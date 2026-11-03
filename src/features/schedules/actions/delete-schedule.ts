'use server';

import { revalidatePath} from 'next/cache';
import { getSession } from '@/lib/auth';
import { USER_ROLE } from '@/lib/constants';
import { db } from '@/lib/db';
import { type ActionResponse } from '@/types';

export async function deleteSchedule(id: number): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || session.role !== USER_ROLE.ADMIN) {
    return {
      success: false,
      message: 'Akses ditolak. Sesi Anda telah habis atau akun tidak berwenang.',
      error: 'Akses ditolak. Sesi Anda telah habis atau akun tidak berwenang.',
    };
  }

  if (!id || typeof id !== 'number' || isNaN(id) || id <= 0) {
    return { success: false, message: 'ID jadwal tidak valid.', error: 'ID jadwal tidak valid.' };
  }

  try {
    const existing = await db.doctorSchedule.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, message: 'Jadwal dokter tidak ditemukan.', error: 'Jadwal dokter tidak ditemukan.' };
    }

    await db.doctorSchedule.delete({ where: { id } });

    revalidatePath('/');
    revalidatePath('/admin/schedules');

    return { success: true, message: 'Jadwal dokter berhasil dihapus.' };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menghapus jadwal.';
    return { success: false, message, error: message };
  }
}
