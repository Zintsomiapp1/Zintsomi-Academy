
import React from 'react';
import { Button } from '@/components/ui/button';

interface StoriesCategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const StoriesCategoryFilter = ({ categories, activeCategory, onCategoryChange }: StoriesCategoryFilterProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "outline"}
          onClick={() => onCategoryChange(category)}
          className="mb-2"
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default StoriesCategoryFilter;
