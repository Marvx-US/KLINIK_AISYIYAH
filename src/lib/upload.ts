import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdirSync, existsSync } from 'fs';

/**
 * Menyimpan objek File ke folder public/uploads
 * Mengembalikan URL string yang bisa disimpan ke database (misal: /uploads/nama-file.jpg)
 */
export async function uploadFile(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ambil ekstensi asli dari nama file
    const extension = file.name.split('.').pop();
    // Buat nama file unik
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1000)}.${extension}`;
    
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
    console.error('Error uploading file:', error);
    return null;
  }
}
