
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

  // Expanded sample courses with VR and AR content
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
    },
    {
      id: '4',
      title: 'Virtual Reality African Heritage Tour',
      creator: 'VR Studios Africa',
      thumbnail: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=400&h=225&fit=crop',
      likes: 567,
      comments: 89,
      isPremium: true,
      rating: 4.9,
      category: 'VR Content',
      duration: '2 hours',
    },
    {
      id: '5',
      title: 'Immersive Zulu Village Experience',
      creator: 'Cultural VR Lab',
      thumbnail: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=225&fit=crop',
      likes: 234,
      comments: 45,
      isPremium: true,
      rating: 4.7,
      category: 'VR Content',
      duration: '1.5 hours',
    },
    {
      id: '6',
      title: 'AR Storytelling with African Masks',
      creator: 'AR Education Team',
      thumbnail: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=400&h=225&fit=crop',
      likes: 123,
      comments: 67,
      isPremium: false,
      rating: 4.5,
      category: 'AR Content',
      duration: '45 minutes',
    },
    {
      id: '7',
      title: 'Interactive Historical Artifacts',
      creator: 'Museum AR',
      thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=225&fit=crop',
      likes: 445,
      comments: 78,
      isPremium: true,
      rating: 4.8,
      category: 'AR Content',
      duration: '3 hours',
    },
    {
      id: '8',
      title: 'AI-Powered Language Learning',
      creator: 'AI Language Labs',
      thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=225&fit=crop',
      likes: 890,
      comments: 156,
      isPremium: false,
      rating: 4.9,
      category: 'AI-Powered',
      duration: '6 hours',
    },
    {
      id: '9',
      title: 'Sesotho Folk Tales Audio Collection',
      creator: 'Audio Stories Africa',
      thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=225&fit=crop',
      likes: 267,
      comments: 34,
      isPremium: false,
      rating: 4.6,
      category: 'Audio Books',
      duration: '4 hours',
    },
    {
      id: '10',
      title: 'Traditional Sepedi Legends',
      creator: 'Heritage Audio',
      thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop',
      likes: 178,
      comments: 29,
      isPremium: true,
      rating: 4.4,
      category: 'Sepedi',
      duration: '2.5 hours',
    },
    {
      id: '11',
      title: 'Digital Storytelling Masterclass',
      creator: 'Prof. Digital Arts',
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=225&fit=crop',
      likes: 678,
      comments: 98,
      isPremium: true,
      rating: 4.8,
      category: 'Lectures',
      duration: '8 hours',
    },
    {
      id: '12',
      title: 'African Literature PDF Collection',
      creator: 'Digital Library',
      thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=225&fit=crop',
      likes: 345,
      comments: 56,
      isPremium: false,
      rating: 4.3,
      category: 'PDFs',
      duration: 'Self-paced',
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
