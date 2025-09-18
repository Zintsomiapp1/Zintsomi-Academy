import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Upload, X, Star, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Photo {
  id: string;
  photo_url: string;
  is_primary: boolean;
  display_order: number;
}

export function PhotoManager() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      loadPhotos();
    }
  }, [user]);

  const loadPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('user_photos')
        .select('*')
        .eq('user_id', user?.id)
        .order('display_order');

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  };

  const uploadPhoto = async (file: File) => {
    if (!user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `profiles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const nextOrder = Math.max(...photos.map(p => p.display_order), 0) + 1;
      const isPrimary = photos.length === 0;

      const { error: insertError } = await supabase
        .from('user_photos')
        .insert([{
          user_id: user.id,
          photo_url: publicUrl,
          is_primary: isPrimary,
          display_order: nextOrder
        }]);

      if (insertError) throw insertError;

      // Update avatar_url in profiles if this is the first photo
      if (isPrimary) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ avatar_url: publicUrl })
          .eq('id', user.id);

        if (profileError) throw profileError;
      }

      loadPhotos();
      toast.success('Photo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      uploadPhoto(file);
    }
  };

  const deletePhoto = async (photoId: string) => {
    try {
      const photo = photos.find(p => p.id === photoId);
      if (!photo) return;

      // Delete from storage
      const fileName = photo.photo_url.split('/').pop();
      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from('avatars')
          .remove([`profiles/${fileName}`]);
        
        if (storageError) console.warn('Error deleting file from storage:', storageError);
      }

      // Delete from database
      const { error } = await supabase
        .from('user_photos')
        .delete()
        .eq('id', photoId);

      if (error) throw error;

      // If this was the primary photo, make the first remaining photo primary
      if (photo.is_primary && photos.length > 1) {
        const remainingPhotos = photos.filter(p => p.id !== photoId);
        const newPrimary = remainingPhotos.sort((a, b) => a.display_order - b.display_order)[0];
        
        if (newPrimary) {
          await setPrimaryPhoto(newPrimary.id);
          
          // Update avatar_url in profiles
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ avatar_url: newPrimary.photo_url })
            .eq('id', user?.id);

          if (profileError) throw profileError;
        }
      }

      loadPhotos();
      toast.success('Photo deleted successfully!');
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('Failed to delete photo');
    }
  };

  const setPrimaryPhoto = async (photoId: string) => {
    try {
      // Remove primary status from all photos
      await supabase
        .from('user_photos')
        .update({ is_primary: false })
        .eq('user_id', user?.id);

      // Set new primary photo
      const { error } = await supabase
        .from('user_photos')
        .update({ is_primary: true })
        .eq('id', photoId);

      if (error) throw error;

      // Update avatar_url in profiles
      const photo = photos.find(p => p.id === photoId);
      if (photo) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ avatar_url: photo.photo_url })
          .eq('id', user?.id);

        if (profileError) throw profileError;
      }

      loadPhotos();
      toast.success('Primary photo updated!');
    } catch (error) {
      console.error('Error setting primary photo:', error);
      toast.error('Failed to update primary photo');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Photo Gallery ({photos.length}/6)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {photos.length < 6 && (
          <div className="space-y-2">
            <Label htmlFor="photo-upload">Upload New Photo</Label>
            <div className="flex items-center gap-2">
              <Input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="flex-1"
              />
              <Button disabled={uploading} size="sm">
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Maximum 6 photos, up to 10MB each
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={photo.photo_url}
                  alt="Profile photo"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {photo.is_primary && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white p-1 rounded-full">
                  <Star className="h-3 w-3 fill-current" />
                </div>
              )}

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                {!photo.is_primary && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setPrimaryPhoto(photo.id)}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deletePhoto(photo.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {photos.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No photos uploaded yet</p>
            <p className="text-sm">Upload your first photo to get started!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}