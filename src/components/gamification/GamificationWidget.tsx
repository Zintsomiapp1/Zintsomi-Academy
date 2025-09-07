import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Star, Trophy, Target } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';
import { Link } from 'react-router-dom';

const GamificationWidget = () => {
  const { 
    userPoints, 
    getStreakByType, 
    getCompletedAchievementsCount, 
    loading 
  } = useGamification();

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center justify-center h-20">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const loginStreak = getStreakByType('login');
  const completedAchievements = getCompletedAchievementsCount();
  const currentLevel = userPoints ? Math.floor(userPoints.total_points / 100) + 1 : 1;

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            Your Progress
          </h3>
          <Link 
            to="/gamification"
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Level */}
          <div className="text-center p-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
            <Target className="w-5 h-5 mx-auto mb-1 text-purple-500" />
            <div className="text-lg font-bold text-purple-600">
              {currentLevel}
            </div>
            <div className="text-xs text-purple-700">Level</div>
          </div>

          {/* Points */}
          <div className="text-center p-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
            <Star className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
            <div className="text-lg font-bold text-yellow-600">
              {userPoints?.total_points || 0}
            </div>
            <div className="text-xs text-yellow-700">Points</div>
          </div>

          {/* Streak */}
          <div className="text-center p-2 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
            <Flame className="w-5 h-5 mx-auto mb-1 text-orange-500" />
            <div className="text-lg font-bold text-orange-600">
              {loginStreak?.current_streak || 0}
            </div>
            <div className="text-xs text-orange-700">Streak</div>
          </div>

          {/* Achievements */}
          <div className="text-center p-2 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
            <Trophy className="w-5 h-5 mx-auto mb-1 text-blue-500" />
            <div className="text-lg font-bold text-blue-600">
              {completedAchievements}
            </div>
            <div className="text-xs text-blue-700">Unlocked</div>
          </div>
        </div>

        {/* Progress message */}
        <div className="mt-3 text-center">
          {loginStreak && loginStreak.current_streak > 0 ? (
            <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
              🔥 {loginStreak.current_streak} day streak!
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
              Start your streak today! 🎯
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GamificationWidget;