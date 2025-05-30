
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  Target,
  User,
  Settings,
  Heart,
  ShoppingCart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const UserDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Courses Completed', value: '3', icon: Trophy, color: 'text-yellow-600' },
    { label: 'Hours Learned', value: '24', icon: Clock, color: 'text-blue-600' },
    { label: 'Current Streak', value: '7 days', icon: Target, color: 'text-green-600' },
    { label: 'Certificates', value: '2', icon: BookOpen, color: 'text-purple-600' }
  ];

  const recentCourses = [
    { title: 'IsiZulu Storytelling', progress: 75, thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=60&fit=crop' },
    { title: 'Advanced Narratives', progress: 45, thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=60&fit=crop' },
    { title: 'Digital Storytelling', progress: 90, thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=60&fit=crop' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Learner'}!
              </h2>
              <p className="text-gray-600">Continue your learning journey</p>
            </div>
            <div className="flex gap-2">
              <Link to="/profile-settings">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
              <Link to="/wishlist">
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  Wishlist
                </Button>
              </Link>
              <Link to="/cart">
                <Button variant="outline" size="sm">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Continue Learning</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentCourses.map((course, index) => (
            <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="w-16 h-10 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-medium">{course.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={course.progress} className="flex-1" />
                  <span className="text-sm text-gray-600">{course.progress}%</span>
                </div>
              </div>
              <Button size="sm">Continue</Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h3 className="font-semibold mb-2">Browse Courses</h3>
            <p className="text-sm text-gray-600 mb-4">Discover new learning opportunities</p>
            <Link to="/courses">
              <Button className="w-full">Explore Courses</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Target className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <h3 className="font-semibold mb-2">Brain Training</h3>
            <p className="text-sm text-gray-600 mb-4">Exercise your cognitive abilities</p>
            <Link to="/brain-training">
              <Button className="w-full" variant="outline">Start Training</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <User className="w-12 h-12 mx-auto mb-4 text-purple-600" />
            <h3 className="font-semibold mb-2">Profile</h3>
            <p className="text-sm text-gray-600 mb-4">Manage your account settings</p>
            <Link to="/profile-settings">
              <Button className="w-full" variant="outline">View Profile</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
