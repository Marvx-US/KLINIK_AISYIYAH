'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { uploadFile } from '@/lib/upload';
import { z, parseForm } from '@/lib/validations';

const prisma = db as any;

/** CREATE atau UPDATE logo mitra */
export async function savePartnerAction(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized. Sesi telah habis.' };

  const validation = parseForm(() => {
    const id = formData.get('id') as string | null;
    return {
      id: id ? z.number(id, 'ID Mitra') : null,
      name: z.maxLength(z.string(formData.get('name'), 'Nama Mitra'), 100, 'Nama Mitra'),
      imageFile: z.file(formData.get('image'), 'Logo Mitra', !id),
    };
  });

  if (!validation.success) {
    return { error: validation.error };
  }

  const { id, name, imageFile } = validation.data;

  try {
    if (id) {
      // UPDATE
      const existing = await prisma.partner.findUnique({ where: { id } });
      if (!existing) return { error: 'Mitra tidak ditemukan.' };

      let logoUrl = existing.logoUrl;
      if (imageFile) {
        const uploaded = await uploadFile(imageFile);
        if (uploaded) logoUrl = uploaded;
      }

      await prisma.partner.update({
        where: { id },
        data: { name, logoUrl },
      });
    } else {
      // CREATE
      const logoUrl = await uploadFile(imageFile);
      if (!logoUrl) {
        return { error: 'Gagal mengunggah logo.' };
      }

      await prisma.partner.create({
        data: { name, logoUrl, isActive: true },
      });
    }

    revalidatePath('/');
    revalidatePath('/admin/partners');
    return { success: true };
  } catch (error: any) {
    console.error('Error saving partner:', error);
    return { error: 'Terjadi kesalahan sistem saat menyimpan mitra.' };
  }
}

/** DELETE logo mitra */
export async function deletePartnerAction(id: number) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized.' };

  try {
    if (!id || isNaN(id) || id <= 0) return { error: 'ID tidak valid' };
    await prisma.partner.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/admin/partners');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting partner:', error);
    return { error: 'Gagal menghapus mitra.' };
  }
}

/** TOGGLE status aktif mitra */
export async function togglePartnerStatusAction(id: number, currentStatus: boolean) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized.' };

  try {
    if (!id || isNaN(id) || id <= 0) return { error: 'ID tidak valid' };
    await prisma.partner.update({
      where: { id },
      data: { isActive: !currentStatus },
    });
    revalidatePath('/');
    revalidatePath('/admin/partners');
    return { success: true };
  } catch (error: any) {
    console.error('Error toggling partner status:', error);
    return { error: 'Gagal mengubah status mitra.' };
  }
}
