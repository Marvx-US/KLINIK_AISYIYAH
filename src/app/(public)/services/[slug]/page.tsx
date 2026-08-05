import React from 'react';
import { getServiceBySlug } from '@/core/services/serviceService';
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

  // Coba ambil dari DB
  const dbService = await getServiceBySlug(rawSlug).catch(() => null) 
    || await getServiceBySlug(slug).catch(() => null);
  
  // Ambil detail statis premium
  const staticDetails = SERVICES_DATA[slug] || null;

  if (!dbService && !staticDetails) {
    notFound();
  }

  // Jika tidak ada staticDetails tapi ada dbService, kita buat fallback minimal
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

  const mergedData = {
    ...resolvedStatic,
    title: dbService?.name || resolvedStatic.title,
    fullDescription: dbService?.description || resolvedStatic.fullDescription,
    heroImage: dbService?.roomImage || resolvedStatic.heroImage,
    vaccinePrices: dbPrices || resolvedStatic.vaccinePrices || null
  };

  return <ServiceDetailClient service={mergedData} currentSlug={slug} />;
}
