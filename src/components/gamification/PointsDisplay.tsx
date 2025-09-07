import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, TrendingUp, Award, Crown } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';

const PointsDisplay = () => {
  const { userPoints, loading, getCompletedAchievementsCount } = useGamification();

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-20">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const calculateLevel = (points: number) => {
    return Math.floor(points / 100) + 1;
  };

  const calculateLevelProgress = (points: number) => {
    return points % 100;
  };

  const getNextLevelPoints = (currentLevel: number) => {
    return currentLevel * 100;
  };

  const getRankTitle = (level: number) => {
    if (level >= 50) return { title: 'Grandmaster', icon: Crown, color: 'text-purple-600' };
    if (level >= 25) return { title: 'Expert', icon: Award, color: 'text-blue-600' };
    if (level >= 10) return { title: 'Advanced', icon: TrendingUp, color: 'text-green-600' };
    if (level >= 5) return { title: 'Intermediate', icon: Star, color: 'text-yellow-600' };
    return { title: 'Beginner', icon: Star, color: 'text-gray-600' };
  };

  const currentLevel = userPoints ? calculateLevel(userPoints.total_points) : 1;
  const levelProgress = userPoints ? calculateLevelProgress(userPoints.total_points) : 0;
  const nextLevelPoints = getNextLevelPoints(currentLevel);
  const rank = getRankTitle(currentLevel);
  const RankIcon = rank.icon;
  const achievementsCount = getCompletedAchievementsCount();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Level and Rank */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <RankIcon className={`w-8 h-8 ${rank.color}`} />
            <div>
              <div className="text-3xl font-bold text-gray-900">
                Level {currentLevel}
              </div>
              <Badge variant="outline" className={`text-sm ${rank.color} border-current`}>
                {rank.title}
              </Badge>
            </div>
          </div>
        </div>

        {/* Points */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <Star className="w-6 h-6 mx-auto mb-1 text-yellow-500" />
            <div className="text-2xl font-bold text-yellow-600">
              {userPoints?.total_points || 0}
            </div>
            <div className="text-sm text-yellow-700">Total Points</div>
          </div>
          
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Award className="w-6 h-6 mx-auto mb-1 text-blue-500" />
            <div className="text-2xl font-bold text-blue-600">
              {achievementsCount}
            </div>
            <div className="text-sm text-blue-700">Achievements</div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress to Level {currentLevel + 1}</span>
            <span className="text-gray-600">{levelProgress}/100</span>
          </div>
          <Progress value={levelProgress} className="h-2" />
          <div className="text-xs text-gray-500 text-center">
            {100 - levelProgress} points to next level
          </div>
        </div>

        {/* Quick Stats */}
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {userPoints?.experience_points || 0}
              </div>
              <div className="text-xs text-gray-500">Experience</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {nextLevelPoints - (userPoints?.total_points || 0)}
              </div>
              <div className="text-xs text-gray-500">To Next Level</div>
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <p className="text-sm text-gray-700">
            {levelProgress < 25 && "🌱 Keep growing! Every action counts."}
            {levelProgress >= 25 && levelProgress < 50 && "🚀 You're making great progress!"}
            {levelProgress >= 50 && levelProgress < 75 && "⭐ Almost there! You're doing amazing."}
            {levelProgress >= 75 && "🏆 So close to the next level! Push forward!"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PointsDisplay;