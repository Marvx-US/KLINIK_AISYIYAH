import { MetadataRoute } from 'next';
import { getPublishedArticles } from '@/core/services/articleService';
import { getPublishedEvents } from '@/core/services/eventService';
import { getActiveServices } from '@/core/services/serviceService';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const defaultSiteUrl = 'https://www.klinikaisyiyahpangkajene.marvx.my.id';
  const rawUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  const baseUrl = rawUrl && !rawUrl.includes('localhost') ? rawUrl : defaultSiteUrl;

  // Fetch dynamic content
  const [articles, events, services] = await Promise.all([
    getPublishedArticles().catch(() => []),
    getPublishedEvents().catch(() => []),
    getActiveServices().catch(() => []),
  ]);

  // Map dynamic services routes
  const serviceUrls = (services as any[]).map((service: any) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: service.updatedAt || service.createdAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));


  // Map dynamic articles routes
  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: article.updatedAt || article.createdAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Map dynamic events routes
  const eventUrls = events.map((event) => ({
    url: `${baseUrl}/events/${event.slug}`,
    lastModified: event.updatedAt || event.createdAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Map static public routes
  const staticRoutes = [
    { route: '', priority: 1.0, freq: 'daily' as const },
    { route: '/services', priority: 0.9, freq: 'daily' as const },
    { route: '/articles', priority: 0.8, freq: 'daily' as const },
    { route: '/events', priority: 0.8, freq: 'daily' as const },
    { route: '/contact', priority: 0.8, freq: 'monthly' as const },
  ].map((item) => ({
    url: `${baseUrl}${item.route}`,
    lastModified: new Date(),
    changeFrequency: item.freq,
    priority: item.priority,
  }));

  return [...staticRoutes, ...serviceUrls, ...articleUrls, ...eventUrls];
}

