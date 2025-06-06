
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Users, Clock, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useCourses } from '@/hooks/useCourses';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CourseFormData {
  title: string;
  description: string;
  creator: string;
  category: string;
  duration: string;
  is_premium: boolean;
  price: number;
  rating: number;
}

const CourseManagement = () => {
  const { courses, loading } = useCourses();
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    creator: '',
    category: 'storytelling',
    duration: '',
    is_premium: false,
    price: 0,
    rating: 0
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const categories = [
    'storytelling',
    'folklore', 
    'vr_lessons',
    'creative_writing'
  ];

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
      rating: course.rating || 0
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

        // Refresh the page to show updated data
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
      if (thumbnailFile) {
        thumbnailUrl = await handleThumbnailUpload(thumbnailFile);
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
        thumbnail: thumbnailUrl
      };

      if (editingCourse) {
        // Update existing course
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
        // Create new course
        const { error } = await supabase
          .from('courses')
          .insert(courseData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Course created successfully!",
        });
      }

      setShowCreateForm(false);
      setEditingCourse(null);
      setFormData({
        title: '',
        description: '',
        creator: '',
        category: 'storytelling',
        duration: '',
        is_premium: false,
        price: 0,
        rating: 0
      });
      setThumbnailFile(null);

      // Refresh the page to show updated data
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
    setFormData({
      title: '',
      description: '',
      creator: '',
      category: 'storytelling',
      duration: '',
      is_premium: false,
      price: 0,
      rating: 0
    });
    setThumbnailFile(null);
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
          <p className="text-gray-600">Create, edit, and manage educational courses</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Course
        </Button>
      </div>

      {/* Course List */}
      <div className="space-y-4">
        {courses.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Plus className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-600">Create your first course to get started</p>
            </CardContent>
          </Card>
        ) : (
          courses.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                      {course.isPremium && (
                        <Badge className="bg-yellow-500 hover:bg-yellow-600">Premium</Badge>
                      )}
                      <Badge variant="outline">{course.category}</Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3">Created by {course.creator}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>24 enrolled</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{course.duration || '2-3 hours'}</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        <span>156 views</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(course)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(course.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Course Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingCourse ? 'Edit Course' : 'Create New Course'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Course Title *</Label>
                <Input 
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter course title..."
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Course description..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="creator">Creator *</Label>
                  <Input 
                    id="creator"
                    value={formData.creator}
                    onChange={(e) => setFormData(prev => ({ ...prev, creator: e.target.value }))}
                    placeholder="Creator name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input 
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g., 2-3 hours"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="rating">Rating (0-5)</Label>
                  <Input 
                    id="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) || 0 }))}
                    placeholder="4.5"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_premium"
                    checked={formData.is_premium}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_premium: checked }))}
                  />
                  <Label htmlFor="is_premium">Premium Course</Label>
                </div>
                
                {formData.is_premium && (
                  <div>
                    <Label htmlFor="price">Price (ZAR)</Label>
                    <Input 
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
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
              
              <div className="flex space-x-3 pt-4">
                <Button 
                  onClick={handleSubmitForm}
                  disabled={saving}
                  className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white"
                >
                  {saving ? (
                    <>
                      <Upload className="w-4 h-4 mr-2 animate-spin" />
                      {editingCourse ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      {editingCourse ? 'Update Course' : 'Create Course'}
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleCancelForm} disabled={saving}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
