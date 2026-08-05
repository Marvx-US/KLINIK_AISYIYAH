import React from 'react';
import { getServiceBySlug, getAllServices } from '@/core/services/serviceService';
import { SERVICES_DATA, type ServiceData } from '@/data/services';
import ServiceDetailClient from './ServiceDetailClient';
import { notFound } from 'next/navigation';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

function normalizeSlug(slug: string): string {
  const s = slug.toLowerCase().trim();
  if (s === 'igd-instalasi-gawat-darurat') return 'igd';
  if (s === 'poli-kia-bersalin' || s === 'kesehatan-ibu-anak-kia') return 'poli-kia';
  if (s === 'vaksin-haji-umrah' || s === 'poli-vaksinasi') return 'vaksin-haji';
  if (s === 'poli-gigi-mulut') return 'poli-gigi';
  return s;
}

function getPossibleDbSlugs(slug: string): string[] {
  const s = slug.toLowerCase().trim();
  const set = new Set<string>([s]);
  if (s === 'igd' || s === 'igd-instalasi-gawat-darurat') {
    set.add('igd');
    set.add('igd-instalasi-gawat-darurat');
  }
  if (s === 'poli-kia' || s === 'poli-kia-bersalin' || s === 'kesehatan-ibu-anak-kia') {
    set.add('poli-kia');
    set.add('poli-kia-bersalin');
    set.add('kesehatan-ibu-anak-kia');
  }
  if (s === 'vaksin-haji' || s === 'vaksin-haji-umrah' || s === 'poli-vaksinasi') {
    set.add('vaksin-haji');
    set.add('vaksin-haji-umrah');
    set.add('poli-vaksinasi');
  }
  if (s === 'poli-gigi' || s === 'poli-gigi-mulut') {
    set.add('poli-gigi');
    set.add('poli-gigi-mulut');
  }
  return Array.from(set);
}

function parsePriceList(rawPrices: string | null | undefined): { name: string; price: number }[] | null {
  if (!rawPrices) return null;
  const list: { name: string; price: number }[] = [];
  const lines = rawPrices.split('\n');
  for (const line of lines) {
    if (!line.trim()) continue;
    const parts = line.split(':');
    if (parts.length >= 2) {
      const name = parts[0].trim();
      const priceVal = parts[1].trim().replace(/[^0-9]/g, '');
      const price = parseInt(priceVal, 10);
      if (name && !isNaN(price)) {
        list.push({ name, price });
      }
    }
  }
  return list.length > 0 ? list.sort((a, b) => a.price - b.price) : null;
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams.slug;
  const slug = normalizeSlug(rawSlug);

  // Ambil service dari DB dengan pencarian fleksibel
  const candidateSlugs = getPossibleDbSlugs(rawSlug);
  let dbService: any = null;
  for (const candidate of candidateSlugs) {
    dbService = await getServiceBySlug(candidate).catch(() => null);
    if (dbService) break;
  }
  if (!dbService) {
    const allDb = await getAllServices().catch(() => []);
    dbService = allDb.find((s: any) => 
      candidateSlugs.some(c => s.slug.toLowerCase().includes(c) || c.includes(s.slug.toLowerCase()))
    ) || null;
  }

  // Ambil detail statis premium
  const staticDetails = SERVICES_DATA[slug] || null;

  if (!dbService && !staticDetails) {
    notFound();
  }

  // Jika tidak ada staticDetails tapi ada dbService, buat fallback
  const resolvedStatic: ServiceData = staticDetails || {
    id: dbService?.id || 0,
    slug: slug,
    title: dbService?.name || 'Layanan Kesehatan',
    shortDescription: dbService?.description.substring(0, 150) || 'Layanan medis Klinik Pratama Aisyiyah.',
    fullDescription: dbService?.description || 'Detail layanan belum tersedia.',
    purpose: 'Memberikan pelayanan kesehatan prima.',
    benefits: ['Pelayanan ramah', 'Dokter profesional', 'Fasilitas memadai'],
    targetAudience: 'Masyarakat umum',
    heroImage: dbService?.roomImage || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop',
    gallery: [dbService?.roomImage || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop'],
    facilities: ['Ruang Tunggu', 'AC', 'Wi-Fi'],
    doctors: [],
    operationalHours: { 'Senin - Sabtu': '08:00 - 20:00 WIB' },
    workflow: ['Pendaftaran', 'Pemeriksaan', 'Pembayaran & Obat'],
    preparation: ['Membawa KTP/Kartu BPJS'],
    procedures: [],
    faq: [],
    relatedServices: [],
    contactInformation: { phone: '(0274) 555-888', whatsapp: 'https://wa.me/6281122334455', email: 'info@klinikaisyiyah.com' },
    seo: { title: dbService?.name || 'Layanan', description: dbService?.description || 'Layanan', keywords: [] }
  };

  const dbPrices = parsePriceList(dbService?.priceList);

  // Parse dbService.gallery jika ada dari admin
  let dbGallery: string[] | null = null;
  if (dbService?.gallery) {
    try {
      const parsed = JSON.parse(dbService.gallery);
      if (Array.isArray(parsed) && parsed.length > 0) {
        dbGallery = parsed.filter((url) => typeof url === 'string' && url.trim() !== '');
      }
    } catch {
      dbGallery = null;
    }
  }

  // Tentukan gallery final: jika admin pernah upload galeri, gunakan dbGallery secara utama!
  let finalGallery: string[] = [];
  if (dbGallery && dbGallery.length > 0) {
    finalGallery = dbGallery;
  } else {
    finalGallery = resolvedStatic.gallery || [];
  }

  if (dbService?.roomImage && !finalGallery.includes(dbService.roomImage)) {
    finalGallery = [dbService.roomImage, ...finalGallery];
  }

  const mergedData = {
    ...resolvedStatic,
    title: dbService?.name || resolvedStatic.title,
    fullDescription: dbService?.description || resolvedStatic.fullDescription,
    heroImage: dbService?.roomImage || resolvedStatic.heroImage,
    gallery: finalGallery,
    vaccinePrices: dbPrices || resolvedStatic.vaccinePrices || null
  };

  return <ServiceDetailClient service={mergedData} currentSlug={slug} />;
}
