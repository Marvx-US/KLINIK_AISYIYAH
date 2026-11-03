import { describe, it, expect } from 'vitest';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

describe('Utility Functions (Bab 12.1 Unit Testing)', () => {
  describe('cn (Tailwind Class Merger)', () => {
    it('should correctly merge non-conflicting classes', () => {
      const result = cn('px-4', 'py-2', 'bg-blue-500');
      expect(result).toBe('px-4 py-2 bg-blue-500');
    });

    it('should resolve tailwind class conflicts by taking the latest class', () => {
      const result = cn('px-4', 'px-8');
      expect(result).toBe('px-8');
    });

    it('should handle conditional falsy values properly', () => {
      const isActive = false;
      const result = cn('btn', isActive && 'btn-active', null, undefined);
      expect(result).toBe('btn');
    });
  });

  describe('formatCurrency (Format Rupiah)', () => {
    it('should format numbers to Indonesian Rupiah currency string', () => {
      const formatted = formatCurrency(50000);
      // Strip non-breaking spaces for cross-platform assertion
      const normalized = formatted.replace(/\s/g, ' ');
      expect(normalized).toContain('Rp');
      expect(normalized).toContain('50.000');
    });
  });

  describe('formatDate (Format Tanggal Indonesia)', () => {
    it('should return "-" for empty or null date', () => {
      expect(formatDate(null)).toBe('-');
      expect(formatDate(undefined)).toBe('-');
    });

    it('should format a valid date to Indonesian long date format', () => {
      const testDate = new Date('2026-08-17T00:00:00Z');
      const formatted = formatDate(testDate);
      expect(formatted).toContain('Agustus');
      expect(formatted).toContain('2026');
    });
  });
});
