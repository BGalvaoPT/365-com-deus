'use client';

import { useEffect, useState } from 'react';
import { fetchPassage, getAvailableVersions, type BibleVersion, type BiblePassage } from '@/lib/bible-api';
import { ChevronDownIcon } from './Icons';
import { VersionSelector } from './VersionSelector';

interface BibleReaderProps {
  passage: string;
}

/**
 * Componente BibleReader
 * Exibe o texto completo de uma passagem bíblica com suporte a múltiplas versões
 *
 * Funcionalidades:
 * - Carrega passagens através da Bible API
 * - Permite seleção de versão da Bíblia
 * - Salva preferência do usuário em localStorage
 * - Skeleton loading enquanto busca dados
 * - Fallback amigável em caso de erro
 * - Design colapsável/expansível
 */
export function BibleReader({ passage }: BibleReaderProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<BiblePassage | null>(null);
  const [error, setError] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<BibleVersion>('ARC');

  // Carregar versão preferida do localStorage na montagem
  useEffect(() => {
    const savedVersion = localStorage.getItem('bible_version') as BibleVersion | null;
    if (savedVersion && ['ARC', 'NVI', 'ARA', 'ACF'].includes(savedVersion)) {
      setSelectedVersion(savedVersion);
    }
  }, []);

  // Buscar passagem quando expandir, passage ou versão mudar
  useEffect(() => {
    if (!isExpanded) return;

    const fetchPassageData = async () => {
      setIsLoading(true);
      setError(false);
      try {
        const result = await fetchPassage(passage, selectedVersion);
        if (result) {
          setData(result);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Erro ao buscar passagem:', err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPassageData();
  }, [isExpanded, passage, selectedVersion]);

  // Salvar versão preferida em localStorage
  const handleVersionChange = (version: string) => {
    const bibleVersion = version as BibleVersion;
    setSelectedVersion(bibleVersion);
    localStorage.setItem('bible_version', bibleVersion);
  };

  return (
    <div className="w-full space-y-3">
      {/* Botão para expandir/colapsar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gold-100 dark:bg-gold-900/20 hover:bg-gold-200 dark:hover:bg-gold-900/30 border border-gold-300 dark:border-gold-700 rounded-lg text-gold-700 dark:text-gold-400 font-medium transition-colors"
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'Colapsar' : 'Expandir'} passagem bíblica`}
      >
        <span>Ler passagem</span>
        <ChevronDownIcon
          size={18}
          className={`transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Conteúdo expansível */}
      {isExpanded && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Seletor de versão */}
          <div className="flex items-center justify-between px-4 py-2 bg-parchment-50 dark:bg-neutral-900 rounded-lg border border-parchment-200 dark:border-neutral-800">
            <span className="text-sm font-medium text-parchment-700 dark:text-parchment-300">
              Versão:
            </span>
            <VersionSelector
              value={selectedVersion}
              onChange={handleVersionChange}
            />
          </div>

          {/* Área de conteúdo */}
          <div className="bg-parchment-50 dark:bg-neutral-900 rounded-lg border border-parchment-200 dark:border-neutral-800 p-4">
            {isLoading && <LoadingSkeleton />}

            {error && !isLoading && (
              <div className="text-center py-6 space-y-3">
                <p className="text-parchment-600 dark:text-parchment-400 text-sm">
                  Não conseguimos carregar a passagem bíblica.
                </p>
                <a
                  href="https://www.bibliaonline.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-gold-600 dark:text-gold-400 hover:text-gold-700 dark:hover:text-gold-300 text-sm font-medium transition-colors"
                >
                  Abre a tua Bíblia em {passage}
                </a>
              </div>
            )}

            {data && !isLoading && (
              <div className="space-y-4">
                {/* Referência */}
                <div className="pb-3 border-b border-parchment-200 dark:border-neutral-700">
                  <h3 className="text-lg font-serif font-semibold text-parchment-900 dark:text-parchment-100">
                    {data.reference}
                  </h3>
                </div>

                {/* Versículos */}
                <div className="space-y-3 font-serif text-parchment-800 dark:text-parchment-200 leading-[1.8]">
                  {data.verses.map((verse, index) => (
                    <div key={index} className="flex gap-3">
                      {/* Número do versículo em ouro */}
                      <span className="inline-flex items-start font-semibold text-gold-600 dark:text-gold-400 min-w-fit pt-0.5">
                        {verse.verse}
                      </span>
                      {/* Texto do versículo */}
                      <p className="text-base leading-[1.8]">
                        {verse.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Fonte */}
                <div className="text-xs text-parchment-500 dark:text-parchment-500 pt-2 border-t border-parchment-200 dark:border-neutral-700">
                  Fonte: {data.source === 'bible-api' ? 'Bible API' : 'Bolls.life'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Componente de skeleton loading
 * Exibe placeholders enquanto a passagem está sendo carregada
 */
function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="pb-3 border-b border-parchment-200 dark:border-neutral-700">
        <div className="h-6 bg-parchment-200 dark:bg-neutral-800 rounded w-48 animate-pulse" />
      </div>

      {/* Versículos skeleton */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-parchment-200 dark:bg-neutral-800 rounded w-full animate-pulse" />
            <div className="h-4 bg-parchment-200 dark:bg-neutral-800 rounded w-5/6 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
