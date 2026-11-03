'use server';

/**
 * SERVER ACTION (WRITE) — Hapus Kegiatan
 * Mengikuti Template 5 Langkah Aman Bab 6.3 HANDBOOK_CLEANCODE.md
 */

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { USER_ROLE } from '@/lib/constants';
import { db } from '@/lib/db';
import { deleteFile } from '@/lib/upload';
import { getEventById } from '../queries/event-queries';
import { ActionResponse } from '@/types';

export async function deleteEvent(id: number): Promise<ActionResponse> {
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

  // 2. VALIDASI INPUT
  if (!id || isNaN(id) || id <= 0) {
    const errorMsg = 'ID kegiatan tidak valid.';
    return {
      success: false,
      message: errorMsg,
      error: errorMsg,
    };
  }

  try {
    // 3. CEK ATURAN BISNIS
    const existing = await getEventById(id);
    if (!existing) {
      const errorMsg = 'Kegiatan tidak ditemukan atau sudah dihapus.';
      return {
        success: false,
        message: errorMsg,
        error: errorMsg,
      };
    }

    // 4. EKSEKUSI DATABASE
    if (existing.coverImage) {
      await deleteFile(existing.coverImage).catch(() => null);
    }
    await db.event.delete({ where: { id } });

    // 5. REVALIDATE CACHE HALAMAN & KEMBALIKAN RESPONSE STANDAR
    revalidatePath('/admin/events');
    revalidatePath('/events');
    revalidatePath('/events/[slug]', 'page');
    revalidatePath('/');

    return {
      success: true,
      message: 'Kegiatan berhasil dihapus.',
    };
  } catch (error) {
    console.error('[DELETE_EVENT_ERROR]:', error);
    const msg = error instanceof Error ? error.message : 'Terjadi kesalahan pada server saat menghapus kegiatan.';
    return {
      success: false,
      message: msg,
      error: msg,
    };
  }
}
