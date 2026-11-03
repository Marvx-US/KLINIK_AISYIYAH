import { describe, it, expect, vi, beforeEach } from 'vitest';
import { revalidatePath } from 'next/cache';
import { saveFacility } from './save-facility';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { uploadFile } from '@/lib/upload';
import { USER_ROLE } from '@/lib/constants';

vi.mock('@/lib/auth', () => ({ getSession: vi.fn() }));
vi.mock('@/lib/db', () => ({
  db: {
    facility: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));
vi.mock('@/lib/upload', () => ({ uploadFile: vi.fn() }));

const adminSession = { id: 'admin-1', username: 'admin', name: 'Admin', role: USER_ROLE.ADMIN };

describe('saveFacility Server Action (Bab 4.3 Integration Testing)', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('1. [RBAC] harus menolak jika tidak ada sesi valid', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce(null);
    const formData = new FormData();
    formData.append('name', 'Ruang ICU');

    // Act
    const result = await saveFacility(formData);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/akses ditolak/i);
    expect(db.facility.create).not.toHaveBeenCalled();
  });

  it('2. [ZOD] harus mengembalikan fieldErrors jika nama atau deskripsi fasilitas kosong', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce(adminSession);
    const formData = new FormData();
    formData.append('name', '');
    formData.append('description', '');

    // Act
    const result = await saveFacility(formData);

    // Assert
    expect(result.success).toBe(false);
    expect(result.fieldErrors).toBeDefined();
    expect(db.facility.create).not.toHaveBeenCalled();
  });

  it('3. [ATURAN BISNIS] harus menolak fasilitas baru tanpa file gambar', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce(adminSession);
    const formData = new FormData();
    formData.append('name', 'Ruang Pemulihan');
    formData.append('description', 'Ruang pemulihan pasca operasi dengan peralatan modern.');
    formData.append('isActive', 'true');

    // Act
    const result = await saveFacility(formData);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/gambar fasilitas wajib/i);
    expect(db.facility.create).not.toHaveBeenCalled();
  });

  it('4. [ATURAN BISNIS] harus menolak update jika fasilitas ID tidak ditemukan', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce(adminSession);
    vi.mocked(db.facility.findUnique).mockResolvedValueOnce(null);
    const formData = new FormData();
    formData.append('id', '999');
    formData.append('name', 'Ruang ICU Updated');
    formData.append('description', 'Deskripsi terbaru untuk ruang ICU.');
    formData.append('isActive', 'true');

    // Act
    const result = await saveFacility(formData);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/tidak ditemukan/i);
    expect(db.facility.update).not.toHaveBeenCalled();
  });

  it('5. [HAPPY PATH] harus berhasil membuat fasilitas baru dengan foto dan me-revalidate cache', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce(adminSession);
    vi.mocked(uploadFile).mockResolvedValueOnce('/uploads/facilities/icu.webp');
    vi.mocked(db.facility.create).mockResolvedValueOnce({
      id: 3, name: 'Ruang ICU', description: 'Perawatan intensif.',
      imageUrl: '/uploads/facilities/icu.webp', isActive: true,
      createdAt: new Date(), updatedAt: new Date(),
    });

    const imageFile = new File(['img'], 'icu.webp', { type: 'image/webp' });
    const formData = new FormData();
    formData.append('name', 'Ruang ICU');
    formData.append('description', 'Perawatan intensif 24 jam dengan tenaga ahli terlatih.');
    formData.append('isActive', 'true');
    formData.append('image', imageFile);

    // Act
    const result = await saveFacility(formData);

    // Assert
    expect(result.success).toBe(true);
    expect(result.data?.id).toBe(3);
    expect(uploadFile).toHaveBeenCalled();
    expect(db.facility.create).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/');
    expect(revalidatePath).toHaveBeenCalledWith('/admin/facilities');
  });
});
