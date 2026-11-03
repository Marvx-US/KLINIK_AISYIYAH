'use client';

import React from 'react';
import { Copy, Check, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WhatsAppIcon, FacebookIcon, XIcon, TelegramIcon } from './share-icons';

interface ShareSidebarVariantProps {
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

export default function ShareSidebarVariant({
  className = '',
  copied,
  copyLabel,
  onCopy,
  canNativeShare,
  onNativeShare,
  shareLinks,
}: ShareSidebarVariantProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <button
        onClick={onCopy}
        type="button"
        aria-label={copyLabel}
        className={cn(
          'w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all duration-200 cursor-pointer',
          copied
            ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
            : 'bg-white border-border-fine text-text-dark hover:border-primary/50 hover:bg-bg-snow/60 active:scale-[0.99]'
        )}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Link Berhasil Disalin!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 text-text-muted" />
            <span>{copyLabel}</span>
          </>
        )}
      </button>

      <div className="grid grid-cols-4 gap-2">
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          title="Bagikan ke WhatsApp"
          className="flex items-center justify-center py-2.5 px-2 rounded-xl bg-brand-whatsapp/10 text-brand-whatsapp hover:bg-brand-whatsapp hover:text-white border border-brand-whatsapp/20 transition-all duration-200"
        >
          <WhatsAppIcon />
        </a>
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          title="Bagikan ke Facebook"
          className="flex items-center justify-center py-2.5 px-2 rounded-xl bg-brand-facebook/10 text-brand-facebook hover:bg-brand-facebook hover:text-white border border-brand-facebook/20 transition-all duration-200"
        >
          <FacebookIcon />
        </a>
        <a
          href={shareLinks.telegram}
          target="_blank"
          rel="noopener noreferrer"
          title="Bagikan ke Telegram"
          className="flex items-center justify-center py-2.5 px-2 rounded-xl bg-brand-telegram/10 text-brand-telegram hover:bg-brand-telegram hover:text-white border border-brand-telegram/20 transition-all duration-200"
        >
          <TelegramIcon />
        </a>
        <a
          href={shareLinks.x}
          target="_blank"
          rel="noopener noreferrer"
          title="Bagikan ke X"
          className="flex items-center justify-center py-2.5 px-2 rounded-xl bg-text-dark/5 text-text-dark hover:bg-text-dark hover:text-white border border-border-fine transition-all duration-200"
        >
          <XIcon />
        </a>
      </div>

      {canNativeShare && (
        <button
          onClick={onNativeShare}
          type="button"
          className="w-full py-2 px-3 rounded-xl bg-primary-light text-primary hover:bg-primary hover:text-white border border-primary/20 text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Bagikan via Menu HP</span>
        </button>
      )}
    </div>
  );
}
