
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Upload } from 'lucide-react';

const AdvancedCourses = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const advancedCourses = []; // Empty courses array

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Advanced Courses</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Take your skills to the next level with our expert-designed advanced courses
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search advanced courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Empty State */}
        <div className="text-center py-16">
          <div className="bg-gray-100 rounded-lg p-12 max-w-md mx-auto">
            <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Advanced Courses Available</h3>
            <p className="text-gray-500 mb-4">Ready for new content to be added</p>
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center">
              <span className="text-gray-400">Upload Image</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCourses;
