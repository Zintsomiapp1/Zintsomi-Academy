
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import CategoryTabs from '@/components/CategoryTabs';
import CourseGrid from '@/components/CourseGrid';

interface CoursesProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

const Courses = ({ user, onLogout }: CoursesProps) => {
  const [activeCategory, setActiveCategory] = useState('All');
  
  const categories = [
    'All',
    'IsiZulu Storytelling',
    'Nguni',
    'Sesotho',
    'English',
    'Sepedi',
    'VR Content',
    'AI-Powered',
    'Audio Books',
    'PDFs',
    'Lectures',
    'AR Content'
  ];

  // Sample course data
  const courses = [
    {
      id: '1',
      title: 'Traditional IsiZulu Folk Tales',
      creator: 'Dr. Nomsa Mbeki',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
      likes: 234,
      comments: 45,
      isPremium: true,
      rating: 4.8,
      category: 'IsiZulu Storytelling',
      duration: '2h 30m'
    },
    {
      id: '2',
      title: 'AI Character Creation Workshop',
      creator: 'Prof. Thabo Molefe',
      thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=225&fit=crop',
      likes: 156,
      comments: 28,
      isPremium: false,
      rating: 4.6,
      category: 'AI-Powered',
      duration: '1h 45m'
    },
    {
      id: '3',
      title: 'Sesotho Stories for Children',
      creator: 'Mrs. Lerato Motsepe',
      thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=225&fit=crop',
      likes: 189,
      comments: 32,
      isPremium: true,
      rating: 4.9,
      category: 'Sesotho',
      duration: '3h 15m'
    },
    {
      id: '4',
      title: 'Virtual Reality Storytelling Basics',
      creator: 'Dr. Sipho Ndlovu',
      thumbnail: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=400&h=225&fit=crop',
      likes: 298,
      comments: 67,
      isPremium: true,
      rating: 4.7,
      category: 'VR Content',
      duration: '4h 20m'
    },
    {
      id: '5',
      title: 'English Narrative Techniques',
      creator: 'Prof. Sarah Williams',
      thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=225&fit=crop',
      likes: 167,
      comments: 23,
      isPremium: false,
      rating: 4.5,
      category: 'English',
      duration: '2h 10m'
    },
    {
      id: '6',
      title: 'Sepedi Oral Traditions',
      creator: 'Chief Kgabo Mampuru',
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=225&fit=crop',
      likes: 143,
      comments: 19,
      isPremium: true,
      rating: 4.8,
      category: 'Sepedi',
      duration: '2h 45m'
    }
  ];

  const filteredCourses = activeCategory === 'All' 
    ? courses 
    : courses.filter(course => course.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} onLogout={onLogout} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Explore Our Courses
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover storytelling courses, AI-powered content, and immersive experiences 
            across multiple African languages and cutting-edge technologies.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-8">
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
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

        {/* Course Grid */}
        <CourseGrid
          courses={filteredCourses}
          onLike={(courseId) => console.log('Liked course:', courseId)}
          onComment={(courseId) => console.log('Comment on course:', courseId)}
        />
      </main>
    </div>
  );
};

export default Courses;
