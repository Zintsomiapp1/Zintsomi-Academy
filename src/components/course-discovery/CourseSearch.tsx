
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';

interface CourseSearchProps {
  onSearch: (query: string) => void;
  onToggleFilters: () => void;
}

const CourseSearch = ({ onSearch, onToggleFilters }: CourseSearchProps) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="flex gap-2 w-full max-w-2xl">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search courses, instructors, topics..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
      <Button onClick={handleSearch}>Search</Button>
      <Button variant="outline" onClick={onToggleFilters}>
        <Filter className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CourseSearch;
