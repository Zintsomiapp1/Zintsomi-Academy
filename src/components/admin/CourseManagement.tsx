
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminCourses } from '@/hooks/useAdminCourses';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CourseForm from './course/CourseForm';
import AdminCourseList from './course/AdminCourseList';
import { CourseFormData, defaultFormData } from './course/CourseFormData';
import { useCourseFileUpload } from './course/useCourseFileUpload';

const CourseManagement = () => {
  const { courses, loading } = useAdminCourses();
  const { toast } = useToast();
  const { handleFileUpload } = useCourseFileUpload();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [formData, setFormData] = useState<CourseFormData>(defaultFormData);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const handleEdit = (course: any) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || '',
      description: course.description || '',
      creator: course.creator || '',
      category: course.category || 'storytelling',
      duration: course.duration || '',
      is_premium: course.isPremium || false,
      price: course.price || 0,
      rating: course.rating || 0,
      status: course.status || 'published',
      featured: course.featured || false
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const { error } = await supabase
          .from('courses')
          .delete()
          .eq('id', courseId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Course deleted successfully!",
        });

        window.location.reload();
      } catch (error) {
        console.error('Error deleting course:', error);
        toast({
          title: "Error",
          description: "Failed to delete course.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmitForm = async () => {
    if (!formData.title || !formData.creator || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      let thumbnailUrl = editingCourse?.thumbnail || '';
      let pdfUrl = editingCourse?.pdf_url || '';
      let videoUrl = editingCourse?.video_url || '';
      let audioUrl = editingCourse?.audio_url || '';

      if (thumbnailFile) {
        thumbnailUrl = await handleFileUpload(thumbnailFile, 'thumbnails');
      }
      if (pdfFile) {
        pdfUrl = await handleFileUpload(pdfFile, 'pdfs');
      }
      if (videoFile) {
        videoUrl = await handleFileUpload(videoFile, 'videos');
      }
      if (audioFile) {
        audioUrl = await handleFileUpload(audioFile, 'audio');
      }

      const courseData = {
        title: formData.title,
        description: formData.description,
        creator: formData.creator,
        category: formData.category,
        duration: formData.duration,
        is_premium: formData.is_premium,
        price: formData.price,
        rating: formData.rating,
        status: formData.status,
        featured: formData.featured,
        thumbnail: thumbnailUrl,
        pdf_url: pdfUrl,
        video_url: videoUrl,
        audio_url: audioUrl
      };

      if (editingCourse) {
        const { error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', editingCourse.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Course updated successfully!",
        });
      } else {
        const { error } = await supabase
          .from('courses')
          .insert(courseData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Course created successfully!",
        });
      }

      handleCancelForm();
      window.location.reload();

    } catch (error) {
      console.error('Error saving course:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingCourse ? 'update' : 'create'} course.`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelForm = () => {
    setShowCreateForm(false);
    setEditingCourse(null);
    setFormData(defaultFormData);
    setThumbnailFile(null);
    setPdfFile(null);
    setVideoFile(null);
    setAudioFile(null);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Management</h2>
          <p className="text-gray-600">Create, edit, and manage educational courses with file uploads</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Course
        </Button>
      </div>

      <AdminCourseList
        courses={courses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CourseForm
        isVisible={showCreateForm}
        editingCourse={editingCourse}
        formData={formData}
        saving={saving}
        onFormDataChange={setFormData}
        onThumbnailChange={setThumbnailFile}
        onPdfChange={setPdfFile}
        onVideoChange={setVideoFile}
        onAudioChange={setAudioFile}
        onSubmit={handleSubmitForm}
        onCancel={handleCancelForm}
      />
    </div>
  );
};

export default CourseManagement;
