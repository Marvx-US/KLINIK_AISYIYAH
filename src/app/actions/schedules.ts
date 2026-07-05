'use server';

/**
 * LAYER 3 - ACTION (Controller)
 */

import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { z, parseForm } from '@/lib/validations';
import * as scheduleService from '@/core/services/scheduleService';

export type ActionResult = { success?: boolean; error?: string };

export async function saveScheduleAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized. Sesi telah habis.' };

  const validation = parseForm(() => {
    const id = formData.get('id') as string | null;
    return {
      id: id ? z.number(id, 'ID Jadwal') : null,
      poli: z.maxLength(z.string(formData.get('poli'), 'Poli'), 100, 'Poli'),
      doctorName: z.maxLength(z.string(formData.get('doctorName'), 'Nama Dokter'), 100, 'Nama Dokter'),
      scheduleInfo: z.maxLength(
        z.string(formData.get('scheduleInfo'), 'Informasi Jadwal'),
        500,
        'Informasi Jadwal'
      ),
    };
  });

  if (!validation.success) return { error: validation.error };

  const { id, poli, doctorName, scheduleInfo } = validation.data;

  try {
    if (id) {
      await scheduleService.updateSchedule(id, { poli, doctorName, scheduleInfo });
    } else {
      await scheduleService.createSchedule({ poli, doctorName, scheduleInfo });
    }
    revalidatePath('/');
    revalidatePath('/admin/schedules');
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Gagal menyimpan jadwal.';
    return { error: msg };
  }
}

export async function deleteScheduleAction(id: number): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized.' };
  if (!id || isNaN(id) || id <= 0) return { error: 'ID tidak valid.' };

  try {
    await scheduleService.deleteSchedule(id);
    revalidatePath('/');
    revalidatePath('/admin/schedules');
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Gagal menghapus jadwal.';
    return { error: msg };
  }
}

export async function toggleScheduleStatusAction(
  id: number,
  currentStatus: boolean
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized.' };
  if (!id || isNaN(id) || id <= 0) return { error: 'ID tidak valid.' };

  try {
    await scheduleService.toggleScheduleStatus(id, currentStatus);
    revalidatePath('/');
    revalidatePath('/admin/schedules');
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Gagal mengubah status jadwal.';
    return { error: msg };
  }
}
