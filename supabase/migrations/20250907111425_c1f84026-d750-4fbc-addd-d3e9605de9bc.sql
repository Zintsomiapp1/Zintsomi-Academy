-- Function to check and award general achievements
CREATE OR REPLACE FUNCTION public.check_and_award_achievement(user_id uuid, achievement_id uuid, progress integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user already has this achievement
  INSERT INTO user_achievements (user_id, achievement_id, progress, is_completed, completed_at)
  VALUES (user_id, achievement_id, progress, true, now())
  ON CONFLICT (user_id, achievement_id) DO NOTHING;
  
  -- Update user points
  INSERT INTO user_points (user_id, total_points, experience_points)
  VALUES (user_id, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  
  UPDATE user_points 
  SET 
    total_points = total_points + (SELECT points FROM achievements WHERE id = achievement_id),
    experience_points = experience_points + (SELECT points FROM achievements WHERE id = achievement_id),
    updated_at = now()
  WHERE user_points.user_id = check_and_award_achievement.user_id;
END;
$$;