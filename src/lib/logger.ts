/**
 * Structured Logger & Audit Trail Helper
 * Sesuai Bab 9.1 & 9.2 HANDBOOK_CLEANCODE.md
 */

interface LogContext {
  userId?: string;
  actionName?: string;
  entityId?: string | number;
  entityType?: string;
  payload?: unknown;
  error?: unknown;
  [key: string]: unknown;
}

export const logger = {
  info: (message: string, context?: LogContext) => {
    const timestamp = new Date().toISOString();
    console.log(
      JSON.stringify({
        level: 'INFO',
        timestamp,
        message,
        ...context,
      })
    );
  },

  warn: (message: string, context?: LogContext) => {
    const timestamp = new Date().toISOString();
    console.warn(
      JSON.stringify({
        level: 'WARN',
        timestamp,
        message,
        ...context,
      })
    );
  },

  error: (message: string, context?: LogContext) => {
    const timestamp = new Date().toISOString();
    const errorDetails =
      context?.error instanceof Error
        ? {
            errorMessage: context.error.message,
            stack: context.error.stack,
          }
        : context?.error;

    console.error(
      JSON.stringify({
        level: 'ERROR',
        timestamp,
        message,
        ...context,
        error: errorDetails,
      })
    );
  },
};
