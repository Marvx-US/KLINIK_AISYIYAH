// =============================================================
// Tipe data bersama untuk mock data layanan klinik
// Sesuai Bab 5 HANDBOOK_CLEANCODE.md (Zero `any`)
// =============================================================

export interface Procedure {
  title: string;
  description: string;
  iconName: string;
}

export interface Doctor {
  name: string;
  specialty: string;
  experience: string;
  schedule: string;
  image: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ServiceData {
  id: number;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  purpose: string;
  benefits: string[];
  targetAudience: string;
  heroImage: string;
  gallery: string[];
  facilities: string[];
  doctors: Doctor[];
  operationalHours: Record<string, string>;
  workflow: string[];
  preparation: string[];
  procedures: Procedure[];
  faq: FAQItem[];
  relatedServices: string[];
  contactInformation: {
    phone: string;
    whatsapp: string;
    email: string;
  };
  vaccinePrices?: { name: string; price: number }[] | null;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}
