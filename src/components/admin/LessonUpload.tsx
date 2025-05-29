
import React, { useState, useEffect } from 'react';
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

interface Course {
  id: string;
  title: string;
}

const LessonUpload = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessonData, setLessonData] = useState({
    title: '',
    description: '',
    course_id: '',
    order_index: 1,
    duration: 0,
    is_free: false,
    content: ''
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const uploadFile = async (file: File, type: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `lessons/${type}/${Date.now()}.${fileExt}`;

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
    if (!lessonData.title || !lessonData.course_id) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let videoUrl = '';
      let audioUrl = '';
      let pdfUrl = '';

      if (videoFile) {
        videoUrl = await uploadFile(videoFile, 'videos');
      }
      if (audioFile) {
        audioUrl = await uploadFile(audioFile, 'audio');
      }
      if (pdfFile) {
        pdfUrl = await uploadFile(pdfFile, 'pdfs');
      }

      const { error } = await supabase
        .from('lessons')
        .insert({
          title: lessonData.title,
          description: lessonData.description,
          course_id: lessonData.course_id,
          order_index: lessonData.order_index,
          duration: lessonData.duration,
          is_free: lessonData.is_free,
          content: lessonData.content,
          video_url: videoUrl,
          audio_url: audioUrl,
          pdf_url: pdfUrl
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Lesson created successfully!",
      });

      // Reset form
      setLessonData({
        title: '',
        description: '',
        course_id: '',
        order_index: 1,
        duration: 0,
        is_free: false,
        content: ''
      });
      setVideoFile(null);
      setAudioFile(null);
      setPdfFile(null);

    } catch (error) {
      console.error('Error creating lesson:', error);
      toast({
        title: "Error",
        description: "Failed to create lesson.",
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
          Create New Lesson
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lesson-title">Lesson Title *</Label>
              <Input
                id="lesson-title"
                value={lessonData.title}
                onChange={(e) => setLessonData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter lesson title"
                required
              />
            </div>

            <div>
              <Label htmlFor="course">Course *</Label>
              <Select
                value={lessonData.course_id}
                onValueChange={(value) => setLessonData(prev => ({ ...prev, course_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="lesson-description">Description</Label>
            <Textarea
              id="lesson-description"
              value={lessonData.description}
              onChange={(e) => setLessonData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter lesson description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="order">Order Index</Label>
              <Input
                id="order"
                type="number"
                min="1"
                value={lessonData.order_index}
                onChange={(e) => setLessonData(prev => ({ ...prev, order_index: parseInt(e.target.value) || 1 }))}
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="0"
                value={lessonData.duration}
                onChange={(e) => setLessonData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                placeholder="30"
              />
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Switch
                id="is_free_lesson"
                checked={lessonData.is_free}
                onCheckedChange={(checked) => setLessonData(prev => ({ ...prev, is_free: checked }))}
              />
              <Label htmlFor="is_free_lesson">Free Lesson</Label>
            </div>
          </div>

          <div>
            <Label htmlFor="content">Lesson Content</Label>
            <Textarea
              id="content"
              value={lessonData.content}
              onChange={(e) => setLessonData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter lesson content or transcript"
              rows={6}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="video">Video File</Label>
              <Input
                id="video"
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="audio">Audio File</Label>
              <Input
                id="audio"
                type="file"
                accept="audio/*"
                onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="pdf">PDF File</Label>
              <Input
                id="pdf"
                type="file"
                accept=".pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                className="mt-1"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            {loading ? 'Creating Lesson...' : 'Create Lesson'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LessonUpload;
