import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode || 'test', process.cwd(), '');
  Object.assign(process.env, env);

  return {
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./tests/setup/vitest.setup.ts'],
      clearMocks: true,
      restoreMocks: true,
      include: ['src/**/*.{test,spec}.{ts,tsx}', 'tests/**/*.{test,spec}.{ts,tsx}'],
      exclude: ['tests/e2e/**', 'node_modules/**', '.next/**'],
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
  };
});
