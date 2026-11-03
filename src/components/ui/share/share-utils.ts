export type ContentType = 'article' | 'event' | 'general' | 'schedule';

export interface ShareContentMetadata {
  copyLabel: string;
  defaultShareText: string;
  defaultNativeText: string;
  socialTitle: string;
  headingTitle: string;
  headingDesc: string;
}

export function getShareMetadata(
  title: string,
  contentType: ContentType,
  description?: string
): ShareContentMetadata {
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

  return {
    copyLabel,
    defaultShareText,
    defaultNativeText,
    socialTitle,
    headingTitle,
    headingDesc,
  };
}

// ============================================================
// HELPER KHUSUS SHARE JADWAL DOKTER
// Menghasilkan teks pesan siap kirim ke WhatsApp / medsos
// ============================================================

export interface ScheduleShareParams {
  poli: string;
  doctorName: string;
  scheduleInfo: string;
  serviceUrl?: string; // URL halaman detail layanan (opsional)
}

/**
 * Membentuk teks pesan otomatis untuk berbagi jadwal dokter
 * ke WhatsApp, Telegram, dan platform lain.
 * Format: pesan alami seperti yang akan ditulis admin secara manual.
 */
export function generateScheduleShareText({
  poli,
  doctorName,
  scheduleInfo,
  serviceUrl,
}: ScheduleShareParams): string {
  const lines = [
    `📋 *Jadwal Praktek Dokter*`,
    `🏥 *Klinik Pratama Aisyiyah Pangkajene*`,
    ``,
    `🩺 *Poli / Layanan:* ${poli}`,
    `👨‍⚕️ *Dokter:* ${doctorName}`,
    `⏰ *Jadwal:* ${scheduleInfo}`,
    ``,
    `Untuk informasi dan pendaftaran:`,
    `📞 0878-3117-7100`,
  ];

  if (serviceUrl) {
    lines.push(`🔗 ${serviceUrl}`);
  }

  lines.push(``, `_Klinik Pratama Aisyiyah – Melayani dengan Amanah_`);

  return lines.join('\n');
}

/**
 * Menghasilkan semua link share untuk jadwal dokter.
 */
export function generateScheduleShareLinks(params: ScheduleShareParams) {
  const shareText = generateScheduleShareText(params);
  const encodedText = encodeURIComponent(shareText);

  const socialTitle = `Jadwal Praktek ${params.poli} – Klinik Aisyiyah`;
  const encodedTitle = encodeURIComponent(socialTitle);
  const encodedUrl = params.serviceUrl ? encodeURIComponent(params.serviceUrl) : '';

  return {
    whatsapp: `https://api.whatsapp.com/send?text=${encodedText}${encodedUrl ? `%20${encodedUrl}` : ''}`,
    facebook: encodedUrl
      ? `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
      : `https://www.facebook.com/sharer/sharer.php?quote=${encodedTitle}`,
    telegram: encodedUrl
      ? `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
      : `https://t.me/share/url?url=${encodeURIComponent('https://klinik-aisyiyah.com')}&text=${encodeURIComponent(shareText)}`,
    x: `https://twitter.com/intent/tweet?text=${encodedTitle}${encodedUrl ? `&url=${encodedUrl}` : ''}`,
    rawText: shareText, // Untuk salin ke clipboard
  };
}

export function generateShareLinks(
  currentUrl: string,
  shareText: string,
  socialTitle: string
) {
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(currentUrl);

  return {
    whatsapp: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(socialTitle)}&url=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(socialTitle)}`,
  };
}

export async function copyUrlToClipboard(url: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url);
      return true;
    }
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
    return true;
  } catch (err) {
    console.error('Gagal menyalin link:', err);
    return false;
  }
}
