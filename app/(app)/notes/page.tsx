"use client";

import { useUserData } from "@/hooks/useUserData";
import { getDevotional } from "@/data/devotionals";
import Link from "next/link";

export default function NotesPage() {
  const { notes, loading } = useUserData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-parchment-400 dark:text-neutral-600 animate-pulse">
          A carregar...
        </div>
      </div>
    );
  }

  const noteEntries = Object.entries(notes).sort(
    (a, b) => Number(b[0]) - Number(a[0])
  );

  return (
    <div className="px-4 py-6 max-w-lg mx-auto animate-fade-in">
      <h2 className="text-2xl font-light text-parchment-900 dark:text-neutral-100 mb-2">
        As Tuas Notas
      </h2>
      <p className="text-sm text-parchment-400 dark:text-neutral-600 mb-6">
        O que tens aprendido ao longo do caminho.
      </p>

      {noteEntries.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-parchment-400 dark:text-neutral-600 text-[15px]">
            Ainda não tens notas guardadas.
          </p>
          <p className="text-parchment-400 dark:text-neutral-600 text-sm mt-2">
            Ao concluíres um devocional, escreve o que aprendeste.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {noteEntries.map(([day, note]) => {
            const devotional = getDevotional(Number(day));
            return (
              <div key={day} className="card p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-semibold text-gold-600 dark:text-gold-500">
                    Dia {day} — {devotional?.passage}
                  </span>
                  <Link
                    href={`/devotional/${day}`}
                    className="text-xs text-parchment-400 dark:text-neutral-600 hover:text-gold-600 dark:hover:text-gold-500 transition-colors"
                  >
                    Ver
                  </Link>
                </div>
                {note.learned && (
                  <p className="text-sm text-parchment-700 dark:text-neutral-300 leading-relaxed mb-2">
                    <strong className="text-parchment-800 dark:text-neutral-200">
                      Aprendi:
                    </strong>{" "}
                    {note.learned}
                  </p>
                )}
                {note.apply && (
                  <p className="text-sm text-parchment-700 dark:text-neutral-300 leading-relaxed">
                    <strong className="text-parchment-800 dark:text-neutral-200">
                      Vou aplicar:
                    </strong>{" "}
                    {note.apply}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
