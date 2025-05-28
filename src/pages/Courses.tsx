
import React, { useState, useEffect } from 'react';
import CategoryTabs from '@/components/CategoryTabs';
import CourseGrid from '@/components/CourseGrid';
import LoadingSpinner from '@/components/LoadingSpinner';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

const Courses = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
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

  // Sample courses as fallback
  const sampleCourses: Course[] = [
    {
      id: '1',
      title: 'Introduction to IsiZulu Storytelling',
      creator: 'Dr. Amara Okafor',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
      likes: 342,
      comments: 28,
      isPremium: false,
      rating: 4.8,
      category: 'IsiZulu Storytelling',
      duration: '3 hours',
    },
    {
      id: '2',
      title: 'Advanced African Narratives',
      creator: 'Prof. Thabo Mthembu',
      thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=225&fit=crop',
      likes: 189,
      comments: 15,
      isPremium: true,
      rating: 4.6,
      category: 'Nguni',
      duration: '5 hours',
    },
    {
      id: '3',
      title: 'Digital Storytelling Techniques',
      creator: 'Sarah Johnson',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop',
      likes: 456,
      comments: 42,
      isPremium: false,
      rating: 4.9,
      category: 'English',
      duration: '4 hours',
    }
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        // Transform data to match CourseCard interface
        const transformedCourses = data.map(course => ({
          id: course.id,
          title: course.title,
          creator: course.creator,
          thumbnail: course.thumbnail || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
          likes: Math.floor(Math.random() * 300) + 50,
          comments: Math.floor(Math.random() * 100) + 10,
          isPremium: course.is_premium,
          rating: course.rating,
          category: course.category,
          duration: course.duration,
        }));

        setCourses(transformedCourses);
      } else {
        // Use sample courses as fallback
        setCourses(sampleCourses);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses');
      
      // Use sample courses as fallback
      setCourses(sampleCourses);
      setLoading(false);
      
      toast({
        title: "Notice",
        description: "Using sample courses. Connect to Supabase for full functionality.",
        variant: "default",
      });
    }
  };

  const filteredCourses = activeCategory === 'All' 
    ? courses 
    : courses.filter(course => course.category === activeCategory);

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading courses..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
