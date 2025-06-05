
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface CourseProgress {
  id: string;
  progress: number;
}

interface UserProgress {
  coursesInProgress: CourseProgress[];
  completedCourses: string[];
  totalCoursesEnrolled: number;
}

export const useUserProgress = () => {
  const [progress, setProgress] = useState<UserProgress>({
    coursesInProgress: [],
    completedCourses: [],
    totalCoursesEnrolled: 0,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch user enrollments and progress
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from('user_enrollments')
          .select(`
            course_id,
            completed_at,
            courses:course_id(title)
          `)
          .eq('user_id', user.id);

        if (enrollmentsError) throw enrollmentsError;

        // Fetch progress for each course
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('course_id, progress_percentage, completed')
          .eq('user_id', user.id);

        if (progressError) throw progressError;

        // Calculate progress by course
        const courseProgressMap = new Map<string, number>();
        const completedCourseIds = new Set<string>();

        progressData?.forEach(p => {
          const currentProgress = courseProgressMap.get(p.course_id) || 0;
          courseProgressMap.set(p.course_id, Math.max(currentProgress, p.progress_percentage || 0));
          
          if (p.completed) {
            completedCourseIds.add(p.course_id);
          }
        });

        const coursesInProgress = Array.from(courseProgressMap.entries())
          .filter(([courseId, progress]) => progress > 0 && progress < 100)
          .map(([courseId, progress]) => ({ id: courseId, progress }));

        setProgress({
          coursesInProgress,
          completedCourses: Array.from(completedCourseIds),
          totalCoursesEnrolled: enrollments?.length || 0,
        });
      } catch (err) {
        console.error('Error fetching user progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProgress();
  }, [user]);

  return { progress, loading };
};
