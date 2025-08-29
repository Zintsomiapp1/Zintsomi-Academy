import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Conversation {
  user_id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
  is_online: boolean;
}

interface ConversationListProps {
  onSelectConversation: (userId: string, userName: string, userAvatar?: string) => void;
}

const ConversationList = ({ onSelectConversation }: ConversationListProps) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadConversations = async () => {
      try {
        // Get all matches first
        const { data: matches, error: matchError } = await supabase
          .from('mjolo_matches')
          .select('user1_id, user2_id')
          .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
          .eq('status', 'active');

        if (matchError) throw matchError;

        if (!matches || matches.length === 0) {
          setConversations([]);
          setLoading(false);
          return;
        }

        // Get other user IDs from matches
        const otherUserIds = matches.map(match => 
          match.user1_id === user.id ? match.user2_id : match.user1_id
        );

        // Get profiles and presence for matched users
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .in('id', otherUserIds);

        if (profileError) throw profileError;

        const { data: presence, error: presenceError } = await supabase
          .from('user_presence')
          .select('user_id, is_online, last_seen')
          .in('user_id', otherUserIds);

        if (presenceError) throw presenceError;

        // Get last messages for each conversation
        const conversationsData: Conversation[] = [];

        for (const profile of profiles || []) {
          const { data: lastMessage } = await supabase
            .from('user_messages')
            .select('content, created_at, sender_id, read_at')
            .or(`and(sender_id.eq.${user.id},receiver_id.eq.${profile.id}),and(sender_id.eq.${profile.id},receiver_id.eq.${user.id})`)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          const { count: unreadCount } = await supabase
            .from('user_messages')
            .select('*', { count: 'exact', head: true })
            .eq('sender_id', profile.id)
            .eq('receiver_id', user.id)
            .is('read_at', null);

          const userPresence = presence?.find(p => p.user_id === profile.id);

          conversationsData.push({
            user_id: profile.id,
            username: profile.username,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
            last_message: lastMessage?.content,
            last_message_time: lastMessage?.created_at,
            unread_count: unreadCount || 0,
            is_online: userPresence?.is_online || false
          });
        }

        // Sort by last message time (most recent first)
        conversationsData.sort((a, b) => {
          if (!a.last_message_time && !b.last_message_time) return 0;
          if (!a.last_message_time) return 1;
          if (!b.last_message_time) return -1;
          return new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime();
        });

        setConversations(conversationsData);
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [user]);

  const filteredConversations = conversations.filter(conv =>
    conv.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (dateString?: string) => {
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
          <MessageSquare className="w-5 h-5 text-mjolo-pink" />
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
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'No conversations found' : 'No matches yet'}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {searchTerm ? 'Try a different search term' : 'Start swiping to find matches!'}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.user_id}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onSelectConversation(
                    conversation.user_id,
                    conversation.full_name || conversation.username || 'Unknown',
                    conversation.avatar_url
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={conversation.avatar_url} />
                        <AvatarFallback className="bg-mjolo-pink/20 text-mjolo-pink">
                          {(conversation.full_name || conversation.username || 'U').charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.is_online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 truncate">
                          {conversation.full_name || conversation.username || 'Unknown'}
                        </h3>
                        <div className="flex items-center gap-2">
                          {conversation.last_message_time && (
                            <span className="text-xs text-gray-500">
                              {formatTime(conversation.last_message_time)}
                            </span>
                          )}
                          {conversation.unread_count > 0 && (
                            <Badge className="bg-mjolo-pink text-white text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center">
                              {conversation.unread_count}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {conversation.last_message && (
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {conversation.last_message}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant={conversation.is_online ? "default" : "secondary"}
                          className={`text-xs ${
                            conversation.is_online 
                              ? "bg-green-500 hover:bg-green-600" 
                              : "bg-gray-400"
                          }`}
                        >
                          {conversation.is_online ? "Online" : "Offline"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ConversationList;