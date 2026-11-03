import 'server-only';
import { db } from '@/lib/db';

/**
 * DATA ACCESS LAYER (READ) — Modul Artikel
 * Sesuai Bab 6.1 HANDBOOK_CLEANCODE.md
 * Wajib `server-only` agar tidak pernah terbundel ke sisi client.
 */

export async function getArticleCount(): Promise<number> {
  return db.article.count();
}

export async function getLatestArticles(take: number) {
  return db.article.findMany({
    orderBy: { createdAt: 'desc' },
    take,
  });
}

export async function getArticles(limit = 100) {
  const safeLimit = Math.max(1, Math.min(limit, 100));
  return db.article.findMany({
    orderBy: { createdAt: 'desc' },
    take: safeLimit,
  });
}

interface PublishedArticleFilter {
  search?: string;
  category?: string;
  take?: number;
  skip?: number;
}

export async function getPublishedArticles({
  search = '',
  category = '',
  take = 50,
  skip = 0,
}: PublishedArticleFilter = {}) {
  const safeTake = Math.min(Math.max(1, take), 100);
  const where = {
    status: 'PUBLISHED',
    ...(category && category !== 'Semua' ? { category } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search } },
            { summary: { contains: search } },
          ],
        }
      : {}),
  };

  return db.article.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: safeTake,
    skip,
  });
}

export async function getArticleBySlug(slug: string) {
  return db.article.findUnique({ where: { slug } });
}

export async function getArticleById(id: number) {
  return db.article.findUnique({ where: { id } });
}
