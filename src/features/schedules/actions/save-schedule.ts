'use server';

/**
 * SERVER ACTION (WRITE) — Simpan/Perbarui Jadwal Dokter
 * Mengikuti Template 5 Langkah Aman Bab 6.3 HANDBOOK_CLEANCODE.md
 */

import { revalidatePath} from 'next/cache';
import { getSession } from '@/lib/auth';
import { USER_ROLE } from '@/lib/constants';
import { db } from '@/lib/db';
import { scheduleSchema } from '../schemas/schedule-schema';
import { type ActionResponse } from '@/types';

export async function saveSchedule(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResponse<{ id?: number }>> {
  // 1. Cek Autentikasi & Hak Akses (RBAC)
  const session = await getSession();
  if (!session || session.role !== USER_ROLE.ADMIN) {
    return {
      success: false,
      message: 'Akses ditolak. Sesi Anda telah habis atau akun tidak berwenang.',
      error: 'Akses ditolak. Sesi Anda telah habis atau akun tidak berwenang.',
    };
  }

  // 2. Validasi Input dengan Zod
  const rawId = formData.get('id');
  const id = rawId ? Number(rawId) : null;
  const rawPoli = formData.get('poli');
  const rawDoctorName = formData.get('doctorName');
  const rawScheduleInfo = formData.get('scheduleInfo');

  const validated = scheduleSchema.safeParse({
    id,
    poli: rawPoli,
    doctorName: rawDoctorName,
    scheduleInfo: rawScheduleInfo,
  });

  if (!validated.success) {
    const firstError = validated.error.issues[0]?.message ?? 'Validasi jadwal gagal';
    return {
      success: false,
      message: firstError,
      error: firstError,
      fieldErrors: validated.error.flatten().fieldErrors,
    };
  }

  // 3. Cek Aturan Bisnis & 4. Eksekusi Database
  try {
    const { poli, doctorName, scheduleInfo } = validated.data;
    let savedScheduleId = id ?? 0;

    if (id) {
      const existing = await db.doctorSchedule.findUnique({ where: { id } });
      if (!existing) {
        return {
          success: false,
          message: 'Jadwal dokter tidak ditemukan untuk diperbarui.',
          error: 'Jadwal dokter tidak ditemukan untuk diperbarui.',
        };
      }

      const updated = await db.doctorSchedule.update({
        where: { id },
        data: { poli, doctorName, scheduleInfo },
      });
      savedScheduleId = updated.id;
    } else {
      const created = await db.doctorSchedule.create({
        data: { poli, doctorName, scheduleInfo, isActive: true },
      });
      savedScheduleId = created.id;
    }

    // 5. Revalidate Cache & Kembalikan Response Standar
    revalidatePath('/');
    revalidatePath('/admin/schedules');

    return {
      success: true,
      message: id ? 'Jadwal dokter berhasil diperbarui.' : 'Jadwal dokter berhasil ditambahkan.',
      data: { id: savedScheduleId },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menyimpan jadwal.';
    return { success: false, message, error: message };
  }
}
