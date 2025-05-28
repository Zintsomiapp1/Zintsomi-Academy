
import React from 'react';
import { Play, Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Lesson {
  id: string;
  title: string;
  duration: number;
  order_index: number;
  is_free: boolean;
  completed?: boolean;
}

interface LessonNavigationProps {
  lessons: Lesson[];
  currentLessonId: string;
  onLessonSelect: (lessonId: string) => void;
  isEnrolled: boolean;
}

const LessonNavigation = ({ lessons, currentLessonId, onLessonSelect, isEnrolled }: LessonNavigationProps) => {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  };

  const canAccessLesson = (lesson: Lesson) => {
    return lesson.is_free || isEnrolled;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border h-full">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-800">Course Content</h3>
        <p className="text-sm text-gray-600">{lessons.length} lessons</p>
      </div>
      
      <ScrollArea className="h-[calc(100%-80px)]">
        <div className="p-2">
          {lessons
            .sort((a, b) => a.order_index - b.order_index)
            .map((lesson, index) => {
              const isCurrentLesson = lesson.id === currentLessonId;
              const canAccess = canAccessLesson(lesson);
              
              return (
                <Button
                  key={lesson.id}
                  variant={isCurrentLesson ? "default" : "ghost"}
                  className={`w-full justify-start p-3 h-auto mb-2 ${
                    !canAccess ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                  onClick={() => canAccess && onLessonSelect(lesson.id)}
                  disabled={!canAccess}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className="flex-shrink-0">
                      {lesson.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : !canAccess ? (
                        <Lock className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {index + 1}. {lesson.title}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDuration(lesson.duration)}
                        </span>
                      </div>
                      
                      {!lesson.is_free && !isEnrolled && (
                        <span className="text-xs text-yellow-600 font-medium">Premium</span>
                      )}
                      
                      {lesson.is_free && (
                        <span className="text-xs text-green-600 font-medium">Free</span>
                      )}
                    </div>
                  </div>
                </Button>
              );
            })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LessonNavigation;
