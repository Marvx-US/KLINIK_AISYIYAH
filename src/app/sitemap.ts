import { MetadataRoute } from 'next';
import { getPublishedArticles } from '@/core/services/articleService';
import { getPublishedEvents } from '@/core/services/eventService';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Fetch dynamic content
  const articles = await getPublishedArticles().catch(() => []);
  const events = await getPublishedEvents().catch(() => []);

  // Map dynamic routes
  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: article.updatedAt || article.createdAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const eventUrls = events.map((event) => ({
    url: `${baseUrl}/events/${event.slug}`,
    lastModified: event.updatedAt || event.createdAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Map static routes
  const staticRoutes = [
    '',
    '/articles',
    '/events',
    '/facilities',
    '/contact',
    '/login'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.9,
  }));

  return [...staticRoutes, ...articleUrls, ...eventUrls];
}
