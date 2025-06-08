
import React from 'react';
import { Edit, Trash2, Users, Clock, Eye, FileText, Video, Music } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AdminCourseCardProps {
  course: any;
  onEdit: (course: any) => void;
  onDelete: (courseId: string) => void;
}

const AdminCourseCard = ({ course, onEdit, onDelete }: AdminCourseCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
              {course.isPremium && (
                <Badge className="bg-yellow-500 hover:bg-yellow-600">Premium</Badge>
              )}
              <Badge variant="outline">{course.category}</Badge>
              <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                {course.status}
              </Badge>
              {course.featured && (
                <Badge className="bg-purple-500 hover:bg-purple-600">Featured</Badge>
              )}
            </div>
            
            <p className="text-gray-600 mb-3">Created by {course.creator}</p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>24 enrolled</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{course.duration || '2-3 hours'}</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                <span>156 views</span>
              </div>
              {course.pdf_url && (
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-1" />
                  <span>PDF</span>
                </div>
              )}
              {course.video_url && (
                <div className="flex items-center">
                  <Video className="w-4 h-4 mr-1" />
                  <span>Video</span>
                </div>
              )}
              {course.audio_url && (
                <div className="flex items-center">
                  <Music className="w-4 h-4 mr-1" />
                  <span>Audio</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(course)}
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-600 hover:text-red-700"
              onClick={() => onDelete(course.id)}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminCourseCard;
