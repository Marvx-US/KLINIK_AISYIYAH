import { describe, it, expect } from 'vitest';
import {
  generateScheduleShareText,
  generateScheduleShareLinks,
  type ScheduleShareParams,
} from '@/components/ui/share/share-utils';

// ============================================================
// UNIT TEST — generateScheduleShareText & generateScheduleShareLinks
// Target: src/components/ui/share/share-utils.ts
// Bab 2 HANDBOOK_TESTING: Unit Test fungsi murni
// ============================================================

const BASE_PARAMS: ScheduleShareParams = {
  poli: 'Poli Umum',
  doctorName: 'dr. Andi Pratama',
  scheduleInfo: 'Senin–Jumat: 13.00–20.00 WITA',
};

describe('generateScheduleShareText', () => {
  it('harus menghasilkan teks yang memuat nama poli, dokter, dan jadwal', () => {
    // Arrange & Act
    const result = generateScheduleShareText(BASE_PARAMS);

    // Assert
    expect(result).toContain('Poli Umum');
    expect(result).toContain('dr. Andi Pratama');
    expect(result).toContain('Senin–Jumat: 13.00–20.00 WITA');
  });

  it('harus menyertakan emoji informatif di dalam teks pesan', () => {
    const result = generateScheduleShareText(BASE_PARAMS);

    expect(result).toContain('📋');
    expect(result).toContain('🏥');
    expect(result).toContain('🩺');
    expect(result).toContain('👨‍⚕️');
    expect(result).toContain('⏰');
  });

  it('harus menyertakan URL layanan jika serviceUrl diberikan', () => {
    const params: ScheduleShareParams = {
      ...BASE_PARAMS,
      serviceUrl: 'https://klinik-aisyiyah.com/services/poli-umum',
    };

    const result = generateScheduleShareText(params);

    expect(result).toContain('https://klinik-aisyiyah.com/services/poli-umum');
  });

  it('harus tidak menyertakan baris URL jika serviceUrl tidak diberikan', () => {
    const result = generateScheduleShareText(BASE_PARAMS);

    // URL tidak boleh muncul jika tidak diberikan
    expect(result).not.toContain('http');
  });

  it('harus selalu menyertakan nomor telepon klinik', () => {
    const result = generateScheduleShareText(BASE_PARAMS);

    expect(result).toContain('0878-3117-7100');
  });

  it('harus menghasilkan teks multi-baris (bukan satu baris datar)', () => {
    const result = generateScheduleShareText(BASE_PARAMS);

    expect(result.includes('\n')).toBe(true);
  });
});

describe('generateScheduleShareLinks', () => {
  it('harus menghasilkan semua platform: whatsapp, facebook, telegram, x, dan rawText', () => {
    const links = generateScheduleShareLinks(BASE_PARAMS);

    expect(links).toHaveProperty('whatsapp');
    expect(links).toHaveProperty('facebook');
    expect(links).toHaveProperty('telegram');
    expect(links).toHaveProperty('x');
    expect(links).toHaveProperty('rawText');
  });

  it('link WhatsApp harus menggunakan domain api.whatsapp.com', () => {
    const links = generateScheduleShareLinks(BASE_PARAMS);

    expect(links.whatsapp).toMatch(/^https:\/\/api\.whatsapp\.com\/send\?text=/);
  });

  it('link Facebook harus menggunakan domain facebook.com/sharer', () => {
    const links = generateScheduleShareLinks(BASE_PARAMS);

    expect(links.facebook).toContain('facebook.com/sharer');
  });

  it('link Telegram harus menggunakan domain t.me/share', () => {
    const links = generateScheduleShareLinks(BASE_PARAMS);

    expect(links.telegram).toContain('t.me/share');
  });

  it('link X harus menggunakan domain twitter.com/intent/tweet', () => {
    const links = generateScheduleShareLinks(BASE_PARAMS);

    expect(links.x).toContain('twitter.com/intent/tweet');
  });

  it('rawText harus sama dengan hasil generateScheduleShareText', () => {
    const links = generateScheduleShareLinks(BASE_PARAMS);
    const expectedText = generateScheduleShareText(BASE_PARAMS);

    expect(links.rawText).toBe(expectedText);
  });

  it('link WhatsApp harus mengandung teks terenkode (URL-encoded)', () => {
    const links = generateScheduleShareLinks(BASE_PARAMS);

    // Spasi di-encode jadi %20 atau +
    expect(links.whatsapp).not.toContain(' '); // tidak ada spasi mentah di URL
  });

  it('[Edge Case] harus tetap berfungsi jika poli/dokter/jadwal berisi karakter khusus', () => {
    const specialParams: ScheduleShareParams = {
      poli: 'Poli KIA & Anak',
      doctorName: 'dr. Siti Rahmawati, Sp.A',
      scheduleInfo: 'Selasa & Kamis: 16.00–18.00 WITA',
    };

    // Tidak boleh throw error
    expect(() => generateScheduleShareLinks(specialParams)).not.toThrow();
    const links = generateScheduleShareLinks(specialParams);
    expect(links.whatsapp).toBeTruthy();
  });

  it('[Edge Case] harus menghasilkan link valid meski nama dokter kosong', () => {
    const emptyDoctor: ScheduleShareParams = {
      poli: 'Poli Gigi',
      doctorName: '',
      scheduleInfo: 'Setiap hari: 16.00–18.00',
    };

    expect(() => generateScheduleShareLinks(emptyDoctor)).not.toThrow();
    const links = generateScheduleShareLinks(emptyDoctor);
    expect(links.rawText).toContain('Poli Gigi');
  });
});

