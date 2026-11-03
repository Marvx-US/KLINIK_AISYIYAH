'use server';

import { revalidatePath} from 'next/cache';
import { getSession } from '@/lib/auth';
import { USER_ROLE } from '@/lib/constants';
import { db } from '@/lib/db';
import { type ActionResponse } from '@/types';

export async function toggleFacility(
  id: number,
  currentStatus: boolean
): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || session.role !== USER_ROLE.ADMIN) {
    return {
      success: false,
      message: 'Akses ditolak. Sesi Anda telah habis atau akun tidak berwenang.',
      error: 'Akses ditolak. Sesi Anda telah habis atau akun tidak berwenang.',
    };
  }

  if (!id || typeof id !== 'number' || isNaN(id) || id <= 0) {
    return { success: false, message: 'ID fasilitas tidak valid.', error: 'ID fasilitas tidak valid.' };
  }

  try {
    const existing = await db.facility.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, message: 'Fasilitas tidak ditemukan.', error: 'Fasilitas tidak ditemukan.' };
    }

    await db.facility.update({
      where: { id },
      data: { isActive: !currentStatus },
    });

    revalidatePath('/');
    revalidatePath('/admin/facilities');

    return {
      success: true,
      message: `Status fasilitas berhasil ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}.`,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal mengubah status fasilitas.';
    return { success: false, message, error: message };
  }
}
