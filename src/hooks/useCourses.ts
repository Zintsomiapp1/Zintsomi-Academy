
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Course, sampleCourses } from '@/data/sampleCourses';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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

  useEffect(() => {
    fetchCourses();
  }, []);

  return { courses, loading, error, refetch: fetchCourses };
};
