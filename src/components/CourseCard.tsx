
import React from 'react';
import { Heart, MessageCircle, Play, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CourseCardProps {
  course: {
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
  };
  onLike?: (courseId: string) => void;
  onComment?: (courseId: string) => void;
}

const CourseCard = ({ course, onLike, onComment }: CourseCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden rounded-2xl">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Play className="w-12 h-12 text-white" />
        </div>
        {course.isPremium && (
          <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
            Premium
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-800 line-clamp-2 leading-tight">
            {course.title}
          </h3>
          
          <p className="text-sm text-gray-600">{course.creator}</p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="text-blue-600 font-medium">{course.category}</span>
            {course.duration && <span>{course.duration}</span>}
          </div>
          
          {course.rating && (
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">{course.rating}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onLike?.(course.id)}
                className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
              >
                <Heart className="w-4 h-4" />
                <span className="text-sm">{course.likes}</span>
              </button>
              
              <button
                onClick={() => onComment?.(course.id)}
                className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{course.comments}</span>
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
