'use server';

/**
 * SERVER ACTION (WRITE) — Akhiri sesi pengguna & redirect ke login
 * Sesuai Bab 1.1 HANDBOOK_CLEANCODE.md (pemisahan tanggung jawab)
 */

import { redirect } from 'next/navigation';
import { logout } from '@/lib/auth';

export async function logoutAction(): Promise<void> {
  await logout();
  redirect('/login');
}
