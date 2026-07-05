'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { uploadFile } from '@/lib/upload';
import { z, parseForm } from '@/lib/validations';

const prisma = db as any;

export async function saveFacilityAction(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized. Sesi telah habis.' };

  // Strict Validation
  const validation = parseForm(() => {
    const id = formData.get('id') as string | null;
    return {
      id: id ? z.number(id, 'ID Fasilitas') : null,
      name: z.maxLength(z.string(formData.get('name'), 'Nama Fasilitas'), 100, 'Nama Fasilitas'),
      description: z.maxLength(z.string(formData.get('description'), 'Deskripsi'), 500, 'Deskripsi'),
      imageFile: z.file(formData.get('image'), 'Gambar', !id), // Required if NEW (!id)
      isActive: z.boolean(formData.get('isActive')),
    };
  });

  if (!validation.success) {
    return { error: validation.error };
  }

  const { id, name, description, imageFile, isActive } = validation.data;

  try {
    if (id) {
      // UPDATE
      const existing = await prisma.facility.findUnique({ where: { id } });
      if (!existing) return { error: 'Fasilitas tidak ditemukan.' };

      let imageUrl = existing.imageUrl;
      if (imageFile) {
        const uploaded = await uploadFile(imageFile);
        if (uploaded) imageUrl = uploaded;
      }

      await prisma.facility.update({
        where: { id },
        data: { name, description, imageUrl, isActive },
      });
    } else {
      // CREATE
      const imageUrl = await uploadFile(imageFile);
      if (!imageUrl) {
        return { error: 'Gagal mengunggah gambar.' };
      }

      await prisma.facility.create({
        data: { name, description, imageUrl, isActive },
      });
    }

    revalidatePath('/');
    revalidatePath('/admin/facilities');
    return { success: true };
  } catch (error: any) {
    console.error('Error saving facility:', error);
    return { error: 'Terjadi kesalahan sistem saat menyimpan fasilitas.' };
  }
}

export async function deleteFacilityAction(id: number) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized.' };

  try {
    if (!id || isNaN(id) || id <= 0) return { error: 'ID tidak valid' };
    await prisma.facility.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/admin/facilities');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting facility:', error);
    return { error: 'Gagal menghapus fasilitas.' };
  }
}

export async function toggleFacilityStatusAction(id: number, currentStatus: boolean) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized.' };

  try {
    if (!id || isNaN(id) || id <= 0) return { error: 'ID tidak valid' };
    await prisma.facility.update({
      where: { id },
      data: { isActive: !currentStatus },
    });
    revalidatePath('/');
    revalidatePath('/admin/facilities');
    return { success: true };
  } catch (error: any) {
    console.error('Error toggling facility status:', error);
    return { error: 'Gagal mengubah status.' };
  }
}
