"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import catechism, { CATECHISM_PARTS, getWeekForDay, type CatechismQA } from "@/data/catechism";
import { useUserData } from "@/hooks/useUserData";
import { ChevronDownIcon, BibleIcon, SearchIcon } from "@/components/Icons";

type Version = "short" | "full";

export default function CatecismoPage() {
  const { getCurrentDay } = useUserData();
  const currentDay = getCurrentDay();
  const currentWeek = getWeekForDay(currentDay);

  const [version, setVersion] = useState<Version>("short");
  const [search, setSearch] = useState("");
  const [openNumber, setOpenNumber] = useState<number | null>(currentWeek);
  const [activePart, setActivePart] = useState<1 | 2 | 3 | "all">("all");

  // Persistir preferência entre visitas
  useEffect(() => {
    const stored = localStorage.getItem("catechismVersion");
    if (stored === "full" || stored === "short") setVersion(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("catechismVersion", version);
  }, [version]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return catechism.filter((q) => {
      if (activePart !== "all" && q.part !== activePart) return false;
      if (!term) return true;
      return (
        q.question.toLowerCase().includes(term) ||
        q.answerShort.toLowerCase().includes(term) ||
        q.answerFull.toLowerCase().includes(term) ||
        q.reference.toLowerCase().includes(term)
      );
    });
  }, [search, activePart]);

  const grouped = useMemo(() => {
    const groups: Record<number, CatechismQA[]> = { 1: [], 2: [], 3: [] };
    for (const q of filtered) groups[q.part].push(q);
    return groups;
  }, [filtered]);

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-12">
      {/* Cabeçalho */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-100 dark:bg-gold-900/30 mb-3">
          <BibleIcon size={24} className="text-gold-600 dark:text-gold-500" />
        </div>
        <h1 className="text-2xl font-bold text-parchment-900 dark:text-neutral-100 mb-1">
          Catecismo New City
        </h1>
        <p className="text-sm text-parchment-600 dark:text-neutral-400">
          52 perguntas e respostas · uma por semana
        </p>
      </div>

      {/* Pergunta da semana em destaque */}
      <div className="mb-6">
        <Link
          href="#q-week"
          onClick={(e) => {
            e.preventDefault();
            setActivePart("all");
            setSearch("");
            setOpenNumber(currentWeek);
            setTimeout(() => {
              document
                .getElementById(`q-${currentWeek}`)
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 50);
          }}
          className="block rounded-2xl bg-gradient-to-br from-gold-600 to-gold-700 text-white p-5 shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-2 mb-2 opacity-90">
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Semana {currentWeek} · esta semana
            </span>
          </div>
          <p className="font-semibold mb-1 leading-snug">
            {catechism[currentWeek - 1].question}
          </p>
          <p className="text-xs opacity-90">
            Toca para ir direto à resposta
          </p>
        </Link>
      </div>

      {/* Barra de pesquisa + versão */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="relative">
          <SearchIcon
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-parchment-400 dark:text-neutral-500"
          />
          <input
            type="text"
            placeholder="Pesquisar pergunta, resposta ou referência..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        <div className="flex gap-2 items-center justify-between">
          {/* Filtro por parte */}
          <div className="flex gap-1 text-xs bg-parchment-200 dark:bg-neutral-800 rounded-lg p-1">
            {(["all", 1, 2, 3] as const).map((p) => (
              <button
                key={String(p)}
                onClick={() => setActivePart(p)}
                className={`px-2.5 py-1.5 rounded-md font-semibold transition-colors ${
                  activePart === p
                    ? "bg-white dark:bg-neutral-700 text-gold-700 dark:text-gold-400 shadow-sm"
                    : "text-parchment-600 dark:text-neutral-400"
                }`}
              >
                {p === "all" ? "Todas" : `Pt. ${p}`}
              </button>
            ))}
          </div>

          {/* Toggle crianças/adultos */}
          <div className="flex gap-1 text-xs bg-parchment-200 dark:bg-neutral-800 rounded-lg p-1">
            <button
              onClick={() => setVersion("short")}
              className={`px-2.5 py-1.5 rounded-md font-semibold transition-colors ${
                version === "short"
                  ? "bg-white dark:bg-neutral-700 text-gold-700 dark:text-gold-400 shadow-sm"
                  : "text-parchment-600 dark:text-neutral-400"
              }`}
            >
              Crianças
            </button>
            <button
              onClick={() => setVersion("full")}
              className={`px-2.5 py-1.5 rounded-md font-semibold transition-colors ${
                version === "full"
                  ? "bg-white dark:bg-neutral-700 text-gold-700 dark:text-gold-400 shadow-sm"
                  : "text-parchment-600 dark:text-neutral-400"
              }`}
            >
              Adultos
            </button>
          </div>
        </div>
      </div>

      {/* Lista por parte */}
      {([1, 2, 3] as const).map((part) => {
        const items = grouped[part];
        if (items.length === 0) return null;

        return (
          <section key={part} className="mb-8">
            <header className="mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gold-600 dark:text-gold-500">
                {CATECHISM_PARTS[part].title}
              </p>
              <h2 className="text-base font-semibold text-parchment-900 dark:text-neutral-100">
                {CATECHISM_PARTS[part].subtitle}
              </h2>
            </header>

            <div className="flex flex-col gap-2">
              {items.map((q) => {
                const isOpen = openNumber === q.number;
                const answer = version === "full" ? q.answerFull : q.answerShort;
                const isCurrentWeek = q.number === currentWeek;

                return (
                  <div
                    key={q.number}
                    id={`q-${q.number}`}
                    className={`card overflow-hidden transition-colors ${
                      isCurrentWeek
                        ? "ring-2 ring-gold-500/50"
                        : ""
                    }`}
                  >
                    <button
                      onClick={() => setOpenNumber(isOpen ? null : q.number)}
                      className="w-full text-left p-4 flex items-start gap-3 hover:bg-parchment-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <span
                        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                          isCurrentWeek
                            ? "bg-gold-600 text-white"
                            : "bg-parchment-100 dark:bg-neutral-800 text-gold-600 dark:text-gold-500"
                        }`}
                      >
                        {q.number}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-parchment-900 dark:text-neutral-100 text-sm leading-snug">
                          {q.question}
                        </p>
                        <p className="text-[11px] text-gold-600 dark:text-gold-500 mt-0.5">
                          {q.reference}
                        </p>
                      </div>
                      <ChevronDownIcon
                        size={18}
                        className={`flex-shrink-0 text-parchment-400 dark:text-neutral-500 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 animate-fade-in">
                        <div className="border-l-2 border-gold-500/40 pl-3 py-1">
                          <p className="text-sm leading-relaxed text-parchment-800 dark:text-neutral-200">
                            {answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-parchment-500 dark:text-neutral-500">
            Nenhum resultado para &ldquo;{search}&rdquo;.
          </p>
        </div>
      )}

      {/* Crédito */}
      <p className="text-center text-[11px] text-parchment-400 dark:text-neutral-600 mt-8">
        Catecismo New City · Gospel Coalition & Redeemer Presbyterian
        <br />
        Tradução para português pela Igreja da Lapa
      </p>
    </div>
  );
}
