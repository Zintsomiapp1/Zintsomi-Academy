
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Upload, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const CourseUpload = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    creator: '',
    category: '',
    duration: '',
    is_premium: false,
    price: 0,
    rating: 0
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const categories = [
    'IsiZulu Storytelling',
    'Nguni',
    'Sesotho',
    'English',
    'Sepedi',
    'VR Content',
    'AI-Powered',
    'Audio Books',
    'PDFs',
    'Lectures',
    'AR Content'
  ];

  const handleThumbnailUpload = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `courses/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('course-assets')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('course-assets')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseData.title || !courseData.creator || !courseData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let thumbnailUrl = '';
      if (thumbnailFile) {
        thumbnailUrl = await handleThumbnailUpload(thumbnailFile);
      }

      const { error } = await supabase
        .from('courses')
        .insert({
          title: courseData.title,
          description: courseData.description,
          creator: courseData.creator,
          category: courseData.category,
          duration: courseData.duration,
          is_premium: courseData.is_premium,
          price: courseData.price,
          rating: courseData.rating,
          thumbnail: thumbnailUrl
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Course created successfully!",
      });

      // Reset form
      setCourseData({
        title: '',
        description: '',
        creator: '',
        category: '',
        duration: '',
        is_premium: false,
        price: 0,
        rating: 0
      });
      setThumbnailFile(null);

    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: "Error",
        description: "Failed to create course.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create New Course
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                value={courseData.title}
                onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter course title"
                required
              />
            </div>

            <div>
              <Label htmlFor="creator">Creator *</Label>
              <Input
                id="creator"
                value={courseData.creator}
                onChange={(e) => setCourseData(prev => ({ ...prev, creator: e.target.value }))}
                placeholder="Enter creator name"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={courseData.description}
              onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter course description"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={courseData.category}
                onValueChange={(value) => setCourseData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={courseData.duration}
                onChange={(e) => setCourseData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="e.g., 3 hours"
              />
            </div>

            <div>
              <Label htmlFor="rating">Rating (0-5)</Label>
              <Input
                id="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={courseData.rating}
                onChange={(e) => setCourseData(prev => ({ ...prev, rating: parseFloat(e.target.value) || 0 }))}
                placeholder="4.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_premium"
                checked={courseData.is_premium}
                onCheckedChange={(checked) => setCourseData(prev => ({ ...prev, is_premium: checked }))}
              />
              <Label htmlFor="is_premium">Premium Course</Label>
            </div>

            {courseData.is_premium && (
              <div>
                <Label htmlFor="price">Price (ZAR)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={courseData.price}
                  onChange={(e) => setCourseData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  placeholder="99.99"
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="thumbnail">Course Thumbnail</Label>
            <Input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            {loading ? 'Creating Course...' : 'Create Course'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CourseUpload;
