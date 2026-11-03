
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

export interface Procedure {
  title: string;
  description: string;
  iconName: string;
}

export interface VaccinePriceItem {
  name: string;
  price: number;
}

export interface ServiceDetailData {
  id: number;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  purpose: string;
  benefits: string[];
  targetAudience: string;
  heroImage: string;     // Foto dokter / tenaga medis
  bannerImage: string;   // Foto ruangan (background hero banner)
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
  vaccinePrices?: VaccinePriceItem[] | null;
}
