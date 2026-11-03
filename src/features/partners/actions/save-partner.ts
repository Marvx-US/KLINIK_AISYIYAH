'use server';

/**
 * SERVER ACTION (WRITE) — Simpan/Perbarui Mitra
 * Mengikuti Template 5 Langkah Aman Bab 6.3 HANDBOOK_CLEANCODE.md
 */

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { USER_ROLE } from '@/lib/constants';
import { uploadFile } from '@/lib/upload';
import { db } from '@/lib/db';
import { partnerSchema } from '../schemas/partner-schema';
import { type ActionResponse } from '@/types';

export async function savePartner(
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
  const rawName = formData.get('name');

  const validated = partnerSchema.safeParse({
    id,
    name: rawName,
  });

  if (!validated.success) {
    const firstError = validated.error.issues[0]?.message ?? 'Validasi mitra gagal';
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
      message: 'Logo mitra wajib diunggah untuk mitra baru.',
      error: 'Logo mitra wajib diunggah untuk mitra baru.',
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
        message: 'Ukuran logo tidak boleh melebihi 5 MB.',
        error: 'Ukuran logo tidak boleh melebihi 5 MB.',
      };
    }
  }

  // 3. Cek Aturan Bisnis & 4. Eksekusi Database
  try {
    let savedPartnerId = id ?? 0;
    if (id) {
      const existing = await db.partner.findUnique({ where: { id } });
      if (!existing) {
        return {
          success: false,
          message: 'Mitra tidak ditemukan untuk diperbarui.',
          error: 'Mitra tidak ditemukan untuk diperbarui.',
        };
      }

      let logoUrl = existing.logoUrl;
      if (hasValidFile) {
        const uploaded = await uploadFile(imageFile);
        if (uploaded) logoUrl = uploaded;
      }

      const updated = await db.partner.update({
        where: { id },
        data: {
          name: validated.data.name,
          logoUrl,
        },
      });
      savedPartnerId = updated.id;
    } else {
      const logoUrl = await uploadFile(imageFile);
      if (!logoUrl) {
        return {
          success: false,
          message: 'Gagal mengunggah logo mitra ke server.',
          error: 'Gagal mengunggah logo mitra ke server.',
        };
      }

      const created = await db.partner.create({
        data: {
          name: validated.data.name,
          logoUrl,
          isActive: true,
        },
      });
      savedPartnerId = created.id;
    }

    // 5. Revalidate Cache & Kembalikan Response Standar
    revalidatePath('/');
    revalidatePath('/admin/partners');

    return {
      success: true,
      message: id ? 'Data mitra berhasil diperbarui.' : 'Mitra baru berhasil ditambahkan.',
      data: { id: savedPartnerId },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menyimpan mitra.';
    return { success: false, message, error: message };
  }
}
