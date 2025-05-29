
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserRole } from '@/hooks/useUserRole';
import { Shield, Upload, BookOpen, FileAudio, FileText, Video } from 'lucide-react';
import CourseUpload from '@/components/admin/CourseUpload';
import LessonUpload from '@/components/admin/LessonUpload';
import AssetUpload from '@/components/admin/AssetUpload';

const AdminPanel = () => {
  const { isAdmin, loading } = useUserRole();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-8 h-8 mx-auto mb-4 animate-spin" />
          <p>Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-gray-600">
              You don't have permission to access the admin panel.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <p className="text-gray-600">
            Manage courses, lessons, and all app content from this central dashboard.
          </p>
        </div>

        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="lessons" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Lessons
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <FileAudio className="w-4 h-4" />
              Audio
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <CourseUpload />
          </TabsContent>

          <TabsContent value="lessons">
            <LessonUpload />
          </TabsContent>

          <TabsContent value="audio">
            <AssetUpload type="audio" />
          </TabsContent>

          <TabsContent value="documents">
            <AssetUpload type="document" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
