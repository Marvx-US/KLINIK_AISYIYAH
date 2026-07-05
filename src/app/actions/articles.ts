'use server';

/**
 * LAYER 3 - ACTION (Controller)
 * Tanggung jawab: Autentikasi, validasi input, lalu panggil Service.
 * TIDAK BOLEH ada logika bisnis atau akses database langsung di sini.
 */

import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { ARTICLE_CATEGORIES } from '@/lib/constants';
import { z, parseForm } from '@/lib/validations';
import * as articleService from '@/core/services/articleService';

export type ActionResult = { success?: boolean; error?: string };

export async function saveArticleAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Sesi habis. Silakan login kembali.' };

  const validation = parseForm(() => {
    const id = formData.get('id') as string | null;
    return {
      id: id ? z.number(id, 'ID Artikel') : null,
      title: z.maxLength(z.string(formData.get('title'), 'Judul Artikel'), 200, 'Judul Artikel'),
      summary: z.maxLength(z.string(formData.get('summary'), 'Ringkasan'), 500, 'Ringkasan'),
      content: z.maxLength(z.string(formData.get('content'), 'Isi Artikel'), 100_000, 'Isi Artikel'),
      category: z.enum(formData.get('category'), ARTICLE_CATEGORIES as unknown as readonly string[], 'Kategori'),
      status: z.enum(formData.get('status'), ['PUBLISHED', 'DRAFT'] as const, 'Status', 'DRAFT'),
      coverImageFile: z.file(formData.get('coverImage'), 'Gambar Cover', false),
    };
  });

  if (!validation.success) return { error: validation.error };

  const { id, title, summary, content, category, status, coverImageFile } = validation.data;

  try {
    if (id !== null) {
      await articleService.updateArticle(id, { title, summary, content, category, status, coverImageFile });
    } else {
      await articleService.createArticle({ title, summary, content, category, status, coverImageFile });
    }
    revalidatePath('/admin/articles');
    revalidatePath('/articles');
    revalidatePath('/');
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Gagal menyimpan artikel.';
    return { error: msg };
  }
}

export async function deleteArticleAction(id: number): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Sesi habis. Silakan login kembali.' };
  if (!id || isNaN(id) || id <= 0) return { error: 'ID artikel tidak valid.' };

  try {
    await articleService.deleteArticle(id);
    revalidatePath('/admin/articles');
    revalidatePath('/articles');
    revalidatePath('/');
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Gagal menghapus artikel.';
    return { error: msg };
  }
}
