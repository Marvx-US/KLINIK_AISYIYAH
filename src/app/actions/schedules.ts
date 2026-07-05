'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { z, parseForm } from '@/lib/validations';

const prisma = db as any;

export async function saveScheduleAction(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized. Sesi telah habis.' };

  const validation = parseForm(() => {
    const id = formData.get('id') as string | null;
    return {
      id: id ? z.number(id, 'ID Jadwal') : null,
      poli: z.maxLength(z.string(formData.get('poli'), 'Poli'), 100, 'Poli'),
      doctorName: z.maxLength(z.string(formData.get('doctorName'), 'Nama Dokter'), 100, 'Nama Dokter'),
      scheduleInfo: z.maxLength(z.string(formData.get('scheduleInfo'), 'Informasi Jadwal'), 500, 'Informasi Jadwal'),
    };
  });

  if (!validation.success) {
    return { error: validation.error };
  }

  const { id, poli, doctorName, scheduleInfo } = validation.data;

  try {
    if (id) {
      // UPDATE
      const existing = await prisma.doctorSchedule.findUnique({ where: { id } });
      if (!existing) return { error: 'Jadwal tidak ditemukan.' };

      await prisma.doctorSchedule.update({
        where: { id },
        data: { poli, doctorName, scheduleInfo },
      });
    } else {
      // CREATE
      await prisma.doctorSchedule.create({
        data: { poli, doctorName, scheduleInfo },
      });
    }

    revalidatePath('/');
    revalidatePath('/admin/schedules');
    return { success: true };
  } catch (error: any) {
    console.error('saveScheduleAction error:', error);
    return { error: 'Terjadi kesalahan sistem saat menyimpan jadwal.' };
  }
}

export async function deleteScheduleAction(id: number) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized.' };

  try {
    if (!id || isNaN(id) || id <= 0) return { error: 'ID tidak valid' };
    await prisma.doctorSchedule.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/admin/schedules');
    return { success: true };
  } catch (error: any) {
    console.error('deleteScheduleAction error:', error);
    return { error: 'Gagal menghapus jadwal.' };
  }
}

export async function toggleScheduleStatusAction(id: number, currentStatus: boolean) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized.' };

  try {
    if (!id || isNaN(id) || id <= 0) return { error: 'ID tidak valid' };
    await prisma.doctorSchedule.update({
      where: { id },
      data: { isActive: !currentStatus },
    });
    revalidatePath('/');
    revalidatePath('/admin/schedules');
    return { success: true };
  } catch (error: any) {
    console.error('toggleScheduleStatusAction error:', error);
    return { error: 'Gagal mengubah status.' };
  }
}
