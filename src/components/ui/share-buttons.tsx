'use client';

import React, { useState, useEffect } from 'react';
import {
  type ContentType,
  getShareMetadata,
  generateShareLinks,
  copyUrlToClipboard,
} from './share/share-utils';
import ShareCompactVariant from './share/share-compact-variant';
import ShareSidebarVariant from './share/share-sidebar-variant';
import ShareInlineVariant from './share/share-inline-variant';

export interface ShareButtonsProps {
  title: string;
  url?: string;
  description?: string;
  variant?: 'inline' | 'sidebar' | 'compact';
  contentType?: ContentType;
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
  const [clientUrl, setClientUrl] = useState('');
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    if (!url && typeof window !== 'undefined') {
      const href = window.location.href;
      requestAnimationFrame(() => setClientUrl(href));
    }
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      requestAnimationFrame(() => setCanNativeShare(true));
    }
  }, [url]);

  const effectiveUrl = url || clientUrl;
  const meta = getShareMetadata(title, contentType, description);
  const shareLinks = generateShareLinks(effectiveUrl, meta.defaultShareText, meta.socialTitle);

  const handleCopy = async () => {
    const targetUrl = effectiveUrl || (typeof window !== 'undefined' ? window.location.href : '');
    const success = await copyUrlToClipboard(targetUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (!canNativeShare) return;
    try {
      await navigator.share({
        title,
        text: meta.defaultNativeText,
        url: effectiveUrl,
      });
    } catch {
      // User cancelled share
    }
  };

  if (variant === 'compact') {
    return (
      <ShareCompactVariant
        className={className}
        copied={copied}
        copyLabel={meta.copyLabel}
        onCopy={handleCopy}
        canNativeShare={canNativeShare}
        onNativeShare={handleNativeShare}
        shareLinks={shareLinks}
      />
    );
  }

  if (variant === 'sidebar') {
    return (
      <ShareSidebarVariant
        className={className}
        copied={copied}
        copyLabel={meta.copyLabel}
        onCopy={handleCopy}
        canNativeShare={canNativeShare}
        onNativeShare={handleNativeShare}
        shareLinks={shareLinks}
      />
    );
  }

  return (
    <ShareInlineVariant
      className={className}
      headingTitle={meta.headingTitle}
      headingDesc={meta.headingDesc}
      copied={copied}
      onCopy={handleCopy}
      canNativeShare={canNativeShare}
      onNativeShare={handleNativeShare}
      shareLinks={shareLinks}
    />
  );
}
