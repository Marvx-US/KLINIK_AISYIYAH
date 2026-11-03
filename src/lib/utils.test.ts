import { describe, it, expect } from 'vitest';
import { cn, formatCurrency, formatDate } from './utils';

// =============================================================
// Unit Tests — src/lib/utils.ts
// Sesuai Lapis 2 HANDBOOK_TESTING.MD (Unit Testing fungsi murni)
// =============================================================

describe('cn() — class name merger', () => {
  it('harus menggabungkan beberapa class menjadi satu string', () => {
    // Arrange & Act
    const result = cn('px-4', 'py-2', 'rounded');

    // Assert
    expect(result).toBe('px-4 py-2 rounded');
  });

  it('harus menghapus class yang falsy (undefined, null, false)', () => {
    const result = cn('base-class', undefined, null, false, 'active-class');
    expect(result).toBe('base-class active-class');
  });

  it('harus menyelesaikan konflik class Tailwind — class terakhir menang', () => {
    // tailwind-merge: p-4 harus menang atas p-2
    const result = cn('p-2', 'p-4');
    expect(result).toBe('p-4');
  });

  it('harus menangani conditional class object dengan benar', () => {
    const isActive = true;
    const result = cn('btn', { 'btn-primary': isActive, 'btn-secondary': !isActive });
    expect(result).toBe('btn btn-primary');
  });

  it('harus mengembalikan string kosong jika tidak ada input', () => {
    const result = cn();
    expect(result).toBe('');
  });
});

// =============================================================

describe('formatCurrency() — format Rupiah', () => {
  it('harus memformat angka positif menjadi format Rupiah Indonesia', () => {
    const result = formatCurrency(150000);
    // Harus mengandung "150.000" dan simbol Rp
    expect(result).toMatch(/Rp/);
    expect(result).toMatch(/150\.000/);
  });

  it('harus memformat angka nol dengan benar', () => {
    const result = formatCurrency(0);
    expect(result).toMatch(/Rp/);
    expect(result).toMatch(/0/);
  });

  it('harus memformat angka besar (jutaan) dengan benar', () => {
    const result = formatCurrency(1500000);
    expect(result).toMatch(/1\.500\.000/);
  });

  it('harus memformat angka negatif (nilai kredit/refund)', () => {
    const result = formatCurrency(-50000);
    // Intl.NumberFormat menambahkan tanda minus
    expect(result).toMatch(/-/);
    expect(result).toMatch(/50\.000/);
  });

  it('harus tidak menampilkan desimal (maximumFractionDigits: 0)', () => {
    const result = formatCurrency(99999.99);
    // Tidak boleh ada koma desimal
    expect(result).not.toMatch(/,\d{2}/);
  });
});

// =============================================================

describe('formatDate() — format tanggal Indonesia', () => {
  it('harus memformat objek Date menjadi tanggal Indonesia panjang', () => {
    const date = new Date('2026-10-19T00:00:00Z');
    const result = formatDate(date);
    // Harus mengandung "2026" dan salah satu bulan Indonesia
    expect(result).toMatch(/2026/);
    expect(result).toMatch(/Oktober/i);
  });

  it('harus memformat string tanggal ISO dengan benar', () => {
    const result = formatDate('2026-01-05T00:00:00Z');
    expect(result).toMatch(/2026/);
    expect(result).toMatch(/Januari/i);
  });

  it('harus mengembalikan tanda "-" untuk nilai null', () => {
    const result = formatDate(null);
    expect(result).toBe('-');
  });

  it('harus mengembalikan tanda "-" untuk nilai undefined', () => {
    const result = formatDate(undefined);
    expect(result).toBe('-');
  });

  it('harus memformat timestamp number (epoch milliseconds)', () => {
    // 1 Januari 2026 UTC
    const timestamp = new Date('2026-01-01T00:00:00Z').getTime();
    const result = formatDate(timestamp);
    expect(result).toMatch(/2026/);
  });
});
