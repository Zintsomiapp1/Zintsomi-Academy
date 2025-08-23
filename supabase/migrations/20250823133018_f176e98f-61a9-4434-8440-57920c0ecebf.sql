-- Create reusable updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Enum for quiz categories
CREATE TYPE IF NOT EXISTS public.quiz_category AS ENUM ('music', 'movies', 'travel', 'hobbies', 'lifestyle');

-- Orders table for Stripe one-off payments (ZAR)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  stripe_session_id TEXT UNIQUE,
  product_type TEXT NOT NULL, -- 'credits' | 'boost'
  credits_amount INTEGER,
  boost_type TEXT,
  amount INTEGER NOT NULL, -- amount in cents
  currency TEXT NOT NULL DEFAULT 'zar',
  status TEXT NOT NULL DEFAULT 'pending', -- pending | paid | failed | canceled
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Credits ledger for all credit balance changes (compute balance via SUM(delta))
CREATE TABLE IF NOT EXISTS public.credits_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  delta INTEGER NOT NULL, -- positive for earnings/purchases, negative for spends
  reason TEXT NOT NULL, -- daily_bonus | quiz_bonus | referral | purchase | spend | adjustment
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Matches table (pair of users)
CREATE TABLE IF NOT EXISTS public.mjolo_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL,
  user2_id UUID NOT NULL,
  love_meter INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active', -- active | blocked | ended
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_distinct_users CHECK (user1_id <> user2_id)
);

-- Photo swap swipes
CREATE TABLE IF NOT EXISTS public.photo_swaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initiator_id UUID NOT NULL,
  target_id UUID NOT NULL,
  initiator_like BOOLEAN,
  target_like BOOLEAN,
  matched_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Question bank
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category public.quiz_category NOT NULL,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_index INTEGER NOT NULL,
  created_by UUID,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Quiz sessions/attempts
CREATE TABLE IF NOT EXISTS public.quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  question_id UUID NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  correct BOOLEAN,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | answered | reset
  last_attempt_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Date rooms (audio MVP, future video)
CREATE TABLE IF NOT EXISTS public.date_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL,
  created_by UUID NOT NULL,
  room_name TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'audio', -- audio | video
  status TEXT NOT NULL DEFAULT 'active', -- active | ended
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ
);

-- Blocks
CREATE TABLE IF NOT EXISTS public.user_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL,
  blocked_id UUID NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uniq_block UNIQUE (blocker_id, blocked_id)
);

-- Reports
CREATE TABLE IF NOT EXISTS public.user_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL,
  reported_id UUID NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | reviewing | resolved | rejected
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Moderation flags for images
CREATE TABLE IF NOT EXISTS public.moderation_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  image_url TEXT,
  bucket TEXT,
  file_path TEXT,
  category TEXT, -- e.g., sexual, violence, self-harm
  verdict TEXT NOT NULL, -- safe | flagged
  confidence NUMERIC,
  details JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Triggers for updated_at
DROP TRIGGER IF EXISTS trg_orders_updated_at ON public.orders;
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_matches_updated_at ON public.mjolo_matches;
CREATE TRIGGER trg_matches_updated_at BEFORE UPDATE ON public.mjolo_matches
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_photo_swaps_updated_at ON public.photo_swaps;
CREATE TRIGGER trg_photo_swaps_updated_at BEFORE UPDATE ON public.photo_swaps
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_quiz_questions_updated_at ON public.quiz_questions;
CREATE TRIGGER trg_quiz_questions_updated_at BEFORE UPDATE ON public.quiz_questions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_quiz_sessions_updated_at ON public.quiz_sessions;
CREATE TRIGGER trg_quiz_sessions_updated_at BEFORE UPDATE ON public.quiz_sessions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_user_reports_updated_at ON public.user_reports;
CREATE TRIGGER trg_user_reports_updated_at BEFORE UPDATE ON public.user_reports
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credits_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mjolo_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_swaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.date_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_flags ENABLE ROW LEVEL SECURITY;

-- Orders policies
DROP POLICY IF EXISTS "select_own_orders" ON public.orders;
CREATE POLICY "select_own_orders" ON public.orders
  FOR SELECT USING (user_id = auth.uid());

-- Credits ledger policies
DROP POLICY IF EXISTS "select_own_credits" ON public.credits_ledger;
CREATE POLICY "select_own_credits" ON public.credits_ledger
  FOR SELECT USING (user_id = auth.uid());

-- Matches policies
DROP POLICY IF EXISTS "select_involved_matches" ON public.mjolo_matches;
CREATE POLICY "select_involved_matches" ON public.mjolo_matches
  FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

DROP POLICY IF EXISTS "insert_match_by_participant" ON public.mjolo_matches;
CREATE POLICY "insert_match_by_participant" ON public.mjolo_matches
  FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

DROP POLICY IF EXISTS "update_match_by_participant" ON public.mjolo_matches;
CREATE POLICY "update_match_by_participant" ON public.mjolo_matches
  FOR UPDATE USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Photo swaps policies
DROP POLICY IF EXISTS "select_involved_swaps" ON public.photo_swaps;
CREATE POLICY "select_involved_swaps" ON public.photo_swaps
  FOR SELECT USING (auth.uid() = initiator_id OR auth.uid() = target_id);

DROP POLICY IF EXISTS "insert_swap_by_initiator" ON public.photo_swaps;
CREATE POLICY "insert_swap_by_initiator" ON public.photo_swaps
  FOR INSERT WITH CHECK (auth.uid() = initiator_id);

DROP POLICY IF EXISTS "update_swap_by_participant" ON public.photo_swaps;
CREATE POLICY "update_swap_by_participant" ON public.photo_swaps
  FOR UPDATE USING (auth.uid() = initiator_id OR auth.uid() = target_id);

-- Quiz questions policies
DROP POLICY IF EXISTS "select_all_questions" ON public.quiz_questions;
CREATE POLICY "select_all_questions" ON public.quiz_questions
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "admin_manage_questions" ON public.quiz_questions;
CREATE POLICY "admin_manage_questions" ON public.quiz_questions
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Quiz sessions policies
DROP POLICY IF EXISTS "select_quiz_participants" ON public.quiz_sessions;
CREATE POLICY "select_quiz_participants" ON public.quiz_sessions
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "insert_quiz_by_sender" ON public.quiz_sessions;
CREATE POLICY "insert_quiz_by_sender" ON public.quiz_sessions
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "update_quiz_participants" ON public.quiz_sessions;
CREATE POLICY "update_quiz_participants" ON public.quiz_sessions
  FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Date rooms policies
DROP POLICY IF EXISTS "select_date_room_participants" ON public.date_rooms;
CREATE POLICY "select_date_room_participants" ON public.date_rooms
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.mjolo_matches m
      WHERE m.id = date_rooms.match_id AND (auth.uid() = m.user1_id OR auth.uid() = m.user2_id)
    )
  );

DROP POLICY IF EXISTS "insert_date_room_by_creator" ON public.date_rooms;
CREATE POLICY "insert_date_room_by_creator" ON public.date_rooms
  FOR INSERT WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "update_date_room_participants" ON public.date_rooms;
CREATE POLICY "update_date_room_participants" ON public.date_rooms
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.mjolo_matches m
      WHERE m.id = date_rooms.match_id AND (auth.uid() = m.user1_id OR auth.uid() = m.user2_id)
    )
  );

-- User blocks policies
DROP POLICY IF EXISTS "insert_own_block" ON public.user_blocks;
CREATE POLICY "insert_own_block" ON public.user_blocks
  FOR INSERT WITH CHECK (auth.uid() = blocker_id);

DROP POLICY IF EXISTS "select_own_blocks" ON public.user_blocks; 
CREATE POLICY "select_own_blocks" ON public.user_blocks
  FOR SELECT USING (auth.uid() = blocker_id);

DROP POLICY IF EXISTS "admin_view_blocks" ON public.user_blocks;
CREATE POLICY "admin_view_blocks" ON public.user_blocks
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- User reports policies
DROP POLICY IF EXISTS "insert_own_report" ON public.user_reports;
CREATE POLICY "insert_own_report" ON public.user_reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "select_own_reports" ON public.user_reports;
CREATE POLICY "select_own_reports" ON public.user_reports
  FOR SELECT USING (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "admin_manage_reports" ON public.user_reports;
CREATE POLICY "admin_manage_reports" ON public.user_reports
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Moderation flags policies
DROP POLICY IF EXISTS "insert_own_moderation" ON public.moderation_flags;
CREATE POLICY "insert_own_moderation" ON public.moderation_flags
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "select_own_moderation" ON public.moderation_flags;
CREATE POLICY "select_own_moderation" ON public.moderation_flags
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin_manage_moderation" ON public.moderation_flags;
CREATE POLICY "admin_manage_moderation" ON public.moderation_flags
  FOR ALL USING (has_role(auth.uid(), 'admin'));