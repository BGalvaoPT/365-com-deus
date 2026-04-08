"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useUserData } from "@/hooks/useUserData";
import { getDevotional } from "@/data/devotionals";
import { Toast } from "@/components/Toast";
import { BibleReader } from "@/components/BibleReader";
import { ShareCard } from "@/components/ShareCard";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  EditIcon,
  BookmarkIcon,
  BookmarkFilledIcon,
  ShareIcon,
  BookIcon,
  BibleIcon,
} from "@/components/Icons";
import Link from "next/link";

export default function DevotionalPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRecovery = searchParams.get("recovery") === "true";

  const {
    progress,
    notes,
    loading,
    completeDay,
    saveNote,
    getCurrentDay,
  } = useUserData();

  // Determinar o dia
  const dayParam = params.day as string;
  const currentDay = getCurrentDay();
  const day = dayParam === "today" ? currentDay : parseInt(dayParam, 10);
  const devotional = getDevotional(day);

  // Estado local
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [noteLearn, setNoteLearn] = useState("");
  const [noteApply, setNoteApply] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [completing, setCompleting] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showShare, setShowShare] = useState(false);

  // Carregar notas existentes
  useEffect(() => {
    if (notes[day]) {
      setNoteLearn(notes[day].learned || "");
      setNoteApply(notes[day].apply || "");
    }
  }, [notes, day]);

  // Carregar favoritos do localStorage
  useEffect(() => {
    const stored = localStorage.getItem("devotionalFavorites");
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  // Detectar scroll para mostrar botão "voltar ao topo"
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-parchment-400 dark:text-neutral-600 animate-pulse">
          A carregar...
        </div>
      </div>
    );
  }

  if (!devotional) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-parchment-500 dark:text-neutral-500">
          Devocional não encontrado.
        </p>
        <Link
          href="/dashboard"
          className="text-gold-600 dark:text-gold-500 text-sm mt-4 inline-block"
        >
          Voltar ao início
        </Link>
      </div>
    );
  }

  const isCompleted = !!progress[day];
  const hasFullContent = !!(devotional.context && devotional.explanation);
  const dayNote = notes[day];
  const isFavorite = favorites.includes(day);

  const handleComplete = async () => {
    setCompleting(true);
    const success = await completeDay(day, isRecovery);
    if (success) {
      setToastMessage("Devocional concluído. Glória a Deus.");
      setShowToast(true);
    }
    setCompleting(false);
  };

  const handleSaveNote = async () => {
    const success = await saveNote(day, noteLearn, noteApply);
    if (success) {
      setShowNoteEditor(false);
      setToastMessage("Notas guardadas.");
      setShowToast(true);
    }
  };

  const handleToggleFavorite = () => {
    let newFavorites: number[];
    if (isFavorite) {
      newFavorites = favorites.filter((d) => d !== day);
    } else {
      newFavorites = [...favorites, day];
    }
    setFavorites(newFavorites);
    localStorage.setItem("devotionalFavorites", JSON.stringify(newFavorites));
    setToastMessage(
      isFavorite ? "Removido de favoritos." : "Adicionado aos favoritos."
    );
    setShowToast(true);
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Extrair um versículo-chave (primeiras 120 caracteres da explicação ou contexto)
  const keyVerse =
    devotional.explanation?.substring(0, 120).trim() ||
    devotional.context?.substring(0, 120).trim() ||
    devotional.passage;

  // Calcular progresso
  const progressPercentage = (day / 365) * 100;

  return (
    <div className="px-4 py-4 max-w-xl mx-auto animate-fade-in">
      {/* Header com bookmark */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-sm text-parchment-500 dark:text-neutral-500 hover:text-gold-600 dark:hover:text-gold-500 transition-colors"
        >
          <ChevronLeftIcon size={18} /> Início
        </Link>
        <button
          onClick={handleToggleFavorite}
          className="text-parchment-400 dark:text-neutral-600 hover:text-gold-600 dark:hover:text-gold-500 transition-colors"
          title={isFavorite ? "Remover de favoritos" : "Adicionar aos favoritos"}
        >
          {isFavorite ? (
            <BookmarkFilledIcon size={20} />
          ) : (
            <BookmarkIcon size={20} />
          )}
        </button>
      </div>

      {/* Indicador de Progresso */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-parchment-600 dark:text-neutral-400">
            Dia {day} de 365
          </span>
          <span className="text-xs text-parchment-500 dark:text-neutral-500">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full h-2 bg-parchment-200 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold-600 to-gold-500 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Título e passagem */}
      <div className="mb-8">
        <div className="inline-block px-3 py-1 bg-gold-600/10 rounded-full mb-3">
          <span className="text-xs font-semibold text-gold-600 dark:text-gold-500 tracking-wide">
            {devotional.passage}
          </span>
        </div>
        <h1 className="text-3xl font-light text-parchment-900 dark:text-neutral-100 leading-tight">
          {devotional.title}
        </h1>
      </div>

      {/* Bible Reader Section */}
      <section className="mb-8 bg-parchment-50 dark:bg-neutral-900/50 border border-parchment-200 dark:border-neutral-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <BibleIcon size={18} className="text-gold-600 dark:text-gold-500" />
          <h3 className="text-sm font-semibold text-parchment-700 dark:text-neutral-300">
            Leitura Bíblica
          </h3>
        </div>
        <BibleReader passage={devotional.passage} />
      </section>

      {hasFullContent ? (
        <>
          {/* Contexto bíblico */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BookIcon size={18} className="text-gold-600 dark:text-gold-500" />
              <h3 className="text-sm font-semibold text-parchment-700 dark:text-neutral-300">
                Contexto Bíblico
              </h3>
            </div>
            <p className="text-[15px] leading-[1.8] text-parchment-800 dark:text-neutral-300">
              {devotional.context}
            </p>
          </section>

          <hr className="border-parchment-200 dark:border-neutral-800 mb-8" />

          {/* Explicação */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BookIcon size={18} className="text-gold-600 dark:text-gold-500" />
              <h3 className="text-sm font-semibold text-parchment-700 dark:text-neutral-300">
                O Que o Texto Diz
              </h3>
            </div>
            <p className="text-[15px] leading-[1.8] text-parchment-800 dark:text-neutral-300">
              {devotional.explanation}
            </p>
          </section>

          <hr className="border-parchment-200 dark:border-neutral-800 mb-8" />

          {/* Aplicação */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BookIcon size={18} className="text-gold-600 dark:text-gold-500" />
              <h3 className="text-sm font-semibold text-parchment-700 dark:text-neutral-300">
                Aplicação para Hoje
              </h3>
            </div>
            <p className="text-[15px] leading-[1.8] text-parchment-800 dark:text-neutral-300">
              {devotional.application}
            </p>
          </section>

          <hr className="border-parchment-200 dark:border-neutral-800 mb-8" />

          {/* Oração */}
          <section className="mb-8 bg-gold-600/5 dark:bg-gold-500/5 border border-gold-600/10 dark:border-gold-500/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <BookIcon size={18} className="text-gold-600 dark:text-gold-500" />
              <h3 className="text-sm font-semibold text-parchment-700 dark:text-neutral-300">
                Oração
              </h3>
            </div>
            <p className="text-[15px] leading-[1.8] text-parchment-800 dark:text-neutral-300 italic">
              {devotional.prayer}
            </p>
          </section>
        </>
      ) : (
        <div className="card p-7 text-center mb-8">
          <p className="text-parchment-600 dark:text-neutral-400 text-[15px] leading-relaxed">
            O conteúdo completo deste devocional estará disponível em breve.
          </p>
          <p className="text-parchment-500 dark:text-neutral-500 text-sm mt-3">
            Passagem para leitura:{" "}
            <strong className="text-gold-600 dark:text-gold-500">
              {devotional.passage}
            </strong>
          </p>
          <p className="text-parchment-400 dark:text-neutral-600 text-xs mt-4 leading-relaxed">
            Lê o texto na tua Bíblia, medita nele, e marca como concluído.
          </p>
        </div>
      )}

      {/* Notas existentes */}
      {dayNote && !showNoteEditor && (
        <div className="card p-5 mb-5 animate-fade-in">
          <div className="flex justify-between items-center mb-3">
            <h3 className="section-label mb-0">As Tuas Notas</h3>
            <button
              onClick={() => setShowNoteEditor(true)}
              className="text-parchment-400 dark:text-neutral-600 hover:text-gold-600 dark:hover:text-gold-500 transition-colors"
            >
              <EditIcon size={16} />
            </button>
          </div>
          {dayNote.learned && (
            <p className="text-sm text-parchment-700 dark:text-neutral-300 leading-relaxed mb-2">
              <strong>O que aprendi:</strong> {dayNote.learned}
            </p>
          )}
          {dayNote.apply && (
            <p className="text-sm text-parchment-700 dark:text-neutral-300 leading-relaxed">
              <strong>O que vou aplicar:</strong> {dayNote.apply}
            </p>
          )}
        </div>
      )}

      {/* Editor de notas */}
      {showNoteEditor && (
        <div className="card p-5 mb-5 animate-fade-in">
          <h3 className="section-label">Notas Pessoais</h3>
          <label className="text-xs text-parchment-500 dark:text-neutral-500 block mb-1">
            O que aprendi hoje:
          </label>
          <textarea
            value={noteLearn}
            onChange={(e) => setNoteLearn(e.target.value)}
            rows={3}
            className="input-field mb-3 resize-y"
          />
          <label className="text-xs text-parchment-500 dark:text-neutral-500 block mb-1">
            O que vou aplicar:
          </label>
          <textarea
            value={noteApply}
            onChange={(e) => setNoteApply(e.target.value)}
            rows={3}
            className="input-field mb-4 resize-y"
          />
          <div className="flex gap-2">
            <button onClick={handleSaveNote} className="btn-primary flex-1">
              Guardar
            </button>
            <button
              onClick={() => setShowNoteEditor(false)}
              className="btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Share Card */}
      {hasFullContent && (
        <ShareCard
          verse={keyVerse}
          reference={devotional.passage}
          version="ACF"
        />
      )}

      {/* Ações */}
      <div className="flex gap-3 mb-6">
        {!isCompleted ? (
          <button
            onClick={handleComplete}
            disabled={completing}
            className="btn-success flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <CheckIcon size={18} />
            {completing ? "A concluir..." : "Concluir Devocional"}
          </button>
        ) : (
          <div className="flex-1 py-4 px-6 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40 rounded-xl text-center font-semibold text-[15px]">
            Concluído
          </div>
        )}
        {!dayNote && !showNoteEditor && (
          <button
            onClick={() => setShowNoteEditor(true)}
            className="btn-secondary px-4"
            title="Adicionar notas"
          >
            <EditIcon size={18} />
          </button>
        )}
      </div>

      {/* Botão de Áudio (desabilitado por enquanto) */}
      <div className="mb-6">
        <button
          disabled
          className="w-full py-3 px-4 flex items-center justify-center gap-2 text-parchment-400 dark:text-neutral-600 bg-parchment-100 dark:bg-neutral-800 border border-parchment-200 dark:border-neutral-700 rounded-xl cursor-not-allowed opacity-60"
          title="Esta funcionalidade virá em breve"
        >
          <span className="text-sm">Ouvir</span>
          <span className="text-xs text-parchment-500 dark:text-neutral-500">
            Em breve
          </span>
        </button>
      </div>

      {/* Navegação entre dias */}
      <div className="flex justify-between items-center mb-6">
        {day > 1 ? (
          <Link
            href={`/devotional/${day - 1}`}
            className="flex items-center gap-1 text-xs text-parchment-400 dark:text-neutral-600 hover:text-gold-600 dark:hover:text-gold-500 transition-colors"
          >
            <ChevronLeftIcon size={16} /> Dia {day - 1}
          </Link>
        ) : (
          <div />
        )}
        {day < 365 && (
          <Link
            href={`/devotional/${day + 1}`}
            className="flex items-center gap-1 text-xs text-parchment-400 dark:text-neutral-600 hover:text-gold-600 dark:hover:text-gold-500 transition-colors"
          >
            Dia {day + 1} <ChevronRightIcon size={16} />
          </Link>
        )}
      </div>

      {/* Botão de Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={handleScrollTop}
          className="fixed bottom-8 right-8 p-3 bg-gold-600 dark:bg-gold-500 text-white rounded-full shadow-lg hover:bg-gold-700 dark:hover:bg-gold-600 transition-all duration-200 animate-fade-in"
          title="Voltar ao topo"
        >
          <ChevronLeftIcon size={20} className="rotate-90" />
        </button>
      )}

      {/* Toast */}
      <Toast
        message={toastMessage}
        show={showToast}
        onHide={() => setShowToast(false)}
      />
    </div>
  );
}
