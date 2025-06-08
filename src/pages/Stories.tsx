
import React, { useState, useEffect } from 'react';
import StoriesHeader from '@/components/stories/StoriesHeader';
import StoriesCategoryFilter from '@/components/stories/StoriesCategoryFilter';
import StoriesEmptyState from '@/components/stories/StoriesEmptyState';
import { useCourses } from '@/hooks/useCourses';
import CourseGrid from '@/components/CourseGrid';

const Stories = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const { courses, loading } = useCourses();

  const storyCategories = [
    'All',
    'storytelling',
    'folklore',
    'vr_lessons',
    'creative_writing'
  ];

  // Filter courses for story-related categories
  const storyCourses = courses.filter(course => 
    ['storytelling', 'folklore', 'vr_lessons', 'creative_writing'].includes(course.category)
  );

  const filteredStories = activeCategory === 'All' 
    ? storyCourses 
    : storyCourses.filter(course => course.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <StoriesHeader />
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <StoriesHeader />
        
        <StoriesCategoryFilter 
          categories={storyCategories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {filteredStories.length === 0 ? (
          <StoriesEmptyState />
        ) : (
          <CourseGrid courses={filteredStories} />
        )}
      </div>
    </div>
  );
};

export default Stories;
