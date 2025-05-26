
import React from 'react';
import CourseCard from './CourseCard';

interface Course {
  id: string;
  title: string;
  creator: string;
  thumbnail: string;
  likes: number;
  comments: number;
  isPremium: boolean;
  rating?: number;
  category: string;
  duration?: string;
}

interface CourseGridProps {
  courses: Course[];
  onLike?: (courseId: string) => void;
  onComment?: (courseId: string) => void;
}

const CourseGrid = ({ courses, onLike, onComment }: CourseGridProps) => {
  if (courses.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-32 h-32 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses yet</h3>
        <p className="text-gray-500">Upload a course. Become the first.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onLike={onLike}
          onComment={onComment}
        />
      ))}
    </div>
  );
};

export default CourseGrid;
