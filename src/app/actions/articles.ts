'use server';

import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { ARTICLE_CATEGORIES } from '@/lib/constants';
import { uploadFile } from '@/lib/upload';
import { z, parseForm } from '@/lib/validations';

export type ActionResult = { success?: boolean; error?: string };

// Helper: generate slug unik dari judul
function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  const suffix = Math.floor(Math.random() * 10000);
  return `${base}-${suffix}`;
}

export async function saveArticleAction(prevState: ActionResult | null, formData: FormData): Promise<ActionResult> {
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

  if (!validation.success) {
    return { error: validation.error };
  }

  const { id, title, summary, content, category, status, coverImageFile } = validation.data;

  try {
    if (id !== null) {
      // UPDATE
      const existing = await db.article.findUnique({ where: { id } });
      if (!existing) return { error: 'Artikel tidak ditemukan.' };

      let coverImageUrl = existing.coverImage;
      if (coverImageFile) {
        const uploaded = await uploadFile(coverImageFile);
        if (uploaded) coverImageUrl = uploaded;
      }

      await db.article.update({
        where: { id },
        data: {
          title,
          summary,
          content,
          category,
          status,
          coverImage: coverImageUrl,
        },
      });
    } else {
      // CREATE
      const slug = generateSlug(title);
      const coverImageUrl = await uploadFile(coverImageFile);

      await db.article.create({
        data: {
          title,
          slug,
          summary,
          content,
          category,
          status,
          coverImage: coverImageUrl,
        },
      });
    }

    revalidatePath('/admin/articles');
    revalidatePath('/articles');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Save article error:', error);
    return { error: 'Gagal menyimpan artikel. Pastikan koneksi database aktif.' };
  }
}

export async function deleteArticleAction(id: number): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Sesi habis. Silakan login kembali.' };

  try {
    if (!id || isNaN(id) || id <= 0) return { error: 'ID artikel tidak valid.' };

    const existing = await db.article.findUnique({ where: { id } });
    if (!existing) return { error: 'Artikel tidak ditemukan.' };

    await db.article.delete({ where: { id } });

    revalidatePath('/admin/articles');
    revalidatePath('/articles');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Delete article error:', error);
    return { error: 'Gagal menghapus artikel.' };
  }
}
