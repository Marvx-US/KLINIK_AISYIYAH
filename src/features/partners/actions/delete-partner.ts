'use server';

import { revalidatePath} from 'next/cache';
import { getSession } from '@/lib/auth';
import { USER_ROLE } from '@/lib/constants';
import { db } from '@/lib/db';
import { deleteFile } from '@/lib/upload';
import { type ActionResponse } from '@/types';

export async function deletePartner(id: number): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || session.role !== USER_ROLE.ADMIN) {
    return {
      success: false,
      message: 'Akses ditolak. Sesi Anda telah habis atau akun tidak berwenang.',
      error: 'Akses ditolak. Sesi Anda telah habis atau akun tidak berwenang.',
    };
  }

  if (!id || typeof id !== 'number' || isNaN(id) || id <= 0) {
    return { success: false, message: 'ID mitra tidak valid.', error: 'ID mitra tidak valid.' };
  }

  try {
    const existing = await db.partner.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, message: 'Mitra tidak ditemukan.', error: 'Mitra tidak ditemukan.' };
    }

    if (existing.logoUrl) {
      await deleteFile(existing.logoUrl).catch(() => null);
    }
    await db.partner.delete({ where: { id } });

    revalidatePath('/');
    revalidatePath('/admin/partners');

    return { success: true, message: 'Data mitra berhasil dihapus.' };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menghapus mitra.';
    return { success: false, message, error: message };
  }
}
