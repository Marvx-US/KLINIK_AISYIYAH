'use server';

/**
 * SERVER ACTION (WRITE) — Simpan/Perbarui Banner Promosi
 * Mengikuti Template 5 Langkah Aman Bab 6.3 HANDBOOK_CLEANCODE.md
 */

import { revalidatePath} from 'next/cache';
import { getSession } from '@/lib/auth';
import { USER_ROLE } from '@/lib/constants';
import { uploadFile } from '@/lib/upload';
import { db } from '@/lib/db';
import { bannerSchema } from '../schemas/banner-schema';
import { type ActionResponse } from '@/types';

export async function saveBanner(
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
  const rawTitle = formData.get('title');
  const rawIsActive = formData.get('isActive') === 'on' || formData.get('isActive') === 'true';

  const validated = bannerSchema.safeParse({
    id,
    title: rawTitle,
    isActive: rawIsActive,
  });

  if (!validated.success) {
    const firstError = validated.error.issues[0]?.message ?? 'Validasi banner gagal';
    return {
      success: false,
      message: firstError,
      error: firstError,
      fieldErrors: validated.error.flatten().fieldErrors,
    };
  }

  const imageFile = formData.get('image') as File | null;
  const hasValidFile = imageFile && imageFile.size > 0;

  if (!id && !hasValidFile) {
    return {
      success: false,
      message: 'Gambar banner wajib diunggah untuk banner baru.',
      error: 'Gambar banner wajib diunggah untuk banner baru.',
    };
  }

  if (hasValidFile) {
    if (!imageFile.type.startsWith('image/')) {
      return {
        success: false,
        message: 'Berkas yang diunggah harus berupa gambar.',
        error: 'Berkas yang diunggah harus berupa gambar.',
      };
    }
    if (imageFile.size > 5 * 1024 * 1024) {
      return {
        success: false,
        message: 'Ukuran gambar tidak boleh melebihi 5 MB.',
        error: 'Ukuran gambar tidak boleh melebihi 5 MB.',
      };
    }
  }

  // 3. Cek Aturan Bisnis & 4. Eksekusi Database
  try {
    let savedBannerId = id ?? 0;
    if (id) {
      const existing = await db.banner.findUnique({ where: { id } });
      if (!existing) {
        return {
          success: false,
          message: 'Banner tidak ditemukan untuk diperbarui.',
          error: 'Banner tidak ditemukan untuk diperbarui.',
        };
      }

      let imageUrl = existing.imageUrl;
      if (hasValidFile) {
        const uploaded = await uploadFile(imageFile);
        if (uploaded) imageUrl = uploaded;
      }

      const updated = await db.banner.update({
        where: { id },
        data: {
          title: validated.data.title,
          imageUrl,
          isActive: validated.data.isActive,
        },
      });
      savedBannerId = updated.id;
    } else {
      const imageUrl = await uploadFile(imageFile);
      if (!imageUrl) {
        return {
          success: false,
          message: 'Gagal mengunggah gambar banner ke server.',
          error: 'Gagal mengunggah gambar banner ke server.',
        };
      }

      const created = await db.banner.create({
        data: {
          title: validated.data.title,
          imageUrl,
          isActive: validated.data.isActive,
        },
      });
      savedBannerId = created.id;
    }

    // 5. Revalidate Cache & Kembalikan Response Standar
    revalidatePath('/');
    revalidatePath('/admin/banners');

    return {
      success: true,
      message: id ? 'Banner berhasil diperbarui.' : 'Banner baru berhasil ditambahkan.',
      data: { id: savedBannerId },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menyimpan banner.';
    return { success: false, message, error: message };
  }
}
