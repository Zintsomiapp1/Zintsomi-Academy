
import React, { useState } from 'react';
import CourseGrid from '@/components/CourseGrid';
import LoadingSpinner from '@/components/LoadingSpinner';
import CourseHero from '@/components/course/CourseHero';
import CourseFilters from '@/components/course/CourseFilters';
import { useCourses } from '@/hooks/useCourses';
import { categories } from '@/data/sampleCourses';

const Courses = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const { courses, loading } = useCourses();

  const filteredCourses = activeCategory === 'All' 
    ? courses 
    : courses.filter(course => course.category === activeCategory);

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading courses..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <CourseHero />
        
        <CourseFilters
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          filteredCourses={filteredCourses}
        />

        <CourseGrid
          courses={filteredCourses}
          onLike={(courseId) => console.log('Liked course:', courseId)}
          onComment={(courseId) => console.log('Comment on course:', courseId)}
        />
      </main>
    </div>
  );
};

export default Courses;
