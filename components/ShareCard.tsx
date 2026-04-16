'use client';

import { useEffect, useState } from 'react';
import { DownloadIcon, CopyIcon, ShareIcon, CheckIcon } from './Icons';
import type { Devotional } from '@/data/devotionals';

interface ShareCardProps {
  devotional: Devotional;
  verse?: string;
  version?: string;
}

/**
 * Componente de partilha do devocional completo em PDF.
 * Gera um PDF A4 elegante, com tipografia cuidada e layout organizado.
 */
export function ShareCard({ devotional, verse, version = 'ACF' }: ShareCardProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [generating, setGenerating] = useState(true);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      setCanNativeShare(true);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    let urlToRevoke: string | null = null;

    async function generate() {
      setGenerating(true);
      try {
        const { jsPDF } = await import('jspdf');
        const blob = buildDevotionalPdf(jsPDF, devotional, verse, version);
        if (cancelled) return;
        const url = URL.createObjectURL(blob);
        urlToRevoke = url;
        setPdfBlob(blob);
        setPdfUrl(url);
      } catch (err) {
        console.error('Erro ao gerar PDF:', err);
      } finally {
        if (!cancelled) setGenerating(false);
      }
    }

    generate();

    return () => {
      cancelled = true;
      if (urlToRevoke) URL.revokeObjectURL(urlToRevoke);
    };
  }, [devotional, verse, version]);

  const filename = `365-com-deus-dia-${String(devotional.day).padStart(3, '0')}.pdf`;

  const downloadPdf = () => {
    if (!pdfUrl) return;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyTextSummary = () => {
    const parts: string[] = [];
    parts.push(`📖 365 com Deus — Dia ${devotional.day} / 365`);
    parts.push(devotional.title);
    parts.push(`${devotional.passage}  ·  ${version}`);
    parts.push('');

    if (verse && verse.trim()) {
      parts.push(`"${verse.trim()}"`);
      parts.push('');
    }

    if (devotional.context) {
      parts.push('— CONTEXTO —');
      parts.push(devotional.context);
      parts.push('');
    }

    if (devotional.explanation) {
      parts.push('— EXPLICAÇÃO —');
      parts.push(devotional.explanation);
      parts.push('');
    }

    if (devotional.application) {
      parts.push('— APLICAÇÃO —');
      parts.push(devotional.application);
      parts.push('');
    }

    if (devotional.prayer) {
      parts.push('— ORAÇÃO —');
      parts.push(devotional.prayer);
      parts.push('');
    }

    parts.push('—');
    parts.push('365 com Deus · Um ano de fidelidade na Palavra');

    const text = parts.join('\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const nativeShare = async () => {
    if (!pdfBlob) return;

    const shareText =
      `📖 365 com Deus — Dia ${devotional.day}\n` +
      `${devotional.title}\n` +
      `${devotional.passage}` +
      (verse ? `\n\n"${verse}"` : '');

    try {
      const file = new File([pdfBlob], filename, { type: 'application/pdf' });
      const shareData: ShareData = {
        title: `365 com Deus — Dia ${devotional.day}`,
        text: shareText,
      };

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        shareData.files = [file];
      }

      await navigator.share(shareData);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Erro ao partilhar:', err);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Pré-visualização do PDF */}
      <div className="flex justify-center">
        {generating ? (
          <div className="w-full max-w-xs aspect-[1/1.414] rounded-xl bg-parchment-100 dark:bg-neutral-800 border border-parchment-200 dark:border-neutral-700 flex items-center justify-center animate-pulse">
            <span className="text-parchment-500 dark:text-neutral-500 text-sm">
              A preparar PDF…
            </span>
          </div>
        ) : pdfUrl ? (
          <div className="w-full max-w-xs">
            <div className="aspect-[1/1.414] rounded-xl overflow-hidden bg-white shadow-lg border border-parchment-200 dark:border-neutral-700">
              <iframe
                src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                className="w-full h-full pointer-events-none"
                title="Pré-visualização do PDF"
              />
            </div>
            <p className="text-center text-xs text-parchment-500 dark:text-neutral-500 mt-2">
              Dia {devotional.day} · {devotional.passage}
            </p>
          </div>
        ) : (
          <div className="w-full max-w-xs aspect-[1/1.414] rounded-xl bg-parchment-100 dark:bg-neutral-800 flex items-center justify-center">
            <span className="text-parchment-500 dark:text-neutral-500 text-sm">
              Erro ao gerar PDF
            </span>
          </div>
        )}
      </div>

      {/* Botões */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          onClick={copyTextSummary}
          disabled={generating}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-parchment-100 dark:bg-neutral-800 hover:bg-parchment-200 dark:hover:bg-neutral-700 border border-parchment-200 dark:border-neutral-700 transition-colors text-parchment-800 dark:text-neutral-200 font-medium text-sm disabled:opacity-50"
        >
          {copied ? (
            <>
              <CheckIcon size={18} />
              <span>Copiado!</span>
            </>
          ) : (
            <>
              <CopyIcon size={18} />
              <span>Copiar texto</span>
            </>
          )}
        </button>

        <button
          onClick={downloadPdf}
          disabled={generating || !pdfUrl}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-parchment-100 dark:bg-neutral-800 hover:bg-parchment-200 dark:hover:bg-neutral-700 border border-parchment-200 dark:border-neutral-700 transition-colors text-parchment-800 dark:text-neutral-200 font-medium text-sm disabled:opacity-50"
        >
          <DownloadIcon size={18} />
          <span>Guardar PDF</span>
        </button>

        <button
          onClick={canNativeShare ? nativeShare : downloadPdf}
          disabled={generating || !pdfBlob}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gold-600 hover:bg-gold-700 text-white font-semibold text-sm transition-colors shadow-sm disabled:opacity-50"
        >
          <ShareIcon size={18} />
          <span>Partilhar PDF</span>
        </button>
      </div>

      <p className="text-center text-xs text-parchment-500 dark:text-neutral-500">
        Um PDF do devocional completo — perfeito para enviar ou imprimir.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Gerador do PDF                                                     */
/* ------------------------------------------------------------------ */

type JsPDFCtor = typeof import('jspdf').jsPDF;
type JsPDFInstance = InstanceType<JsPDFCtor>;

function buildDevotionalPdf(
  JsPdf: JsPDFCtor,
  d: Devotional,
  verse: string | undefined,
  version: string
): Blob {
  const doc = new JsPdf({ unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Paleta
  const BG = { r: 26, g: 26, b: 26 };
  const PARCHMENT = { r: 245, g: 240, b: 232 };
  const GOLD = { r: 184, g: 146, b: 62 };
  const INK = { r: 40, g: 35, b: 28 };
  const MUTED = { r: 110, g: 100, b: 88 };

  const margin = 56;
  const contentW = pageW - margin * 2;

  // Cabeçalho escuro
  doc.setFillColor(BG.r, BG.g, BG.b);
  doc.rect(0, 0, pageW, 220, 'F');

  doc.setDrawColor(GOLD.r, GOLD.g, GOLD.b);
  doc.setLineWidth(1);
  doc.line(margin, 60, pageW - margin, 60);
  doc.line(margin, 200, pageW - margin, 200);

  drawCross(doc, pageW / 2, 90, 18, GOLD);

  doc.setTextColor(GOLD.r, GOLD.g, GOLD.b);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('365 COM DEUS', pageW / 2, 125, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(180, 160, 120);
  doc.text('Devocional cristão diário', pageW / 2, 142, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`DIA ${d.day} · 365`, pageW / 2, 170, { align: 'center' });

  doc.setFont('times', 'bolditalic');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  const titleLines = doc.splitTextToSize(d.title, contentW - 40);
  let headerY = 192;
  titleLines.forEach((line: string) => {
    doc.text(line, pageW / 2, headerY, { align: 'center' });
    headerY += 22;
  });

  // Corpo — fundo pergaminho
  doc.setFillColor(PARCHMENT.r, PARCHMENT.g, PARCHMENT.b);
  doc.rect(0, 220, pageW, pageH - 220, 'F');

  let y = 260;

  // Banner dourado com referência bíblica
  doc.setFillColor(GOLD.r, GOLD.g, GOLD.b);
  doc.roundedRect(margin, y, contentW, 34, 6, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(`${d.passage}  ·  ${version}`, pageW / 2, y + 22, { align: 'center' });
  y += 34 + 24;

  // Versículo em destaque
  if (verse && verse.trim().length > 0) {
    const verseText = `"${verse.trim()}"`;
    doc.setFont('times', 'italic');
    doc.setFontSize(12);
    doc.setTextColor(INK.r, INK.g, INK.b);
    const verseLines = doc.splitTextToSize(verseText, contentW - 40);
    const boxH = verseLines.length * 16 + 24;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(GOLD.r, GOLD.g, GOLD.b);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, contentW, boxH, 4, 4, 'FD');

    doc.setFillColor(GOLD.r, GOLD.g, GOLD.b);
    doc.rect(margin, y, 4, boxH, 'F');

    let vy = y + 18;
    verseLines.forEach((line: string) => {
      doc.text(line, pageW / 2, vy, { align: 'center' });
      vy += 16;
    });
    y += boxH + 22;
  }

  const addSection = (label: string, text: string) => {
    if (!text) return;

    if (y > pageH - 140) {
      addFooter(doc, pageW, pageH, d.day, margin, MUTED, GOLD);
      doc.addPage();
      addPageBackground(doc, pageW, pageH, PARCHMENT);
      y = margin;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(GOLD.r, GOLD.g, GOLD.b);
    doc.text(label.toUpperCase(), margin, y);

    doc.setDrawColor(GOLD.r, GOLD.g, GOLD.b);
    doc.setLineWidth(0.8);
    const labelWidth = doc.getTextWidth(label.toUpperCase());
    doc.line(margin + labelWidth + 8, y - 3, margin + labelWidth + 40, y - 3);

    y += 16;

    doc.setFont('times', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(INK.r, INK.g, INK.b);
    const lines = doc.splitTextToSize(text, contentW);
    const lineHeight = 15;

    lines.forEach((line: string) => {
      if (y > pageH - 80) {
        addFooter(doc, pageW, pageH, d.day, margin, MUTED, GOLD);
        doc.addPage();
        addPageBackground(doc, pageW, pageH, PARCHMENT);
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });

    y += 20;
  };

  addSection('Contexto', d.context);
  addSection('Explicação', d.explanation);
  addSection('Aplicação', d.application);

  // Oração em cartão escuro
  if (d.prayer) {
    if (y > pageH - 200) {
      addFooter(doc, pageW, pageH, d.day, margin, MUTED, GOLD);
      doc.addPage();
      addPageBackground(doc, pageW, pageH, PARCHMENT);
      y = margin;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(GOLD.r, GOLD.g, GOLD.b);
    doc.text('ORAÇÃO', margin, y);
    y += 14;

    const prayerLines = doc.splitTextToSize(d.prayer, contentW - 32);
    const boxH = prayerLines.length * 15 + 28;

    if (y + boxH > pageH - 80) {
      addFooter(doc, pageW, pageH, d.day, margin, MUTED, GOLD);
      doc.addPage();
      addPageBackground(doc, pageW, pageH, PARCHMENT);
      y = margin;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(GOLD.r, GOLD.g, GOLD.b);
      doc.text('ORAÇÃO', margin, y);
      y += 14;
    }

    doc.setFillColor(BG.r, BG.g, BG.b);
    doc.roundedRect(margin, y, contentW, boxH, 6, 6, 'F');

    doc.setFont('times', 'italic');
    doc.setFontSize(11);
    doc.setTextColor(240, 230, 210);

    let py = y + 20;
    prayerLines.forEach((line: string) => {
      doc.text(line, margin + 16, py);
      py += 15;
    });

    y += boxH + 20;
  }

  addFooter(doc, pageW, pageH, d.day, margin, MUTED, GOLD);

  return doc.output('blob');
}

function addPageBackground(
  doc: JsPDFInstance,
  pageW: number,
  pageH: number,
  parchment: { r: number; g: number; b: number }
) {
  doc.setFillColor(parchment.r, parchment.g, parchment.b);
  doc.rect(0, 0, pageW, pageH, 'F');
}

function addFooter(
  doc: JsPDFInstance,
  pageW: number,
  pageH: number,
  day: number,
  margin: number,
  muted: { r: number; g: number; b: number },
  gold: { r: number; g: number; b: number }
) {
  doc.setDrawColor(gold.r, gold.g, gold.b);
  doc.setLineWidth(0.5);
  doc.line(margin, pageH - 50, pageW - margin, pageH - 50);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(muted.r, muted.g, muted.b);
  doc.text('365 com Deus · Um ano de fidelidade na Palavra', margin, pageH - 32);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(gold.r, gold.g, gold.b);
  doc.text(`Dia ${day} / 365`, pageW - margin, pageH - 32, { align: 'right' });
}

function drawCross(
  doc: JsPDFInstance,
  x: number,
  y: number,
  size: number,
  gold: { r: number; g: number; b: number }
) {
  doc.setDrawColor(gold.r, gold.g, gold.b);
  doc.setLineWidth(2);
  doc.setLineCap('round');
  doc.line(x, y - size, x, y + size);
  doc.line(x - size * 0.55, y - size * 0.4, x + size * 0.55, y - size * 0.4);
}
