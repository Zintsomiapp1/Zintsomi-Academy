import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  points: number;
  requirement_type: string;
  requirement_value: number;
  is_active: boolean;
}

interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  progress: number;
  is_completed: boolean;
  completed_at: string | null;
  achievement: Achievement;
}

interface UserStreak {
  id: string;
  user_id: string;
  streak_type: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
}

interface UserPoints {
  id: string;
  user_id: string;
  total_points: number;
  level: number;
  experience_points: number;
}

export const useGamification = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [userStreaks, setUserStreaks] = useState<UserStreak[]>([]);
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [loading, setLoading] = useState(true);

  // Load all achievements
  const loadAchievements = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  }, []);

  // Load user's achievements
  const loadUserAchievements = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      setUserAchievements(data || []);
    } catch (error) {
      console.error('Error loading user achievements:', error);
    }
  }, [user]);

  // Load user's streaks
  const loadUserStreaks = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setUserStreaks(data || []);
    } catch (error) {
      console.error('Error loading user streaks:', error);
    }
  }, [user]);

  // Load user's points
  const loadUserPoints = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (!data) {
        // Create initial points record
        const { data: newPoints, error: createError } = await supabase
          .from('user_points')
          .insert({
            user_id: user.id,
            total_points: 0,
            level: 1,
            experience_points: 0
          })
          .select()
          .single();

        if (createError) throw createError;
        setUserPoints(newPoints);
      } else {
        setUserPoints(data);
      }
    } catch (error) {
      console.error('Error loading user points:', error);
    }
  }, [user]);

  // Update login streak
  const updateLoginStreak = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('update_login_streak', {
        user_id: user.id
      });

      if (error) throw error;
      
      // Reload data to get updated streaks and achievements
      await Promise.all([
        loadUserStreaks(),
        loadUserAchievements(),
        loadUserPoints()
      ]);
    } catch (error) {
      console.error('Error updating login streak:', error);
    }
  }, [user, loadUserStreaks, loadUserAchievements, loadUserPoints]);

  // Update activity streak (for messaging, gaming, etc.)
  const updateActivityStreak = useCallback(async (streakType: string) => {
    if (!user) return;

    try {
      const { data: existingStreak } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user.id)
        .eq('streak_type', streakType)
        .single();

      const today = new Date().toISOString().split('T')[0];
      
      if (!existingStreak) {
        // Create new streak
        await supabase
          .from('user_streaks')
          .insert({
            user_id: user.id,
            streak_type: streakType,
            current_streak: 1,
            longest_streak: 1,
            last_activity_date: today
          });
      } else {
        const lastActivity = new Date(existingStreak.last_activity_date);
        const todayDate = new Date(today);
        const diffTime = todayDate.getTime() - lastActivity.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
          // Already updated today
          return;
        }

        let newStreak = 1;
        if (diffDays === 1) {
          // Consecutive day
          newStreak = existingStreak.current_streak + 1;
        }

        await supabase
          .from('user_streaks')
          .update({
            current_streak: newStreak,
            longest_streak: Math.max(existingStreak.longest_streak, newStreak),
            last_activity_date: today
          })
          .eq('id', existingStreak.id);
      }

      await loadUserStreaks();
    } catch (error) {
      console.error('Error updating activity streak:', error);
    }
  }, [user, loadUserStreaks]);

  // Award achievement
  const awardAchievement = useCallback(async (achievementId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_id: achievementId,
          progress: 1,
          is_completed: true,
          completed_at: new Date().toISOString()
        });

      if (error && error.code !== '23505') throw error; // Ignore duplicate key errors

      const achievement = achievements.find(a => a.id === achievementId);
      if (achievement) {
        toast({
          title: "🏆 Achievement Unlocked!",
          description: `${achievement.name} - ${achievement.description}`,
          duration: 5000,
        });
      }

      await Promise.all([
        loadUserAchievements(),
        loadUserPoints()
      ]);
    } catch (error) {
      console.error('Error awarding achievement:', error);
    }
  }, [user, achievements, toast, loadUserAchievements, loadUserPoints]);

  // Get streak by type
  const getStreakByType = useCallback((type: string) => {
    return userStreaks.find(streak => streak.streak_type === type);
  }, [userStreaks]);

  // Get completed achievements count
  const getCompletedAchievementsCount = useCallback(() => {
    return userAchievements.filter(ua => ua.is_completed).length;
  }, [userAchievements]);

  // Load all data on mount
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([
        loadAchievements(),
        loadUserAchievements(),
        loadUserStreaks(),
        loadUserPoints()
      ]);
      setLoading(false);
    };

    if (user) {
      loadAllData();
      // Update login streak on mount
      updateLoginStreak();
    }
  }, [user, loadAchievements, loadUserAchievements, loadUserStreaks, loadUserPoints, updateLoginStreak]);

  // Subscribe to achievement updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('user-achievements')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_achievements',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          loadUserAchievements();
          loadUserPoints();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_points',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          loadUserPoints();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, loadUserAchievements, loadUserPoints]);

  return {
    achievements,
    userAchievements,
    userStreaks,
    userPoints,
    loading,
    updateLoginStreak,
    updateActivityStreak,
    awardAchievement,
    getStreakByType,
    getCompletedAchievementsCount,
    refetch: async () => {
      await Promise.all([
        loadAchievements(),
        loadUserAchievements(),
        loadUserStreaks(),
        loadUserPoints()
      ]);
    }
  };
};