// =============================================================
// Indeks data layanan klinik — menggabungkan semua data per-layanan
// Sesuai Bab 4.1 HANDBOOK_CLEANCODE.md (maks 250 baris per file)
// =============================================================

export type { ServiceData, Doctor, FAQItem, Procedure } from './services-data-types';

export { SERVICE_IGD } from './service-igd';
export { SERVICE_POLI_UMUM } from './service-poli-umum';
export { SERVICE_POLI_GIGI } from './service-poli-gigi';
export { SERVICE_POLI_KIA } from './service-poli-kia';
export { SERVICE_VAKSIN_HAJI } from './service-vaksin-haji';
export { SERVICE_REHABILITASI_NAPZA } from './service-rehabilitasi-napza';

import { SERVICE_IGD } from './service-igd';
import { SERVICE_POLI_UMUM } from './service-poli-umum';
import { SERVICE_POLI_GIGI } from './service-poli-gigi';
import { SERVICE_POLI_KIA } from './service-poli-kia';
import { SERVICE_VAKSIN_HAJI } from './service-vaksin-haji';
import { SERVICE_REHABILITASI_NAPZA } from './service-rehabilitasi-napza';
import { type ServiceData } from './services-data-types';

export const SERVICES_DATA: Record<string, ServiceData> = {
  igd: SERVICE_IGD,
  'poli-umum': SERVICE_POLI_UMUM,
  'poli-gigi': SERVICE_POLI_GIGI,
  'poli-kia': SERVICE_POLI_KIA,
  'vaksin-haji': SERVICE_VAKSIN_HAJI,
  'rehabilitasi-napza': SERVICE_REHABILITASI_NAPZA,
};
