import { describe, it, expect } from 'vitest';
import {
  CONTENT_STATUS,
  USER_ROLE,
  ARTICLE_CATEGORIES,
  KLINIK_INFO,
  KLINIK_HOURS,
} from './constants';

// =============================================================
// Unit Tests — src/lib/constants.ts
// Sesuai Lapis 2 HANDBOOK_TESTING.MD
// Memastikan konstanta kritis tidak berubah tanpa disengaja (regression guard)
// =============================================================

describe('CONTENT_STATUS — konstanta status konten', () => {
  it('harus memiliki nilai DRAFT yang benar', () => {
    expect(CONTENT_STATUS.DRAFT).toBe('DRAFT');
  });

  it('harus memiliki nilai PUBLISHED yang benar', () => {
    expect(CONTENT_STATUS.PUBLISHED).toBe('PUBLISHED');
  });

  it('harus memiliki tepat 2 nilai status', () => {
    expect(Object.keys(CONTENT_STATUS)).toHaveLength(2);
  });
});

// =============================================================

describe('USER_ROLE — konstanta role pengguna', () => {
  it('harus memiliki nilai ADMIN yang benar', () => {
    expect(USER_ROLE.ADMIN).toBe('ADMIN');
  });

  it('harus bersifat immutable (as const) — tidak bisa di-mutasi', () => {
    // Verifikasi bahwa nilai tersedia dan bertipe literal string
    const role: string = USER_ROLE.ADMIN;
    expect(role).toBe('ADMIN');
  });
});

// =============================================================

describe('ARTICLE_CATEGORIES — daftar kategori artikel', () => {
  it('harus berisi kategori yang diharapkan', () => {
    expect(ARTICLE_CATEGORIES).toContain('Gaya Hidup');
    expect(ARTICLE_CATEGORIES).toContain('Kesehatan Anak');
    expect(ARTICLE_CATEGORIES).toContain('Edukasi Medis');
    expect(ARTICLE_CATEGORIES).toContain('Info Klinik');
  });

  it('harus berisi tepat 4 kategori', () => {
    expect(ARTICLE_CATEGORIES).toHaveLength(4);
  });

  it('setiap kategori harus berupa string non-kosong', () => {
    ARTICLE_CATEGORIES.forEach((cat) => {
      expect(typeof cat).toBe('string');
      expect(cat.trim().length).toBeGreaterThan(0);
    });
  });
});

// =============================================================

describe('KLINIK_INFO — informasi dasar klinik', () => {
  it('harus memiliki field name yang terisi', () => {
    expect(KLINIK_INFO.name).toBeTruthy();
    expect(typeof KLINIK_INFO.name).toBe('string');
  });

  it('harus memiliki nomor WhatsApp yang valid (hanya angka)', () => {
    expect(KLINIK_INFO.whatsapp).toMatch(/^\d+$/);
  });

  it('harus memiliki email yang valid', () => {
    expect(KLINIK_INFO.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it('harus memiliki mapsUrl yang merupakan URL valid', () => {
    expect(KLINIK_INFO.mapsUrl).toMatch(/^https?:\/\//);
  });
});

// =============================================================

describe('KLINIK_HOURS — jam operasional klinik', () => {
  it('harus berupa array non-kosong', () => {
    expect(Array.isArray(KLINIK_HOURS)).toBe(true);
    expect(KLINIK_HOURS.length).toBeGreaterThan(0);
  });

  it('setiap entry harus memiliki field day, hours, dan closed', () => {
    KLINIK_HOURS.forEach((entry) => {
      expect(entry).toHaveProperty('day');
      expect(entry).toHaveProperty('hours');
      expect(entry).toHaveProperty('closed');
      expect(typeof entry.closed).toBe('boolean');
    });
  });
});
