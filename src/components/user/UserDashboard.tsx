
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
import { useUserProgress } from '@/hooks/useUserProgress';

const UserDashboard = () => {
  const { user } = useAuth();
  const { progress } = useUserProgress();

  const stats = [
    { label: 'Courses Completed', value: '0', icon: Trophy, color: 'text-yellow-600' },
    { label: 'Hours Learned', value: '0', icon: Clock, color: 'text-sky-600' },
    { label: 'Current Streak', value: '0 days', icon: Target, color: 'text-green-600' },
    { label: 'Certificates', value: '0', icon: BookOpen, color: 'text-purple-600' }
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
              <p className="text-gray-600">Start your learning journey today</p>
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

      {/* Empty Learning State */}
      <Card>
        <CardHeader>
          <CardTitle>Continue Learning</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses started yet</h3>
          <p className="text-gray-600 mb-6">Begin your learning journey by exploring our course catalog</p>
          <Link to="/courses">
            <Button className="bg-sky-600 hover:bg-sky-700">Browse Courses</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-sky-600" />
            <h3 className="font-semibold mb-2">Browse Courses</h3>
            <p className="text-sm text-gray-600 mb-4">Discover new learning opportunities</p>
            <Link to="/courses">
              <Button className="w-full bg-sky-600 hover:bg-sky-700">Explore Courses</Button>
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
