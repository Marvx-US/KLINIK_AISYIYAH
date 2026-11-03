import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loginAction } from './login';
import { db } from '@/lib/db';
import { login as setSessionCookie } from '@/lib/auth';
import { comparePassword } from '@/lib/hash';
import { buildMockUser } from '../../../../tests/factories/user.factory';

vi.mock('@/lib/auth', () => ({
  login: vi.fn(),
}));

vi.mock('@/lib/hash', () => ({
  comparePassword: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Map([['x-forwarded-for', '127.0.0.1']])),
}));

describe('loginAction Server Action (Bab 4.3 Integration Testing)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. [VALIDASI] harus menolak jika username atau password kosong', async () => {
    // Arrange
    const formData = new FormData();
    formData.append('username', '');
    formData.append('password', '');

    // Act
    const result = await loginAction(null, formData);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/username dan password wajib diisi/i);
    expect(db.user.findUnique).not.toHaveBeenCalled();
  });

  it('2. [SECURITY] harus menolak jika kredensial user tidak terdaftar', async () => {
    // Arrange
    vi.mocked(db.user.findUnique).mockResolvedValueOnce(null);

    const formData = new FormData();
    formData.append('username', 'nonexistent@user.com');
    formData.append('password', 'ValidPass123!');

    // Act
    const result = await loginAction(null, formData);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/username atau password salah/i);
    expect(setSessionCookie).not.toHaveBeenCalled();
  });

  it('3. [SECURITY] harus menolak jika password salah (hash mismatch)', async () => {
    // Arrange
    const mockUser = buildMockUser({ username: 'aisyiyah@admin.com' });
    vi.mocked(db.user.findUnique).mockResolvedValueOnce(mockUser);
    vi.mocked(comparePassword).mockResolvedValueOnce(false);

    const formData = new FormData();
    formData.append('username', 'aisyiyah@admin.com');
    formData.append('password', 'WrongPassword!');

    // Act
    const result = await loginAction(null, formData);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/username atau password salah/i);
    expect(setSessionCookie).not.toHaveBeenCalled();
  });

  it('4. [HAPPY PATH] harus berhasil login dan mencatat cookie sesi admin', async () => {
    // Arrange
    const mockUser = buildMockUser({
      id: 'admin-101',
      username: 'aisyiyah@admin.com',
      name: 'Super Admin',
      role: 'ADMIN',
    });
    vi.mocked(db.user.findUnique).mockResolvedValueOnce(mockUser);
    vi.mocked(comparePassword).mockResolvedValueOnce(true);
    vi.mocked(setSessionCookie).mockResolvedValueOnce(undefined);

    const formData = new FormData();
    formData.append('username', 'aisyiyah@admin.com');
    formData.append('password', 'SecretPassword123!');

    // Act
    const result = await loginAction(null, formData);

    // Assert
    expect(result.success).toBe(true);
    expect(result.message).toMatch(/login berhasil/i);
    expect(setSessionCookie).toHaveBeenCalledWith({
      id: 'admin-101',
      name: 'Super Admin',
      username: 'aisyiyah@admin.com',
      role: 'ADMIN',
    });
  });
});
