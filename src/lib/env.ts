import { z } from 'zod';

/**
 * Validasi Environment Variables terpusat (Fail-Fast Principle)
 * Sesuai Bab 5.2 HANDBOOK_CLEANCODE.md
 */

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL wajib diisi di berkas .env'),
  NEXTAUTH_SECRET: z.string().min(16, 'NEXTAUTH_SECRET minimal 16 karakter untuk keamanan JWT'),
  NEXT_PUBLIC_APP_URL: z.string().url('NEXT_PUBLIC_APP_URL harus berupa URL yang valid').default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DEFAULT_ADMIN_USERNAME: z.string().optional(),
  DEFAULT_ADMIN_PASSWORD: z.string().optional(),
});

// Hanya memvalidasi rahasia server saat kode dieksekusi di sisi server atau dalam runner pengujian (test)
const isServer = typeof window === 'undefined' || process.env.NODE_ENV === 'test';

function parseEnv() {
  if (!isServer) {
    return {
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      NODE_ENV: process.env.NODE_ENV || 'development',
    } as unknown as z.infer<typeof envSchema>;
  }

  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ FATAL: Konfigurasi Environment Variables (.env) tidak valid:');
    console.error(result.error.flatten().fieldErrors);
    throw new Error('Aplikasi gagal diinisialisasi karena konfigurasi .env belum valid.');
  }

  return result.data;
}

export const env = parseEnv();
