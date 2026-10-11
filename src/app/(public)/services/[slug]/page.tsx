import React from 'react';
import type { Metadata } from 'next';
import { getServiceBySlug, getAllServices } from '@/core/services/serviceService';
import { SERVICES_DATA, type ServiceData } from '@/data/services';
import ServiceDetailClient from './ServiceDetailClient';
import { notFound } from 'next/navigation';
import { KLINIK_INFO } from '@/lib/constants';
import JsonLd from '@/components/seo/JsonLd';
import { getMedicalServiceSchema } from '@/lib/seoSchemas';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const rawSlug = resolvedParams.slug;
  const slug = normalizeSlug(rawSlug);
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

  const staticDetails = SERVICES_DATA[slug] || null;
  const title = dbService?.name || staticDetails?.title || 'Layanan Kesehatan';
  const description = dbService?.description || staticDetails?.shortDescription || `Layanan medis ${title} terpadu di Klinik Aisyiyah Pangkajene, Kab. Sidrap.`;
  const image = dbService?.roomImage || staticDetails?.heroImage || '/logo.png';

  return {
    title: `${title} - Layanan Medis`,
    description,
    alternates: {
      canonical: `/services/${rawSlug}`,
    },
    openGraph: {
      title: `${title} | Klinik Aisyiyah Pangkajene`,
      description,
      url: `/services/${rawSlug}`,
      siteName: KLINIK_INFO.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'id_ID',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Klinik Aisyiyah`,
      description,
      images: [image],
    },
  };
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
  const lines = cleaned.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Format 1: "Nama: Harga" — format standar dengan titik dua
    if (line.includes(':')) {
      const colonIdx = line.lastIndexOf(':');
      const namePart = line.substring(0, colonIdx).trim();
      const pricePart = line.substring(colonIdx + 1).trim();
      const priceNum = parseInt(pricePart.replace(/[^0-9]/g, ''), 10);
      if (namePart && !isNaN(priceNum) && priceNum > 0) {
        list.push({ name: namePart, price: priceNum });
        i++;
        continue;
      }
    }

    // Format 2: "Nama Rp 100.000" — nama dan harga dalam satu baris dengan prefix Rp
    const inlineRpMatch = line.match(/^(.+?)\s+Rp\.?\s*([\d.,]+)\s*$/i);
    if (inlineRpMatch) {
      const name = inlineRpMatch[1].trim();
      const priceNum = parseInt(inlineRpMatch[2].replace(/[^0-9]/g, ''), 10);
      if (name && !isNaN(priceNum) && priceNum > 0) {
        list.push({ name, price: priceNum });
        i++;
        continue;
      }
    }

    // Format 3: "Nama" di baris ini, "Rp Harga" atau angka saja di baris berikutnya
    if (i + 1 < lines.length) {
      const nextLine = lines[i + 1];
      const nextRpMatch = nextLine.match(/^(?:Rp\.?\s*)?([\d.,]+)\s*$/i);
      if (nextRpMatch) {
        const name = line.trim();
        const priceNum = parseInt(nextRpMatch[1].replace(/[^0-9]/g, ''), 10);
        if (name && !isNaN(priceNum) && priceNum > 0) {
          list.push({ name, price: priceNum });
          i += 2; // lewati dua baris sekaligus
          continue;
        }
      }
    }

    i++;
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
    shortDescription: dbService?.description.substring(0, 150) || 'Layanan medis Klinik Aisyiyah Pangkajene.',
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
    contactInformation: { phone: '0878-3117-7100', whatsapp: 'https://wa.me/6287831177100', email: 'klinikaisyiyahpangkajene@gmail.com' },
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

  // BANNER IMAGE: foto ruangan dari gallery → dipakai sebagai background hero banner
  // Prioritas: gallery[0] > roomImage > static heroImage
  const finalBannerImage = (dbGallery && dbGallery.length > 0 ? dbGallery[0] : null)
    || dbService?.roomImage
    || resolvedStatic.heroImage;

  // HERO IMAGE: foto dokter / tenaga medis → ditampilkan di kartu detail
  // Prioritas: roomImage (upload foto dokter admin) > static heroImage
  const finalHeroImage = dbService?.roomImage
    || resolvedStatic.heroImage;

  let finalGallery: string[] = [];
  if (dbGallery && dbGallery.length > 0) {
    finalGallery = dbGallery;
  } else if (dbService?.roomImage) {
    finalGallery = [dbService.roomImage, ...(resolvedStatic.gallery || [])];
  } else {
    finalGallery = resolvedStatic.gallery || [];
  }

  const isPoliWithHours = ['poli-umum', 'poli-kia', 'poli-gigi'].includes(slug);
  const finalOperationalHours = isPoliWithHours
    ? (resolvedStatic.operationalHours || dbOperationalHours)
    : {};

  const mergedData = {
    ...resolvedStatic,
    title: dbService?.name || resolvedStatic.title,
    fullDescription: dbService?.description || resolvedStatic.fullDescription,
    purpose: dbPurpose || resolvedStatic.purpose,
    heroImage: finalHeroImage,
    bannerImage: finalBannerImage,
    gallery: finalGallery,
    operationalHours: finalOperationalHours,
    facilities: dbFacilities || resolvedStatic.facilities,
    benefits: dbBenefits || resolvedStatic.benefits,
    preparation: dbPreparation || resolvedStatic.preparation,
    procedures: dbProcedures || resolvedStatic.procedures,
    faq: dbFaq || resolvedStatic.faq,
    vaccinePrices: dbPrices || resolvedStatic.vaccinePrices || null
  };

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return (
    <>
      <JsonLd data={getMedicalServiceSchema(mergedData, baseUrl)} />
      <ServiceDetailClient service={mergedData} currentSlug={slug} />
    </>
  );
}

