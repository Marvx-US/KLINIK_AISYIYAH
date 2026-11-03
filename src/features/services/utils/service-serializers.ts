import { SERVICES_DATA } from '../constants/services-data';
import {
  type Service,
  type ProcedureItem,
  type FaqItemState,
  type PriceItemState,
} from '../types';

export function normalizeSlug(slug: string): string {
  const s = slug.toLowerCase().trim();
  if (s.includes('igd')) return 'igd';
  if (s.includes('kia') || s.includes('bersalin')) return 'poli-kia';
  if (s.includes('vaksin') || s.includes('haji')) return 'vaksin-haji';
  if (s.includes('gigi')) return 'poli-gigi';
  if (s.includes('napza') || s.includes('rehab')) return 'rehabilitasi-napza';
  if (s.includes('umum')) return 'poli-umum';
  return s;
}

export function getInitialFormValues(service: Service) {
  const normSlug = normalizeSlug(service.slug);
  const staticData = SERVICES_DATA[normSlug] || SERVICES_DATA[service.slug];

  let operationalHours = service.operationalHours || '';
  if (!operationalHours && staticData?.operationalHours) {
    operationalHours = Object.entries(staticData.operationalHours)
      .map(([day, time]) => `${day}: ${time}`)
      .join('\n');
  }

  let facilities = service.facilities || '';
  if (!facilities && staticData?.facilities) {
    facilities = staticData.facilities.join('\n');
  }

  let purpose = service.purpose || '';
  if (!purpose && staticData?.purpose) {
    purpose = staticData.purpose;
  }

  let benefits = service.benefits || '';
  if (!benefits && staticData?.benefits) {
    benefits = staticData.benefits.join('\n');
  }

  let preparation = service.preparation || '';
  if (!preparation && staticData?.preparation) {
    preparation = staticData.preparation.join('\n');
  }

  let procedures = service.procedures || '';
  if (!procedures && staticData?.procedures) {
    procedures = staticData.procedures.map((p) => `${p.title} | ${p.description}`).join('\n');
  }

  let faq = service.faq || '';
  if (!faq && staticData?.faq) {
    faq = staticData.faq.map((f) => `${f.question} | ${f.answer}`).join('\n');
  }

  let priceList = service.priceList || '';
  if (!priceList && staticData?.vaccinePrices) {
    priceList = staticData.vaccinePrices.map((v) => `${v.name}: ${v.price}`).join('\n');
  }

  return {
    operationalHours,
    facilities,
    purpose,
    benefits,
    preparation,
    procedures,
    faq,
    priceList,
  };
}

export function parseProceduresToItems(raw: string): ProcedureItem[] {
  if (!raw || !raw.trim()) return [];
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line, idx) => {
      const parts = line.split('|');
      return {
        id: `proc-${idx}-${Math.random().toString(36).slice(2, 7)}`,
        title: parts[0]?.trim() || '',
        description: parts.slice(1).join('|').trim() || '',
      };
    });
}

export function serializeProcedures(items: ProcedureItem[]): string {
  return items
    .filter((item) => item.title.trim() || item.description.trim())
    .map((item) => `${item.title.trim()} | ${item.description.trim()}`)
    .join('\n');
}

export function parseFaqToItems(raw: string): FaqItemState[] {
  if (!raw || !raw.trim()) return [];
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line, idx) => {
      const parts = line.split('|');
      return {
        id: `faq-${idx}-${Math.random().toString(36).slice(2, 7)}`,
        question: parts[0]?.trim() || '',
        answer: parts.slice(1).join('|').trim() || '',
      };
    });
}

export function serializeFaq(items: FaqItemState[]): string {
  return items
    .filter((item) => item.question.trim() || item.answer.trim())
    .map((item) => `${item.question.trim()} | ${item.answer.trim()}`)
    .join('\n');
}

export function parsePriceListToItems(raw: string): PriceItemState[] {
  if (!raw || !raw.trim()) return [];
  const items: PriceItemState[] = [];
  const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.toLowerCase().startsWith('format:')) continue;

    if (line.includes(':')) {
      const colonIdx = line.lastIndexOf(':');
      const name = line.substring(0, colonIdx).trim();
      const price = line.substring(colonIdx + 1).replace(/[^0-9]/g, '').trim();
      if (name) {
        items.push({ id: `price-${i}-${Math.random().toString(36).slice(2, 7)}`, name, price });
        continue;
      }
    }

    const rpMatch = line.match(/^(.+?)\s+Rp\.?\s*([\d.,]+)\s*$/i);
    if (rpMatch) {
      items.push({
        id: `price-${i}-${Math.random().toString(36).slice(2, 7)}`,
        name: rpMatch[1].trim(),
        price: rpMatch[2].replace(/[^0-9]/g, ''),
      });
      continue;
    }

    items.push({ id: `price-${i}-${Math.random().toString(36).slice(2, 7)}`, name: line, price: '' });
  }
  return items;
}

export function serializePriceList(items: PriceItemState[]): string {
  return items
    .filter((item) => item.name.trim())
    .map((item) => {
      const cleanPrice = item.price.replace(/[^0-9]/g, '').trim();
      return `${item.name.trim()}: ${cleanPrice || '0'}`;
    })
    .join('\n');
}
