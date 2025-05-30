
import React from 'react';
import CategoryTabs from '@/components/CategoryTabs';

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

interface CourseFiltersProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  filteredCourses: Course[];
}

const CourseFilters = ({ 
  categories, 
  activeCategory, 
  onCategoryChange, 
  filteredCourses 
}: CourseFiltersProps) => {
  return (
    <div>
      {/* Category Tabs */}
      <div className="mb-8">
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={onCategoryChange}
        />
      </div>

      {/* Premium vs Free Filter */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600 font-medium">Showing:</span>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
              Premium: {filteredCourses.filter(c => c.isPremium).length}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
              Free: {filteredCourses.filter(c => !c.isPremium).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseFilters;
