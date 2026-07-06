'use server';

import { getSession } from '@/lib/auth';
import { uploadFile } from '@/lib/upload';

export type UploadResult = { success?: boolean; url?: string; error?: string };

export async function uploadInlineImageAction(formData: FormData): Promise<UploadResult> {
  // Pastikan user adalah admin
  const session = await getSession();
  if (!session) {
    return { error: 'Sesi habis. Silakan login kembali.' };
  }

  const file = formData.get('file') as File | null;
  if (!file) {
    return { error: 'Tidak ada file gambar yang diunggah.' };
  }

  // Validasi tipe file
  if (!file.type.startsWith('image/')) {
    return { error: 'Berkas harus berupa gambar.' };
  }

  // Validasi ukuran (misal maksimal 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { error: 'Ukuran gambar maksimal 5MB.' };
  }

  try {
    const url = await uploadFile(file);
    if (!url) {
      return { error: 'Gagal menyimpan gambar di server.' };
    }
    return { success: true, url };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Terjadi kesalahan saat mengunggah gambar.';
    return { error: msg };
  }
}
