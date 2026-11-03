import { describe, it, expect, vi } from 'vitest';
import { createSafeAction } from '@/lib/action-client';
import { logger } from '@/lib/logger';

describe('createSafeAction Wrapper (Bab 1.1 & 6.4)', () => {
  it('should return result from successful handler execution', async () => {
    const mockHandler = vi.fn().mockResolvedValue({
      success: true,
      message: 'Operasi sukses',
      data: { id: 1 },
    });

    const result = await createSafeAction('testSuccessAction', mockHandler, { id: 1 });

    expect(result.success).toBe(true);
    expect(result.message).toBe('Operasi sukses');
    expect(result.data).toEqual({ id: 1 });
  });

  it('should catch unhandled errors and return sanitized safe error message', async () => {
    const spyLogger = vi.spyOn(logger, 'error').mockImplementation(() => {});
    const mockFailingHandler = vi.fn().mockRejectedValue(new Error('Koneksi timeout'));

    const result = await createSafeAction('testFailAction', mockFailingHandler, { param: 'test' });

    expect(result.success).toBe(false);
    expect(result.message).toBe('Koneksi timeout');
    expect(spyLogger).toHaveBeenCalled();
  });

  it('should mask internal database errors from leaking to users', async () => {
    vi.spyOn(logger, 'error').mockImplementation(() => {});
    const mockDbCrashHandler = vi.fn().mockRejectedValue(new Error('PrismaClientInitializationError: Failed to connect'));

    const result = await createSafeAction('testPrismaLeakAction', mockDbCrashHandler, null);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Terjadi kesalahan pada server saat memproses aksi ini.');
  });
});
