
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Clock, BookOpen, Star, Settings, Shield, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';

const UserDashboard = () => {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();

  const enrolledCourses = [
    { id: 1, title: 'African Storytelling Basics', progress: 75, timeSpent: '8h 30m' },
    { id: 2, title: 'Advanced Xhosa Literature', progress: 45, timeSpent: '5h 15m' },
    { id: 3, title: 'Digital Marketing', progress: 90, timeSpent: '12h 45m' },
  ];

  const achievements = [
    { id: 1, title: 'First Course Completed', icon: Trophy, earned: true },
    { id: 2, title: 'Study Streak - 7 Days', icon: Clock, earned: true },
    { id: 3, title: 'Knowledge Seeker', icon: BookOpen, earned: false },
  ];

  return (
    <div className="space-y-6">
      {/* User Profile Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
                  {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                </h2>
                <p className="text-gray-600">{user?.email}</p>
                {isAdmin && (
                  <Badge className="mt-1 bg-gradient-to-r from-yellow-500 to-orange-500">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => window.location.href = '/profile-settings'}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Profile Settings
              </Button>
              {isAdmin && (
                <Button
                  onClick={() => window.location.href = '/admin'}
                  className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                >
                  <Shield className="w-4 h-4" />
                  Admin Panel
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Courses Enrolled</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hours Learned</p>
                <p className="text-2xl font-bold">26h</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Certificates Earned</p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning Section */}
      <Card>
        <CardHeader>
          <CardTitle>Continue Learning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">{course.title}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <Progress value={course.progress} className="w-32" />
                    <span className="text-sm text-gray-600">{course.progress}% complete</span>
                    <span className="text-sm text-gray-600">{course.timeSpent}</span>
                  </div>
                </div>
                <Badge variant="outline">Continue</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements Section */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 border rounded-lg text-center ${
                  achievement.earned ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <achievement.icon
                  className={`h-8 w-8 mx-auto mb-2 ${
                    achievement.earned ? 'text-yellow-500' : 'text-gray-400'
                  }`}
                />
                <p className="text-sm font-medium">{achievement.title}</p>
                {achievement.earned && <Badge className="mt-2">Earned</Badge>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
