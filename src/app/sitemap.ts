import { MetadataRoute } from 'next';
import { env } from '@/lib/env';
import { getPublishedArticles } from '@/features/articles/queries/article-queries';
import { getPublishedEvents } from '@/features/events/queries/event-queries';
import { getActiveServices } from '@/features/services/queries/service-queries';

// ISR: regenerasi sitemap setiap 1 jam agar konten terbaru selalu terindex
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const defaultSiteUrl = 'https://www.klinikaisyiyahpangkajene.marvx.my.id';
  const rawUrl = env.NEXT_PUBLIC_APP_URL?.trim();
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

    const serviceUrls: MetadataRoute.Sitemap = services.map((service) => ({
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
    console.error('[SITEMAP ERROR] Gagal memuat data dinamis, mengembalikan rute statis:', error);
    return staticRoutes;
  }
}
