'use server';

/**
 * SERVER ACTION (WRITE) — Simpan/Perbarui Artikel
 * Mengikuti Template 5 Langkah Aman Bab 6.3 HANDBOOK_CLEANCODE.md
 */

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { uploadFile } from '@/lib/upload';
import { db } from '@/lib/db';
import { ArticleSchema } from '../schemas/article-schema';
import { getArticleById } from '../queries/article-queries';
import { ActionResponse } from '@/types';
import { CONTENT_STATUS, USER_ROLE } from '@/lib/constants';

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${base}-${Date.now()}`;
}

export async function saveArticle(
  prevState: unknown,
  formData: FormData
): Promise<ActionResponse<{ id: number }>> {
  // 1. CEK AUTENTIKASI & HAK AKSES (RBAC)
  const session = await getSession();
  if (!session || session.role !== USER_ROLE.ADMIN) {
    const errorMsg = 'Akses ditolak. Sesi habis atau akun tidak berwenang.';
    return {
      success: false,
      message: errorMsg,
      error: errorMsg,
    };
  }

  // 2. VALIDASI INPUT DENGAN ZOD
  const rawId = formData.get('id');
  const rawData = {
    id: rawId ? Number(rawId) : null,
    title: formData.get('title'),
    summary: formData.get('summary'),
    content: formData.get('content'),
    category: formData.get('category'),
    status: formData.get('status') || CONTENT_STATUS.DRAFT,
  };

  const parsed = ArticleSchema.safeParse(rawData);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstErrorMessage = Object.values(fieldErrors)[0]?.[0] || 'Data form tidak valid.';
    return {
      success: false,
      message: firstErrorMessage,
      error: firstErrorMessage,
      fieldErrors,
    };
  }

  const { id, title, summary, content, category, status } = parsed.data;
  const coverImageFile = formData.get('coverImage') as File | null;

  // Validasi file gambar cover bila diunggah
  if (coverImageFile && coverImageFile.size > 0) {
    if (!coverImageFile.type.startsWith('image/')) {
      const errorMsg = 'File cover yang diunggah harus berupa gambar.';
      return {
        success: false,
        message: errorMsg,
        error: errorMsg,
      };
    }
    if (coverImageFile.size > 5 * 1024 * 1024) {
      const errorMsg = 'Ukuran gambar tidak boleh melebihi 5 MB.';
      return {
        success: false,
        message: errorMsg,
        error: errorMsg,
      };
    }
  }

  try {
    // 3. CEK ATURAN BISNIS & 4. EKSEKUSI DATABASE
    let savedArticleId: number;

    if (id) {
      const existing = await getArticleById(id);
      if (!existing) {
        const errorMsg = 'Artikel tidak ditemukan untuk diperbarui.';
        return {
          success: false,
          message: errorMsg,
          error: errorMsg,
        };
      }

      let coverImage = existing.coverImage;
      if (coverImageFile && coverImageFile.size > 0) {
        const uploaded = await uploadFile(coverImageFile);
        if (uploaded) coverImage = uploaded;
      }

      const updated = await db.article.update({
        where: { id },
        data: {
          title,
          summary,
          content,
          category,
          status,
          coverImage,
        },
      });
      savedArticleId = updated.id;
    } else {
      let coverImage: string | null = null;
      if (coverImageFile && coverImageFile.size > 0) {
        coverImage = await uploadFile(coverImageFile);
      }

      const slug = generateSlug(title);
      const created = await db.article.create({
        data: {
          title,
          slug,
          summary,
          content,
          category,
          status,
          coverImage,
        },
      });
      savedArticleId = created.id;
    }

    // 5. REVALIDATE CACHE HALAMAN & KEMBALIKAN RESPONSE STANDAR
    revalidatePath('/admin/articles');
    revalidatePath('/articles');
    revalidatePath('/articles/[slug]', 'page');
    revalidatePath('/');

    return {
      success: true,
      message: id ? 'Artikel berhasil diperbarui.' : 'Artikel baru berhasil disimpan.',
      data: { id: savedArticleId },
    };
  } catch (error) {
    console.error('[SAVE_ARTICLE_ERROR]:', error);
    const msg = error instanceof Error ? error.message : 'Terjadi kesalahan pada server saat menyimpan artikel.';
    return {
      success: false,
      message: msg,
      error: msg,
    };
  }
}
