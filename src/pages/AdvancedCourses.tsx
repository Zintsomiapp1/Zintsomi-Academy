
import React, { useState } from 'react';
import CourseSearch from '@/components/course-discovery/CourseSearch';
import CourseFilters from '@/components/course-discovery/CourseFilters';
import CourseCard from '@/components/CourseCard';

const AdvancedCourses = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const sampleCourses = [
    {
      id: '1',
      title: 'Advanced African Storytelling',
      creator: 'Dr. Amara Okafor',
      thumbnail: '/placeholder.svg',
      likes: 1234,
      comments: 89,
      isPremium: true,
      rating: 4.8,
      category: 'IsiZulu Storytelling',
      duration: '6 weeks'
    },
    {
      id: '2',
      title: 'Digital Marketing for Beginners',
      creator: 'Sarah Johnson',
      thumbnail: '/placeholder.svg',
      likes: 2567,
      comments: 145,
      isPremium: false,
      rating: 4.6,
      category: 'English',
      duration: '4 weeks'
    },
    {
      id: '3',
      title: 'Data Science with Python',
      creator: 'Dr. Michael Chen',
      thumbnail: '/placeholder.svg',
      likes: 3456,
      comments: 234,
      isPremium: true,
      rating: 4.9,
      category: 'AI-Powered',
      duration: '8 weeks'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Discover Courses</h1>
          <p className="text-gray-600 mt-2">Find the perfect course for your learning journey</p>
        </div>

        <div className="mb-6">
          <CourseSearch 
            onSearch={setSearchQuery}
            onToggleFilters={() => setShowFilters(!showFilters)}
          />
        </div>

        <div className="flex gap-6">
          {showFilters && (
            <div className="w-1/4">
              <CourseFilters onFiltersChange={(filters) => console.log(filters)} />
            </div>
          )}
          
          <div className={`${showFilters ? 'w-3/4' : 'w-full'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCourses;
