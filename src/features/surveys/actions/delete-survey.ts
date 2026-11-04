'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import type { ActionResponse } from '@/types';

export async function deleteSurvey(id: number): Promise<ActionResponse<void>> {
  const user = await getSession();
  if (!user || user.role !== 'ADMIN') {
    return {
      success: false,
      message: 'Akses ditolak. Anda tidak memiliki izin untuk tindakan ini.',
    };
  }

  if (!id || typeof id !== 'number') {
    return {
      success: false,
      message: 'ID tanggapan survei tidak valid.',
    };
  }

  try {
    await db.surveyResponse.delete({
      where: { id },
    });

    revalidatePath('/admin/surveys');

    return {
      success: true,
      message: 'Data responden survei berhasil dihapus.',
    };
  } catch (error) {
    console.error('[DELETE_SURVEY_ERROR]:', error);
    return {
      success: false,
      message: 'Gagal menghapus data survei dari server.',
    };
  }
}
