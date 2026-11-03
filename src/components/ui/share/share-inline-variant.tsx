'use client';

import React from 'react';
import { Copy, Check, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WhatsAppIcon, FacebookIcon, XIcon, TelegramIcon } from './share-icons';

interface ShareInlineVariantProps {
  className?: string;
  headingTitle: string;
  headingDesc: string;
  copied: boolean;
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

export default function ShareInlineVariant({
  className = '',
  headingTitle,
  headingDesc,
  copied,
  onCopy,
  canNativeShare,
  onNativeShare,
  shareLinks,
}: ShareInlineVariantProps) {
  return (
    <div className={cn('p-6 sm:p-7 rounded-2xl bg-white border border-border-fine shadow-xs', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-heading font-bold text-text-dark text-base flex items-center gap-2">
            <Share2 className="w-4 h-4 text-primary" />
            {headingTitle}
          </h4>
          <p className="text-xs text-text-muted mt-1">{headingDesc}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <button
            onClick={onCopy}
            type="button"
            className={cn(
              'px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 border transition-all duration-200 cursor-pointer',
              copied
                ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
                : 'bg-bg-snow/60 border-border-fine text-text-dark hover:bg-white hover:border-primary/40 active:scale-[0.98]'
            )}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Link Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-text-muted" />
                <span>Salin Link</span>
              </>
            )}
          </button>

          <a
            href={shareLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Bagikan ke WhatsApp"
            className="p-2.5 rounded-xl bg-brand-whatsapp/10 text-brand-whatsapp hover:bg-brand-whatsapp hover:text-white border border-brand-whatsapp/20 transition-all duration-200"
          >
            <WhatsAppIcon />
          </a>

          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Bagikan ke Facebook"
            className="p-2.5 rounded-xl bg-brand-facebook/10 text-brand-facebook hover:bg-brand-facebook hover:text-white border border-brand-facebook/20 transition-all duration-200"
          >
            <FacebookIcon />
          </a>

          <a
            href={shareLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Bagikan ke Telegram"
            className="p-2.5 rounded-xl bg-brand-telegram/10 text-brand-telegram hover:bg-brand-telegram hover:text-white border border-brand-telegram/20 transition-all duration-200"
          >
            <TelegramIcon />
          </a>

          <a
            href={shareLinks.x}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Bagikan ke X"
            className="p-2.5 rounded-xl bg-text-dark/5 text-text-dark hover:bg-text-dark hover:text-white border border-border-fine transition-all duration-200"
          >
            <XIcon />
          </a>

          {canNativeShare && (
            <button
              onClick={onNativeShare}
              type="button"
              aria-label="Bagikan lewat aplikasi lain"
              className="p-2.5 rounded-xl bg-primary-light text-primary hover:bg-primary hover:text-white border border-primary/20 transition-all duration-200 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
