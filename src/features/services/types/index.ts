export interface Service {
  id: number;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  isActive: boolean;
  roomImage?: string | null;
  bannerImage?: string | null;
  gallery?: string | null;
  priceList?: string | null;
  purpose?: string | null;
  benefits?: string | null;
  facilities?: string | null;
  operationalHours?: string | null;
  preparation?: string | null;
  procedures?: string | null;
  faq?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProcedureItem {
  id: string;
  title: string;
  description: string;
}

export interface FaqItemState {
  id: string;
  question: string;
  answer: string;
}

export interface PriceItemState {
  id: string;
  name: string;
  price: string;
}

export interface IconOption {
  name: string;
  label: string;
}
