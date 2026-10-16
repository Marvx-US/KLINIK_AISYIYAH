'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';

export interface ShareButtonsProps {
  title: string;
  url?: string;
  description?: string;
  variant?: 'inline' | 'sidebar' | 'compact';
  contentType?: 'article' | 'event' | 'general';
  className?: string;
}

export default function ShareButtons({
  title,
  url,
  description,
  variant = 'inline',
  contentType = 'event',
  className = '',
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(url || '');
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    if (!url && typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    } else if (url) {
      setCurrentUrl(url);
    }

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setCanNativeShare(true);
    }
  }, [url]);

  const isArticle = contentType === 'article';
  const isEvent = contentType === 'event';

  const copyLabel = isArticle
    ? 'Salin Link Artikel'
    : isEvent
      ? 'Salin Link Kegiatan'
      : 'Salin Link';

  const defaultShareText = isArticle
    ? `Halo! Simak artikel kesehatan "${title}" dari Klinik Aisyiyah.\nInformasi selengkapnya dapat dibaca di:`
    : `Halo! Ikuti kegiatan "${title}" di Klinik Aisyiyah.\nInformasi lengkapnya dapat dilihat di:`;

  const defaultNativeText =
    description ||
    (isArticle
      ? `Baca artikel "${title}" di Klinik Aisyiyah`
      : `Ikuti kegiatan ${title} di Klinik Aisyiyah`);

  const socialTitle = isArticle
    ? `Artikel "${title}" di Klinik Aisyiyah`
    : `Kegiatan "${title}" di Klinik Aisyiyah`;

  const headingTitle = isArticle
    ? 'Bagikan Artikel Ini'
    : isEvent
      ? 'Bagikan Informasi Kegiatan Ini'
      : 'Bagikan Informasi Ini';

  const headingDesc = isArticle
    ? 'Bantu sebarkan informasi dan tips kesehatan bermanfaat ini kepada keluarga dan teman terdekat.'
    : 'Bantu sebarkan agenda dan kegiatan bermanfaat ini kepada keluarga dan teman terdekat.';

  const handleCopy = async () => {
    const targetUrl = currentUrl || (typeof window !== 'undefined' ? window.location.href : '');
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(targetUrl);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = targetUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Gagal menyalin link:', err);
    }
  };

  const handleNativeShare = async () => {
    if (!canNativeShare) return;
    try {
      await navigator.share({
        title,
        text: defaultNativeText,
        url: currentUrl,
      });
    } catch {
      // User cancelled or share failed, no error needed
    }
  };

  const encodedText = encodeURIComponent(defaultShareText);
  const encodedUrl = encodeURIComponent(currentUrl);

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(socialTitle)}&url=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(socialTitle)}`,
  };

  // SVGs for clean branded social icons
  const WhatsAppIcon = () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );

  const FacebookIcon = () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );

  const XIcon = () => (
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );

  const TelegramIcon = () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.536-.196 1.006.128.832.922z" />
    </svg>
  );

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        {/* Tombol Salin Link */}
        <button
          onClick={handleCopy}
          type="button"
          aria-label={copyLabel}
          title={copied ? 'Link Tersalin!' : copyLabel}
          className={`p-2 rounded-xl text-xs font-bold inline-flex items-center justify-center border transition-all duration-200 cursor-pointer ${
            copied
              ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
              : 'bg-white border-border-fine text-text-muted hover:text-primary hover:border-primary/40 active:scale-95'
          }`}
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>

        {/* WhatsApp */}
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Bagikan ke WhatsApp"
          title="Bagikan ke WhatsApp"
          className="p-2 rounded-xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white border border-[#25D366]/20 transition-all duration-200"
        >
          <WhatsAppIcon />
        </a>

        {/* Facebook */}
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Bagikan ke Facebook"
          title="Bagikan ke Facebook"
          className="p-2 rounded-xl bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white border border-[#1877F2]/20 transition-all duration-200"
        >
          <FacebookIcon />
        </a>

        {/* Telegram */}
        <a
          href={shareLinks.telegram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Bagikan ke Telegram"
          title="Bagikan ke Telegram"
          className="p-2 rounded-xl bg-[#229ED9]/10 text-[#229ED9] hover:bg-[#229ED9] hover:text-white border border-[#229ED9]/20 transition-all duration-200"
        >
          <TelegramIcon />
        </a>

        {/* X (Twitter) */}
        <a
          href={shareLinks.x}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Bagikan ke X"
          title="Bagikan ke X"
          className="p-2 rounded-xl bg-text-dark/5 text-text-dark hover:bg-text-dark hover:text-white border border-border-fine transition-all duration-200"
        >
          <XIcon />
        </a>

        {/* Web Share (HP) */}
        {canNativeShare && (
          <button
            onClick={handleNativeShare}
            type="button"
            aria-label="Bagikan via Menu HP"
            title="Bagikan via Menu HP"
            className="p-2 rounded-xl bg-primary-light text-primary hover:bg-primary hover:text-white border border-primary/20 transition-all duration-200 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className={`flex flex-col gap-3 ${className}`}>
        {/* Tombol Salin Link */}
        <button
          onClick={handleCopy}
          type="button"
          aria-label={copyLabel}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all duration-200 cursor-pointer ${
            copied
              ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
              : 'bg-white border-border-fine text-text-dark hover:border-primary/50 hover:bg-bg-snow/60 active:scale-[0.99]'
          }`}
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

        {/* Baris Tombol Media Sosial */}
        <div className="grid grid-cols-4 gap-2">
          {/* WhatsApp */}
          <a
            href={shareLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            title="Bagikan ke WhatsApp"
            className="flex items-center justify-center py-2.5 px-2 rounded-xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white border border-[#25D366]/20 transition-all duration-200"
          >
            <WhatsAppIcon />
          </a>

          {/* Facebook */}
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            title="Bagikan ke Facebook"
            className="flex items-center justify-center py-2.5 px-2 rounded-xl bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white border border-[#1877F2]/20 transition-all duration-200"
          >
            <FacebookIcon />
          </a>

          {/* Telegram */}
          <a
            href={shareLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            title="Bagikan ke Telegram"
            className="flex items-center justify-center py-2.5 px-2 rounded-xl bg-[#229ED9]/10 text-[#229ED9] hover:bg-[#229ED9] hover:text-white border border-[#229ED9]/20 transition-all duration-200"
          >
            <TelegramIcon />
          </a>

          {/* X (Twitter) */}
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

        {/* Mobile Native Share Button if supported */}
        {canNativeShare && (
          <button
            onClick={handleNativeShare}
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

  // Default 'inline' variant (for bottom of article/content)
  return (
    <div className={`p-6 sm:p-7 rounded-2xl bg-white border border-border-fine shadow-xs ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-heading font-bold text-text-dark text-base flex items-center gap-2">
            <Share2 className="w-4 h-4 text-primary" />
            {headingTitle}
          </h4>
          <p className="text-xs text-text-muted mt-1">
            {headingDesc}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Tombol Salin Link */}
          <button
            onClick={handleCopy}
            type="button"
            className={`px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 border transition-all duration-200 cursor-pointer ${
              copied
                ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
                : 'bg-bg-snow/60 border-border-fine text-text-dark hover:bg-white hover:border-primary/40 active:scale-[0.98]'
            }`}
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

          {/* WhatsApp */}
          <a
            href={shareLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Bagikan ke WhatsApp"
            className="p-2.5 rounded-xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white border border-[#25D366]/20 transition-all duration-200"
          >
            <WhatsAppIcon />
          </a>

          {/* Facebook */}
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Bagikan ke Facebook"
            className="p-2.5 rounded-xl bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white border border-[#1877F2]/20 transition-all duration-200"
          >
            <FacebookIcon />
          </a>

          {/* Telegram */}
          <a
            href={shareLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Bagikan ke Telegram"
            className="p-2.5 rounded-xl bg-[#229ED9]/10 text-[#229ED9] hover:bg-[#229ED9] hover:text-white border border-[#229ED9]/20 transition-all duration-200"
          >
            <TelegramIcon />
          </a>

          {/* X (Twitter) */}
          <a
            href={shareLinks.x}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Bagikan ke X"
            className="p-2.5 rounded-xl bg-text-dark/5 text-text-dark hover:bg-text-dark hover:text-white border border-border-fine transition-all duration-200"
          >
            <XIcon />
          </a>

          {/* Web Share (HP) */}
          {canNativeShare && (
            <button
              onClick={handleNativeShare}
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
