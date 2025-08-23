import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Phone, Video, MessageSquare, PhoneOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface DateRoom {
  id: string;
  match_id: string;
  created_by: string;
  room_name: string;
  media_type: 'audio' | 'video';
  status: 'active' | 'ended';
  created_at: string;
  ended_at: string | null;
  match: {
    user1_profile: any;
    user2_profile: any;
  };
}

export function DateRooms() {
  const { user } = useAuth();
  const [dateRooms, setDateRooms] = useState<DateRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDateRooms();
    }
  }, [user]);

  const fetchDateRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('date_rooms')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch match data and profiles separately
      const roomsWithData = await Promise.all(
        (data || []).map(async (room) => {
          const { data: match } = await supabase
            .from('mjolo_matches')
            .select('user1_id, user2_id')
            .eq('id', room.match_id)
            .single();
          
          if (!match) return null;
          
          const [user1Result, user2Result] = await Promise.all([
            supabase.from('profiles').select('*').eq('id', match.user1_id).single(),
            supabase.from('profiles').select('*').eq('id', match.user2_id).single()
          ]);
          
          return {
            ...room,
            media_type: room.media_type as 'audio' | 'video',
            status: room.status as 'active' | 'ended',
            match: {
              user1_profile: user1Result.data,
              user2_profile: user2Result.data
            }
          };
        })
      );
      
      // Filter rooms where user is part of the match
      const userRooms = roomsWithData.filter(room => {
        if (!room?.match) return false;
        return room.match.user1_profile?.id === user?.id || room.match.user2_profile?.id === user?.id;
      });

      setDateRooms(userRooms);
    } catch (error) {
      console.error('Error fetching date rooms:', error);
      toast.error('Failed to load date rooms');
    } finally {
      setLoading(false);
    }
  };

  const createDateRoom = async (matchId: string, mediaType: 'audio' | 'video') => {
    try {
      const { error } = await supabase
        .from('date_rooms')
        .insert([{
          match_id: matchId,
          created_by: user?.id,
          room_name: `${mediaType} Date ${Date.now()}`,
          media_type: mediaType,
          status: 'active'
        }]);

      if (error) throw error;
      toast.success(`${mediaType === 'video' ? 'Video' : 'Audio'} date room created!`);
      fetchDateRooms();
    } catch (error) {
      console.error('Error creating date room:', error);
      toast.error('Failed to create date room');
    }
  };

  const joinRoom = (room: DateRoom) => {
    toast.info(`Joining ${room.media_type} call... (Feature coming soon!)`);
  };

  const endRoom = async (roomId: string) => {
    try {
      const { error } = await supabase
        .from('date_rooms')
        .update({
          status: 'ended',
          ended_at: new Date().toISOString()
        })
        .eq('id', roomId);

      if (error) throw error;
      toast.success('Date room ended');
      fetchDateRooms();
    } catch (error) {
      console.error('Error ending room:', error);
      toast.error('Failed to end room');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {dateRooms.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Active Date Rooms</h2>
          {dateRooms.map((room) => {
            const match = room.match;
            const otherUser = match.user1_profile?.id === user?.id 
              ? match.user2_profile 
              : match.user1_profile;
            const isCreator = room.created_by === user?.id;

            return (
              <Card key={room.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={otherUser?.avatar_url} />
                        <AvatarFallback>
                          {otherUser?.full_name?.[0] || otherUser?.username?.[0] || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">
                          {otherUser?.full_name || otherUser?.username}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {room.room_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={room.media_type === 'video' ? 'default' : 'secondary'}>
                        {room.media_type === 'video' ? (
                          <Video className="h-3 w-3 mr-1" />
                        ) : (
                          <Phone className="h-3 w-3 mr-1" />
                        )}
                        {room.media_type}
                      </Badge>
                      <Badge variant="outline">
                        {room.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1"
                      onClick={() => joinRoom(room)}
                    >
                      {room.media_type === 'video' ? (
                        <Video className="h-4 w-4 mr-2" />
                      ) : (
                        <Phone className="h-4 w-4 mr-2" />
                      )}
                      Join Call
                    </Button>
                    {isCreator && (
                      <Button 
                        variant="destructive"
                        onClick={() => endRoom(room.id)}
                      >
                        <PhoneOff className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Created {new Date(room.created_at).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Active Date Rooms</h3>
            <p className="text-muted-foreground mb-4">
              Start a voice or video date with your matches!
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Audio Date
              </Button>
              <Button>
                <Video className="h-4 w-4 mr-2" />
                Video Date
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}