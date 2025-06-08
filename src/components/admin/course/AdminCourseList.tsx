
import React from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import AdminCourseCard from './AdminCourseCard';

interface AdminCourseListProps {
  courses: any[];
  onEdit: (course: any) => void;
  onDelete: (courseId: string) => void;
}

const AdminCourseList = ({ courses, onEdit, onDelete }: AdminCourseListProps) => {
  if (courses.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <Plus className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
          <p className="text-gray-600">Create your first course to get started</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <AdminCourseCard
          key={course.id}
          course={course}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default AdminCourseList;
