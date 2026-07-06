/**
 * LAYER 1 - REPOSITORY
 * Hanya berisi operasi database mentah (CRUD).
 * Tidak ada validasi, tidak ada logika bisnis.
 */

import { db } from '@/lib/db';
import { unstable_cache } from 'next/cache';

export const findAllArticles = unstable_cache(
  async () => db.article.findMany({ orderBy: { createdAt: 'desc' } }),
  ['articles-all'],
  { revalidate: 60, tags: ['articles'] }
);

export const findPublishedArticles = unstable_cache(
  async () =>
    db.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
    }),
  ['articles-published'],
  { revalidate: 60, tags: ['articles'] }
);

export const findArticleBySlug = unstable_cache(
  async (slug: string) => db.article.findUnique({ where: { slug } }),
  ['article-by-slug'],
  { revalidate: 60, tags: ['articles'] }
);


// Fungsi WRITE — tidak di-cache
export async function findArticleById(id: number) {
  return db.article.findUnique({ where: { id } });
}


export async function createArticle(data: {
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  status: string;
  coverImage: string | null;
}) {
  return db.article.create({ data });
}

export async function updateArticle(
  id: number,
  data: {
    title?: string;
    summary?: string;
    content?: string;
    category?: string;
    status?: string;
    coverImage?: string | null;
  }
) {
  return db.article.update({ where: { id }, data });
}

export async function deleteArticle(id: number) {
  return db.article.delete({ where: { id } });
}
