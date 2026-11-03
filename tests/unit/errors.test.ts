import { describe, it, expect } from 'vitest';
import {
  AppError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  ConflictError,
} from '@/lib/errors';

describe('Custom Error Classes (Bab 1.1 & 9.1)', () => {
  it('should initialize AppError with custom message, statusCode, and operational status', () => {
    const error = new AppError('Custom system error', 500, false);
    expect(error.message).toBe('Custom system error');
    expect(error.statusCode).toBe(500);
    expect(error.isOperational).toBe(false);
    expect(error.name).toBe('AppError');
  });

  it('should create UnauthorizedError with default 401 code', () => {
    const error = new UnauthorizedError();
    expect(error.statusCode).toBe(401);
    expect(error.name).toBe('UnauthorizedError');
    expect(error.isOperational).toBe(true);
  });

  it('should create ForbiddenError with default 403 code', () => {
    const error = new ForbiddenError();
    expect(error.statusCode).toBe(403);
    expect(error.name).toBe('ForbiddenError');
  });

  it('should create NotFoundError with default 404 code and custom entity message', () => {
    const error = new NotFoundError('Artikel tidak ditemukan');
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('Artikel tidak ditemukan');
    expect(error.name).toBe('NotFoundError');
  });

  it('should create ValidationError with field errors and 400 code', () => {
    const fieldErrors = { title: ['Judul minimal 3 karakter'] };
    const error = new ValidationError('Validasi form gagal', fieldErrors);
    expect(error.statusCode).toBe(400);
    expect(error.fieldErrors).toEqual(fieldErrors);
    expect(error.name).toBe('ValidationError');
  });

  it('should create ConflictError with default 409 code', () => {
    const error = new ConflictError('Slug sudah digunakan');
    expect(error.statusCode).toBe(409);
    expect(error.message).toBe('Slug sudah digunakan');
    expect(error.name).toBe('ConflictError');
  });
});
