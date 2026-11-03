import { describe, it, expect, vi, beforeEach } from 'vitest';
import { revalidatePath } from 'next/cache';
import { updateClinicDescription, updateVisionMission } from './save-setting';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { USER_ROLE } from '@/lib/constants';

vi.mock('@/lib/auth', () => ({ getSession: vi.fn() }));
vi.mock('@/lib/db', () => ({
  db: {
    siteSetting: {
      upsert: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));
vi.mock('@/lib/upload', () => ({ uploadFile: vi.fn() }));

const adminSession = { id: 'admin-1', username: 'admin', name: 'Admin', role: USER_ROLE.ADMIN };

describe('updateClinicDescription Server Action (Bab 4.3 Integration Testing)', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('1. [RBAC] harus menolak jika tidak ada sesi valid', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce(null);
    const formData = new FormData();
    formData.append('description', 'Deskripsi klinik terbaru.');

    // Act
    const result = await updateClinicDescription(formData);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/akses ditolak/i);
    expect(db.siteSetting.upsert).not.toHaveBeenCalled();
  });

  it('2. [ZOD] harus mengembalikan error jika deskripsi kosong', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce(adminSession);
    const formData = new FormData();
    formData.append('description', '');

    // Act
    const result = await updateClinicDescription(formData);

    // Assert
    expect(result.success).toBe(false);
    expect(db.siteSetting.upsert).not.toHaveBeenCalled();
  });

  it('3. [HAPPY PATH] harus berhasil menyimpan deskripsi dan me-revalidate cache', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce(adminSession);
    vi.mocked(db.siteSetting.upsert).mockResolvedValueOnce({
      id: 1, key: 'about_description', value: 'Deskripsi baru klinik.', updatedAt: new Date(),
    });

    const formData = new FormData();
    formData.append('description', 'Klinik Aisyiyah Pandaan melayani masyarakat dengan penuh dedikasi dan profesionalisme.');

    // Act
    const result = await updateClinicDescription(formData);

    // Assert
    expect(result.success).toBe(true);
    expect(result.message).toMatch(/berhasil disimpan/i);
    expect(db.siteSetting.upsert).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/');
    expect(revalidatePath).toHaveBeenCalledWith('/admin/clinic-profile');
  });
});

describe('updateVisionMission Server Action (Bab 4.3 Integration Testing)', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('1. [RBAC] harus menolak jika tidak ada sesi valid', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce(null);
    const formData = new FormData();
    formData.append('vision', 'Menjadi klinik terdepan.');
    formData.append('mission', 'Memberikan pelayanan prima.');

    // Act
    const result = await updateVisionMission(formData);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/akses ditolak/i);
    expect(db.$transaction).not.toHaveBeenCalled();
  });

  it('2. [HAPPY PATH] harus berhasil menyimpan visi dan misi dalam satu transaksi atomik', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce(adminSession);
    vi.mocked(db.$transaction).mockResolvedValueOnce([]);

    const formData = new FormData();
    formData.append('vision', 'Menjadi klinik kesehatan terpercaya di Pandaan.');
    formData.append('mission', 'Memberikan layanan medis berkualitas dengan harga terjangkau.');

    // Act
    const result = await updateVisionMission(formData);

    // Assert
    expect(result.success).toBe(true);
    expect(result.message).toMatch(/berhasil disimpan/i);
    expect(db.$transaction).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/');
  });
});
