import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Calendar, MessageCircle, Gamepad2, Brain, Trophy } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';

const streakIcons = {
  login: Flame,
  messaging: MessageCircle,
  gaming: Gamepad2,
  learning: Brain,
};

const streakColors = {
  login: 'text-orange-500',
  messaging: 'text-blue-500',
  gaming: 'text-purple-500',
  learning: 'text-green-500',
};

const streakNames = {
  login: 'Daily Login',
  messaging: 'Messaging',
  gaming: 'Gaming',
  learning: 'Learning',
};

const StreakDisplay = () => {
  const { userStreaks, loading } = useGamification();

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            Your Streaks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-20">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const loginStreak = userStreaks.find(s => s.streak_type === 'login');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Your Streaks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Login Streak */}
        <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame className="w-8 h-8 text-orange-500" />
            <div>
              <div className="text-3xl font-bold text-orange-600">
                {loginStreak?.current_streak || 0}
              </div>
              <div className="text-sm text-orange-700 font-medium">
                Daily Login Streak
              </div>
            </div>
          </div>
          
          {loginStreak && (
            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-orange-600">
              <div className="flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                <span>Best: {loginStreak.longest_streak}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Last: {new Date(loginStreak.last_activity_date).toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Other Streaks */}
        <div className="grid grid-cols-2 gap-2">
          {userStreaks
            .filter(streak => streak.streak_type !== 'login')
            .map((streak) => {
              const IconComponent = streakIcons[streak.streak_type as keyof typeof streakIcons] || Flame;
              const colorClass = streakColors[streak.streak_type as keyof typeof streakColors] || 'text-gray-500';
              const streakName = streakNames[streak.streak_type as keyof typeof streakNames] || streak.streak_type;

              return (
                <div 
                  key={streak.id}
                  className="p-3 bg-gray-50 rounded-lg border text-center"
                >
                  <IconComponent className={`w-5 h-5 mx-auto mb-1 ${colorClass}`} />
                  <div className="text-lg font-bold text-gray-900">
                    {streak.current_streak}
                  </div>
                  <div className="text-xs text-gray-600 truncate">
                    {streakName}
                  </div>
                  <Badge variant="outline" className="text-xs mt-1">
                    Best: {streak.longest_streak}
                  </Badge>
                </div>
              );
            })}
        </div>

        {userStreaks.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <Flame className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Start your first streak today!</p>
            <p className="text-xs text-gray-400 mt-1">
              Login daily to build your streak
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StreakDisplay;
