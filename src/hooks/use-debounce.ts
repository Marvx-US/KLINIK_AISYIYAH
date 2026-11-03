import { useEffect, useState } from 'react';

/**
 * useDebounce — Menunda pembaruan nilai hingga selang waktu tertentu berlalu.
 * Digunakan untuk mencegah pemanggilan API berulang saat pengguna mengetik.
 *
 * @param value - Nilai yang akan di-debounce
 * @param delayMs - Jeda waktu dalam milidetik (default: 400ms)
 * @returns Nilai yang sudah di-debounce
 */
export function useDebounce<T>(value: T, delayMs = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}
