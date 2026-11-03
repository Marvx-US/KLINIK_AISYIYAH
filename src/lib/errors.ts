/**
 * Custom Error Classes untuk standarisasi penanganan error di aplikasi
 * Sesuai Bab 1.1 & Bab 9.1 HANDBOOK_CLEANCODE.md
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Akses ditolak. Sesi Anda telah berakhir atau belum terautentikasi.') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Anda tidak memiliki hak akses yang cukup untuk melakukan operasi ini.') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Data yang diminta tidak ditemukan.') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Terjadi konflik data.') {
    super(message, 409);
  }
}

export class ValidationError extends AppError {
  public readonly fieldErrors?: Record<string, string[]>;

  constructor(message = 'Data yang dikirimkan tidak valid.', fieldErrors?: Record<string, string[]>) {
    super(message, 400);
    this.fieldErrors = fieldErrors;
  }
}
