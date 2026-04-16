"use client";

import { useState } from "react";
import Link from "next/link";
import { getCatechismForDay, getWeekForDay } from "@/data/catechism";
import { ChevronDownIcon, BibleIcon, ChevronRightIcon } from "./Icons";

interface CatechismWeekProps {
  day: number;
}

/**
 * Pequeno cartão com a pergunta e resposta do catecismo da semana.
 * Apresenta a pergunta visível e a resposta expansível.
 */
export function CatechismWeek({ day }: CatechismWeekProps) {
  const qa = getCatechismForDay(day);
  const week = getWeekForDay(day);
  const [open, setOpen] = useState(false);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BibleIcon size={16} className="text-gold-600 dark:text-gold-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gold-600 dark:text-gold-500">
            Catecismo · Semana {week}
          </span>
        </div>
        <Link
          href="/catecismo"
          className="flex items-center gap-0.5 text-[11px] text-parchment-500 dark:text-neutral-500 hover:text-gold-600 dark:hover:text-gold-500 transition-colors"
        >
          Ver todas
          <ChevronRightIcon size={12} />
        </Link>
      </div>

      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left group"
      >
        <p className="font-semibold text-parchment-900 dark:text-neutral-100 leading-snug mb-1 pr-6 relative">
          {qa.number}. {qa.question}
          <ChevronDownIcon
            size={16}
            className={`absolute right-0 top-1 text-parchment-400 dark:text-neutral-500 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </p>
        <p className="text-[11px] text-gold-600 dark:text-gold-500">
          {qa.reference}
        </p>
      </button>

      {open && (
        <div className="mt-3 pt-3 border-t border-parchment-200 dark:border-neutral-800 animate-fade-in">
          <p className="text-sm leading-relaxed text-parchment-800 dark:text-neutral-200">
            {qa.answerShort}
          </p>
          <p className="text-[11px] text-parchment-500 dark:text-neutral-500 mt-2">
            Tenta decorar esta pergunta e resposta durante a semana.
          </p>
        </div>
      )}
    </div>
  );
}
