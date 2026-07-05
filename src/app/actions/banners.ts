'use server';

import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { uploadFile } from '@/lib/upload';
import { revalidatePath } from 'next/cache';
import { z, parseForm } from '@/lib/validations';

const prisma = db as any;

export interface ActionResult {
  error?: string;
  success?: boolean;
}

export async function saveBannerAction(prevState: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized. Harap login kembali.' };

  const validation = parseForm(() => {
    const id = formData.get('id') as string | null;
    return {
      id: id ? z.number(id, 'ID Banner') : null,
      title: z.maxLength(z.string(formData.get('title'), 'Judul Banner'), 150, 'Judul Banner'),
      imageFile: z.file(formData.get('image'), 'Gambar Banner', !id),
      isActive: z.boolean(formData.get('isActive')),
    };
  });

  if (!validation.success) {
    return { error: validation.error };
  }

  const { id, title, imageFile, isActive } = validation.data;

  try {
    if (id) {
      // UPDATE
      const existing = await prisma.banner.findUnique({ where: { id } });
      if (!existing) return { error: 'Banner tidak ditemukan.' };

      let imageUrl = existing.imageUrl;
      if (imageFile) {
        const uploaded = await uploadFile(imageFile);
        if (uploaded) imageUrl = uploaded;
      }

      await prisma.banner.update({
        where: { id },
        data: { title, isActive, imageUrl },
      });
    } else {
      // CREATE
      const imageUrl = await uploadFile(imageFile);
      if (!imageUrl) {
        return { error: 'Gagal mengunggah gambar.' };
      }

      await prisma.banner.create({
        data: { title, imageUrl, isActive },
      });
    }

    revalidatePath('/');
    revalidatePath('/admin/banners');
    return { success: true };
  } catch (error: unknown) {
    console.error('Save Banner Error:', error);
    return { error: 'Terjadi kesalahan saat menyimpan banner.' };
  }
}

export async function deleteBannerAction(id: number): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized.' };

  try {
    if (!id || isNaN(id) || id <= 0) return { error: 'ID tidak valid' };
    await prisma.banner.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/admin/banners');
    return { success: true };
  } catch (error: unknown) {
    console.error('Delete Banner Error:', error);
    return { error: 'Gagal menghapus banner.' };
  }
}

export async function toggleBannerStatusAction(id: number, currentStatus: boolean): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized.' };

  try {
    if (!id || isNaN(id) || id <= 0) return { error: 'ID tidak valid' };
    await prisma.banner.update({
      where: { id },
      data: { isActive: !currentStatus },
    });
    revalidatePath('/');
    revalidatePath('/admin/banners');
    return { success: true };
  } catch (error: unknown) {
    console.error('Toggle Banner Error:', error);
    return { error: 'Gagal mengubah status banner.' };
  }
}
