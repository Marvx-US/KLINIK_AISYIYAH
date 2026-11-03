import { describe, it, expect } from 'vitest';
import { bannerSchema } from './banner-schema';

describe('bannerSchema Validation (Bab 4.2 Unit Testing)', () => {
  it('harus meluluskan payload banner yang valid', () => {
    const payload = {
      title: 'Pemeriksaan Kesehatan Gratis Lansia',
      isActive: true,
    };

    const result = bannerSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it('harus menolak string judul kosong atau hanya spasi', () => {
    const payload = {
      title: '   ',
      isActive: true,
    };

    const result = bannerSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.title).toBeDefined();
    }
  });

  it('harus menolak judul jika melebihi 150 karakter', () => {
    const payload = {
      title: 'a'.repeat(151),
      isActive: true,
    };

    const result = bannerSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it('harus mengisi default isActive bernilai true jika tidak diberikan', () => {
    const payload = {
      title: 'Banner Tanpa Status',
    };

    const result = bannerSchema.safeParse(payload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isActive).toBe(true);
    }
  });
});
