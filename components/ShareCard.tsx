'use client';

import { useRef, useEffect, useState } from 'react';
import { DownloadIcon, CopyIcon, ShareIcon, CheckIcon } from './Icons';

interface ShareCardProps {
  verse: string;
  reference: string;
  version: string;
}

export function ShareCard({ verse, reference, version }: ShareCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    // Detectar suporte a Web Share API (nativo do iPhone e Android)
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      setCanNativeShare(true);
    }
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Canvas dimensions
      const width = 1080;
      const height = 1080;
      canvas.width = width;
      canvas.height = height;

      // Colors
      const bgColor = '#1a1a1a';
      const goldColor = '#b8923e';
      const textColor = '#ffffff';

      // Fill background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // Draw top cross icon
      const crossSize = 50;
      const crossX = width / 2;
      const crossY = 110;
      drawCross(ctx, crossX, crossY, crossSize, goldColor);

      // Draw decorative line
      ctx.strokeStyle = goldColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(150, 180);
      ctx.lineTo(width - 150, 180);
      ctx.stroke();

      // Verse text - with text wrapping
      const verseY = 320;
      const maxWidth = width - 120;
      const lineHeight = 60;
      ctx.font = 'italic 38px "Georgia", serif';
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';

      const wrappedVerse = wrapText(ctx, `"${verse}"`, maxWidth);
      let currentY = verseY;
      wrappedVerse.forEach((line) => {
        ctx.fillText(line, width / 2, currentY);
        currentY += lineHeight;
      });

      // Reference text
      const referenceY = currentY + 80;
      ctx.font = 'bold 34px "Georgia", serif';
      ctx.fillStyle = goldColor;
      ctx.fillText(reference, width / 2, referenceY);

      // Version text
      ctx.font = '20px "Arial", sans-serif';
      ctx.fillStyle = '#999999';
      ctx.fillText(version, width / 2, referenceY + 40);

      // Decorative bottom line
      ctx.strokeStyle = goldColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(150, height - 160);
      ctx.lineTo(width - 150, height - 160);
      ctx.stroke();

      // Bottom branding
      ctx.font = 'bold 28px "Georgia", serif';
      ctx.fillStyle = goldColor;
      ctx.fillText('365 com Deus', width / 2, height - 100);

      // Convert canvas to blob URL
      canvas.toBlob((blob) => {
        if (blob) {
          setImageBlob(blob);
          const url = URL.createObjectURL(blob);
          setShareUrl(url);
        }
      }, 'image/png');
    }
  }, [verse, reference, version]);

  const wrapText = (context: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach((word) => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = context.measureText(testLine);

      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  };

  const drawCross = (
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    color: string
  ) => {
    context.strokeStyle = color;
    context.lineWidth = 5;
    context.lineCap = 'round';

    // Vertical line
    context.beginPath();
    context.moveTo(x, y - size / 2);
    context.lineTo(x, y + size / 2);
    context.stroke();

    // Horizontal line
    context.beginPath();
    context.moveTo(x - size / 3, y - size / 4);
    context.lineTo(x + size / 3, y - size / 4);
    context.stroke();
  };

  const downloadImage = () => {
    if (!shareUrl) return;

    const link = document.createElement('a');
    link.href = shareUrl;
    link.download = `365-com-deus-${reference.replace(/\s+/g, '-').replace(/:/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = () => {
    const text = `"${verse}"\n\n${reference} — ${version}\n\n— 365 com Deus`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const nativeShare = async () => {
    if (!imageBlob) return;

    const shareText = `"${verse}"\n\n${reference} — ${version}\n\n— 365 com Deus`;

    try {
      // Tentar partilhar com imagem e texto
      const file = new File([imageBlob], '365-com-deus.png', { type: 'image/png' });
      const shareData: ShareData = {
        title: '365 com Deus',
        text: shareText,
      };

      // Alguns browsers suportam partilhar ficheiros
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        shareData.files = [file];
      }

      await navigator.share(shareData);
    } catch (err) {
      // Utilizador cancelou ou erro — sem ação
      if ((err as Error).name !== 'AbortError') {
        console.error('Erro ao partilhar:', err);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Canvas para gerar a imagem (escondido) */}
      <div className="hidden">
        <canvas ref={canvasRef} />
      </div>

      {/* Preview da imagem */}
      {shareUrl && (
        <div className="flex justify-center">
          <img
            src={shareUrl}
            alt="Imagem para partilhar"
            className="w-full max-w-xs rounded-xl shadow-lg"
          />
        </div>
      )}

      {/* Botões de ação - layout simples e intuitivo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {/* Copiar texto */}
        <button
          onClick={copyToClipboard}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-parchment-100 dark:bg-neutral-800 hover:bg-parchment-200 dark:hover:bg-neutral-700 border border-parchment-200 dark:border-neutral-700 transition-colors text-parchment-800 dark:text-neutral-200 font-medium text-sm"
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

        {/* Guardar imagem */}
        <button
          onClick={downloadImage}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-parchment-100 dark:bg-neutral-800 hover:bg-parchment-200 dark:hover:bg-neutral-700 border border-parchment-200 dark:border-neutral-700 transition-colors text-parchment-800 dark:text-neutral-200 font-medium text-sm"
        >
          <DownloadIcon size={18} />
          <span>Guardar imagem</span>
        </button>

        {/* Partilhar (nativo) */}
        {canNativeShare ? (
          <button
            onClick={nativeShare}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gold-600 hover:bg-gold-700 text-white font-semibold text-sm transition-colors shadow-sm"
          >
            <ShareIcon size={18} />
            <span>Partilhar</span>
          </button>
        ) : (
          <button
            onClick={() => {
              // Fallback: copiar e informar
              copyToClipboard();
            }}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gold-600 hover:bg-gold-700 text-white font-semibold text-sm transition-colors shadow-sm"
          >
            <ShareIcon size={18} />
            <span>Partilhar</span>
          </button>
        )}
      </div>
    </div>
  );
}

// Export function to generate share image as a blob URL
export function generateShareImage(
  verse: string,
  reference: string,
  version: string
): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      resolve('');
      return;
    }

    const width = 1080;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    const bgColor = '#1a1a1a';
    const goldColor = '#b8923e';
    const textColor = '#ffffff';

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    const crossSize = 50;
    drawCrossHelper(ctx, width / 2, 110, crossSize, goldColor);

    ctx.strokeStyle = goldColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, 180);
    ctx.lineTo(width - 150, 180);
    ctx.stroke();

    const wrapTextHelper = (
      context: CanvasRenderingContext2D,
      text: string,
      maxWidth: number
    ): string[] => {
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      words.forEach((word) => {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = context.measureText(testLine);

        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });

      if (currentLine) {
        lines.push(currentLine);
      }

      return lines;
    };

    const verseY = 320;
    const maxWidth = width - 120;
    const lineHeight = 60;
    ctx.font = 'italic 38px "Georgia", serif';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';

    const wrappedVerse = wrapTextHelper(ctx, `"${verse}"`, maxWidth);
    let currentY = verseY;
    wrappedVerse.forEach((line) => {
      ctx.fillText(line, width / 2, currentY);
      currentY += lineHeight;
    });

    const referenceY = currentY + 80;
    ctx.font = 'bold 34px "Georgia", serif';
    ctx.fillStyle = goldColor;
    ctx.fillText(reference, width / 2, referenceY);

    ctx.font = '20px "Arial", sans-serif';
    ctx.fillStyle = '#999999';
    ctx.fillText(version, width / 2, referenceY + 40);

    ctx.strokeStyle = goldColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, height - 160);
    ctx.lineTo(width - 150, height - 160);
    ctx.stroke();

    ctx.font = 'bold 28px "Georgia", serif';
    ctx.fillStyle = goldColor;
    ctx.fillText('365 com Deus', width / 2, height - 100);

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        resolve(url);
      } else {
        resolve('');
      }
    }, 'image/png');
  });
}

function drawCrossHelper(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) {
  context.strokeStyle = color;
  context.lineWidth = 5;
  context.lineCap = 'round';

  context.beginPath();
  context.moveTo(x, y - size / 2);
  context.lineTo(x, y + size / 2);
  context.stroke();

  context.beginPath();
  context.moveTo(x - size / 3, y - size / 4);
  context.lineTo(x + size / 3, y - size / 4);
  context.stroke();
}
