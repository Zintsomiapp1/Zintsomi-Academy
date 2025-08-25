
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
// import { useUserProgress } from '@/hooks/useUserProgress';

const UserDashboard = () => {
  const { user } = useAuth();
  // const { progress } = useUserProgress();

  const stats = [
    { label: 'Matches Made', value: '0', icon: Heart, color: 'text-pink-600' },
    { label: 'Messages Sent', value: '0', icon: Clock, color: 'text-blue-600' },
    { label: 'Profile Views', value: '0', icon: Target, color: 'text-green-600' },
    { label: 'Dates Planned', value: '0', icon: Trophy, color: 'text-purple-600' }
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
              <p className="text-gray-600">Ready to find your perfect match?</p>
            </div>
            <div className="flex gap-2">
              <Link to="/profile-settings">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
              {/* Removed wishlist and cart buttons */}
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

      {/* Get Started */}
      <Card>
        <CardHeader>
          <CardTitle>Start Your Dating Journey</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Heart className="w-16 h-16 mx-auto mb-4 text-pink-500" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Find Your Perfect Match</h3>
          <p className="text-gray-600 mb-6">Connect with amazing people across Africa</p>
          <Link to="/mjolo">
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">Start Dating</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Heart className="w-12 h-12 mx-auto mb-4 text-pink-600" />
            <h3 className="font-semibold mb-2">Mjolo Dating</h3>
            <p className="text-sm text-gray-600 mb-4">Find your perfect match</p>
            <Link to="/mjolo">
              <Button className="w-full bg-pink-600 hover:bg-pink-700">Start Dating</Button>
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
