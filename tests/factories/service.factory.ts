import type { Service } from '@prisma/client';

/**
 * Factory untuk data mock Service sesuai Bab 3.3 HANDBOOK_TESTING.MD
 */
export function buildMockService(overrides: Partial<Service> = {}): Service {
  return {
    id: 1,
    name: 'Poli Umum',
    slug: 'poli-umum',
    description: 'Pemeriksaan kesehatan dasar untuk berbagai rentang usia dengan dokter umum siaga.',
    iconName: 'Stethoscope',
    isActive: true,
    roomImage: '/uploads/services/poli-umum-room.webp',
    bannerImage: '/uploads/services/poli-umum-banner.webp',
    gallery: JSON.stringify(['/uploads/services/galeri-1.webp']),
    purpose: 'Mendiagnosis dan mengobati keluhan kesehatan awal.',
    benefits: 'Pelayanan cepat dan terintegrasi farmasi klinik.',
    facilities: 'Ruang periksa ber-AC, tensimeter digital, stetoskop terstandar.',
    operationalHours: 'Senin - Sabtu: 08:00 - 21:00',
    preparation: 'Membawa kartu identitas / kartu pasien.',
    procedures: 'Registrasi -> Skrining Tensi -> Konsultasi Dokter -> Resep Obat',
    faq: 'Apakah melayani BPJS? Layanan umum non-BPJS dan rujukan.',
    priceList: 'Konsultasi Dokter: Rp 35.000',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    ...overrides,
  };
}
