import { describe, it, expect } from 'vitest';
import { scheduleSchema } from './schedule-schema';

describe('scheduleSchema Validation (Bab 4.2 Unit Testing)', () => {
  it('harus meluluskan payload jadwal dokter yang valid', () => {
    const payload = {
      poli: 'Poli Gigi & Mulut',
      doctorName: 'drg. Siti Aminah, Sp.KG',
      scheduleInfo: 'Senin - Kamis: 09:00 - 13:00',
    };

    const result = scheduleSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it('harus menolak jika ada kolom kosong', () => {
    const payload = {
      poli: '',
      doctorName: '   ',
      scheduleInfo: '',
    };

    const result = scheduleSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.poli).toBeDefined();
      expect(result.error.flatten().fieldErrors.doctorName).toBeDefined();
      expect(result.error.flatten().fieldErrors.scheduleInfo).toBeDefined();
    }
  });

  it('harus menolak jika kolom melebihi batas panjang karakter', () => {
    const payload = {
      poli: 'P'.repeat(101),
      doctorName: 'D'.repeat(101),
      scheduleInfo: 'S'.repeat(501),
    };

    const result = scheduleSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });
});
