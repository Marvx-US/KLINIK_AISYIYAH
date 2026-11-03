import { type SessionUser } from '@/lib/auth';
import { type User } from '@prisma/client';

/**
 * Factory untuk SessionUser (payload JWT setelah login)
 */
export function buildMockSession(overrides: Partial<SessionUser> = {}): SessionUser {
  return {
    id: 'user-admin-test-uuid',
    username: 'admin.test',
    name: 'Admin Test',
    role: 'ADMIN',
    ...overrides,
  };
}

/**
 * Factory untuk User model Prisma (baris di tabel users)
 * Sesuai Bab 3.3 HANDBOOK_TESTING.MD — Test Data Factory Pattern
 */
export function buildMockUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-db-test-uuid',
    username: 'admin@klinik.com',
    password: '$2a$10$hashedpassword.placeholder.string.only',
    name: 'Admin Klinik',
    role: 'ADMIN',
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
    ...overrides,
  };
}
