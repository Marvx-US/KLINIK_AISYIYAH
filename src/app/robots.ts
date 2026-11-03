import { MetadataRoute } from 'next';
import { env } from '@/lib/env';

export default function robots(): MetadataRoute.Robots {
  const defaultSiteUrl = 'https://www.klinikaisyiyahpangkajene.marvx.my.id';
  const rawUrl = env.NEXT_PUBLIC_APP_URL?.trim();
  const baseUrl = (rawUrl && !rawUrl.includes('localhost') ? rawUrl : defaultSiteUrl).toLowerCase().replace(/\/+$/, '');

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admin/*', '/login', '/api/*'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

