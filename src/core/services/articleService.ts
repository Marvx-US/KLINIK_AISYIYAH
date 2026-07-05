/**
 * LAYER 2 - SERVICE
 * Berisi logika bisnis: generate slug, handle upload,
 * lalu memanggil Repository untuk akses database.
 */

import { uploadFile } from '@/lib/upload';
import * as articleRepo from '@/core/repositories/articleRepository';

// Helper: generate slug unik dari judul
function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${base}-${Date.now()}`;
}

export async function createArticle(data: {
  title: string;
  summary: string;
  content: string;
  category: string;
  status: string;
  coverImageFile: File | null;
}) {
  const slug = generateSlug(data.title);
  const coverImage = await uploadFile(data.coverImageFile);

  return articleRepo.createArticle({
    title: data.title,
    slug,
    summary: data.summary,
    content: data.content,
    category: data.category,
    status: data.status,
    coverImage,
  });
}

export async function updateArticle(
  id: number,
  data: {
    title: string;
    summary: string;
    content: string;
    category: string;
    status: string;
    coverImageFile: File | null;
  }
) {
  const existing = await articleRepo.findArticleById(id);
  if (!existing) throw new Error('Artikel tidak ditemukan.');

  let coverImage = existing.coverImage;
  if (data.coverImageFile) {
    const uploaded = await uploadFile(data.coverImageFile);
    if (uploaded) coverImage = uploaded;
  }

  return articleRepo.updateArticle(id, {
    title: data.title,
    summary: data.summary,
    content: data.content,
    category: data.category,
    status: data.status,
    coverImage,
  });
}

export async function deleteArticle(id: number) {
  const existing = await articleRepo.findArticleById(id);
  if (!existing) throw new Error('Artikel tidak ditemukan.');
  return articleRepo.deleteArticle(id);
}

export const getAllArticles = articleRepo.findAllArticles;
export const getPublishedArticles = articleRepo.findPublishedArticles;
export const getArticleBySlug = articleRepo.findArticleBySlug;
