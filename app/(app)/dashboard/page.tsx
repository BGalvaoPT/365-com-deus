"use client";

import { useUserData } from "@/hooks/useUserData";
import { FireIcon, CheckIcon, BookIcon } from "@/components/Icons";
import Link from "next/link";
import { getDevotional } from "@/data/devotionals";

export default function DashboardPage() {
  const { profile, progress, stats, loading, getCurrentDay, getMissedDays } =
    useUserData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-parchment-400 dark:text-neutral-600 animate-pulse">
          A carregar...
        </div>
      </div>
    );
  }

  const currentDay = getCurrentDay();
  const totalCompleted = stats?.total_completed ?? 0;
  const percentage = Math.round((totalCompleted / 365) * 100);
  const streak = stats?.current_streak ?? 0;
  const bestStreak = stats?.best_streak ?? 0;
  const missedDays = getMissedDays().slice(-3);
  const circumference = 2 * Math.PI * 32;

  // Próximos devocionais
  const upcoming = [];
  for (let i = currentDay; i <= Math.min(currentDay + 4, 365); i++) {
    const dev = getDevotional(i);
    if (dev) upcoming.push(dev);
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto animate-fade-in">
      {/* Saudação */}
      <div className="mb-8">
        <p className="text-xs text-parchment-400 dark:text-neutral-600 uppercase tracking-widest mb-1">
          Bem-vindo
        </p>
        <h2 className="text-2xl font-light text-parchment-900 dark:text-neutral-100">
          {profile?.name || "Peregrino"}
        </h2>
      </div>

      {/* Card de progresso */}
      <div className="card p-6 mb-4">
        <div className="flex justify-between items-center mb-5">
          <div>
            <p className="text-xs text-parchment-400 dark:text-neutral-600 uppercase tracking-widest mb-1">
              Progresso anual
            </p>
            <p className="text-4xl font-light text-parchment-900 dark:text-neutral-100">
              {totalCompleted}
              <span className="text-base text-parchment-400 dark:text-neutral-600">
                /365
              </span>
            </p>
          </div>
          <div className="relative w-[72px] h-[72px]">
            <svg width="72" height="72" className="rotate-[-90deg]">
              <circle
                cx="36"
                cy="36"
                r="32"
                fill="none"
                className="stroke-parchment-200 dark:stroke-neutral-800"
                strokeWidth="3"
              />
              <circle
                cx="36"
                cy="36"
                r="32"
                fill="none"
                className="stroke-gold-600 dark:stroke-gold-500"
                strokeWidth="3"
                strokeDasharray={`${(percentage / 100) * circumference} ${circumference}`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-gold-600 dark:text-gold-500">
              {percentage}%
            </span>
          </div>
        </div>
        <div className="h-1 bg-parchment-200 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gold-600 dark:bg-gold-500 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <FireIcon size={18} className="text-orange-500" />
            <span className="text-xs text-parchment-400 dark:text-neutral-600 uppercase tracking-widest">
              Streak
            </span>
          </div>
          <p className="text-3xl font-light text-parchment-900 dark:text-neutral-100">
            {streak}{" "}
            <span className="text-sm text-parchment-400 dark:text-neutral-600">
              dias
            </span>
          </p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <CheckIcon size={18} className="text-gold-600 dark:text-gold-500" />
            <span className="text-xs text-parchment-400 dark:text-neutral-600 uppercase tracking-widest">
              Melhor
            </span>
          </div>
          <p className="text-3xl font-light text-parchment-900 dark:text-neutral-100">
            {bestStreak}{" "}
            <span className="text-sm text-parchment-400 dark:text-neutral-600">
              dias
            </span>
          </p>
        </div>
      </div>

      {/* Botão devocional do dia */}
      <Link
        href={`/devotional/${currentDay}`}
        className="w-full flex items-center justify-center gap-3 bg-gold-600 text-white font-semibold py-5 px-6 rounded-xl hover:bg-gold-700 transition-colors text-base mb-4"
      >
        <BookIcon />
        Devocional do Dia {currentDay}
      </Link>

      {/* Dias perdidos */}
      {missedDays.length > 0 && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl p-4 mb-6">
          <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2">
            Dias por recuperar
          </p>
          <p className="text-sm text-parchment-600 dark:text-neutral-400 leading-relaxed mb-3">
            Foste disciplinado até aqui. Não desistas. Podes fazer até 2
            devocionais num dia.
          </p>
          <div className="flex gap-2 flex-wrap">
            {missedDays.map((d) => (
              <Link
                key={d}
                href={`/devotional/${d}?recovery=true`}
                className="px-4 py-2 text-sm bg-white dark:bg-neutral-900 text-parchment-700 dark:text-neutral-300 border border-parchment-200 dark:border-neutral-700 rounded-lg hover:border-gold-400 transition-colors"
              >
                Dia {d}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Próximos devocionais */}
      <div>
        <p className="text-xs text-parchment-400 dark:text-neutral-600 uppercase tracking-widest mb-3">
          Próximos devocionais
        </p>
        {upcoming.map((dev) => {
          const isComplete = !!progress[dev.day];
          return (
            <Link
              key={dev.day}
              href={`/devotional/${dev.day}`}
              className={`flex items-center gap-4 p-4 rounded-xl border mb-2 transition-colors ${
                isComplete
                  ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40"
                  : "bg-white dark:bg-neutral-900 border-parchment-200 dark:border-neutral-800 hover:bg-parchment-50 dark:hover:bg-neutral-850"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                  isComplete
                    ? "bg-emerald-600 text-white"
                    : "bg-gold-600/10 text-gold-600 dark:text-gold-500"
                }`}
              >
                {isComplete ? <CheckIcon size={16} /> : dev.day}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-parchment-900 dark:text-neutral-200 truncate">
                  {dev.title}
                </p>
                <p className="text-xs text-parchment-400 dark:text-neutral-600 mt-0.5">
                  {dev.passage}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
