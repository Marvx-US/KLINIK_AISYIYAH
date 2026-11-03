import type { Service } from '@prisma/client';
import { type ServiceData } from '../constants/services-data';
import type { ServiceDetailData, VaccinePriceItem, Procedure, FAQItem } from '../types/public-service';

export function normalizeSlug(slug: string): string {
  const s = slug.toLowerCase().trim();
  if (s === 'igd-instalasi-gawat-darurat') return 'igd';
  if (s === 'poli-kia-bersalin' || s === 'kesehatan-ibu-anak-kia') return 'poli-kia';
  if (s === 'vaksin-haji-umrah' || s === 'poli-vaksinasi') return 'vaksin-haji';
  if (s === 'poli-gigi-mulut') return 'poli-gigi';
  return s;
}

export function getPossibleDbSlugs(slug: string): string[] {
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

export function cleanRaw(raw: string | null | undefined): string | null {
  if (!raw || !raw.trim()) return null;
  return raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
}

export function parsePriceList(rawPrices: string | null | undefined): VaccinePriceItem[] | null {
  const cleaned = cleanRaw(rawPrices);
  if (!cleaned) return null;
  const list: VaccinePriceItem[] = [];
  const lines = cleaned.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Format 1: "Nama: Harga"
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

    // Format 2: "Nama Rp 100.000"
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

    // Format 3: "Nama" di baris ini, "Rp Harga" di baris berikutnya
    if (i + 1 < lines.length) {
      const nextLine = lines[i + 1];
      const nextRpMatch = nextLine.match(/^(?:Rp\.?\s*)?([\d.,]+)\s*$/i);
      if (nextRpMatch) {
        const name = line.trim();
        const priceNum = parseInt(nextRpMatch[1].replace(/[^0-9]/g, ''), 10);
        if (name && !isNaN(priceNum) && priceNum > 0) {
          list.push({ name, price: priceNum });
          i += 2;
          continue;
        }
      }
    }

    i++;
  }

  return list.length > 0 ? list.sort((a, b) => a.price - b.price) : null;
}

export function parseOperationalHours(raw: string | null | undefined): Record<string, string> | null {
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
      if (key) hours[key] = val;
    } else {
      hours[trimmed] = '';
    }
  }
  return Object.keys(hours).length > 0 ? hours : null;
}

export function parseList(raw: string | null | undefined): string[] | null {
  const cleaned = cleanRaw(raw);
  if (!cleaned) return null;
  const list = cleaned
    .split('\n')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
  return list.length > 0 ? list : null;
}

export function parseProcedures(raw: string | null | undefined): Procedure[] | null {
  const cleaned = cleanRaw(raw);
  if (!cleaned) return null;
  const list: Procedure[] = [];
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

export function parseFAQ(raw: string | null | undefined): FAQItem[] | null {
  const cleaned = cleanRaw(raw);
  if (!cleaned) return null;
  const list: FAQItem[] = [];
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

export function buildMergedServiceData(
  slug: string,
  dbService: Service | null,
  staticDetails: ServiceData | null
): ServiceDetailData {
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

  const finalBannerImage = dbService?.bannerImage
    || (dbGallery && dbGallery.length > 0 ? dbGallery[0] : null)
    || dbService?.roomImage
    || resolvedStatic.heroImage;

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
    ? (resolvedStatic.operationalHours || dbOperationalHours || {})
    : {};

  return {
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
}
