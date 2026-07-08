'use server';

import { login as setSessionCookie } from '@/lib/auth';
import { comparePassword } from '@/lib/hash';
import { db } from '@/lib/db';
import { cookies, headers } from 'next/headers';

// =============================================================
// Tipe untuk kembalian Server Actions (menggantikan any)
// =============================================================
export type LoginResult = { success?: boolean; error?: string };

// =============================================================
// Batas panjang input login
// =============================================================
const MAX_USERNAME_LENGTH = 50;
const MAX_PASSWORD_LENGTH = 128;

// =============================================================
// Rate Limiter — In-Memory
// Maksimal 5 percobaan gagal per IP dalam 15 menit.
// Menggunakan Map sederhana; memadai untuk single-instance deployment.
// =============================================================
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 menit

interface RateLimitEntry {
  count: number;
  firstAttemptAt: number;
}

const loginAttempts = new Map<string, RateLimitEntry>();

/**
 * Memeriksa apakah IP tertentu telah melebihi batas percobaan login.
 * Mengembalikan objek { allowed, retryAfterSeconds }.
 */
function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry) return { allowed: true };

  // Reset jika jendela waktu sudah lewat
  if (now - entry.firstAttemptAt > WINDOW_MS) {
    loginAttempts.delete(ip);
    return { allowed: true };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    const retryAfterMs = WINDOW_MS - (now - entry.firstAttemptAt);
    return { allowed: false, retryAfterSeconds: Math.ceil(retryAfterMs / 1000) };
  }

  return { allowed: true };
}

/**
 * Mencatat satu percobaan login gagal untuk IP tertentu.
 */
function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry || now - entry.firstAttemptAt > WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, firstAttemptAt: now });
  } else {
    entry.count += 1;
  }
}

/**
 * Menghapus catatan percobaan gagal setelah login berhasil.
 */
function clearAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

// =============================================================
// Login Admin
// =============================================================
export async function loginAction(prevState: LoginResult | null, formData: FormData): Promise<LoginResult> {
  // Ambil IP dari header (untuk rate limiting)
  const headerStore = await headers();
  const ip =
    headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headerStore.get('x-real-ip') ??
    'unknown';

  // 0. Cek rate limit
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    const minutes = Math.ceil((rateCheck.retryAfterSeconds ?? 900) / 60);
    return {
      error: `Terlalu banyak percobaan login. Coba lagi dalam ${minutes} menit.`,
    };
  }

  const username = (formData.get('username') as string | null)?.trim() ?? '';
  const password = (formData.get('password') as string | null) ?? '';

  // 1. Validasi — keberadaan field
  if (!username || !password) {
    return { error: 'Username dan password wajib diisi.' };
  }

  // 2. Validasi — batas panjang (mencegah input eksesif / serangan DoS kecil)
  if (username.length > MAX_USERNAME_LENGTH) {
    return { error: 'Username terlalu panjang.' };
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return { error: 'Password terlalu panjang.' };
  }

  // 3. Validasi karakter username — hanya alfanumerik dan underscore
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { error: 'Username hanya boleh mengandung huruf, angka, dan underscore.' };
  }

  try {
    const user = await db.user.findUnique({
      where: { username },
    });

    // 4. Gunakan pesan error umum untuk mencegah user enumeration attack
    if (!user) {
      recordFailedAttempt(ip);
      return { error: 'Username atau password salah.' };
    }

    const passwordMatch = comparePassword(password, user.password);
    if (!passwordMatch) {
      recordFailedAttempt(ip);
      return { error: 'Username atau password salah.' };
    }

    // Login berhasil — hapus catatan percobaan gagal
    clearAttempts(ip);

    await setSessionCookie({
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    });

    return { success: true };
  } catch (error) {
    console.error('Login action error:', error);
    // Pesan generik — tidak menyebut teknologi database spesifik
    return { error: 'Terjadi kesalahan pada server. Silakan coba beberapa saat lagi.' };
  }
}

// =============================================================
// Logout Admin
// =============================================================
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

