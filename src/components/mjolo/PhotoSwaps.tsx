import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Heart, X, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface PhotoSwap {
  id: string;
  initiator_id: string;
  target_id: string;
  initiator_like: boolean | null;
  target_like: boolean | null;
  matched_at: string | null;
  created_at: string;
  initiator_profile: any;
  target_profile: any;
}

export function PhotoSwaps() {
  const { user } = useAuth();
  const [photoSwaps, setPhotoSwaps] = useState<PhotoSwap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPhotoSwaps();
    }
  }, [user]);

  const fetchPhotoSwaps = async () => {
    try {
      const { data, error } = await supabase
        .from('photo_swaps')
        .select(`
          *,
          initiator_profile:profiles!photo_swaps_initiator_id_fkey(*),
          target_profile:profiles!photo_swaps_target_id_fkey(*)
        `)
        .or(`initiator_id.eq.${user?.id},target_id.eq.${user?.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhotoSwaps(data || []);
    } catch (error) {
      console.error('Error fetching photo swaps:', error);
      toast.error('Failed to load photo swaps');
    } finally {
      setLoading(false);
    }
  };

  const initiatePhotoSwap = async (targetUserId: string) => {
    try {
      const { error } = await supabase
        .from('photo_swaps')
        .insert([{
          initiator_id: user?.id,
          target_id: targetUserId
        }]);

      if (error) throw error;
      toast.success('Photo swap request sent!');
      fetchPhotoSwaps();
    } catch (error) {
      console.error('Error initiating photo swap:', error);
      toast.error('Failed to send photo swap request');
    }
  };

  const respondToPhotoSwap = async (swapId: string, liked: boolean) => {
    try {
      const { error } = await supabase
        .from('photo_swaps')
        .update({
          target_like: liked,
          matched_at: liked ? new Date().toISOString() : null
        })
        .eq('id', swapId);

      if (error) throw error;
      
      if (liked) {
        toast.success('Photo swap matched! 📸');
      } else {
        toast.info('Photo swap declined');
      }
      
      fetchPhotoSwaps();
    } catch (error) {
      console.error('Error responding to photo swap:', error);
      toast.error('Failed to respond to photo swap');
    }
  };

  const uploadPhoto = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update user's avatar
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user?.id);

      if (updateError) throw updateError;
      
      toast.success('Photo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadPhoto(file);
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Upload Your Photo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload">
              <Button variant="outline" className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
            </label>
            <p className="text-sm text-muted-foreground text-center">
              Upload your best photo to share with matches
            </p>
          </div>
        </CardContent>
      </Card>

      {photoSwaps.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {photoSwaps.map((swap) => {
            const isInitiator = swap.initiator_id === user?.id;
            const otherUser = isInitiator ? swap.target_profile : swap.initiator_profile;
            const pendingResponse = !isInitiator && swap.target_like === null;
            const isMatched = swap.matched_at !== null;

            return (
              <Card key={swap.id} className={`${isMatched ? 'bg-green-50 border-green-200' : ''}`}>
                <CardHeader>
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
                        {isInitiator ? 'You sent a photo swap' : 'Sent you a photo swap'}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isMatched && (
                    <div className="bg-green-100 p-3 rounded-lg mb-4">
                      <p className="text-green-800 font-semibold text-center">
                        🎉 Photo Swap Matched! Share your photos!
                      </p>
                    </div>
                  )}
                  
                  {pendingResponse && (
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => respondToPhotoSwap(swap.id, false)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => respondToPhotoSwap(swap.id, true)}
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                    </div>
                  )}
                  
                  {!pendingResponse && !isMatched && (
                    <p className="text-center text-muted-foreground text-sm">
                      {isInitiator ? 'Waiting for response...' : 'Request declined'}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Camera className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Photo Swaps Yet</h3>
            <p className="text-muted-foreground">
              Match with someone first to start sharing photos!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}