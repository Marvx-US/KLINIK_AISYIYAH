import { describe, it, expect, vi, beforeEach } from 'vitest';
import { revalidatePath } from 'next/cache';
import { saveService } from './save-service';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { buildMockService } from '../../../../tests/factories/service.factory';
import { USER_ROLE } from '@/lib/constants';

vi.mock('@/lib/auth', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  db: {
    service: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('../utils/service-media', () => ({
  processServiceMedia: vi.fn().mockResolvedValue({
    roomImage: null,
    bannerImage: null,
    gallery: null,
  }),
}));

describe('saveService Server Action (Bab 4.3 Integration Testing)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. [RBAC] harus menolak request jika user belum login atau bukan ADMIN', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce(null);
    const formData = new FormData();
    formData.append('name', 'Poli Gigi');

    // Act
    const result = await saveService(formData);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/akses ditolak/i);
    expect(db.service.create).not.toHaveBeenCalled();
  });

  it('2. [ZOD] harus mengembalikan fieldErrors jika input nama atau deskripsi kosong', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce({
      id: 'admin-1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });
    const formData = new FormData();
    formData.append('name', ''); // Invalid: nama wajib diisi

    // Act
    const result = await saveService(formData);

    // Assert
    expect(result.success).toBe(false);
    expect(result.fieldErrors).toBeDefined();
    expect(db.service.create).not.toHaveBeenCalled();
  });

  it('3. [ATURAN BISNIS] harus menolak update jika service ID tidak ditemukan di DB', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce({
      id: 'admin-1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });
    vi.mocked(db.service.findUnique).mockResolvedValueOnce(null);

    const formData = new FormData();
    formData.append('id', '999');
    formData.append('name', 'Poli Mata');
    formData.append('description', 'Pemeriksaan mata komprehensif.');
    formData.append('iconName', 'Eye');
    formData.append('isActive', 'true');

    // Act
    const result = await saveService(formData);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/tidak ditemukan/i);
    expect(db.service.update).not.toHaveBeenCalled();
  });

  it('4. [HAPPY PATH] harus berhasil membuat layanan baru dan memanggil revalidatePath', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce({
      id: 'admin-1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });
    vi.mocked(db.service.findUnique).mockResolvedValueOnce(null); // slug cek unik

    const mockCreated = buildMockService({
      id: 10,
      name: 'Poli Anak & Imunisasi',
      slug: 'poli-anak-imunisasi',
    });
    vi.mocked(db.service.create).mockResolvedValueOnce(mockCreated);

    const formData = new FormData();
    formData.append('name', 'Poli Anak & Imunisasi');
    formData.append('description', 'Layanan kesehatan tumbuh kembang anak terpadu.');
    formData.append('iconName', 'Baby');
    formData.append('isActive', 'true');

    // Act
    const result = await saveService(formData);

    // Assert
    expect(result.success).toBe(true);
    expect(result.data?.service?.id).toBe(10);
    expect(db.service.create).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
    expect(revalidatePath).toHaveBeenCalledWith('/services', 'layout');
    expect(revalidatePath).toHaveBeenCalledWith('/admin/services', 'layout');
  });
});
