
import React from 'react';
import { Button } from '@/components/ui/button';

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryTabs = ({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) => {
  return (
    <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-lg">
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "ghost"}
          size="sm"
          onClick={() => onCategoryChange(category)}
          className={`whitespace-nowrap ${
            activeCategory === category
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryTabs;
