import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Circle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import OnlineStatus from '@/components/ui/online-status';

interface OnlineUser {
  user_id: string;
  is_online: boolean;
  last_seen: string;
  currently_typing_to: string | null;
  profile?: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
  };
}

interface OnlineUsersListProps {
  onSelectUser?: (userId: string, userName: string, userAvatar?: string) => void;
}

const OnlineUsersList = ({ onSelectUser }: OnlineUsersListProps) => {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOnlineUsers = async () => {
    if (!user) return;

    try {
      // First get online presence data
      const { data: presenceData, error: presenceError } = await supabase
        .from('user_presence')
        .select('*')
        .eq('is_online', true)
        .neq('user_id', user.id);

      if (presenceError) throw presenceError;

      if (!presenceData || presenceData.length === 0) {
        setOnlineUsers([]);
        setLoading(false);
        return;
      }

      // Get user IDs from presence data
      const userIds = presenceData.map(p => p.user_id);

      // Get profiles for online users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Combine presence data with profile data
      const usersWithProfiles = presenceData.map(presence => ({
        ...presence,
        profile: profilesData?.find(p => p.id === presence.user_id)
      }));

      setOnlineUsers(usersWithProfiles as OnlineUser[]);
    } catch (error) {
      console.error('Error loading online users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOnlineUsers();
  }, [user]);

  // Real-time subscription for presence updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('online-users-presence')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence'
        },
        () => {
          loadOnlineUsers(); // Reload the list when presence changes
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-mjolo-pink" />
            Online Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-mjolo-pink"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-mjolo-pink" />
          Online Now
          <Badge variant="secondary" className="ml-auto">
            {onlineUsers.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-64">
          {onlineUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No users online</p>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {onlineUsers.map((user) => (
                <div
                  key={user.user_id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  onClick={() => onSelectUser?.(user.user_id, user.profile?.full_name || user.profile?.username || 'Unknown', user.profile?.avatar_url)}
                >
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.profile?.avatar_url} />
                      <AvatarFallback className="bg-mjolo-pink/20 text-mjolo-pink">
                        {user.profile?.full_name?.charAt(0) || user.profile?.username?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Online indicator */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 truncate">
                      {user.profile?.full_name || user.profile?.username || 'Unknown'}
                    </h4>
                    <div className="flex items-center gap-2">
                      <OnlineStatus 
                        isOnline={user.is_online} 
                        lastSeen={user.last_seen}
                        showText
                        size="sm"
                      />
                      
                      {user.currently_typing_to && (
                        <span className="text-xs text-mjolo-pink italic">
                          typing...
                        </span>
                      )}
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

export default OnlineUsersList;