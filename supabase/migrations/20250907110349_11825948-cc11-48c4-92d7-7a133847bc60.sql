-- Fix search path for functions
ALTER FUNCTION public.update_login_streak(uuid) SET search_path = public;
ALTER FUNCTION public.check_streak_achievements(uuid, text, integer) SET search_path = public;