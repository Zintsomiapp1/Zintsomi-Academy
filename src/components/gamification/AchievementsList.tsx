import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Lock, Star, Medal } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';

const categoryIcons = {
  milestone: Trophy,
  streak: Star,
  social: Medal,
  gaming: Medal,
  learning: Medal,
  general: Trophy,
};

const AchievementsList = () => {
  const { achievements, userAchievements, loading } = useGamification();
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const categories = ['all', ...Array.from(new Set(achievements.map(a => a.category)))];
  const userAchievementIds = new Set(userAchievements.filter(ua => ua.is_completed).map(ua => ua.achievement_id));
  
  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const completedCount = userAchievements.filter(ua => ua.is_completed).length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Achievements
          </div>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            {completedCount}/{achievements.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid grid-cols-3 w-full mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="locked">Locked</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {filteredAchievements.map((achievement) => {
              const isCompleted = userAchievementIds.has(achievement.id);
              const IconComponent = categoryIcons[achievement.category as keyof typeof categoryIcons] || Trophy;
              
              return (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border transition-all ${
                    isCompleted 
                      ? 'bg-yellow-50 border-yellow-200 shadow-sm' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      isCompleted ? 'bg-yellow-100' : 'bg-gray-100'
                    }`}>
                      {isCompleted ? (
                        <span className="text-2xl">{achievement.icon}</span>
                      ) : (
                        <Lock className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-medium ${
                          isCompleted ? 'text-yellow-800' : 'text-gray-600'
                        }`}>
                          {achievement.name}
                        </h3>
                        <Badge 
                          variant={isCompleted ? "default" : "secondary"}
                          className={isCompleted ? "bg-yellow-500 text-white" : ""}
                        >
                          {achievement.points} pts
                        </Badge>
                      </div>
                      
                      <p className={`text-sm mt-1 ${
                        isCompleted ? 'text-yellow-700' : 'text-gray-500'
                      }`}>
                        {achievement.description}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {achievement.category}
                        </Badge>
                        
                        {isCompleted && (
                          <Badge variant="default" className="text-xs bg-green-500">
                            ✓ Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="completed" className="space-y-3">
            {achievements
              .filter(a => userAchievementIds.has(a.id))
              .map((achievement) => {
                const userAchievement = userAchievements.find(ua => ua.achievement_id === achievement.id);
                
                return (
                  <div
                    key={achievement.id}
                    className="p-4 rounded-lg border bg-yellow-50 border-yellow-200 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-yellow-100">
                        <span className="text-2xl">{achievement.icon}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-yellow-800">
                            {achievement.name}
                          </h3>
                          <Badge className="bg-yellow-500 text-white">
                            {achievement.points} pts
                          </Badge>
                        </div>
                        
                        <p className="text-sm mt-1 text-yellow-700">
                          {achievement.description}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {achievement.category}
                          </Badge>
                          
                          {userAchievement?.completed_at && (
                            <Badge variant="secondary" className="text-xs">
                              {new Date(userAchievement.completed_at).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
            {achievements.filter(a => userAchievementIds.has(a.id)).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Trophy className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No achievements unlocked yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  Start exploring to unlock your first achievement!
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="locked" className="space-y-3">
            {achievements
              .filter(a => !userAchievementIds.has(a.id))
              .map((achievement) => (
                <div
                  key={achievement.id}
                  className="p-4 rounded-lg border bg-gray-50 border-gray-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-gray-100">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-600">
                          {achievement.name}
                        </h3>
                        <Badge variant="secondary">
                          {achievement.points} pts
                        </Badge>
                      </div>
                      
                      <p className="text-sm mt-1 text-gray-500">
                        {achievement.description}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {achievement.category}
                        </Badge>
                        
                        <Badge variant="outline" className="text-xs text-gray-500">
                          🔒 Locked
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AchievementsList;