
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
  pdf_url?: string;
  video_url?: string;
  audio_url?: string;
  status?: string;
  featured?: boolean;
  likes: number;
  comments: number;
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
            pdf_url,
            video_url,
            audio_url,
            status,
            featured,
            lessons:lessons(count)
          `)
          .eq('status', 'published')
          .order('created_at', { ascending: false });

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
          pdf_url: course.pdf_url,
          video_url: course.video_url,
          audio_url: course.audio_url,
          status: course.status,
          featured: course.featured,
          likes: 0, // Default value for likes
          comments: 0, // Default value for comments
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
