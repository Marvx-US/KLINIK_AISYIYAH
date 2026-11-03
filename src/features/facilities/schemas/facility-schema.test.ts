import { describe, it, expect } from 'vitest';
import { facilitySchema } from './facility-schema';

describe('facilitySchema Validation (Bab 4.2 Unit Testing)', () => {
  it('harus meluluskan payload fasilitas yang valid', () => {
    const payload = {
      name: 'Laboratorium Klinik 24 Jam',
      description: 'Pemeriksaan darah lengkap, urine, dan kimia darah.',
      isActive: true,
    };

    const result = facilitySchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it('harus menolak jika nama atau deskripsi kosong', () => {
    const payload = {
      name: '  ',
      description: '',
    };

    const result = facilitySchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toBeDefined();
      expect(result.error.flatten().fieldErrors.description).toBeDefined();
    }
  });

  it('harus menolak jika nama melebihi 100 karakter atau deskripsi melebihi 500 karakter', () => {
    const payload = {
      name: 'A'.repeat(101),
      description: 'B'.repeat(501),
    };

    const result = facilitySchema.safeParse(payload);
    expect(result.success).toBe(false);
  });
});
