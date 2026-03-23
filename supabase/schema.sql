-- ============================================================
-- 365 COM DEUS — Schema da Base de Dados (Supabase/PostgreSQL)
-- ============================================================

-- Tabela de perfis de utilizador (extensão do auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  notification_time TIME DEFAULT '07:00:00',
  notifications_enabled BOOLEAN DEFAULT false,
  push_subscription JSONB,
  current_day INTEGER DEFAULT 1,
  start_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de progresso diário
CREATE TABLE IF NOT EXISTS public.daily_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL CHECK (day_number >= 1 AND day_number <= 365),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  is_recovery BOOLEAN DEFAULT false, -- se foi feito como recuperação
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, day_number)
);

-- Tabela de notas pessoais
CREATE TABLE IF NOT EXISTS public.devotional_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL CHECK (day_number >= 1 AND day_number <= 365),
  learned TEXT DEFAULT '',
  apply TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, day_number)
);

-- Tabela de streaks (calculado mas guardado para performance)
CREATE TABLE IF NOT EXISTS public.user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  total_completed INTEGER DEFAULT 0,
  last_completed_day INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_daily_progress_user ON public.daily_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_progress_user_day ON public.daily_progress(user_id, day_number);
CREATE INDEX IF NOT EXISTS idx_devotional_notes_user ON public.devotional_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_user ON public.user_stats(user_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devotional_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Profiles: cada utilizador só vê/edita o seu perfil
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Daily progress: cada utilizador só vê/edita o seu progresso
CREATE POLICY "Users can view own progress"
  ON public.daily_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.daily_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON public.daily_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Notes: cada utilizador só vê/edita as suas notas
CREATE POLICY "Users can view own notes"
  ON public.devotional_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes"
  ON public.devotional_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes"
  ON public.devotional_notes FOR UPDATE
  USING (auth.uid() = user_id);

-- Stats: cada utilizador só vê/edita as suas stats
CREATE POLICY "Users can view own stats"
  ON public.user_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats"
  ON public.user_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON public.user_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================
-- TRIGGER: criar perfil automaticamente após registo
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', '')
  );
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- FUNÇÃO: actualizar streak ao completar devocional
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
  v_streak INTEGER := 0;
  v_best INTEGER := 0;
  v_total INTEGER := 0;
  v_last INTEGER := 0;
  v_day RECORD;
BEGIN
  -- Contar total de dias concluídos
  SELECT COUNT(*), MAX(day_number)
  INTO v_total, v_last
  FROM public.daily_progress
  WHERE user_id = NEW.user_id;

  -- Calcular streak actual (dias consecutivos a partir do mais recente)
  v_streak := 0;
  FOR v_day IN
    SELECT day_number FROM public.daily_progress
    WHERE user_id = NEW.user_id
    ORDER BY day_number DESC
  LOOP
    IF v_streak = 0 OR v_day.day_number = v_last - v_streak THEN
      v_streak := v_streak + 1;
    ELSE
      EXIT;
    END IF;
  END LOOP;

  -- Obter melhor streak anterior
  SELECT best_streak INTO v_best
  FROM public.user_stats
  WHERE user_id = NEW.user_id;

  IF v_best IS NULL THEN
    v_best := 0;
  END IF;

  -- Actualizar stats
  INSERT INTO public.user_stats (user_id, current_streak, best_streak, total_completed, last_completed_day, updated_at)
  VALUES (NEW.user_id, v_streak, GREATEST(v_streak, v_best), v_total, v_last, NOW())
  ON CONFLICT (user_id) DO UPDATE SET
    current_streak = v_streak,
    best_streak = GREATEST(v_streak, EXCLUDED.best_streak),
    total_completed = v_total,
    last_completed_day = v_last,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_progress_insert ON public.daily_progress;
CREATE TRIGGER on_progress_insert
  AFTER INSERT ON public.daily_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_user_streak();
