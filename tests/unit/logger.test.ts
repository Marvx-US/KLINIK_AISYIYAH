import { describe, it, expect, vi } from 'vitest';
import { logger } from '@/lib/logger';

describe('Structured Logger (Bab 9.1)', () => {
  it('should format info logs as structured JSON', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    logger.info('User viewed dashboard', { userId: 'user-123' });

    expect(spy).toHaveBeenCalledTimes(1);
    const logCall = spy.mock.calls[0][0];
    const parsed = JSON.parse(logCall);

    expect(parsed.level).toBe('INFO');
    expect(parsed.message).toBe('User viewed dashboard');
    expect(parsed.userId).toBe('user-123');
    expect(parsed.timestamp).toBeDefined();

    spy.mockRestore();
  });

  it('should format error logs with error details as structured JSON', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const testError = new Error('Database connection failed');
    logger.error('Failed to query service', { error: testError, entityType: 'Service' });

    expect(spy).toHaveBeenCalledTimes(1);
    const logCall = spy.mock.calls[0][0];
    const parsed = JSON.parse(logCall);

    expect(parsed.level).toBe('ERROR');
    expect(parsed.message).toBe('Failed to query service');
    expect(parsed.entityType).toBe('Service');
    expect(parsed.error.errorMessage).toBe('Database connection failed');

    spy.mockRestore();
  });
});
