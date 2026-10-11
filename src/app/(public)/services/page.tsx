import React from 'react';
import type { Metadata } from 'next';
import { Search } from 'lucide-react';
import { getActiveServices } from '@/core/services/serviceService';
import ServiceCard, { type ServiceCardData } from '@/components/ui/ServiceCard';
import EmptyState from '@/components/ui/EmptyState';
import { STATIC_SERVICES } from '@/components/sections/ServicesSection';
import { KLINIK_INFO } from '@/lib/constants';

export const revalidate = 60; // ISR: re-generate tiap 1 menit

export const metadata: Metadata = {
  title: 'Layanan Medis & Fasilitas Kesehatan',
  description: 'Daftar lengkap layanan kesehatan terpadu dan fasilitas medis di Klinik Aisyiyah Pangkajene, Kab. Sidrap. Pelayanan IGD 24 Jam, Poli Umum, Poli Gigi, Poli KIA/Bersalin, dan Vaksinasi.',
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'Layanan Medis & Fasilitas Kesehatan | Klinik Aisyiyah Pangkajene',
    description: 'Daftar lengkap layanan kesehatan terpadu dan fasilitas medis di Klinik Aisyiyah Pangkajene, Kab. Sidrap.',
    url: '/services',
    siteName: KLINIK_INFO.name,
    locale: 'id_ID',
    type: 'website',
  },
};

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}


async function getFilteredServices(searchQuery: string) {
  try {
    const all = await getActiveServices();
    const filtered = all.filter((svc: any) =>
      searchQuery
        ? svc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        svc.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );
    return filtered;
  } catch (error) {
    console.error('Error loading services for public page:', error);
    return [];
  }
}

export default async function ServicesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const searchQuery = params.q ?? '';

  let services = await getFilteredServices(searchQuery);
  const isFallbackUsed = services.length === 0 && !searchQuery;

  if (isFallbackUsed) {
    services = STATIC_SERVICES as any[];
  }

  return (
    <div className="pt-32 pb-16 md:pt-40 md:pb-24 w-full px-6 sm:px-8 lg:px-12 bg-bg-snow min-h-screen">
      {/* Page Header */}
      <div className="max-w-3xl mb-16">
        <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-3">
          Layanan Kesehatan
        </span>
        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-text-dark tracking-tight leading-[1.1] mb-6 font-editorial-serif">
          Solusi Layanan Medis Terpadu & Profesional
        </h1>
        <p className="text-text-muted text-lg leading-relaxed">
          {KLINIK_INFO.name} menyediakan berbagai fasilitas penunjang medis modern guna memberikan diagnosis yang tepat demi pengobatan optimal Anda dan keluarga.
        </p>
      </div>

      {/* Premium Filter/Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-12 bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-border-fine/50">
        <div className="text-sm text-text-muted font-sans font-medium px-4">
          Menampilkan <strong className="text-text-dark">{services.length}</strong> layanan medis aktif
        </div>
        <form action="/services" method="GET" className="relative w-full md:w-72">
          <input
            type="text"
            name="q"
            defaultValue={searchQuery}
            placeholder="Cari layanan..."
            className="w-full bg-bg-snow/50 border-0 rounded-xl py-2.5 pl-11 pr-4 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white text-text-dark transition-all placeholder:text-text-muted/60"
          />
          <Search className="absolute left-4 top-3 h-4 w-4 text-text-muted/70" />
        </form>
      </div>

      {/* Services Grid or Empty State */}
      {services.length === 0 ? (
        <EmptyState
          title="Layanan tidak ditemukan"
          description="Coba gunakan kata kunci pencarian yang lain."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc: any) => (
            <ServiceCard
              key={svc.id || svc.title}
              service={{
                title: svc.name || svc.title,
                slug: svc.slug,
                desc: svc.description || svc.desc,
                iconName: svc.iconName,
                icon: svc.icon,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
