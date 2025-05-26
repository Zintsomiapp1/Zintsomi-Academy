
import React from 'react';
import { Button } from '@/components/ui/button';

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryTabs = ({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) => {
  return (
    <div className="flex space-x-2 overflow-x-auto pb-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "outline"}
          onClick={() => onCategoryChange(category)}
          className={`whitespace-nowrap rounded-full ${
            activeCategory === category
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              : "hover:bg-gray-50"
          }`}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryTabs;
