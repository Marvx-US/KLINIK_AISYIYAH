import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logoutAction } from './logout';
import { logout } from '@/lib/auth';
import { redirect } from 'next/navigation';

vi.mock('@/lib/auth', () => ({
  logout: vi.fn(),
}));

describe('logoutAction Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('harus memanggil logout() dan mengarahkan ke halaman /login', async () => {
    vi.mocked(logout).mockResolvedValueOnce();

    await logoutAction();

    expect(logout).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith('/login');
  });
});
