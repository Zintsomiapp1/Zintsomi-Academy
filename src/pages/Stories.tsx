
import React, { useState } from 'react';
import StoriesHeader from '@/components/stories/StoriesHeader';
import StoriesCategoryFilter from '@/components/stories/StoriesCategoryFilter';
import StoriesEmptyState from '@/components/stories/StoriesEmptyState';

const Stories = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const storyCategories = [
    'All',
    'VR Experiences',
    'Digital Stories',
    'Audio Stories',
    'Interactive Tales'
  ];

  const stories = [
    // Empty array - ready for real content
  ];

  const filteredStories = activeCategory === 'All' 
    ? stories 
    : stories.filter(story => story.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <StoriesHeader />
        
        <StoriesCategoryFilter 
          categories={storyCategories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <StoriesEmptyState />
      </div>
    </div>
  );
};

export default Stories;
