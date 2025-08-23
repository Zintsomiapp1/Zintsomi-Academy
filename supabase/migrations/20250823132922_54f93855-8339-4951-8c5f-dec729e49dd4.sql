-- Create reusable updated_at trigger function if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column'
  ) THEN
    CREATE OR REPLACE FUNCTION public.update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  END IF;
END $$;

-- Enum for quiz categories
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quiz_category') THEN
    CREATE TYPE public.quiz_category AS ENUM ('music', 'movies', 'travel', 'hobbies', 'lifestyle');
  END IF;
END $$;

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
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_orders_updated_at') THEN
    CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_matches_updated_at') THEN
    CREATE TRIGGER trg_matches_updated_at BEFORE UPDATE ON public.mjolo_matches
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_photo_swaps_updated_at') THEN
    CREATE TRIGGER trg_photo_swaps_updated_at BEFORE UPDATE ON public.photo_swaps
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_quiz_questions_updated_at') THEN
    CREATE TRIGGER trg_quiz_questions_updated_at BEFORE UPDATE ON public.quiz_questions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_quiz_sessions_updated_at') THEN
    CREATE TRIGGER trg_quiz_sessions_updated_at BEFORE UPDATE ON public.quiz_sessions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_user_reports_updated_at') THEN
    CREATE TRIGGER trg_user_reports_updated_at BEFORE UPDATE ON public.user_reports
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

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

-- Policies (idempotent creation)
-- Orders: users can view their own orders
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='orders' AND policyname='select_own_orders'
  ) THEN
    CREATE POLICY "select_own_orders" ON public.orders
      FOR SELECT USING (user_id = auth.uid());
  END IF;
END $$;

-- Credits ledger: users can view their own entries
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='credits_ledger' AND policyname='select_own_credits'
  ) THEN
    CREATE POLICY "select_own_credits" ON public.credits_ledger
      FOR SELECT USING (user_id = auth.uid());
  END IF;
END $$;

-- Matches: users involved can select; inserts by either participant; updates by either participant
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='mjolo_matches' AND policyname='select_involved_matches'
  ) THEN
    CREATE POLICY "select_involved_matches" ON public.mjolo_matches
      FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='mjolo_matches' AND policyname='insert_match_by_participant'
  ) THEN
    CREATE POLICY "insert_match_by_participant" ON public.mjolo_matches
      FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='mjolo_matches' AND policyname='update_match_by_participant'
  ) THEN
    CREATE POLICY "update_match_by_participant" ON public.mjolo_matches
      FOR UPDATE USING (auth.uid() = user1_id OR auth.uid() = user2_id);
  END IF;
END $$;

-- Photo swaps: involved users can select; insert by initiator; update by initiator or target
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='photo_swaps' AND policyname='select_involved_swaps'
  ) THEN
    CREATE POLICY "select_involved_swaps" ON public.photo_swaps
      FOR SELECT USING (auth.uid() = initiator_id OR auth.uid() = target_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='photo_swaps' AND policyname='insert_swap_by_initiator'
  ) THEN
    CREATE POLICY "insert_swap_by_initiator" ON public.photo_swaps
      FOR INSERT WITH CHECK (auth.uid() = initiator_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='photo_swaps' AND policyname='update_swap_by_participant'
  ) THEN
    CREATE POLICY "update_swap_by_participant" ON public.photo_swaps
      FOR UPDATE USING (auth.uid() = initiator_id OR auth.uid() = target_id);
  END IF;
END $$;

-- Quiz questions: everyone can view; only admins manage
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='quiz_questions' AND policyname='select_all_questions'
  ) THEN
    CREATE POLICY "select_all_questions" ON public.quiz_questions
      FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='quiz_questions' AND policyname='admin_manage_questions'
  ) THEN
    CREATE POLICY "admin_manage_questions" ON public.quiz_questions
      FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Quiz sessions: participants can select/insert/update
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='quiz_sessions' AND policyname='select_quiz_participants'
  ) THEN
    CREATE POLICY "select_quiz_participants" ON public.quiz_sessions
      FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='quiz_sessions' AND policyname='insert_quiz_by_sender'
  ) THEN
    CREATE POLICY "insert_quiz_by_sender" ON public.quiz_sessions
      FOR INSERT WITH CHECK (auth.uid() = sender_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='quiz_sessions' AND policyname='update_quiz_participants'
  ) THEN
    CREATE POLICY "update_quiz_participants" ON public.quiz_sessions
      FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
  END IF;
END $$;

-- Date rooms: participants can select/update; creator can insert
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='date_rooms' AND policyname='select_date_room_participants'
  ) THEN
    CREATE POLICY "select_date_room_participants" ON public.date_rooms
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM public.mjolo_matches m
          WHERE m.id = date_rooms.match_id AND (auth.uid() = m.user1_id OR auth.uid() = m.user2_id)
        )
      );
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='date_rooms' AND policyname='insert_date_room_by_creator'
  ) THEN
    CREATE POLICY "insert_date_room_by_creator" ON public.date_rooms
      FOR INSERT WITH CHECK (auth.uid() = created_by);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='date_rooms' AND policyname='update_date_room_participants'
  ) THEN
    CREATE POLICY "update_date_room_participants" ON public.date_rooms
      FOR UPDATE USING (
        EXISTS (
          SELECT 1 FROM public.mjolo_matches m
          WHERE m.id = date_rooms.match_id AND (auth.uid() = m.user1_id OR auth.uid() = m.user2_id)
        )
      );
  END IF;
END $$;

-- User blocks: users manage their own records; admins can view all
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_blocks' AND policyname='insert_own_block'
  ) THEN
    CREATE POLICY "insert_own_block" ON public.user_blocks
      FOR INSERT WITH CHECK (auth.uid() = blocker_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_blocks' AND policyname='select_own_blocks'
  ) THEN
    CREATE POLICY "select_own_blocks" ON public.user_blocks
      FOR SELECT USING (auth.uid() = blocker_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_blocks' AND policyname='admin_view_blocks'
  ) THEN
    CREATE POLICY "admin_view_blocks" ON public.user_blocks
      FOR SELECT USING (has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- User reports: users can insert/select own; admins can select/update all
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_reports' AND policyname='insert_own_report'
  ) THEN
    CREATE POLICY "insert_own_report" ON public.user_reports
      FOR INSERT WITH CHECK (auth.uid() = reporter_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_reports' AND policyname='select_own_reports'
  ) THEN
    CREATE POLICY "select_own_reports" ON public.user_reports
      FOR SELECT USING (auth.uid() = reporter_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_reports' AND policyname='admin_manage_reports'
  ) THEN
    CREATE POLICY "admin_manage_reports" ON public.user_reports
      FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Moderation flags: users can insert/select own; admins can select/update all
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='moderation_flags' AND policyname='insert_own_moderation'
  ) THEN
    CREATE POLICY "insert_own_moderation" ON public.moderation_flags
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='moderation_flags' AND policyname='select_own_moderation'
  ) THEN
    CREATE POLICY "select_own_moderation" ON public.moderation_flags
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='moderation_flags' AND policyname='admin_manage_moderation'
  ) THEN
    CREATE POLICY "admin_manage_moderation" ON public.moderation_flags
      FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
  END IF;
END $$;
