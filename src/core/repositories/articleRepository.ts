/**
 * LAYER 1 - REPOSITORY
 * Hanya berisi operasi database mentah (CRUD).
 * Tidak ada validasi, tidak ada logika bisnis.
 */

import { db } from '@/lib/db';

export async function findAllArticles() {
  return db.article.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function findPublishedArticles() {
  return db.article.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
  });
}

export async function findArticleById(id: number) {
  return db.article.findUnique({ where: { id } });
}

export async function findArticleBySlug(slug: string) {
  return db.article.findUnique({ where: { slug } });
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
