'use server';

/**
 * SERVER ACTION (WRITE) — Simpan/Perbarui Fasilitas
 * Mengikuti Template 5 Langkah Aman Bab 6.3 HANDBOOK_CLEANCODE.md
 */

import { revalidatePath} from 'next/cache';
import { getSession } from '@/lib/auth';
import { USER_ROLE } from '@/lib/constants';
import { uploadFile } from '@/lib/upload';
import { db } from '@/lib/db';
import { facilitySchema } from '../schemas/facility-schema';
import { type ActionResponse } from '@/types';

export async function saveFacility(
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
  const rawDescription = formData.get('description');
  const rawIsActive = formData.get('isActive') === 'true' || formData.get('isActive') === 'on';

  const validated = facilitySchema.safeParse({
    id,
    name: rawName,
    description: rawDescription,
    isActive: rawIsActive,
  });

  if (!validated.success) {
    const firstError = validated.error.issues[0]?.message ?? 'Validasi fasilitas gagal';
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
      message: 'Gambar fasilitas wajib diunggah untuk fasilitas baru.',
      error: 'Gambar fasilitas wajib diunggah untuk fasilitas baru.',
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
    let savedFacilityId = id ?? 0;
    if (id) {
      const existing = await db.facility.findUnique({ where: { id } });
      if (!existing) {
        return {
          success: false,
          message: 'Fasilitas tidak ditemukan untuk diperbarui.',
          error: 'Fasilitas tidak ditemukan untuk diperbarui.',
        };
      }

      let imageUrl = existing.imageUrl;
      if (hasValidFile) {
        const uploaded = await uploadFile(imageFile);
        if (uploaded) imageUrl = uploaded;
      }

      const updated = await db.facility.update({
        where: { id },
        data: {
          name: validated.data.name,
          description: validated.data.description,
          imageUrl,
          isActive: validated.data.isActive,
        },
      });
      savedFacilityId = updated.id;
    } else {
      const imageUrl = await uploadFile(imageFile);
      if (!imageUrl) {
        return {
          success: false,
          message: 'Gagal mengunggah foto fasilitas ke server.',
          error: 'Gagal mengunggah foto fasilitas ke server.',
        };
      }

      const created = await db.facility.create({
        data: {
          name: validated.data.name,
          description: validated.data.description,
          imageUrl,
          isActive: validated.data.isActive,
        },
      });
      savedFacilityId = created.id;
    }

    // 5. Revalidate Cache & Kembalikan Response Standar
    revalidatePath('/');
    revalidatePath('/admin/facilities');

    return {
      success: true,
      message: id ? 'Fasilitas berhasil diperbarui.' : 'Fasilitas baru berhasil ditambahkan.',
      data: { id: savedFacilityId },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menyimpan fasilitas.';
    return { success: false, message, error: message };
  }
}
