import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdirSync, existsSync } from 'fs';

// ============================================================
// Whitelist ekstensi dan MIME type yang diizinkan
// Ini adalah lapisan pertahanan terakhir (defense-in-depth).
// Validasi pertama tetap harus dilakukan di Server Action masing-masing.
// ============================================================
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif']);
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
]);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Menyimpan objek File ke folder public/uploads.
 * Mengembalikan URL string yang bisa disimpan ke database (misal: /uploads/nama-file.jpg).
 *
 * @throws {Error} Jika tipe file, ekstensi, atau ukuran tidak valid.
 */
export async function uploadFile(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;

  // --- Validasi ukuran ---
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('Ukuran file melebihi batas maksimal 5 MB.');
  }

  // --- Validasi MIME type ---
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error(`Tipe file tidak diizinkan. Gunakan: JPG, PNG, WebP, AVIF, atau GIF.`);
  }

  // --- Validasi ekstensi (cegah ekstensi ganda seperti file.php.jpg) ---
  const rawExtension = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!ALLOWED_EXTENSIONS.has(rawExtension)) {
    throw new Error(`Ekstensi file tidak diizinkan. Gunakan: ${[...ALLOWED_EXTENSIONS].join(', ')}.`);
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Gunakan ekstensi yang sudah divalidasi (bukan dari nama file asli mentah)
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${rawExtension}`;

    // Tentukan direktori penyimpanan
    const uploadDir = join(process.cwd(), 'public', 'uploads');

    // Buat folder public/uploads jika belum ada
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = join(uploadDir, uniqueName);

    // Tulis file ke sistem
    await writeFile(filePath, buffer);

    // Kembalikan public URL path
    return `/uploads/${uniqueName}`;
  } catch (error) {
    // Re-throw error validasi agar bisa ditangkap di Server Action
    if (error instanceof Error) throw error;
    console.error('Error uploading file:', error);
    throw new Error('Gagal menyimpan gambar di server.');
  }
}
