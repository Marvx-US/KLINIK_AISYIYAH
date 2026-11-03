/**
 * Global Constants — Single Source of Truth
 * Sesuai Bab 1.1 & Bab 3.2 HANDBOOK_CLEANCODE.md
 */

export * from '@/lib/constants';

export const PAGINATION_LIMITS = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
} as const;
