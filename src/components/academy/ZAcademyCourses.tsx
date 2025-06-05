
import React, { useState } from 'react';
import { Book, Clock, Star, Trophy, Filter, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCourses } from '@/hooks/useCourses';
import { useUserProgress } from '@/hooks/useUserProgress';

const ZAcademyCourses = () => {
  const { courses, loading } = useCourses();
  const { progress } = useUserProgress();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'storytelling', 'folklore', 'vr_lessons', 'creative_writing'];

  const filteredCourses = courses.filter(course => 
    selectedCategory === 'all' || course.category === selectedCategory
  );

  const getCourseProgress = (courseId: string) => {
    const courseInProgress = progress.coursesInProgress.find(c => c.id === courseId);
    return courseInProgress ? courseInProgress.progress : 0;
  };

  const getProgressText = (courseId: string) => {
    const progressPercent = getCourseProgress(courseId);
    if (progressPercent === 0) return 'Not started';
    if (progressPercent === 100) return 'Completed';
    return `${progressPercent}% complete`;
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Z Academy Courses</h2>
          <p className="text-gray-600">Enhance your storytelling skills with our curated courses</p>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">All Categories</option>
            <option value="storytelling">Storytelling</option>
            <option value="folklore">Folklore</option>
            <option value="vr_lessons">VR Lessons</option>
            <option value="creative_writing">Creative Writing</option>
          </select>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <Card className="bg-gradient-to-br from-sky-50 to-teal-50 border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <Book className="w-16 h-16 text-sky-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Courses Available Yet</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-4">
              Our educational courses will appear here once they are added by the admin team.
            </p>
            <p className="text-sm text-gray-500">
              Check back soon for exciting storytelling and cultural learning content!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="group hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white rounded-xl overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-sky-100 to-teal-100 relative">
                {course.thumbnail ? (
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Book className="w-12 h-12 text-sky-400" />
                  </div>
                )}
                {course.isPremium && (
                  <Badge className="absolute top-2 right-2 bg-yellow-500 hover:bg-yellow-600">
                    Premium
                  </Badge>
                )}
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-sky-600 transition-colors">
                  {course.title}
                </CardTitle>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{course.creator}</span>
                  {course.rating && (
                    <div className="flex items-center">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>{course.rating}</span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {course.description || 'Enhance your storytelling skills with this comprehensive course.'}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{course.duration || '2-3 hours'}</span>
                  </div>
                  <div className="flex items-center">
                    <Trophy className="w-3 h-3 mr-1" />
                    <span>{course.totalLessons || 5} lessons</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="text-gray-600">{getProgressText(course.id)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-sky-400 to-teal-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getCourseProgress(course.id)}%` }}
                      ></div>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-sky-400 to-teal-500 hover:from-sky-500 hover:to-teal-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    size="sm"
                  >
                    {getCourseProgress(course.id) > 0 ? 'Continue Learning' : 'Start Course'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ZAcademyCourses;
