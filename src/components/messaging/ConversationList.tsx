import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, MessageCircle, Users, Circle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Conversation {
  id: string;
  user_id: string;
  full_name: string;
  username: string;
  avatar_url: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  is_online: boolean;
  last_seen: string;
  currently_typing_to: string | null;
}

interface ConversationListProps {
  onSelectConversation: (userId: string, userName: string, userAvatar?: string) => void;
}

const ConversationList = ({ onSelectConversation }: ConversationListProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, any>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const loadConversations = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get all users who have exchanged messages with current user
      const { data: messageData, error: messageError } = await supabase
        .from('user_messages')
        .select(`
          sender_id,
          receiver_id,
          content,
          created_at,
          read_at
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (messageError) throw messageError;

      // Get presence data for all users
      const { data: presenceData } = await supabase
        .from('user_presence')
        .select('*');

      const presenceMap = presenceData?.reduce((acc, p) => {
        acc[p.user_id] = p;
        return acc;
      }, {} as Record<string, any>) || {};

      setOnlineUsers(presenceMap);

      // Process conversations
      const conversationMap = new Map<string, Conversation>();
      const userIds = new Set<string>();

      // Collect all user IDs from messages
      messageData?.forEach(message => {
        const otherUserId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
        if (otherUserId !== user.id) {
          userIds.add(otherUserId);
        }
      });

      // Get profiles for all users
      const userIdsArray = Array.from(userIds);
      const { data: profilesData } = userIdsArray.length > 0 ? await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', userIdsArray) : { data: [] };

      const profilesMap = profilesData?.reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {} as Record<string, any>) || {};

      messageData?.forEach(message => {
        const otherUserId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
        const otherUser = profilesMap[otherUserId];
        
        if (!otherUser || otherUserId === user.id) return;

        const existingConv = conversationMap.get(otherUserId);
        const isUnread = message.receiver_id === user.id && !message.read_at;
        const presence = presenceMap[otherUserId];

        if (!existingConv || new Date(message.created_at) > new Date(existingConv.last_message_time)) {
          conversationMap.set(otherUserId, {
            id: otherUserId,
            user_id: otherUserId,
            full_name: otherUser.full_name || otherUser.username || 'Unknown',
            username: otherUser.username || '',
            avatar_url: otherUser.avatar_url || '',
            last_message: message.content,
            last_message_time: message.created_at,
            unread_count: isUnread ? (existingConv?.unread_count || 0) + 1 : (existingConv?.unread_count || 0),
            is_online: presence?.is_online || false,
            last_seen: presence?.last_seen || '',
            currently_typing_to: presence?.currently_typing_to || null
          });
        } else if (isUnread) {
          existingConv.unread_count += 1;
        }
      });

      const conversationsList = Array.from(conversationMap.values())
        .sort((a, b) => new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime());

      setConversations(conversationsList);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [user]);

  // Real-time subscriptions for presence updates
  useEffect(() => {
    if (!user) return;

    // Subscribe to presence changes
    const presenceChannel = supabase
      .channel('user-presence-list')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence'
        },
        (payload) => {
          const presence = payload.new as any;
          setOnlineUsers(prev => ({
            ...prev,
            [presence.user_id]: presence
          }));

          // Update conversations with new presence data
          setConversations(prev => prev.map(conv => ({
            ...conv,
            is_online: presence.user_id === conv.user_id ? presence.is_online : conv.is_online,
            last_seen: presence.user_id === conv.user_id ? presence.last_seen : conv.last_seen,
            currently_typing_to: presence.user_id === conv.user_id ? presence.currently_typing_to : conv.currently_typing_to
          })));
        }
      )
      .subscribe();

    // Subscribe to new messages
    const messageChannel = supabase
      .channel('user-messages-list')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_messages',
          filter: `or(sender_id.eq.${user.id},receiver_id.eq.${user.id})`
        },
        () => {
          loadConversations(); // Reload conversations when new messages arrive
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(presenceChannel);
      supabase.removeChannel(messageChannel);
    };
  }, [user]);

  const formatLastSeen = (lastSeen: string) => {
    if (!lastSeen) return 'Never';
    
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffInMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mjolo-pink mx-auto mb-2"></div>
          <p className="text-gray-500">Loading conversations...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-mjolo-pink" />
          Messages
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'No conversations found' : 'No messages yet'}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {searchTerm ? 'Try a different search term' : 'Start messaging to see conversations here!'}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredConversations.map((conversation) => {
                const isTyping = conversation.currently_typing_to === user?.id;
                
                return (
                  <div
                    key={conversation.id}
                    className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => onSelectConversation(
                      conversation.user_id,
                      conversation.full_name,
                      conversation.avatar_url
                    )}
                  >
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={conversation.avatar_url} />
                        <AvatarFallback className="bg-mjolo-pink/20 text-mjolo-pink">
                          {conversation.full_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Online Status Indicator */}
                      <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                        conversation.is_online ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {conversation.full_name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.last_message_time)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-600 truncate">
                            {isTyping ? (
                              <span className="text-mjolo-pink font-medium italic">
                                typing...
                              </span>
                            ) : (
                              conversation.last_message
                            )}
                          </p>
                          
                          {/* Online Status Badge */}
                          {conversation.is_online && (
                            <div className="flex items-center gap-1">
                              <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                              <span className="text-xs text-green-600 font-medium">Online</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {conversation.unread_count > 0 && (
                            <Badge 
                              variant="default" 
                              className="bg-mjolo-pink text-white min-w-[20px] h-5 text-xs rounded-full flex items-center justify-center"
                            >
                              {conversation.unread_count}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Last Seen */}
                      {!conversation.is_online && (
                        <p className="text-xs text-gray-400">
                          Last seen {formatLastSeen(conversation.last_seen)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ConversationList;