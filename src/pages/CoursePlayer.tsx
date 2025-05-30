
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Settings,
  BookOpen,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const CoursePlayer = () => {
  const { id } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(0);

  const course = {
    id: id,
    title: 'Introduction to IsiZulu Storytelling',
    creator: 'Dr. Amara Okafor',
    totalLessons: 8,
    progress: 25
  };

  const lessons = [
    { id: 1, title: 'Welcome to IsiZulu Storytelling', duration: '5:30', completed: true },
    { id: 2, title: 'History and Origins', duration: '12:45', completed: true },
    { id: 3, title: 'Traditional Characters', duration: '8:20', completed: false },
    { id: 4, title: 'Narrative Structure', duration: '15:10', completed: false },
    { id: 5, title: 'Cultural Context', duration: '10:30', completed: false },
    { id: 6, title: 'Modern Adaptations', duration: '14:20', completed: false },
    { id: 7, title: 'Practice Session', duration: '20:00', completed: false },
    { id: 8, title: 'Final Project', duration: '25:30', completed: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Video Player */}
          <div className="lg:col-span-3 space-y-6">
            {/* Video Player */}
            <Card>
              <CardContent className="p-0">
                <div className="relative bg-black aspect-video rounded-t-lg">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                        {isPlaying ? (
                          <Pause className="w-12 h-12" />
                        ) : (
                          <Play className="w-12 h-12 ml-1" />
                        )}
                      </div>
                      <p className="text-lg">Video Player Placeholder</p>
                      <p className="text-sm opacity-75">Lesson {currentLesson + 1}: {lessons[currentLesson]?.title}</p>
                    </div>
                  </div>
                </div>
                
                {/* Controls */}
                <div className="p-4 space-y-4">
                  <Progress value={35} className="w-full" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <SkipBack className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <SkipForward className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Volume2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Info */}
            <Card>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <p className="text-gray-600">by {course.creator}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm text-gray-600">
                    Lesson {currentLesson + 1} of {course.totalLessons}
                  </span>
                  <Progress value={course.progress} className="flex-1" />
                  <span className="text-sm font-medium">{course.progress}% Complete</span>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Resources
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Notes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lesson Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Course Content</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                        index === currentLesson ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                      onClick={() => setCurrentLesson(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium line-clamp-2">{lesson.title}</p>
                          <p className="text-xs text-gray-600">{lesson.duration}</p>
                        </div>
                        {lesson.completed && (
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      disabled={currentLesson === 0}
                      onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      disabled={currentLesson === lessons.length - 1}
                      onClick={() => setCurrentLesson(Math.min(lessons.length - 1, currentLesson + 1))}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
