// =============================================================
// Shared types across all layers (Single Source of Truth)
// Mengikuti standar HANDBOOK_CLEANCODE.md
// =============================================================

/**
 * Format standar response mutasi data Server Actions
 * Sesuai Bab 6.2 HANDBOOK_CLEANCODE.md
 */
export type ActionResponse<T = void> = {
  success: boolean;
  message: string;
  error?: string;
  data?: T;
  fieldErrors?: Record<string, string[]>;
};

/**
 * Tipe lama untuk kompatibilitas selama masa transisi
 */
export type ActionResult<T = void> = {
  success?: boolean;
  error?: string;
  message?: string;
  data?: T;
  service?: unknown;
};

/**
 * Parameter standar paginasi (Bab 1.1 & Bab 6.2)
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

/**
 * Format standar hasil query berpaginasi (Bab 1.1 & Bab 6.2)
 */
export interface PaginatedResult<T> {
  items: T[];
  meta: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}
