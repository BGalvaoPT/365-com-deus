"use client";

import { useState } from "react";
import { useUserData } from "@/hooks/useUserData";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/Icons";
import Link from "next/link";

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const DAY_NAMES = ["D", "S", "T", "Q", "Q", "S", "S"];

export default function CalendarPage() {
  const { profile, progress, loading } = useUserData();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-parchment-400 dark:text-neutral-600 animate-pulse">
          A carregar...
        </div>
      </div>
    );
  }

  const startDate = profile?.start_date
    ? new Date(profile.start_date)
    : new Date();

  const getDayNumber = (date: Date) => {
    const diff = date.getTime() - startDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  return (
    <div className="px-4 py-6 max-w-lg mx-auto animate-fade-in">
      <h2 className="text-2xl font-light text-parchment-900 dark:text-neutral-100 mb-6">
        Calendário
      </h2>

      {/* Navegação */}
      <div className="flex justify-between items-center mb-5">
        <button
          onClick={prevMonth}
          className="p-2 text-parchment-500 dark:text-neutral-500 hover:text-gold-600 dark:hover:text-gold-500 transition-colors"
        >
          <ChevronLeftIcon />
        </button>
        <span className="text-base font-semibold text-parchment-900 dark:text-neutral-100">
          {MONTH_NAMES[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          className="p-2 text-parchment-500 dark:text-neutral-500 hover:text-gold-600 dark:hover:text-gold-500 transition-colors"
        >
          <ChevronRightIcon />
        </button>
      </div>

      {/* Cabeçalho dos dias */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAY_NAMES.map((d, i) => (
          <div
            key={i}
            className="text-center text-xs font-semibold text-parchment-400 dark:text-neutral-600 py-2"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Dias */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;

          const date = new Date(year, month, d);
          const dayNumber = getDayNumber(date);
          const isComplete = dayNumber >= 1 && dayNumber <= 365 && !!progress[dayNumber];
          const isToday = date.toDateString() === now.toDateString();
          const isValidDay = dayNumber >= 1 && dayNumber <= 365;

          const content = (
            <div
              className={`
                aspect-square flex items-center justify-center rounded-xl text-sm transition-colors
                ${isComplete
                  ? "bg-emerald-600 text-white font-semibold"
                  : isToday
                  ? "border-2 border-gold-600 dark:border-gold-500 text-gold-600 dark:text-gold-500 font-bold"
                  : "text-parchment-700 dark:text-neutral-400 hover:bg-parchment-200/50 dark:hover:bg-neutral-800/50"
                }
              `}
            >
              {d}
            </div>
          );

          if (isValidDay) {
            return (
              <Link key={i} href={`/devotional/${dayNumber}`}>
                {content}
              </Link>
            );
          }
          return <div key={i}>{content}</div>;
        })}
      </div>

      {/* Legenda */}
      <div className="flex gap-6 justify-center mt-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-600" />
          <span className="text-xs text-parchment-400 dark:text-neutral-600">
            Concluído
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded border-2 border-gold-600 dark:border-gold-500" />
          <span className="text-xs text-parchment-400 dark:text-neutral-600">
            Hoje
          </span>
        </div>
      </div>
    </div>
  );
}
