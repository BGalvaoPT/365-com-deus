"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  Profile,
  DailyProgress,
  DevotionalNote,
  UserStats,
} from "@/lib/types";

export function useUserData() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [progress, setProgress] = useState<Record<number, DailyProgress>>({});
  const [notes, setNotes] = useState<Record<number, DevotionalNote>>({});
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Carregar dados do utilizador
  const loadData = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    setUserId(user.id);

    // Carregar tudo em paralelo
    const [profileRes, progressRes, notesRes, statsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase
        .from("daily_progress")
        .select("*")
        .eq("user_id", user.id)
        .order("day_number", { ascending: true }),
      supabase
        .from("devotional_notes")
        .select("*")
        .eq("user_id", user.id)
        .order("day_number", { ascending: true }),
      supabase.from("user_stats").select("*").eq("user_id", user.id).single(),
    ]);

    if (profileRes.data) setProfile(profileRes.data);
    if (progressRes.data) {
      const map: Record<number, DailyProgress> = {};
      progressRes.data.forEach((p) => (map[p.day_number] = p));
      setProgress(map);
    }
    if (notesRes.data) {
      const map: Record<number, DevotionalNote> = {};
      notesRes.data.forEach((n) => (map[n.day_number] = n));
      setNotes(map);
    }
    if (statsRes.data) setStats(statsRes.data);

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Concluir devocional
  const completeDay = useCallback(
    async (dayNumber: number, isRecovery = false) => {
      if (!userId || progress[dayNumber]) return;

      const { data, error } = await supabase
        .from("daily_progress")
        .insert({
          user_id: userId,
          day_number: dayNumber,
          is_recovery: isRecovery,
        })
        .select()
        .single();

      if (data && !error) {
        setProgress((prev) => ({ ...prev, [dayNumber]: data }));

        // Recarregar stats (o trigger no DB actualiza-as)
        const { data: newStats } = await supabase
          .from("user_stats")
          .select("*")
          .eq("user_id", userId)
          .single();
        if (newStats) setStats(newStats);

        return true;
      }
      return false;
    },
    [userId, progress, supabase]
  );

  // Guardar notas
  const saveNote = useCallback(
    async (dayNumber: number, learned: string, apply: string) => {
      if (!userId) return;

      const { data, error } = await supabase
        .from("devotional_notes")
        .upsert(
          {
            user_id: userId,
            day_number: dayNumber,
            learned,
            apply,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,day_number" }
        )
        .select()
        .single();

      if (data && !error) {
        setNotes((prev) => ({ ...prev, [dayNumber]: data }));
        return true;
      }
      return false;
    },
    [userId, supabase]
  );

  // Actualizar perfil
  const updateProfile = useCallback(
    async (updates: Partial<Profile>) => {
      if (!userId) return;

      const { data, error } = await supabase
        .from("profiles")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", userId)
        .select()
        .single();

      if (data && !error) {
        setProfile(data);
        return true;
      }
      return false;
    },
    [userId, supabase]
  );

  // Calcular dia actual baseado na data de início
  const getCurrentDay = useCallback(() => {
    if (!profile?.start_date) return 1;
    const start = new Date(profile.start_date);
    const now = new Date();
    const diff = Math.floor(
      (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return Math.min(Math.max(diff + 1, 1), 365);
  }, [profile]);

  // Obter dias perdidos
  const getMissedDays = useCallback(() => {
    const current = getCurrentDay();
    const missed: number[] = [];
    for (let i = 1; i < current; i++) {
      if (!progress[i]) missed.push(i);
    }
    return missed;
  }, [getCurrentDay, progress]);

  return {
    profile,
    progress,
    notes,
    stats,
    loading,
    userId,
    completeDay,
    saveNote,
    updateProfile,
    getCurrentDay,
    getMissedDays,
    reload: loadData,
  };
}
