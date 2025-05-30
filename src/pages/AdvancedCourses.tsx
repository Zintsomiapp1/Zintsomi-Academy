
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Star, Clock, Users } from 'lucide-react';

const AdvancedCourses = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const advancedCourses = [
    {
      id: '1',
      title: 'Advanced AI Storytelling Techniques',
      instructor: 'Dr. Sarah Williams',
      rating: 4.9,
      students: 1234,
      duration: '8 weeks',
      level: 'Advanced',
      price: '$199',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop',
      tags: ['AI', 'Storytelling', 'Technology']
    },
    {
      id: '2',
      title: 'Professional VR Content Creation',
      instructor: 'Prof. Michael Chen',
      rating: 4.8,
      students: 856,
      duration: '12 weeks',
      level: 'Expert',
      price: '$299',
      thumbnail: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=400&h=225&fit=crop',
      tags: ['VR', 'Content Creation', 'Professional']
    },
    {
      id: '3',
      title: 'Multilingual Narrative Mastery',
      instructor: 'Dr. Amara Okafor',
      rating: 4.7,
      students: 567,
      duration: '10 weeks',
      level: 'Advanced',
      price: '$249',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
      tags: ['Languages', 'Narrative', 'Cultural Studies']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Advanced Courses</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Take your skills to the next level with our expert-designed advanced courses
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search advanced courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advancedCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-2 right-2 bg-orange-500">
                  {course.level}
                </Badge>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                <p className="text-sm text-gray-600">{course.instructor}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {course.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-green-600">{course.price}</span>
                  <Button size="sm">Enroll Now</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedCourses;
