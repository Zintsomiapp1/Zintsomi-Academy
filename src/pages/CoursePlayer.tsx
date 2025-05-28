
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import VideoPlayer from '@/components/VideoPlayer';
import LessonNavigation from '@/components/LessonNavigation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Course {
  id: string;
  title: string;
  description: string;
  creator: string;
  thumbnail: string;
  category: string;
  duration: string;
  rating: number;
  is_premium: boolean;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  video_url: string;
  audio_url: string;
  pdf_url: string;
  content: string;
  duration: number;
  order_index: number;
  is_free: boolean;
  completed?: boolean;
}

const CoursePlayer = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastWatchedPosition, setLastWatchedPosition] = useState(0);

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  useEffect(() => {
    if (user && courseId) {
      checkEnrollmentStatus();
    }
  }, [user, courseId]);

  const fetchCourseData = async () => {
    if (!courseId) return;

    try {
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Fetch lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');

      if (lessonsError) throw lessonsError;
      setLessons(lessonsData);

      // Set first lesson as current if available
      if (lessonsData.length > 0) {
        setCurrentLesson(lessonsData[0]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching course data:', error);
      toast({
        title: "Error",
        description: "Failed to load course content",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async () => {
    if (!user || !courseId) return;

    const { data } = await supabase
      .from('user_enrollments')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single();

    setIsEnrolled(!!data);
  };

  const handleEnroll = async () => {
    if (!user || !courseId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to enroll in courses",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId,
        });

      if (error) throw error;

      setIsEnrolled(true);
      toast({
        title: "Success!",
        description: "You've been enrolled in this course",
      });
    } catch (error) {
      console.error('Error enrolling:', error);
      toast({
        title: "Error",
        description: "Failed to enroll in course",
        variant: "destructive",
      });
    }
  };

  const handleLessonSelect = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      setCurrentLesson(lesson);
      setLastWatchedPosition(0);
    }
  };

  const handleProgress = async (currentTime: number, duration: number) => {
    if (!user || !currentLesson || !courseId) return;

    const progressPercentage = Math.floor((currentTime / duration) * 100);
    
    try {
      await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: currentLesson.id,
          progress_percentage: progressPercentage,
          last_watched_position: Math.floor(currentTime),
          completed: progressPercentage >= 90,
        });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleLessonEnd = () => {
    // Auto-advance to next lesson
    if (!currentLesson) return;
    
    const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
    const nextLesson = lessons[currentIndex + 1];
    
    if (nextLesson && (nextLesson.is_free || isEnrolled)) {
      setCurrentLesson(nextLesson);
      setLastWatchedPosition(0);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Course not found</p>
          <Button onClick={() => navigate('/courses')} className="mt-4">
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  const canAccessCurrentLesson = currentLesson.is_free || isEnrolled;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/courses')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="font-semibold text-gray-800">{course.title}</h1>
              <p className="text-sm text-gray-600">by {course.creator}</p>
            </div>
          </div>
          
          {!isEnrolled && course.is_premium && (
            <Button onClick={handleEnroll} className="bg-gradient-to-r from-blue-500 to-purple-600">
              Enroll Now
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {canAccessCurrentLesson ? (
                <VideoPlayer
                  src={currentLesson.video_url}
                  onProgress={handleProgress}
                  onEnded={handleLessonEnd}
                  initialTime={lastWatchedPosition}
                  className="aspect-video w-full"
                />
              ) : (
                <div className="aspect-video bg-gray-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">Premium Content</h3>
                    <p className="text-gray-300 mb-4">Enroll to access this lesson</p>
                    <Button onClick={handleEnroll} variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                      Enroll Now
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Lesson Details */}
            <div className="bg-white rounded-lg shadow-sm mt-4 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentLesson.title}</h2>
                  <p className="text-gray-600">{currentLesson.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {course.is_premium && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500">Premium</Badge>
                  )}
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">{course.rating}</span>
                  </div>
                </div>
              </div>
              
              {currentLesson.content && (
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold mb-2">About this lesson</h3>
                  <p className="text-gray-700">{currentLesson.content}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Lesson Navigation */}
          <div className="lg:col-span-1">
            <LessonNavigation
              lessons={lessons}
              currentLessonId={currentLesson.id}
              onLessonSelect={handleLessonSelect}
              isEnrolled={isEnrolled}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
