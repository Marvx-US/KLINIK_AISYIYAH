'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Share2, Copy, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WhatsAppIcon, FacebookIcon, XIcon, TelegramIcon } from './share/share-icons';
import {
  generateScheduleShareLinks,
  generateScheduleShareText,
  type ScheduleShareParams,
} from './share/share-utils';

interface ScheduleShareButtonProps {
  poli: string;
  doctorName: string;
  scheduleInfo: string;
  /** URL halaman detail layanan yang relevan (opsional). */
  serviceUrl?: string;
  /** Tampilan tombol pemicu share. Default: 'icon-only'. */
  triggerVariant?: 'icon-only' | 'icon-text';
  className?: string;
}

/**
 * Tombol share jadwal dokter yang menampilkan popover berisi
 * shortcut WhatsApp, Facebook, Telegram, X, dan Salin Teks.
 *
 * WHY popover (bukan redirect langsung):
 * Admin perlu memilih platform mana yang ingin digunakan,
 * dan tombol "Salin Teks" memudahkan copy-paste ke story/caption IG
 * yang tidak bisa di-share via URL scheme.
 */
export default function ScheduleShareButton({
  poli,
  doctorName,
  scheduleInfo,
  serviceUrl,
  triggerVariant = 'icon-only',
  className = '',
}: ScheduleShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const params: ScheduleShareParams = { poli, doctorName, scheduleInfo, serviceUrl };
  const links = generateScheduleShareLinks(params);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      requestAnimationFrame(() => setCanNativeShare(true));
    }
  }, []);

  // Tutup popover saat klik di luar
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleCopyText = async () => {
    const text = generateScheduleShareText(params);
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-999999px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Gagal menyalin teks jadwal:', err);
    }
  };

  const handleNativeShare = async () => {
    if (!canNativeShare) return;
    try {
      await navigator.share({
        title: `Jadwal Praktek ${poli} – Klinik Aisyiyah`,
        text: generateScheduleShareText(params),
        url: serviceUrl,
      });
    } catch {
      // User membatalkan share — abaikan error
    }
    setIsOpen(false);
  };

  return (
    <div className={cn('relative inline-flex', className)} ref={popoverRef}>
      {/* Tombol Pemicu */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Bagikan jadwal ${poli}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={cn(
          'inline-flex items-center gap-1.5 rounded-xl border transition-all duration-200 cursor-pointer',
          'text-primary border-primary/20 bg-primary/5 hover:bg-primary hover:text-white hover:border-primary active:scale-[0.97]',
          triggerVariant === 'icon-only' ? 'p-2' : 'px-3 py-2 text-xs font-bold'
        )}
      >
        <Share2 className="w-3.5 h-3.5" />
        {triggerVariant === 'icon-text' && <span>Bagikan</span>}
      </button>

      {/* Popover Panel Share */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={`Pilihan share jadwal ${poli}`}
          className={cn(
            'absolute z-50 bottom-full mb-2 right-0',
            'w-64 bg-white rounded-2xl border border-border-fine shadow-lg',
            'animate-in fade-in slide-in-from-bottom-2 duration-150'
          )}
        >
          {/* Header Popover */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <div>
              <p className="text-xs font-extrabold text-text-dark flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-primary" />
                Bagikan Jadwal
              </p>
              <p className="text-[10px] text-text-muted mt-0.5 leading-tight">
                {poli} · {doctorName}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Tutup panel share"
              className="p-1 rounded-lg text-text-muted hover:bg-bg-snow hover:text-text-dark transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-px bg-border-fine mx-4" />

          {/* Grid Tombol Platform */}
          <div className="p-3 grid grid-cols-4 gap-2">
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              aria-label="Bagikan jadwal ke WhatsApp"
              className="flex flex-col items-center gap-1 p-2 rounded-xl bg-brand-whatsapp/10 text-brand-whatsapp hover:bg-brand-whatsapp hover:text-white border border-brand-whatsapp/20 transition-all duration-200"
            >
              <WhatsAppIcon />
              <span className="text-[9px] font-bold">WA</span>
            </a>

            <a
              href={links.facebook}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              aria-label="Bagikan jadwal ke Facebook"
              className="flex flex-col items-center gap-1 p-2 rounded-xl bg-brand-facebook/10 text-brand-facebook hover:bg-brand-facebook hover:text-white border border-brand-facebook/20 transition-all duration-200"
            >
              <FacebookIcon />
              <span className="text-[9px] font-bold">FB</span>
            </a>

            <a
              href={links.telegram}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              aria-label="Bagikan jadwal ke Telegram"
              className="flex flex-col items-center gap-1 p-2 rounded-xl bg-brand-telegram/10 text-brand-telegram hover:bg-brand-telegram hover:text-white border border-brand-telegram/20 transition-all duration-200"
            >
              <TelegramIcon />
              <span className="text-[9px] font-bold">TG</span>
            </a>

            <a
              href={links.x}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              aria-label="Bagikan jadwal ke X"
              className="flex flex-col items-center gap-1 p-2 rounded-xl bg-text-dark/5 text-text-dark hover:bg-text-dark hover:text-white border border-border-fine transition-all duration-200"
            >
              <XIcon />
              <span className="text-[9px] font-bold">X</span>
            </a>
          </div>

          {/* Baris Bawah: Salin Teks + Native Share */}
          <div className="px-3 pb-3 flex gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className={cn(
                'flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-[10px] font-bold border transition-all duration-200 cursor-pointer',
                copied
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                  : 'bg-bg-snow border-border-fine text-text-dark hover:bg-white hover:border-primary/40'
              )}
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  Tersalin!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-text-muted" />
                  Salin Teks
                </>
              )}
            </button>

            {canNativeShare && (
              <button
                type="button"
                onClick={handleNativeShare}
                aria-label="Bagikan jadwal lewat aplikasi lain"
                className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-[10px] font-bold border border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer"
              >
                <Share2 className="w-3 h-3" />
                Lainnya
              </button>
            )}
          </div>

          {/* Preview teks (tooltip info) */}
          <div className="mx-3 mb-3 p-2.5 bg-bg-snow rounded-xl border border-border-fine">
            <p className="text-[9px] text-text-muted font-semibold leading-relaxed line-clamp-3 whitespace-pre-line">
              {`📋 Jadwal Praktek Dokter\n🩺 ${poli} · 👨‍⚕️ ${doctorName}\n⏰ ${scheduleInfo}`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

