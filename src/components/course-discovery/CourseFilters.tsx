
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

interface CourseFiltersProps {
  onFiltersChange: (filters: any) => void;
}

const CourseFilters = ({ onFiltersChange }: CourseFiltersProps) => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Filter Courses</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-sm font-medium">Price Range</label>
          <Select onValueChange={(value) => onFiltersChange({ priceRange: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select price range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="0-50">$0 - $50</SelectItem>
              <SelectItem value="50-100">$50 - $100</SelectItem>
              <SelectItem value="100+">$100+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Difficulty Level</label>
          <Select onValueChange={(value) => onFiltersChange({ difficulty: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Duration</label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="short" />
              <label htmlFor="short" className="text-sm">0-2 hours</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="medium" />
              <label htmlFor="medium" className="text-sm">2-6 hours</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="long" />
              <label htmlFor="long" className="text-sm">6+ hours</label>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Rating</label>
          <Select onValueChange={(value) => onFiltersChange({ rating: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Minimum rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4.5">4.5+ stars</SelectItem>
              <SelectItem value="4.0">4.0+ stars</SelectItem>
              <SelectItem value="3.5">3.5+ stars</SelectItem>
              <SelectItem value="3.0">3.0+ stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full" onClick={() => onFiltersChange({})}>
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseFilters;
