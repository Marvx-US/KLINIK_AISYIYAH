'use server';

import { login as setSessionCookie } from '@/lib/auth';
import { comparePassword } from '@/lib/hash';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

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
// Login Admin
// =============================================================
export async function loginAction(prevState: LoginResult | null, formData: FormData): Promise<LoginResult> {
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
      return { error: 'Username atau password salah.' };
    }

    const passwordMatch = comparePassword(password, user.password);
    if (!passwordMatch) {
      return { error: 'Username atau password salah.' };
    }

    await setSessionCookie({
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    });

    return { success: true };
  } catch (error) {
    console.error('Login action error:', error);
    return { error: 'Gagal menghubungkan ke database. Silakan periksa koneksi MySQL Anda.' };
  }
}

// =============================================================
// Logout Admin
// =============================================================
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
