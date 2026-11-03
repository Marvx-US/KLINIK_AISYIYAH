'use server';

import { revalidatePath} from 'next/cache';
import { getSession } from '@/lib/auth';
import { USER_ROLE } from '@/lib/constants';
import { db } from '@/lib/db';
import { type ActionResponse } from '@/types';

export async function toggleService(
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
    return { success: false, message: 'ID layanan tidak valid.', error: 'ID layanan tidak valid.' };
  }

  try {
    const existing = await db.service.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, message: 'Layanan tidak ditemukan.', error: 'Layanan tidak ditemukan.' };
    }

    await db.service.update({
      where: { id },
      data: { isActive: !currentStatus },
    });

    revalidatePath('/');
    revalidatePath('/services');
    revalidatePath('/services/[slug]', 'page');
    revalidatePath('/admin/services');

    return {
      success: true,
      message: `Status layanan berhasil ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}.`,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal mengubah status layanan.';
    return { success: false, message, error: message };
  }
}
