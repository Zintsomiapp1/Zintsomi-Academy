
import { useState, useEffect } from 'react';

interface UserProgress {
  coursesCompleted: number;
  hoursLearned: number;
  currentStreak: number;
  certificates: number;
  coursesInProgress: Array<{
    id: string;
    title: string;
    progress: number;
    thumbnail: string;
  }>;
}

const PROGRESS_STORAGE_KEY = 'zintsomi_user_progress';

export const useUserProgress = () => {
  const [progress, setProgress] = useState<UserProgress>({
    coursesCompleted: 0,
    hoursLearned: 0,
    currentStreak: 0,
    certificates: 0,
    coursesInProgress: [],
  });

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress);
        setProgress(parsedProgress);
      }
    } catch (error) {
      console.error('Error loading user progress from localStorage:', error);
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving user progress to localStorage:', error);
    }
  }, [progress]);

  const startCourse = (courseId: string, title: string, thumbnail: string) => {
    setProgress(prev => {
      const existingCourse = prev.coursesInProgress.find(c => c.id === courseId);
      if (existingCourse) return prev;
      
      return {
        ...prev,
        coursesInProgress: [
          ...prev.coursesInProgress,
          { id: courseId, title, progress: 0, thumbnail }
        ]
      };
    });
  };

  const updateCourseProgress = (courseId: string, progressPercentage: number) => {
    setProgress(prev => ({
      ...prev,
      coursesInProgress: prev.coursesInProgress.map(course =>
        course.id === courseId
          ? { ...course, progress: progressPercentage }
          : course
      )
    }));
  };

  const completeCourse = (courseId: string, hoursSpent: number = 1) => {
    setProgress(prev => ({
      ...prev,
      coursesCompleted: prev.coursesCompleted + 1,
      hoursLearned: prev.hoursLearned + hoursSpent,
      certificates: prev.certificates + 1,
      coursesInProgress: prev.coursesInProgress.filter(c => c.id !== courseId)
    }));
  };

  const updateStreak = (days: number) => {
    setProgress(prev => ({
      ...prev,
      currentStreak: days
    }));
  };

  const resetProgress = () => {
    setProgress({
      coursesCompleted: 0,
      hoursLearned: 0,
      currentStreak: 0,
      certificates: 0,
      coursesInProgress: [],
    });
  };

  return {
    progress,
    startCourse,
    updateCourseProgress,
    completeCourse,
    updateStreak,
    resetProgress,
  };
};
