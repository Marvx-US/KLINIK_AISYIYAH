import { describe, it, expect } from 'vitest';
import { env } from '@/lib/env';

describe('Environment Variables Validation (Bab 5.2)', () => {
  it('should successfully parse environment variables with valid values', () => {
    expect(env).toBeDefined();
    expect(env.DATABASE_URL).toBeDefined();
    expect(typeof env.DATABASE_URL).toBe('string');
  });

  it('should have NEXT_PUBLIC_APP_URL configured as a valid URL string', () => {
    expect(env.NEXT_PUBLIC_APP_URL).toBeDefined();
    expect(env.NEXT_PUBLIC_APP_URL).toMatch(/^https?:\/\//);
  });

  it('should have a recognized NODE_ENV', () => {
    expect(['development', 'test', 'production']).toContain(env.NODE_ENV);
  });
});
