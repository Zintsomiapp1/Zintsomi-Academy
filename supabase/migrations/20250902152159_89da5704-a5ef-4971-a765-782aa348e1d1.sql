-- Create achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  points INTEGER NOT NULL DEFAULT 0,
  requirement_type TEXT NOT NULL, -- 'streak', 'count', 'special'
  requirement_value INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user streaks table
CREATE TABLE public.user_streaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  streak_type TEXT NOT NULL, -- 'login', 'messaging', 'gaming', 'learning'
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, streak_type)
);

-- Create user achievements table
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  progress INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create user points table for overall gamification
CREATE TABLE public.user_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  total_points INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  experience_points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;

-- RLS Policies for achievements
CREATE POLICY "Anyone can view achievements" 
ON public.achievements 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage achievements" 
ON public.achievements 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for user_streaks
CREATE POLICY "Users can view their own streaks" 
ON public.user_streaks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own streaks" 
ON public.user_streaks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks" 
ON public.user_streaks 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for user_achievements
CREATE POLICY "Users can view their own achievements" 
ON public.user_achievements 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" 
ON public.user_achievements 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements" 
ON public.user_achievements 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for user_points
CREATE POLICY "Users can view their own points" 
ON public.user_points 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own points" 
ON public.user_points 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own points" 
ON public.user_points 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_achievements_updated_at
BEFORE UPDATE ON public.achievements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_streaks_updated_at
BEFORE UPDATE ON public.user_streaks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_achievements_updated_at
BEFORE UPDATE ON public.user_achievements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_points_updated_at
BEFORE UPDATE ON public.user_points
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial achievements
INSERT INTO public.achievements (name, description, icon, category, points, requirement_type, requirement_value) VALUES
('First Login', 'Welcome! You''ve logged in for the first time', '🎉', 'milestone', 10, 'special', 1),
('3 Day Streak', 'Keep it up! Login for 3 days in a row', '🔥', 'streak', 25, 'streak', 3),
('7 Day Streak', 'Week warrior! Login for 7 days straight', '⚡', 'streak', 50, 'streak', 7),
('30 Day Streak', 'Monthly master! Login for 30 days straight', '👑', 'streak', 200, 'streak', 30),
('Social Butterfly', 'Send your first message', '💬', 'social', 15, 'count', 1),
('Chatterbox', 'Send 100 messages', '🗣️', 'social', 100, 'count', 100),
('Game Master', 'Play your first game', '🎮', 'gaming', 20, 'count', 1),
('Brain Trainer', 'Complete a brain training exercise', '🧠', 'learning', 25, 'count', 1),
('Achiever', 'Unlock 5 achievements', '🏆', 'milestone', 75, 'count', 5);

-- Function to update user login streak
CREATE OR REPLACE FUNCTION public.update_login_streak(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_date_val DATE := CURRENT_DATE;
  last_activity DATE;
  current_streak_val INTEGER;
  longest_streak_val INTEGER;
BEGIN
  -- Get current streak data
  SELECT last_activity_date, current_streak, longest_streak
  INTO last_activity, current_streak_val, longest_streak_val
  FROM user_streaks 
  WHERE user_streaks.user_id = update_login_streak.user_id 
  AND streak_type = 'login';
  
  -- If no record exists, create one
  IF NOT FOUND THEN
    INSERT INTO user_streaks (user_id, streak_type, current_streak, longest_streak, last_activity_date)
    VALUES (update_login_streak.user_id, 'login', 1, 1, current_date_val);
    RETURN;
  END IF;
  
  -- If already logged in today, do nothing
  IF last_activity = current_date_val THEN
    RETURN;
  END IF;
  
  -- If logged in yesterday, increment streak
  IF last_activity = current_date_val - INTERVAL '1 day' THEN
    current_streak_val := current_streak_val + 1;
    longest_streak_val := GREATEST(longest_streak_val, current_streak_val);
  ELSE
    -- Streak broken, reset to 1
    current_streak_val := 1;
  END IF;
  
  -- Update the record
  UPDATE user_streaks 
  SET 
    current_streak = current_streak_val,
    longest_streak = longest_streak_val,
    last_activity_date = current_date_val,
    updated_at = now()
  WHERE user_streaks.user_id = update_login_streak.user_id 
  AND streak_type = 'login';
  
  -- Check for streak achievements
  PERFORM public.check_streak_achievements(update_login_streak.user_id, 'login', current_streak_val);
END;
$$;

-- Function to check and award achievements
CREATE OR REPLACE FUNCTION public.check_streak_achievements(user_id uuid, streak_type text, current_streak integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  achievement_rec RECORD;
BEGIN
  -- Check for streak achievements that user doesn't have yet
  FOR achievement_rec IN
    SELECT a.id, a.requirement_value
    FROM achievements a
    LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = check_streak_achievements.user_id
    WHERE a.requirement_type = 'streak' 
    AND a.is_active = true
    AND ua.id IS NULL
    AND a.requirement_value <= current_streak
  LOOP
    -- Award the achievement
    INSERT INTO user_achievements (user_id, achievement_id, progress, is_completed, completed_at)
    VALUES (check_streak_achievements.user_id, achievement_rec.id, achievement_rec.requirement_value, true, now())
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
    
    -- Update user points
    INSERT INTO user_points (user_id, total_points, experience_points)
    VALUES (check_streak_achievements.user_id, 0, 0)
    ON CONFLICT (user_id) DO NOTHING;
    
    UPDATE user_points 
    SET 
      total_points = total_points + (SELECT points FROM achievements WHERE id = achievement_rec.id),
      experience_points = experience_points + (SELECT points FROM achievements WHERE id = achievement_rec.id),
      updated_at = now()
    WHERE user_points.user_id = check_streak_achievements.user_id;
  END LOOP;
END;
$$;