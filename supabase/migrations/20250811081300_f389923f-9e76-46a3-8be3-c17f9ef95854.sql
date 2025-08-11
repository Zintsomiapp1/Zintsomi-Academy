-- Create/update timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1) Matches between two users
CREATE TABLE IF NOT EXISTS public.mjolo_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a UUID NOT NULL,
  user_b UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | matched | blocked
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure each pair is unique regardless of order
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' AND indexname = 'idx_mjolo_matches_pair_unique'
  ) THEN
    CREATE UNIQUE INDEX idx_mjolo_matches_pair_unique
    ON public.mjolo_matches (
      LEAST(user_a, user_b),
      GREATEST(user_a, user_b)
    );
  END IF;
END $$;

ALTER TABLE public.mjolo_matches ENABLE ROW LEVEL SECURITY;

-- Select: participants only
CREATE POLICY IF NOT EXISTS "Match participants can view their matches"
ON public.mjolo_matches
FOR SELECT
USING (auth.uid() IN (user_a, user_b));

-- Insert: allow either participant to initiate
CREATE POLICY IF NOT EXISTS "Users can create matches they are part of"
ON public.mjolo_matches
FOR INSERT
WITH CHECK (auth.uid() IN (user_a, user_b));

-- Update: participants only
CREATE POLICY IF NOT EXISTS "Match participants can update their matches"
ON public.mjolo_matches
FOR UPDATE
USING (auth.uid() IN (user_a, user_b));

-- Trigger for updated_at
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_mjolo_matches_updated_at'
  ) THEN
    CREATE TRIGGER trg_mjolo_matches_updated_at
    BEFORE UPDATE ON public.mjolo_matches
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- 2) Photo swaps per match
CREATE TABLE IF NOT EXISTS public.photo_swaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.mjolo_matches(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  requester_photo_url TEXT,
  receiver_photo_url TEXT,
  requester_approved BOOLEAN NOT NULL DEFAULT false,
  receiver_approved BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | approved | rejected
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.photo_swaps ENABLE ROW LEVEL SECURITY;

-- Only participants of the match can select
CREATE POLICY IF NOT EXISTS "Match participants can view photo swaps"
ON public.photo_swaps
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.mjolo_matches m
    WHERE m.id = photo_swaps.match_id
      AND auth.uid() IN (m.user_a, m.user_b)
  )
);

-- Insert: requester or receiver must be auth user and part of the match
CREATE POLICY IF NOT EXISTS "Participants can create photo swaps"
ON public.photo_swaps
FOR INSERT
WITH CHECK (
  (auth.uid() IN (requester_id, receiver_id)) AND
  EXISTS (
    SELECT 1 FROM public.mjolo_matches m
    WHERE m.id = match_id AND auth.uid() IN (m.user_a, m.user_b)
  )
);

-- Update: only participants of the match
CREATE POLICY IF NOT EXISTS "Participants can update photo swaps"
ON public.photo_swaps
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.mjolo_matches m
    WHERE m.id = photo_swaps.match_id
      AND auth.uid() IN (m.user_a, m.user_b)
  )
);

-- Trigger for updated_at
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_photo_swaps_updated_at'
  ) THEN
    CREATE TRIGGER trg_photo_swaps_updated_at
    BEFORE UPDATE ON public.photo_swaps
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- 3) Daily quiz sessions per match & user
CREATE TABLE IF NOT EXISTS public.quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.mjolo_matches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  day_date DATE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  score INTEGER NOT NULL DEFAULT 0,
  streak_count INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (match_id, user_id, day_date)
);

ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;

-- Select: any participant of the match can view
CREATE POLICY IF NOT EXISTS "Match participants can view quiz sessions"
ON public.quiz_sessions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.mjolo_matches m
    WHERE m.id = quiz_sessions.match_id
      AND auth.uid() IN (m.user_a, m.user_b)
  )
);

-- Insert: only the user for their own row and must be a participant
CREATE POLICY IF NOT EXISTS "Users can create their own quiz sessions"
ON public.quiz_sessions
FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.mjolo_matches m
    WHERE m.id = match_id AND auth.uid() IN (m.user_a, m.user_b)
  )
);

-- Update: only the owner can update
CREATE POLICY IF NOT EXISTS "Users can update their own quiz sessions"
ON public.quiz_sessions
FOR UPDATE
USING (auth.uid() = user_id);

-- Trigger for updated_at
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_quiz_sessions_updated_at'
  ) THEN
    CREATE TRIGGER trg_quiz_sessions_updated_at
    BEFORE UPDATE ON public.quiz_sessions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- 4) Credits ledger
CREATE TABLE IF NOT EXISTS public.credits_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  amount INTEGER NOT NULL, -- positive or negative
  reason TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.credits_ledger ENABLE ROW LEVEL SECURITY;

-- Users can see their own credits
CREATE POLICY IF NOT EXISTS "Users can view their own credits"
ON public.credits_ledger
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own credits entries (earn/spend). Business rules enforced in app/edge functions later.
CREATE POLICY IF NOT EXISTS "Users can insert their own credits entries"
ON public.credits_ledger
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all credits
CREATE POLICY IF NOT EXISTS "Admins can view all credits"
ON public.credits_ledger
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- 5) Date rooms (video/voice)
CREATE TABLE IF NOT EXISTS public.date_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.mjolo_matches(id) ON DELETE CASCADE,
  created_by UUID NOT NULL,
  room_type TEXT NOT NULL, -- 'video' | 'voice'
  status TEXT NOT NULL DEFAULT 'open', -- 'open' | 'closed'
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.date_rooms ENABLE ROW LEVEL SECURITY;

-- Select: participants only
CREATE POLICY IF NOT EXISTS "Match participants can view date rooms"
ON public.date_rooms
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.mjolo_matches m
    WHERE m.id = date_rooms.match_id
      AND auth.uid() IN (m.user_a, m.user_b)
  )
);

-- Insert: creator must be participant
CREATE POLICY IF NOT EXISTS "Participants can create date rooms"
ON public.date_rooms
FOR INSERT
WITH CHECK (
  auth.uid() = created_by AND
  EXISTS (
    SELECT 1 FROM public.mjolo_matches m
    WHERE m.id = match_id AND auth.uid() IN (m.user_a, m.user_b)
  )
);

-- Update: any participant can update (e.g., close)
CREATE POLICY IF NOT EXISTS "Participants can update date rooms"
ON public.date_rooms
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.mjolo_matches m
    WHERE m.id = date_rooms.match_id
      AND auth.uid() IN (m.user_a, m.user_b)
  )
);

-- Trigger for updated_at
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_date_rooms_updated_at'
  ) THEN
    CREATE TRIGGER trg_date_rooms_updated_at
    BEFORE UPDATE ON public.date_rooms
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- 6) User blocks
CREATE TABLE IF NOT EXISTS public.user_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL,
  blocked_id UUID NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (blocker_id, blocked_id)
);

ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view their own blocks"
ON public.user_blocks
FOR SELECT
USING (auth.uid() = blocker_id);

CREATE POLICY IF NOT EXISTS "Users can create their own blocks"
ON public.user_blocks
FOR INSERT
WITH CHECK (auth.uid() = blocker_id);

-- 7) User reports
CREATE TABLE IF NOT EXISTS public.user_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL,
  reported_id UUID NOT NULL,
  match_id UUID REFERENCES public.mjolo_matches(id) ON DELETE SET NULL,
  reason TEXT,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;

-- Reporters can view their own reports
CREATE POLICY IF NOT EXISTS "Users can view their own reports"
ON public.user_reports
FOR SELECT
USING (auth.uid() = reporter_id);

-- Reporters can create reports
CREATE POLICY IF NOT EXISTS "Users can create reports"
ON public.user_reports
FOR INSERT
WITH CHECK (auth.uid() = reporter_id);

-- Admins can view all reports
CREATE POLICY IF NOT EXISTS "Admins can view all reports"
ON public.user_reports
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));
