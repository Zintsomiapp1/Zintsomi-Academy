import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Flame, Star, Target } from 'lucide-react';
import StreakDisplay from './StreakDisplay';
import AchievementsList from './AchievementsList';
import PointsDisplay from './PointsDisplay';
import { useGamification } from '@/hooks/useGamification';

const GamificationDashboard = () => {
  const { userPoints, getCompletedAchievementsCount, getStreakByType } = useGamification();
  
  const loginStreak = getStreakByType('login');
  const completedAchievements = getCompletedAchievementsCount();

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Quick Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold text-gray-900">
              {userPoints?.total_points || 0}
            </div>
            <div className="text-sm text-gray-600">Total Points</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold text-gray-900">
              {loginStreak?.current_streak || 0}
            </div>
            <div className="text-sm text-gray-600">Login Streak</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold text-gray-900">
              {completedAchievements}
            </div>
            <div className="text-sm text-gray-600">Achievements</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <Target className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold text-gray-900">
              {userPoints?.level || 1}
            </div>
            <div className="text-sm text-gray-600">Level</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="streaks">Streaks</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PointsDisplay />
            <StreakDisplay />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AchievementsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="streaks">
          <StreakDisplay />
        </TabsContent>

        <TabsContent value="achievements">
          <AchievementsList />
        </TabsContent>

        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Leaderboard Coming Soon!
                </h3>
                <p className="text-gray-500">
                  Compare your progress with other users and see who's leading the pack.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamificationDashboard;