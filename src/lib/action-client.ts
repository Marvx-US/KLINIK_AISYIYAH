import { ActionResponse } from '@/types';
import { logger } from '@/lib/logger';

/**
 * Standard Action Client Wrapper
 * Sesuai Bab 1.1 & Bab 6.4 HANDBOOK_CLEANCODE.md
 *
 * Membungkus eksekusi Server Actions dengan logging terstruktur,
 * penanganan error terpusat, dan format ActionResponse yang konsisten.
 */
export async function createSafeAction<TInput, TOutput>(
  actionName: string,
  handler: (input: TInput) => Promise<ActionResponse<TOutput>>,
  input: TInput
): Promise<ActionResponse<TOutput>> {
  try {
    return await handler(input);
  } catch (error) {
    logger.error(`[ACTION_ERROR]: ${actionName}`, {
      actionName,
      error,
      payload: typeof input === 'object' && input !== null ? input : undefined,
    });

    const userMessage =
      error instanceof Error && !error.message.includes('Prisma')
        ? error.message
        : 'Terjadi kesalahan pada server saat memproses aksi ini.';

    return {
      success: false,
      message: userMessage,
      error: userMessage,
    };
  }
}
