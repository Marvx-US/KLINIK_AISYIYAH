'use server';

/**
 * SERVER ACTION (WRITE) — Autentikasi Masuk Admin
 * Sesuai Bab 1.1 & Bab 6 HANDBOOK_CLEANCODE.md
 */

import { login as setSessionCookie } from '@/lib/auth';
import { comparePassword } from '@/lib/hash';
import { db } from '@/lib/db';
import { headers } from 'next/headers';
import { type ActionResponse } from '@/types';

const MAX_USERNAME_LENGTH = 50;
const MAX_PASSWORD_LENGTH = 128;
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 menit

interface RateLimitEntry {
  count: number;
  firstAttemptAt: number;
}

const loginAttempts = new Map<string, RateLimitEntry>();

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry) return { allowed: true };

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

function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry || now - entry.firstAttemptAt > WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, firstAttemptAt: now });
  } else {
    entry.count += 1;
  }
}

function clearAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

export async function loginAction(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const headerStore = await headers();
  const ip =
    headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headerStore.get('x-real-ip') ??
    'unknown';

  const { allowed, retryAfterSeconds } = checkRateLimit(ip);
  if (!allowed) {
    const minutes = Math.ceil((retryAfterSeconds ?? 60) / 60);
    const errorMsg = `Terlalu banyak percobaan login yang gagal. Silakan coba lagi dalam ${minutes} menit.`;
    return { success: false, message: errorMsg, error: errorMsg };
  }

  const username = (formData.get('username') as string | null)?.trim() ?? '';
  const password = (formData.get('password') as string | null) ?? '';

  if (!username || !password) {
    return {
      success: false,
      message: 'Username dan password wajib diisi.',
      error: 'Username dan password wajib diisi.',
    };
  }

  if (username.length > MAX_USERNAME_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
    return {
      success: false,
      message: 'Panjang username atau password melebihi batas yang diizinkan.',
      error: 'Panjang username atau password melebihi batas yang diizinkan.',
    };
  }

  try {
    const user = await db.user.findUnique({ where: { username } });

    if (!user) {
      recordFailedAttempt(ip);
      return {
        success: false,
        message: 'Username atau password salah.',
        error: 'Username atau password salah.',
      };
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      recordFailedAttempt(ip);
      return {
        success: false,
        message: 'Username atau password salah.',
        error: 'Username atau password salah.',
      };
    }

    clearAttempts(ip);

    await setSessionCookie({
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
    });

    return { success: true, message: 'Login berhasil.' };
  } catch (error: unknown) {
    console.error('[AUTH ERROR] Gagal memproses login:', error);
    return {
      success: false,
      message: 'Terjadi kesalahan pada server. Silakan coba lagi.',
      error: 'Terjadi kesalahan pada server. Silakan coba lagi.',
    };
  }
}
