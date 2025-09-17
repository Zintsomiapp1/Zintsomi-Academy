-- Create profile prompts table
CREATE TABLE public.profile_prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profile_prompts ENABLE ROW LEVEL SECURITY;

-- Anyone can view active prompts
CREATE POLICY "Anyone can view active prompts" 
ON public.profile_prompts 
FOR SELECT 
USING (is_active = true);

-- Only admins can manage prompts
CREATE POLICY "Only admins can manage prompts" 
ON public.profile_prompts 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create user prompt answers table
CREATE TABLE public.user_prompt_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  prompt_id UUID NOT NULL REFERENCES public.profile_prompts(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, prompt_id)
);

-- Enable RLS
ALTER TABLE public.user_prompt_answers ENABLE ROW LEVEL SECURITY;

-- Users can view all answers (for discovery)
CREATE POLICY "Users can view all answers" 
ON public.user_prompt_answers 
FOR SELECT 
USING (true);

-- Users can manage their own answers
CREATE POLICY "Users can manage their own answers" 
ON public.user_prompt_answers 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Insert some default prompts
INSERT INTO public.profile_prompts (question, category) VALUES
('What''s your idea of a perfect first date?', 'dating'),
('What''s something you''re passionate about?', 'interests'),
('What''s your favorite way to spend a weekend?', 'lifestyle'),
('What''s a fun fact about you?', 'personality'),
('What''s your biggest turn-on?', 'attraction'),
('What''s your love language?', 'relationships'),
('What''s your biggest deal-breaker?', 'preferences'),
('If you could travel anywhere, where would you go?', 'travel'),
('What''s your favorite type of music?', 'interests'),
('What makes you laugh the most?', 'personality'),
('What''s your favorite food or cuisine?', 'lifestyle'),
('What''s something you''re learning right now?', 'personal_growth');