'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Copy, Check, ExternalLink } from 'lucide-react';

interface SurveyQrModalProps {
  surveyUrl: string;
}

export default function SurveyQrModal({ surveyUrl }: SurveyQrModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (surveyUrl) {
      QRCode.toDataURL(surveyUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0EA5A4', // Brand primary color
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Gagal generate QR Code:', err));
    }
  }, [surveyUrl]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(surveyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'QR-Survei-Klinik-Aisyiyah.png';
    a.click();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-border-fine text-text-dark text-xs font-bold hover:bg-bg-snow hover:border-primary/40 transition-all cursor-pointer shadow-2xs"
      >
        <QrCode className="w-4 h-4 text-primary" />
        <span>Generate QR Code</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-border-fine shadow-xl text-center animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-heading font-extrabold text-lg text-text-dark mb-1">
              QR Code Survei Pasien
            </h3>
            <p className="text-xs text-text-muted mb-6">
              Cetak atau tampilkan QR code ini di meja pendaftaran/kasir agar pasien dapat scan langsung dari smartphone.
            </p>

            <div className="p-4 bg-bg-snow rounded-2xl border border-border-fine inline-block mb-6 shadow-inner">
              {qrDataUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={qrDataUrl}
                  alt="QR Code Survei Kepuasan"
                  className="w-56 h-56 mx-auto rounded-xl"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-text-muted text-xs">
                  Membuat QR Code...
                </div>
              )}
            </div>

            <p className="text-[11px] font-mono text-text-muted truncate bg-bg-snow px-3 py-1.5 rounded-lg border border-border-fine mb-4">
              {surveyUrl}
            </p>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={handleDownloadQr}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh PNG</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-bg-snow border border-border-fine text-text-dark text-xs font-bold hover:bg-white transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin Link'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border-fine">
              <a
                href={surveyUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-primary hover:underline inline-flex items-center gap-1"
              >
                <span>Buka Form</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-text-muted hover:text-text-dark cursor-pointer px-3 py-1"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

