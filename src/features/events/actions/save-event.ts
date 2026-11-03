'use server';

/**
 * SERVER ACTION (WRITE) — Simpan/Perbarui Kegiatan
 * Mengikuti Template 5 Langkah Aman Bab 6.3 HANDBOOK_CLEANCODE.md
 */

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { USER_ROLE } from '@/lib/constants';
import { uploadFile } from '@/lib/upload';
import { db } from '@/lib/db';
import { EventSchema } from '../schemas/event-schema';
import { getEventById } from '../queries/event-queries';
import { ActionResponse } from '@/types';
import { CONTENT_STATUS } from '@/lib/constants';

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${base}-${Date.now()}`;
}

export async function saveEvent(
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
    content: formData.get('content'),
    location: formData.get('location') || null,
    status: formData.get('status') || CONTENT_STATUS.DRAFT,
    eventDate: formData.get('eventDate') || null,
  };

  const parsed = EventSchema.safeParse(rawData);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstErrorMessage = Object.values(fieldErrors)[0]?.[0] || 'Data kegiatan tidak valid.';
    return {
      success: false,
      message: firstErrorMessage,
      error: firstErrorMessage,
      fieldErrors,
    };
  }

  const { id, title, content, location, status, eventDate } = parsed.data;
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
    let savedEventId: number;

    if (id) {
      const existing = await getEventById(id);
      if (!existing) {
        const errorMsg = 'Kegiatan tidak ditemukan untuk diperbarui.';
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

      const updated = await db.event.update({
        where: { id },
        data: {
          title,
          content,
          location,
          status,
          eventDate,
          coverImage,
        },
      });
      savedEventId = updated.id;
    } else {
      let coverImage: string | null = null;
      if (coverImageFile && coverImageFile.size > 0) {
        coverImage = await uploadFile(coverImageFile);
      }

      const slug = generateSlug(title);
      const created = await db.event.create({
        data: {
          title,
          slug,
          content,
          location,
          status,
          eventDate,
          coverImage,
        },
      });
      savedEventId = created.id;
    }

    // 5. REVALIDATE CACHE HALAMAN & KEMBALIKAN RESPONSE STANDAR
    revalidatePath('/admin/events');
    revalidatePath('/events');
    revalidatePath('/events/[slug]', 'page');
    revalidatePath('/');

    return {
      success: true,
      message: id ? 'Kegiatan berhasil diperbarui.' : 'Kegiatan baru berhasil disimpan.',
      data: { id: savedEventId },
    };
  } catch (error) {
    console.error('[SAVE_EVENT_ERROR]:', error);
    const msg = error instanceof Error ? error.message : 'Terjadi kesalahan pada server saat menyimpan kegiatan.';
    return {
      success: false,
      message: msg,
      error: msg,
    };
  }
}
