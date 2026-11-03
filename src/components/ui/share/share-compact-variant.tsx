'use client';

import React from 'react';
import { Copy, Check, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WhatsAppIcon, FacebookIcon, XIcon, TelegramIcon } from './share-icons';

interface ShareCompactVariantProps {
  className?: string;
  copied: boolean;
  copyLabel: string;
  onCopy: () => void;
  canNativeShare: boolean;
  onNativeShare: () => void;
  shareLinks: {
    whatsapp: string;
    facebook: string;
    x: string;
    telegram: string;
  };
}

export default function ShareCompactVariant({
  className = '',
  copied,
  copyLabel,
  onCopy,
  canNativeShare,
  onNativeShare,
  shareLinks,
}: ShareCompactVariantProps) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <button
        onClick={onCopy}
        type="button"
        aria-label={copyLabel}
        title={copied ? 'Link Tersalin!' : copyLabel}
        className={cn(
          'p-2 rounded-xl text-xs font-bold inline-flex items-center justify-center border transition-all duration-200 cursor-pointer',
          copied
            ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
            : 'bg-white border-border-fine text-text-muted hover:text-primary hover:border-primary/40 active:scale-95'
        )}
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
      </button>

      <a
        href={shareLinks.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Bagikan ke WhatsApp"
        className="p-2 rounded-xl bg-brand-whatsapp/10 text-brand-whatsapp hover:bg-brand-whatsapp hover:text-white border border-brand-whatsapp/20 transition-all duration-200"
      >
        <WhatsAppIcon />
      </a>

      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Bagikan ke Facebook"
        className="p-2 rounded-xl bg-brand-facebook/10 text-brand-facebook hover:bg-brand-facebook hover:text-white border border-brand-facebook/20 transition-all duration-200"
      >
        <FacebookIcon />
      </a>

      <a
        href={shareLinks.telegram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Bagikan ke Telegram"
        className="p-2 rounded-xl bg-brand-telegram/10 text-brand-telegram hover:bg-brand-telegram hover:text-white border border-brand-telegram/20 transition-all duration-200"
      >
        <TelegramIcon />
      </a>

      <a
        href={shareLinks.x}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Bagikan ke X"
        className="p-2 rounded-xl bg-text-dark/5 text-text-dark hover:bg-text-dark hover:text-white border border-border-fine transition-all duration-200"
      >
        <XIcon />
      </a>

      {canNativeShare && (
        <button
          onClick={onNativeShare}
          type="button"
          aria-label="Bagikan via Menu HP"
          className="p-2 rounded-xl bg-primary-light text-primary hover:bg-primary hover:text-white border border-primary/20 transition-all duration-200 cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
