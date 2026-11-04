'use client';

import React, { useRef, useState, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, Link2, CheckCircle2, Loader2 } from 'lucide-react';
import {
  generateShareLinks,
  copyUrlToClipboard,
} from '@/components/ui/share/share-utils';
import {
  WhatsAppIcon,
  FacebookIcon,
  TelegramIcon,
  XIcon,
} from '@/components/ui/share/share-icons';
import SurveyShareCard from './survey-share-card';
import type { MonthlySurveyStat } from '../types';

interface SurveyShareModalProps {
  stat: MonthlySurveyStat;
  isOpen: boolean;
  onClose: () => void;
  pageUrl: string;
}

function buildIkmShareText(stat: MonthlySurveyStat, pageUrl: string): string {
  return (
    `📊 *Hasil Indeks Kepuasan Masyarakat (IKM)*\n` +
    `🏥 Klinik Pratama Aisyiyah Pangkajene\n` +
    `📅 Periode: ${stat.monthLabel}\n\n` +
    `✅ Nilai IKM: *${stat.ikmScore.toFixed(2)} / 100*\n` +
    `🏆 Mutu: *${stat.ikmGrade} — ${stat.ikmCategory}*\n` +
    `👥 Total Responden: ${stat.totalRespondents} Pasien\n\n` +
    `🔗 Lihat selengkapnya: ${pageUrl}`
  );
}

export default function SurveyShareModal({ stat, isOpen, onClose, pageUrl }: SurveyShareModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [captureError, setCaptureError] = useState<string | null>(null);

  const shareText = buildIkmShareText(stat, pageUrl);
  const socialTitle = `Hasil IKM ${stat.monthLabel} — Klinik Aisyiyah`;
  const shareLinks = generateShareLinks(pageUrl, shareText, socialTitle);

  const captureImage = useCallback(async (): Promise<string | null> => {
    if (!cardRef.current) return null;
    setIsCapturing(true);
    setCaptureError(null);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        cacheBust: true,
      });
      return dataUrl;
    } catch (err) {
      console.error('[SHARE_CARD_CAPTURE_ERROR]:', err);
      setCaptureError('Gagal membuat gambar. Coba lagi.');
      return null;
    } finally {
      setIsCapturing(false);
    }
  }, []);

  const handleDownload = async () => {
    const dataUrl = await captureImage();
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.download = `IKM_KlinikAisyiyah_${stat.monthLabel.replace(/\s/g, '_')}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleNativeShare = async () => {
    const dataUrl = await captureImage();
    if (!dataUrl) return;

    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `IKM_KlinikAisyiyah_${stat.monthKey}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: socialTitle, text: shareText, files: [file] });
      } else {
        await navigator.share({ title: socialTitle, text: shareText, url: pageUrl });
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setCaptureError('Share dibatalkan atau tidak didukung browser ini.');
      }
    }
  };

  const handleCopyLink = async () => {
    const success = await copyUrlToClipboard(pageUrl);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } else {
      setCaptureError('Gagal menyalin tautan.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col"
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-border-fine shrink-0">
                <div>
                  <h3 className="font-heading font-extrabold text-sm text-text-dark">
                    Bagikan Infografis IKM
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    Download atau bagikan kartu hasil survei ke sosial media
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Tutup modal"
                  title="Tutup"
                  className="w-8 h-8 rounded-full bg-bg-snow border border-border-fine flex items-center justify-center hover:bg-gray-100 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4 text-text-muted" />
                </button>
              </div>

              {/* Preview Kartu (Scrollable body) */}
              <div className="p-5 bg-bg-snow flex justify-center overflow-y-auto grow">
                <div style={{ transform: 'scale(0.72)', transformOrigin: 'top center', marginBottom: '-130px' }}>
                  <SurveyShareCard stat={stat} cardRef={cardRef} />
                </div>
              </div>

              {/* Error */}
              {captureError && (
                <div className="mx-5 mb-2 px-4 py-2 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                  {captureError}
                </div>
              )}

              {/* Action Buttons */}
              <div className="p-5 space-y-2.5 border-t border-border-fine bg-white shrink-0">
                {/* Download PNG */}
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isCapturing}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                  {isCapturing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span>{isCapturing ? 'Membuat gambar...' : '💾 Download Gambar (PNG)'}</span>
                </button>

                {/* Native Share (Mobile) */}
                {typeof navigator !== 'undefined' && !!navigator.share && (
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    disabled={isCapturing}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all cursor-pointer disabled:opacity-60"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>📤 Bagikan Gambar ke Aplikasi (HP)</span>
                  </button>
                )}

                {/* WhatsApp Link Share */}
                <a
                  href={shareLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-[#25D366] text-white text-sm font-bold hover:bg-[#20ba59] transition-all cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-current" />
                  <span>💬 Bagikan via WhatsApp</span>
                </a>

                {/* Other Social Media + Copy Link Bar */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl bg-bg-snow border border-border-fine text-xs font-bold text-text-dark hover:bg-gray-100 transition-all cursor-pointer"
                  >
                    {isCopied ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Link2 className="w-3.5 h-3.5 text-text-muted" />
                    )}
                    <span className={isCopied ? 'text-emerald-700' : ''}>
                      {isCopied ? 'Tautan berhasil disalin!' : 'Salin Tautan'}
                    </span>
                  </button>

                  <a
                    href={shareLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Bagikan ke Facebook"
                    title="Facebook"
                    className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/60 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center"
                  >
                    <FacebookIcon className="w-4 h-4 fill-current" />
                  </a>

                  <a
                    href={shareLinks.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Bagikan ke Telegram"
                    title="Telegram"
                    className="p-2.5 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200/60 hover:bg-sky-600 hover:text-white transition-all flex items-center justify-center"
                  >
                    <TelegramIcon className="w-4 h-4 fill-current" />
                  </a>

                  <a
                    href={shareLinks.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Bagikan ke X"
                    title="X"
                    className="p-2.5 rounded-2xl bg-zinc-100 text-zinc-800 border border-border-fine hover:bg-zinc-800 hover:text-white transition-all flex items-center justify-center"
                  >
                    <XIcon className="w-3.5 h-3.5 fill-current" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
