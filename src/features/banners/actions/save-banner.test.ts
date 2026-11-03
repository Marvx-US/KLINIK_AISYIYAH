
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { revalidatePath } from 'next/cache';
import { saveBanner } from './save-banner';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { uploadFile } from '@/lib/upload';
import { USER_ROLE } from '@/lib/constants';

vi.mock('@/lib/auth', () => ({ getSession: vi.fn() }));
vi.mock('@/lib/db', () => ({
  db: {
    banner: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));
vi.mock('@/lib/upload', () => ({ uploadFile: vi.fn() }));

const adminSession = { id: 'admin-1', username: 'admin', name: 'Admin', role: USER_ROLE.ADMIN };

describe('saveBanner Server Action (Bab 4.3 Integration Testing)', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('1. [RBAC] harus menolak aksi jika sesi tidak ada atau bukan ADMIN', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce(null);
    const formData = new FormData();
    formData.append('title', 'Banner Ramadan');

    // Act
    const result = await saveBanner(null, formData);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/akses ditolak/i);
    expect(db.banner.create).not.toHaveBeenCalled();
  });

  it('2. [ZOD] harus mengembalikan fieldErrors jika judul banner kosong', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce(adminSession);
    const formData = new FormData();
    formData.append('title', '');

    // Act
    const result = await saveBanner(null, formData);

    // Assert
    expect(result.success).toBe(false);
    expect(result.fieldErrors).toBeDefined();
    expect(db.banner.create).not.toHaveBeenCalled();
  });

  it('3. [ATURAN BISNIS] harus menolak banner baru tanpa file gambar', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce(adminSession);
    const formData = new FormData();
    formData.append('title', 'Banner Lebaran 2026');
    formData.append('isActive', 'true');
    // Tidak ada file gambar

    // Act
    const result = await saveBanner(null, formData);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/gambar banner wajib/i);
    expect(db.banner.create).not.toHaveBeenCalled();
  });

  it('4. [ATURAN BISNIS] harus menolak update jika banner ID tidak ditemukan di DB', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce(adminSession);
    vi.mocked(db.banner.findUnique).mockResolvedValueOnce(null);
    const formData = new FormData();
    formData.append('id', '999');
    formData.append('title', 'Banner Update');
    formData.append('isActive', 'true');

    // Act
    const result = await saveBanner(null, formData);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/tidak ditemukan/i);
    expect(db.banner.update).not.toHaveBeenCalled();
  });

  it('5. [HAPPY PATH] harus berhasil membuat banner baru dan me-revalidate cache', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce(adminSession);
    vi.mocked(uploadFile).mockResolvedValueOnce('/uploads/banner-lebaran.webp');
    vi.mocked(db.banner.create).mockResolvedValueOnce({
      id: 5, title: 'Banner Lebaran', imageUrl: '/uploads/banner-lebaran.webp',
      isActive: true, createdAt: new Date(), updatedAt: new Date(),
    });

    const imageFile = new File(['img'], 'banner.webp', { type: 'image/webp' });
    const formData = new FormData();
    formData.append('title', 'Banner Lebaran');
    formData.append('isActive', 'true');
    formData.append('image', imageFile);

    // Act
    const result = await saveBanner(null, formData);

    // Assert
    expect(result.success).toBe(true);
    expect(result.data?.id).toBe(5);
    expect(db.banner.create).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/');
    expect(revalidatePath).toHaveBeenCalledWith('/admin/banners');
  });
});
