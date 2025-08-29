import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface UserMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  match_id?: string;
  content: string;
  message_type: string;
  read_at?: string;
  created_at: string;
  updated_at: string;
  sender?: {
    id: string;
    username?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export interface UserPresence {
  user_id: string;
  is_online: boolean;
  last_seen: string;
  currently_typing_to?: string;
}

export const useMessaging = (receiverId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userPresence, setUserPresence] = useState<Record<string, UserPresence>>({});
  const [loading, setLoading] = useState(false);

  // Load conversation messages
  const loadMessages = useCallback(async () => {
    if (!user || !receiverId) return;
    
    setLoading(true);
    try {
      const { data: messagesData, error } = await supabase
        .from('user_messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Fetch sender profiles separately
      if (messagesData && messagesData.length > 0) {
        const senderIds = [...new Set(messagesData.map(msg => msg.sender_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .in('id', senderIds);

        const messagesWithSenders = messagesData.map(msg => ({
          ...msg,
          sender: profiles?.find(p => p.id === msg.sender_id)
        }));

        setMessages(messagesWithSenders);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, receiverId, toast]);

  // Send a message
  const sendMessage = useCallback(async (content: string, messageType: string = 'text') => {
    if (!user || !receiverId || !content.trim()) return;

    try {
      const { error } = await supabase
        .from('user_messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          content: content.trim(),
          message_type: messageType
        });

      if (error) throw error;

      // Clear typing indicator
      await updateTypingStatus(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  }, [user, receiverId, toast]);

  // Update user presence
  const updatePresence = useCallback(async (isOnline: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_presence')
        .upsert({
          user_id: user.id,
          is_online: isOnline,
          last_seen: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating presence:', error);
    }
  }, [user]);

  // Update typing status
  const updateTypingStatus = useCallback(async (typing: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_presence')
        .upsert({
          user_id: user.id,
          is_online: true,
          currently_typing_to: typing ? receiverId : null,
          last_seen: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  }, [user, receiverId]);

  // Mark messages as read
  const markAsRead = useCallback(async (messageIds: string[]) => {
    if (!user || messageIds.length === 0) return;

    try {
      const { error } = await supabase
        .from('user_messages')
        .update({ read_at: new Date().toISOString() })
        .in('id', messageIds)
        .eq('receiver_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [user]);

  // Real-time subscriptions
  useEffect(() => {
    if (!user) return;

    // Subscribe to new messages
    const messageChannel = supabase
      .channel('user-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_messages',
          filter: `or(sender_id.eq.${user.id},receiver_id.eq.${user.id})`
        },
        async (payload) => {
          const newMessage = payload.new as UserMessage;
          
          // Fetch sender profile for the new message
          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .eq('id', newMessage.sender_id)
            .single();

          setMessages(prev => [...prev, {
            ...newMessage,
            sender: senderProfile
          }]);

          // Show notification if message is from someone else
          if (newMessage.sender_id !== user.id) {
            toast({
              title: "New Message",
              description: senderProfile?.full_name || "Someone sent you a message"
            });
          }
        }
      )
      .subscribe();

    // Subscribe to presence updates
    const presenceChannel = supabase
      .channel('user-presence')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence'
        },
        (payload) => {
          const presence = payload.new as UserPresence;
          setUserPresence(prev => ({
            ...prev,
            [presence.user_id]: presence
          }));

          // Update typing indicator
          if (presence.currently_typing_to === user.id) {
            setIsTyping(true);
          } else if (presence.user_id === receiverId) {
            setIsTyping(false);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(presenceChannel);
    };
  }, [user, receiverId, toast]);

  // Update presence when component mounts/unmounts
  useEffect(() => {
    updatePresence(true);

    const handleBeforeUnload = () => updatePresence(false);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      updatePresence(false);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [updatePresence]);

  // Load messages when receiver changes
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  return {
    messages,
    loading,
    isTyping,
    userPresence,
    sendMessage,
    updateTypingStatus,
    markAsRead,
    loadMessages
  };
};