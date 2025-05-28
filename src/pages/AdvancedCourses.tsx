
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
      description: 'Master the art of traditional African storytelling with modern techniques',
      instructor: 'Dr. Amara Okafor',
      rating: 4.8,
      students: 1234,
      duration: '6 weeks',
      level: 'Advanced',
      price: 99.99,
      image: '/placeholder.svg'
    },
    {
      id: '2',
      title: 'Digital Marketing for Beginners',
      description: 'Learn the fundamentals of digital marketing and social media strategy',
      instructor: 'Sarah Johnson',
      rating: 4.6,
      students: 2567,
      duration: '4 weeks',
      level: 'Beginner',
      price: 79.99,
      image: '/placeholder.svg'
    },
    {
      id: '3',
      title: 'Data Science with Python',
      description: 'Complete guide to data science using Python and machine learning',
      instructor: 'Dr. Michael Chen',
      rating: 4.9,
      students: 3456,
      duration: '8 weeks',
      level: 'Intermediate',
      price: 149.99,
      image: '/placeholder.svg'
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
