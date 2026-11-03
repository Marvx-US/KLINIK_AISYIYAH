import { describe, it, expect, vi, beforeEach } from 'vitest';
import { revalidatePath } from 'next/cache';
import { savePartner } from './save-partner';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { uploadFile } from '@/lib/upload';
import { USER_ROLE } from '@/lib/constants';

vi.mock('@/lib/auth', () => ({ getSession: vi.fn() }));
vi.mock('@/lib/db', () => ({
  db: {
    partner: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));
vi.mock('@/lib/upload', () => ({ uploadFile: vi.fn() }));

const adminSession = { id: 'admin-1', username: 'admin', name: 'Admin', role: USER_ROLE.ADMIN };

describe('savePartner Server Action (Bab 4.3 Integration Testing)', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('1. [RBAC] harus menolak jika tidak ada sesi valid', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce(null);
    const formData = new FormData();
    formData.append('name', 'BPJS Kesehatan');

    // Act
    const result = await savePartner(formData);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/akses ditolak/i);
    expect(db.partner.create).not.toHaveBeenCalled();
  });

  it('2. [ZOD] harus mengembalikan fieldErrors jika nama mitra kosong', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce(adminSession);
    const formData = new FormData();
    formData.append('name', '');

    // Act
    const result = await savePartner(formData);

    // Assert
    expect(result.success).toBe(false);
    expect(result.fieldErrors).toBeDefined();
    expect(db.partner.create).not.toHaveBeenCalled();
  });

  it('3. [ATURAN BISNIS] harus menolak mitra baru tanpa file logo', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce(adminSession);
    const formData = new FormData();
    formData.append('name', 'BPJS Kesehatan');
    // Tidak ada file logo

    // Act
    const result = await savePartner(formData);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/logo mitra wajib/i);
    expect(db.partner.create).not.toHaveBeenCalled();
  });

  it('4. [ATURAN BISNIS] harus menolak update jika mitra ID tidak ditemukan di DB', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce(adminSession);
    vi.mocked(db.partner.findUnique).mockResolvedValueOnce(null);
    const formData = new FormData();
    formData.append('id', '999');
    formData.append('name', 'BPJS Updated');

    // Act
    const result = await savePartner(formData);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/tidak ditemukan/i);
    expect(db.partner.update).not.toHaveBeenCalled();
  });

  it('5. [HAPPY PATH] harus berhasil membuat mitra baru dengan logo dan me-revalidate cache', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce(adminSession);
    vi.mocked(uploadFile).mockResolvedValueOnce('/uploads/partners/bpjs.webp');
    vi.mocked(db.partner.create).mockResolvedValueOnce({
      id: 8, name: 'BPJS Kesehatan', logoUrl: '/uploads/partners/bpjs.webp',
      isActive: true, createdAt: new Date(), updatedAt: new Date(),
    });

    const logoFile = new File(['logo'], 'bpjs.webp', { type: 'image/webp' });
    const formData = new FormData();
    formData.append('name', 'BPJS Kesehatan');
    formData.append('image', logoFile);

    // Act
    const result = await savePartner(formData);

    // Assert
    expect(result.success).toBe(true);
    expect(result.data?.id).toBe(8);
    expect(uploadFile).toHaveBeenCalled();
    expect(db.partner.create).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/');
    expect(revalidatePath).toHaveBeenCalledWith('/admin/partners');
  });
});
