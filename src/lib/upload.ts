import { writeFile, unlink } from 'fs/promises';
import { join, relative, isAbsolute } from 'path';
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
 * Menyimpan objek File ke folder public/uploads dengan kompresi otomatis.
 * Semua gambar (kecuali GIF) dikonversi ke WebP (max 1920px lebar, quality 82)
 * menggunakan sharp — ini adalah kunci performa LCP yang optimal di semua device.
 *
 * Mengembalikan URL string yang bisa disimpan ke database (misal: /uploads/nama-file.webp).
 *
 * @throws {Error} Jika tipe file, ekstensi, atau ukuran tidak valid.
 */
export async function uploadFile(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;

  // --- Validasi ukuran ---
  if (file.size > MAX_FILE_SIZE_BYTES) {
    console.error(`[UPLOAD ERROR] Ukuran file ${file.name} (${file.size} bytes) melebihi batas 5MB.`);
    throw new Error('Ukuran file melebihi batas maksimal 5 MB.');
  }

  // --- Validasi MIME type ---
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    console.error(`[UPLOAD ERROR] MIME type ${file.type} tidak diizinkan.`);
    throw new Error('Format gambar tidak didukung. Gunakan JPG, PNG, atau WebP.');
  }

  // --- Validasi ekstensi ---
  const rawExtension = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!ALLOWED_EXTENSIONS.has(rawExtension)) {
    console.error(`[UPLOAD ERROR] Ekstensi .${rawExtension} tidak diizinkan.`);
    throw new Error(`Ekstensi file .${rawExtension} tidak didukung.`);
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Tentukan direktori penyimpanan
    const uploadDir = join(process.cwd(), 'public', 'uploads');

    // Buat folder public/uploads jika belum ada
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    // ============================================================
    // KOMPRESI OTOMATIS — Konversi ke WebP via sharp
    // GIF dikecualikan agar animasi tetap terjaga.
    // WebP q82 + resize 1920px = ~80-90% pengurangan ukuran file
    // dibanding JPEG/PNG resolusi penuh → FIX utama untuk LCP.
    // ============================================================
    let finalBuffer: Buffer;
    let finalExtension: string;

    if (file.type === 'image/gif') {
      // GIF: simpan apa adanya agar animasi tidak rusak
      finalBuffer = buffer;
      finalExtension = 'gif';
    } else {
      // Semua format lain → konversi ke WebP untuk performa maksimal
      const sharp = (await import('sharp')).default;
      finalBuffer = await sharp(buffer)
        .rotate()                    // Auto-rotate berdasarkan EXIF orientation (fix foto dari HP)
        .resize({
          width: 1920,              // Max lebar 1920px — cukup untuk layar 4K, retina, dan desktop
          withoutEnlargement: true, // Jangan perbesar gambar yang sudah lebih kecil dari 1920px
          fit: 'inside',            // Pertahankan aspect ratio asli
        })
        .webp({ quality: 82 })      // quality 82 — sweet spot: tidak ada beda visual, ukuran ~3-5x lebih kecil
        .toBuffer();
      finalExtension = 'webp';
    }

    // Gunakan nama unik bersertifikasi (timestamp + random)
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${finalExtension}`;
    const filePath = join(uploadDir, uniqueName);

    // Tulis file ke sistem
    await writeFile(filePath, finalBuffer);
    const publicUrl = `/uploads/${uniqueName}`;

    const originalKB = (buffer.length / 1024).toFixed(0);
    const finalKB = (finalBuffer.length / 1024).toFixed(0);
    const saved = ((1 - finalBuffer.length / buffer.length) * 100).toFixed(1);
    console.log(
      `[UPLOAD SUCCESS] ${file.name} → ${publicUrl} | ` +
      `${originalKB} KB → ${finalKB} KB (hemat ${saved}%)`
    );

    return publicUrl;
  } catch (error) {
    if (error instanceof Error) throw error;
    console.error('[UPLOAD ERROR] Gagal menyimpan file di disk:', error);
    throw new Error('Gagal menyimpan gambar di server.');
  }
}

/**
 * Menghapus file fisik dari folder public/uploads jika ada.
 * Mencegah Directory Traversal dengan memeriksa batasan folder public/uploads.
 */
export async function deleteFile(relativePath: string | null | undefined): Promise<boolean> {
  if (!relativePath || typeof relativePath !== 'string') return false;

  // Abaikan URL eksternal (Unsplash, HTTP, dsb)
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return false;
  }

  try {
    // Bersihkan query string dan leading slash
    const cleanPath = relativePath.split('?')[0].replace(/^\/+/, '');
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const fullPath = join(process.cwd(), 'public', cleanPath);

    // Keamanan: pastikan file berada di dalam folder public/uploads
    const rel = relative(uploadDir, fullPath);
    const isInsideUploads = rel && !rel.startsWith('..') && !isAbsolute(rel);
    if (!isInsideUploads) {
      console.warn(`[SECURITY WARN] Percobaan penghapusan file di luar folder uploads diblokir: ${relativePath}`);
      return false;
    }

    if (existsSync(fullPath)) {
      await unlink(fullPath);
      console.log(`[FILE DELETED] File fisik berhasil dihapus dari disk: ${fullPath}`);
      return true;
    }
  } catch (error) {
    console.error(`[FILE DELETE ERROR] Gagal menghapus file ${relativePath}:`, error);
  }
  return false;
}
