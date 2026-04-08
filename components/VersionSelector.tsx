'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from './Icons';

interface VersionSelectorProps {
  value: string;
  onChange: (version: string) => void;
}

/**
 * Componente VersionSelector
 * Dropdown compacto para seleção de versão da Bíblia
 *
 * Versões suportadas:
 * - ARC: Almeida Revista e Corrigida (clássica)
 * - NVI: Nova Versão Internacional (contemporânea)
 * - ARA: Almeida Revista e Atualizada (transitória)
 * - ACF: Almeida Corrigida Fiel (literal)
 */
export function VersionSelector({ value, onChange }: VersionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Versões disponíveis com nomes completos
  const versions = [
    { code: 'ARC', name: 'Almeida Revista e Corrigida' },
    { code: 'NVI', name: 'Nova Versão Internacional' },
    { code: 'ARA', name: 'Almeida Revista e Atualizada' },
    { code: 'ACF', name: 'Almeida Corrigida Fiel' },
  ];

  // Encontrar versão selecionada
  const selectedVersion = versions.find(v => v.code === value);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Fechar dropdown ao selecionar
  const handleSelect = (code: string) => {
    onChange(code);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Botão do dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-parchment-100 dark:bg-neutral-800 hover:bg-parchment-200 dark:hover:bg-neutral-700 border border-parchment-300 dark:border-neutral-700 rounded text-sm font-medium text-parchment-700 dark:text-parchment-300 transition-colors"
        aria-label="Selecionar versão da Bíblia"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="font-semibold">{selectedVersion?.code}</span>
        <ChevronDownIcon
          size={16}
          className={`transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Menu dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-72 bg-parchment-50 dark:bg-neutral-800 border border-parchment-300 dark:border-neutral-700 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <ul role="listbox" className="py-1">
            {versions.map((version) => (
              <li key={version.code}>
                <button
                  onClick={() => handleSelect(version.code)}
                  className={`w-full text-left px-4 py-2.5 flex flex-col gap-0.5 hover:bg-gold-100 dark:hover:bg-gold-900/20 transition-colors ${
                    value === version.code
                      ? 'bg-gold-50 dark:bg-gold-900/30 border-l-2 border-gold-600 dark:border-gold-400'
                      : 'border-l-2 border-transparent'
                  }`}
                  role="option"
                  aria-selected={value === version.code}
                >
                  <span className="font-semibold text-parchment-900 dark:text-parchment-100">
                    {version.code}
                  </span>
                  <span className="text-xs text-parchment-600 dark:text-parchment-400">
                    {version.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
