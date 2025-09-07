-- Check if the has_role function has the proper search path set
ALTER FUNCTION public.has_role(uuid, app_role) SET search_path = public;