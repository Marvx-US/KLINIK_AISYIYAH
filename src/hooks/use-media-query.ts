import { useSyncExternalStore, useCallback } from 'react';

/**
 * useMediaQuery — Mendeteksi apakah media query CSS cocok dengan viewport saat ini.
 * Berguna untuk membuat komponen responsif tanpa bergantung pada CSS saja.
 *
 * @param query - Query CSS yang valid, misal: '(max-width: 768px)'
 * @returns boolean — true jika media query cocok, false jika tidak
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener('change', callback);
      return () => mediaQueryList.removeEventListener('change', callback);
    },
    [query]
  );

  const getSnapshot = useCallback(() => {
    return window.matchMedia(query).matches;
  }, [query]);

  const getServerSnapshot = useCallback(() => {
    return false;
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
