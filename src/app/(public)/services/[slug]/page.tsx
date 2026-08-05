import React from 'react';
import { getServiceBySlug, getAllServices } from '@/core/services/serviceService';
import { SERVICES_DATA, type ServiceData } from '@/data/services';
import ServiceDetailClient from './ServiceDetailClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
  const norm = normalizeSlug(slug);
  const result = [slug, norm];
  if (norm === 'igd') result.push('igd-instalasi-gawat-darurat');
  if (norm === 'poli-kia') result.push('poli-kia-bersalin', 'kesehatan-ibu-anak-kia');
  if (norm === 'vaksin-haji') result.push('vaksin-haji-umrah', 'poli-vaksinasi');
  if (norm === 'poli-gigi') result.push('poli-gigi-mulut');
  if (norm === 'poli-umum') result.push('poli-umum-spesialis');
  if (norm === 'rehabilitasi-napza') result.push('rehabilitasi-napza-narkoba');
  return Array.from(new Set(result));
}

function cleanRaw(raw: string | null | undefined): string | null {
  if (!raw || !raw.trim()) return null;
  return raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
}

function parsePriceList(rawPrices: string | null | undefined): { name: string; price: number }[] | null {
  const cleaned = cleanRaw(rawPrices);
  if (!cleaned) return null;
  const list: { name: string; price: number }[] = [];
  const lines = cleaned.split('\n');
  for (const line of lines) {
    if (!line.trim()) continue;
    const parts = line.split(':');
    if (parts.length >= 2) {
      const name = parts[0].trim();
      const priceNum = parseInt(parts[1].replace(/[^0-9]/g, ''), 10);
      if (name && !isNaN(priceNum)) {
        list.push({ name, price: priceNum });
      }
    }
  }
  return list.length > 0 ? list.sort((a, b) => a.price - b.price) : null;
}

function parseOperationalHours(raw: string | null | undefined): Record<string, string> | null {
  const cleaned = cleanRaw(raw);
  if (!cleaned) return null;
  const hours: Record<string, string> = {};
  const lines = cleaned.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const parts = trimmed.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join(':').trim();
      if (key) {
        hours[key] = val;
      }
    } else {
      hours[trimmed] = '';
    }
  }
  return Object.keys(hours).length > 0 ? hours : null;
}

function parseList(raw: string | null | undefined): string[] | null {
  const cleaned = cleanRaw(raw);
  if (!cleaned) return null;
  const list = cleaned
    .split('\n')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
  return list.length > 0 ? list : null;
}

function parseProcedures(raw: string | null | undefined): { title: string; description: string; iconName: string }[] | null {
  const cleaned = cleanRaw(raw);
  if (!cleaned) return null;
  const list: { title: string; description: string; iconName: string }[] = [];
  const lines = cleaned.split('\n');
  for (const line of lines) {
    if (!line.trim()) continue;
    const parts = line.split('|');
    if (parts.length >= 2) {
      const title = parts[0].trim();
      const description = parts[1].trim();
      if (title) {
        list.push({ title, description, iconName: 'Activity' });
      }
    } else {
      list.push({ title: line.trim(), description: '', iconName: 'Activity' });
    }
  }
  return list.length > 0 ? list : null;
}

function parseFAQ(raw: string | null | undefined): { question: string; answer: string }[] | null {
  const cleaned = cleanRaw(raw);
  if (!cleaned) return null;
  const list: { question: string; answer: string }[] = [];
  const lines = cleaned.split('\n');
  for (const line of lines) {
    if (!line.trim()) continue;
    const parts = line.split('|');
    if (parts.length >= 2) {
      const question = parts[0].trim();
      const answer = parts[1].trim();
      if (question && answer) {
        list.push({ question, answer });
      }
    }
  }
  return list.length > 0 ? list : null;
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
  const dbOperationalHours = parseOperationalHours(dbService?.operationalHours);
  const dbFacilities = parseList(dbService?.facilities);
  const dbBenefits = parseList(dbService?.benefits);
  const dbPreparation = parseList(dbService?.preparation);
  const dbProcedures = parseProcedures(dbService?.procedures);
  const dbFaq = parseFAQ(dbService?.faq);
  const dbPurpose = dbService?.purpose ? dbService.purpose.trim() : null;

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

  // Tentukan finalHeroImage & finalGallery:
  // Foto Utama yang dipilih admin (dbService.roomImage) adalah PRIORITAS #1 untuk Tampilan Publik!
  const finalHeroImage = dbService?.roomImage 
    || (dbGallery && dbGallery.length > 0 ? dbGallery[0] : resolvedStatic.heroImage);

  let finalGallery: string[] = [];
  if (dbGallery && dbGallery.length > 0) {
    if (dbService?.roomImage && !dbGallery.includes(dbService.roomImage)) {
      finalGallery = [dbService.roomImage, ...dbGallery];
    } else {
      finalGallery = dbGallery;
    }
  } else if (dbService?.roomImage) {
    finalGallery = [dbService.roomImage, ...(resolvedStatic.gallery || [])];
  } else {
    finalGallery = resolvedStatic.gallery || [];
  }

  const mergedData = {
    ...resolvedStatic,
    title: dbService?.name || resolvedStatic.title,
    fullDescription: dbService?.description || resolvedStatic.fullDescription,
    purpose: dbPurpose || resolvedStatic.purpose,
    heroImage: finalHeroImage,
    gallery: finalGallery,
    operationalHours: dbOperationalHours || resolvedStatic.operationalHours,
    facilities: dbFacilities || resolvedStatic.facilities,
    benefits: dbBenefits || resolvedStatic.benefits,
    preparation: dbPreparation || resolvedStatic.preparation,
    procedures: dbProcedures || resolvedStatic.procedures,
    faq: dbFaq || resolvedStatic.faq,
    vaccinePrices: dbPrices || resolvedStatic.vaccinePrices || null
  };

  return <ServiceDetailClient service={mergedData} currentSlug={slug} />;
}
