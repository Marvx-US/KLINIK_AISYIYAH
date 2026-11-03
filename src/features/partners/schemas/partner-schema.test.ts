import { describe, it, expect } from 'vitest';
import { partnerSchema } from './partner-schema';

describe('partnerSchema Validation (Bab 4.2 Unit Testing)', () => {
  it('harus meluluskan payload mitra yang valid', () => {
    const payload = {
      name: 'BPJS Kesehatan Kantor Cabang Utama',
    };

    const result = partnerSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it('harus menolak jika nama mitra kosong atau hanya whitespace', () => {
    const payload = {
      name: '     ',
    };

    const result = partnerSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toBeDefined();
    }
  });

  it('harus menolak jika nama mitra melebihi 100 karakter', () => {
    const payload = {
      name: 'P'.repeat(101),
    };

    const result = partnerSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });
});
