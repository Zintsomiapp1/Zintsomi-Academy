import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, X, MessageSquare, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { SwipeableCard } from './SwipeableCard';

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  distance?: number | null;
  prompts?: Array<{
    question: string;
    answer: string;
  }>;
  photos?: Array<{
    photo_url: string;
    is_primary: boolean;
    display_order: number;
  }>;
}

interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  love_meter: number;
  status: string;
  other_user: Profile;
}

export function MatchFeed() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfiles();
      fetchMatches();
    }
  }, [user]);

  const fetchProfiles = async () => {
    try {
      // Get current user's location for distance filtering
      const { data: currentUserData } = await supabase
        .from('profiles')
        .select('latitude, longitude, max_distance')
        .eq('id', user?.id)
        .single();

      let profilesQuery = supabase
        .from('profiles')
        .select('*')
        .neq('id', user?.id);

      // If user has location set, filter by distance
      if (currentUserData?.latitude && currentUserData?.longitude) {
        profilesQuery = profilesQuery
          .not('latitude', 'is', null)
          .not('longitude', 'is', null);
      }

      const { data: profilesData, error: profilesError } = await profilesQuery.limit(10);

      if (profilesError) throw profilesError;
      
      // Then get their prompt answers and photos
      const profilesWithPrompts = await Promise.all(
        (profilesData || []).map(async (profile) => {
          const [promptAnswers, photos] = await Promise.all([
            supabase
              .from('user_prompt_answers')
              .select(`
                answer,
                prompt:profile_prompts(question)
              `)
              .eq('user_id', profile.id)
              .limit(3),
            supabase
              .from('user_photos')
              .select('photo_url, is_primary, display_order')
              .eq('user_id', profile.id)
              .order('display_order')
          ]);

          // Calculate distance if both users have location
          let distance = null;
          if (currentUserData?.latitude && currentUserData?.longitude && 
              profile.latitude && profile.longitude) {
            const { data: distanceData } = await supabase
              .rpc('calculate_distance', {
                lat1: currentUserData.latitude,
                lon1: currentUserData.longitude,
                lat2: profile.latitude,
                lon2: profile.longitude
              });
            distance = distanceData;
          }

          return {
            ...profile,
            distance,
            prompts: promptAnswers.data?.map(pa => ({
              question: pa.prompt.question,
              answer: pa.answer
            })) || [],
            photos: photos.data || []
          };
        })
      );

      // Filter by distance if user has set max_distance
      let filteredProfiles = profilesWithPrompts;
      if (currentUserData?.max_distance) {
        filteredProfiles = profilesWithPrompts.filter(profile => 
          !profile.distance || profile.distance <= currentUserData.max_distance
        );
      }
      
      setProfiles(filteredProfiles);
      if (filteredProfiles && filteredProfiles.length > 0) {
        setCurrentProfile(filteredProfiles[0]);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast.error('Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    try {
    const { data, error } = await supabase
      .from('mjolo_matches')
      .select('*')
      .or(`user1_id.eq.${user?.id},user2_id.eq.${user?.id}`)
      .eq('status', 'active');

      if (error) throw error;

      // Fetch other user profiles separately
      const processedMatches = await Promise.all(
        (data || []).map(async (match) => {
          const otherUserId = match.user1_id === user?.id ? match.user2_id : match.user1_id;
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', otherUserId)
            .single();
          
          return {
            ...match,
            other_user: profile || { id: '', username: 'Unknown', full_name: 'Unknown', avatar_url: '', bio: '' }
          };
        })
      );

      setMatches(processedMatches);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const handleSwipe = async (liked: boolean) => {
    if (!currentProfile || !user) return;

    try {
      if (liked) {
        // Create a match
        const { error } = await supabase
          .from('mjolo_matches')
          .insert([{
            user1_id: user.id,
            user2_id: currentProfile.id,
            love_meter: 1,
            status: 'active'
          }]);

        if (error) throw error;
        toast.success(`Matched with ${currentProfile.full_name || currentProfile.username}!`);
      }

      // Move to next profile
      const currentIndex = profiles.findIndex(p => p.id === currentProfile.id);
      const nextIndex = currentIndex + 1;
      
      if (nextIndex < profiles.length) {
        setCurrentProfile(profiles[nextIndex]);
      } else {
        setCurrentProfile(null);
        toast.info('No more profiles to show');
      }
    } catch (error) {
      console.error('Error handling swipe:', error);
      toast.error('Failed to process swipe');
    }
  };

  const startConversation = async (matchId: string) => {
    try {
      // Create a date room for this match
      const { error } = await supabase
        .from('date_rooms')
        .insert([{
          match_id: matchId,
          created_by: user?.id,
          room_name: `Match ${matchId.slice(0, 8)}`,
          media_type: 'audio'
        }]);

      if (error) throw error;
      toast.success('Date room created! Start your conversation.');
    } catch (error) {
      console.error('Error creating date room:', error);
      toast.error('Failed to start conversation');
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
      {/* Current Profile Card */}
      {currentProfile && (
        <SwipeableCard
          profile={currentProfile}
          onSwipe={handleSwipe}
        />
      )}

      {/* Matches List */}
      {matches.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Your Matches</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {matches.map((match) => (
              <Card key={match.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-2">
                  <Avatar className="h-16 w-16 mx-auto">
                    <AvatarImage src={match.other_user?.avatar_url} />
                    <AvatarFallback>
                      {match.other_user?.full_name?.[0] || match.other_user?.username?.[0] || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg">
                    {match.other_user?.full_name || match.other_user?.username}
                  </CardTitle>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm">{match.love_meter}/10</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    className="w-full"
                    onClick={() => startConversation(match.id)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Start Date
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!currentProfile && matches.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No profiles available</h3>
            <p className="text-muted-foreground">Check back later for new matches!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}