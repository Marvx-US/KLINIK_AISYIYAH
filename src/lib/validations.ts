// Custom validation utility library to replace Zod functionality
// Provides type-safe parsing and validation for Server Actions

type ValidationResult<T> = { success: true; data: T } | { success: false; error: string };

export const z = {
  string: (val: unknown, name: string): string => {
    if (typeof val !== 'string' || val.trim() === '') {
      throw new Error(`${name} wajib diisi.`);
    }
    return val.trim();
  },
  number: (val: unknown, name: string): number => {
    if (val === null || val === undefined || val === '') {
      throw new Error(`${name} tidak valid.`);
    }
    const num = Number(val);
    if (isNaN(num)) {
      throw new Error(`${name} harus berupa angka.`);
    }
    return num;
  },
  boolean: (val: unknown): boolean => {
    return val === 'true' || val === true;
  },
  file: (val: unknown, name: string, required: boolean = false): File | null => {
    if (val instanceof File && val.size > 0) {
      return val;
    }
    if (required) {
      throw new Error(`${name} wajib diunggah.`);
    }
    return null;
  },
  enum: <T extends string>(val: unknown, validValues: readonly T[], name: string, defaultValue?: T): T => {
    if (typeof val === 'string' && validValues.includes(val as T)) {
      return val as T;
    }
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`${name} tidak valid.`);
  },
  maxLength: (val: string, max: number, name: string) => {
    if (val.length > max) {
      throw new Error(`${name} terlalu panjang (maksimal ${max} karakter).`);
    }
    return val;
  }
};

export function parseForm<T>(parser: () => T): ValidationResult<T> {
  try {
    const data = parser();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
