-- Add location fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN latitude DECIMAL(10,8),
ADD COLUMN longitude DECIMAL(11,8),
ADD COLUMN location_city TEXT,
ADD COLUMN location_country TEXT,
ADD COLUMN max_distance INTEGER DEFAULT 50;

-- Create user_photos table for multiple photos
CREATE TABLE public.user_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  photo_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_photos
ALTER TABLE public.user_photos ENABLE ROW LEVEL SECURITY;

-- Create policies for user_photos
CREATE POLICY "Users can view all photos" 
ON public.user_photos 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their own photos" 
ON public.user_photos 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_user_photos_updated_at
  BEFORE UPDATE ON public.user_photos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate distance between two points
CREATE OR REPLACE FUNCTION public.calculate_distance(
  lat1 DECIMAL(10,8),
  lon1 DECIMAL(11,8), 
  lat2 DECIMAL(10,8),
  lon2 DECIMAL(11,8)
) RETURNS DECIMAL AS $$
DECLARE
  earth_radius DECIMAL := 6371; -- Earth's radius in kilometers
  dlat DECIMAL;
  dlon DECIMAL;
  a DECIMAL;
  c DECIMAL;
BEGIN
  dlat := radians(lat2 - lat1);
  dlon := radians(lon2 - lon1);
  
  a := sin(dlat/2) * sin(dlat/2) + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2) * sin(dlon/2);
  c := 2 * atan2(sqrt(a), sqrt(1-a));
  
  RETURN earth_radius * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;