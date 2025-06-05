
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  category: string;
  creator: string;
  isPremium?: boolean;
  rating?: number;
  duration?: string;
  totalLessons?: number;
  price?: number;
  created_at?: string;
  updated_at?: string;
}

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select(`
            id,
            title,
            description,
            thumbnail,
            category,
            creator,
            is_premium,
            rating,
            duration,
            price,
            created_at,
            updated_at,
            lessons:lessons(count)
          `);

        if (error) throw error;

        const coursesWithLessons = data?.map(course => ({
          id: course.id,
          title: course.title,
          description: course.description,
          thumbnail: course.thumbnail,
          category: course.category,
          creator: course.creator,
          isPremium: course.is_premium,
          rating: course.rating,
          duration: course.duration,
          totalLessons: course.lessons?.[0]?.count || 0,
          price: course.price,
          created_at: course.created_at,
          updated_at: course.updated_at,
        })) || [];

        setCourses(coursesWithLessons);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch courses');
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return { courses, loading, error };
};
