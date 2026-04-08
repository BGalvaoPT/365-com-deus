'use client';

import { useRef, useEffect, useState } from 'react';
import { DownloadIcon, CopyIcon, WhatsAppIcon, FacebookIcon, InstagramIcon } from './Icons';

interface ShareCardProps {
  verse: string;
  reference: string;
  version: string;
}

export function ShareCard({ verse, reference, version }: ShareCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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
      const crossSize = 40;
      const crossX = width / 2;
      const crossY = 60;
      drawCross(ctx, crossX, crossY, crossSize, goldColor);

      // Draw decorative line
      ctx.strokeStyle = goldColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(150, 120);
      ctx.lineTo(width - 150, 120);
      ctx.stroke();

      // Verse text - with text wrapping
      const verseY = 200;
      const maxWidth = width - 120;
      const lineHeight = 50;
      ctx.font = 'italic 32px "Georgia", serif';
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';

      const wrappedVerse = wrapText(ctx, verse, maxWidth);
      let currentY = verseY;
      wrappedVerse.forEach((line) => {
        ctx.fillText(line, width / 2, currentY);
        currentY += lineHeight;
      });

      // Reference text
      const referenceY = currentY + 60;
      ctx.font = 'bold 28px "Georgia", serif';
      ctx.fillStyle = goldColor;
      ctx.fillText(reference, width / 2, referenceY);

      // Version text
      ctx.font = '16px "Arial", sans-serif';
      ctx.fillStyle = '#999999';
      ctx.fillText(version, width / 2, referenceY + 40);

      // Bottom branding
      ctx.font = 'bold 24px "Georgia", serif';
      ctx.fillStyle = goldColor;
      ctx.fillText('365 com Deus', width / 2, height - 80);

      // Decorative bottom line
      ctx.strokeStyle = goldColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(150, height - 120);
      ctx.lineTo(width - 150, height - 120);
      ctx.stroke();

      // Convert canvas to blob URL
      canvas.toBlob((blob) => {
        if (blob) {
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
    context.lineWidth = 4;
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
    if (!shareUrl || !canvasRef.current) return;

    const link = document.createElement('a');
    link.href = shareUrl;
    link.download = `365-com-deus-${reference.replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = () => {
    const text = `"${verse}"\n\n${reference} - ${version}\n\n365 com Deus`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(
      `"${verse}"\n\n${reference} - ${version}\n\n365 com Deus`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareOnFacebook = () => {
    const quote = encodeURIComponent(`"${verse}"\n\n${reference} - ${version}`);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?quote=${quote}&hashtag=%23365ComDeus`,
      '_blank'
    );
  };

  const shareOnInstagram = () => {
    // Instagram doesn't support direct web sharing
    // Instead, we download the image with instructions
    downloadImage();
    alert('Imagem baixada! Abra o Instagram e partilhe a imagem do seu dispositivo.');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Canvas for generating the image */}
      <div className="hidden">
        <canvas ref={canvasRef} />
      </div>

      {/* Preview of the share image */}
      {shareUrl && (
        <div className="flex justify-center">
          <img
            src={shareUrl}
            alt="Imagem para partilhar"
            className="w-full max-w-sm rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* Share buttons */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-gray-700 text-center">Partilhar este versículo</p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {/* Copy to Clipboard */}
          <button
            onClick={copyToClipboard}
            className="flex items-center justify-center gap-2 px-3 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors text-gray-800 font-medium text-sm"
            title="Copiar para área de transferência"
          >
            <CopyIcon size={18} />
            <span className="hidden sm:inline">Copiar</span>
          </button>

          {/* Download Image */}
          <button
            onClick={downloadImage}
            className="flex items-center justify-center gap-2 px-3 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium text-sm"
            title="Descarregar imagem"
          >
            <DownloadIcon size={18} />
            <span className="hidden sm:inline">Descarregar</span>
          </button>

          {/* WhatsApp Share */}
          <button
            onClick={shareOnWhatsApp}
            className="flex items-center justify-center gap-2 px-3 py-3 rounded-lg bg-green-500 hover:bg-green-600 transition-colors text-white font-medium text-sm"
            title="Partilhar no WhatsApp"
          >
            <WhatsAppIcon size={18} />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          {/* Facebook Share */}
          <button
            onClick={shareOnFacebook}
            className="flex items-center justify-center gap-2 px-3 py-3 rounded-lg bg-blue-700 hover:bg-blue-800 transition-colors text-white font-medium text-sm"
            title="Partilhar no Facebook"
          >
            <FacebookIcon size={18} />
            <span className="hidden sm:inline">Facebook</span>
          </button>
        </div>

        {/* Instagram Share */}
        <button
          onClick={shareOnInstagram}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 transition-colors text-white font-medium"
          title="Partilhar no Instagram"
        >
          <InstagramIcon size={18} />
          Partilhar no Instagram
        </button>
      </div>

      {/* Copy confirmation message */}
      {copied && (
        <div className="text-center text-sm text-green-600 font-medium">
          Copiado para a área de transferência!
        </div>
      )}
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

    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Draw top cross icon
    const crossSize = 40;
    const crossX = width / 2;
    const crossY = 60;
    drawCrossHelper(ctx, crossX, crossY, crossSize, goldColor);

    // Draw decorative line
    ctx.strokeStyle = goldColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, 120);
    ctx.lineTo(width - 150, 120);
    ctx.stroke();

    // Helper function for wrapping text
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

    // Verse text
    const verseY = 200;
    const maxWidth = width - 120;
    const lineHeight = 50;
    ctx.font = 'italic 32px "Georgia", serif';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';

    const wrappedVerse = wrapTextHelper(ctx, verse, maxWidth);
    let currentY = verseY;
    wrappedVerse.forEach((line) => {
      ctx.fillText(line, width / 2, currentY);
      currentY += lineHeight;
    });

    // Reference text
    const referenceY = currentY + 60;
    ctx.font = 'bold 28px "Georgia", serif';
    ctx.fillStyle = goldColor;
    ctx.fillText(reference, width / 2, referenceY);

    // Version text
    ctx.font = '16px "Arial", sans-serif';
    ctx.fillStyle = '#999999';
    ctx.fillText(version, width / 2, referenceY + 40);

    // Bottom branding
    ctx.font = 'bold 24px "Georgia", serif';
    ctx.fillStyle = goldColor;
    ctx.fillText('365 com Deus', width / 2, height - 80);

    // Decorative bottom line
    ctx.strokeStyle = goldColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, height - 120);
    ctx.lineTo(width - 150, height - 120);
    ctx.stroke();

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
  context.lineWidth = 4;
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
}
