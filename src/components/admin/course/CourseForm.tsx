
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CourseFormData, categories, statusOptions } from './CourseFormData';

interface CourseFormProps {
  isVisible: boolean;
  editingCourse: any;
  formData: CourseFormData;
  saving: boolean;
  onFormDataChange: (data: CourseFormData) => void;
  onThumbnailChange: (file: File | null) => void;
  onPdfChange: (file: File | null) => void;
  onVideoChange: (file: File | null) => void;
  onAudioChange: (file: File | null) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const CourseForm = ({
  isVisible,
  editingCourse,
  formData,
  saving,
  onFormDataChange,
  onThumbnailChange,
  onPdfChange,
  onVideoChange,
  onAudioChange,
  onSubmit,
  onCancel
}: CourseFormProps) => {
  if (!isVisible) return null;

  const updateFormData = (updates: Partial<CourseFormData>) => {
    onFormDataChange({ ...formData, ...updates });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>{editingCourse ? 'Edit Course' : 'Create New Course'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Course Title *</Label>
              <Input 
                id="title"
                value={formData.title}
                onChange={(e) => updateFormData({ title: e.target.value })}
                placeholder="Enter course title..."
              />
            </div>
            
            <div>
              <Label htmlFor="creator">Creator *</Label>
              <Input 
                id="creator"
                value={formData.creator}
                onChange={(e) => updateFormData({ creator: e.target.value })}
                placeholder="Creator name"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              placeholder="Course description..."
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category}
                onValueChange={(value) => updateFormData({ category: value })}
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
              <Label htmlFor="duration">Duration</Label>
              <Input 
                id="duration"
                value={formData.duration}
                onChange={(e) => updateFormData({ duration: e.target.value })}
                placeholder="e.g., 2-3 hours"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status}
                onValueChange={(value) => updateFormData({ status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rating">Rating (0-5)</Label>
              <Input 
                id="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => updateFormData({ rating: parseFloat(e.target.value) || 0 })}
                placeholder="4.5"
              />
            </div>

            <div>
              <Label htmlFor="price">Price (ZAR)</Label>
              <Input 
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => updateFormData({ price: parseFloat(e.target.value) || 0 })}
                placeholder="99.99"
                disabled={!formData.is_premium}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_premium"
                checked={formData.is_premium}
                onCheckedChange={(checked) => updateFormData({ is_premium: checked })}
              />
              <Label htmlFor="is_premium">Premium Course</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => updateFormData({ featured: checked })}
              />
              <Label htmlFor="featured">Featured Course</Label>
            </div>
          </div>
          
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium text-gray-900">File Uploads</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="thumbnail">Course Thumbnail</Label>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={(e) => onThumbnailChange(e.target.files?.[0] || null)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="pdf">PDF Document</Label>
                <Input
                  id="pdf"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => onPdfChange(e.target.files?.[0] || null)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="video">Video File</Label>
                <Input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={(e) => onVideoChange(e.target.files?.[0] || null)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="audio">Audio File</Label>
                <Input
                  id="audio"
                  type="file"
                  accept="audio/*"
                  onChange={(e) => onAudioChange(e.target.files?.[0] || null)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button 
              onClick={onSubmit}
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
            <Button variant="outline" onClick={onCancel} disabled={saving}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseForm;
