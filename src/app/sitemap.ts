import { MetadataRoute } from 'next';
import { getPublishedArticles } from '@/core/services/articleService';
import { getPublishedEvents } from '@/core/services/eventService';
import { getActiveServices } from '@/core/services/serviceService';

// ISR: regenerasi sitemap setiap 1 jam agar konten terbaru selalu terindex
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const defaultSiteUrl = 'https://www.klinikaisyiyahpangkajene.marvx.my.id';
  const rawUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  const baseUrl = (rawUrl && !rawUrl.includes('localhost') ? rawUrl : defaultSiteUrl)
    .toLowerCase()
    .replace(/\/+$/, '');

  // Rute statis — selalu ada, tidak bergantung database
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`,          lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${baseUrl}/articles`, lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8 },
    { url: `${baseUrl}/events`,   lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8 },
    { url: `${baseUrl}/contact`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  try {
    // Fetch konten dinamis secara paralel — masing-masing punya fallback sendiri
    const [articles, events, services] = await Promise.all([
      getPublishedArticles().catch(() => []),
      getPublishedEvents().catch(() => []),
      getActiveServices().catch(() => []),
    ]);

    const serviceUrls: MetadataRoute.Sitemap = (services as any[]).map((service: any) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: service.updatedAt || service.createdAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

    const articleUrls: MetadataRoute.Sitemap = articles.map((article) => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: article.updatedAt || article.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    const eventUrls: MetadataRoute.Sitemap = events.map((event) => ({
      url: `${baseUrl}/events/${event.slug}`,
      lastModified: event.updatedAt || event.createdAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...staticRoutes, ...serviceUrls, ...articleUrls, ...eventUrls];
  } catch (error) {
    // Jika terjadi error tak terduga, kembalikan rute statis saja.
    // Ini mencegah Google mendapat error 500 dan sitemap tetap valid.
    console.error('[SITEMAP ERROR] Gagal memuat data dinamis, mengembalikan rute statis:', error);
    return staticRoutes;
  }
}
