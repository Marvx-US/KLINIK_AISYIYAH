'use client';

import React, { useState } from 'react';
import type { ServiceDetailData } from '@/features/services/types/public-service';
import ServiceHeroBanner from './components/service-hero-banner';
import ServiceDetailAbout from './components/service-detail-about';
import ServiceProceduresList from './components/service-procedures-list';
import ServicePricingTable from './components/service-pricing-table';
import ServiceGallerySection from './components/service-gallery-section';
import ServiceFaqSection from './components/service-faq-section';
import ServiceSidebar from './components/service-sidebar';
import ServiceCtaSection from './components/service-cta-section';
import ServiceLightboxModal from './components/service-lightbox-modal';

interface ServiceDetailClientProps {
  service: ServiceDetailData;
  currentSlug: string;
}

export default function ServiceDetailClient({ service, currentSlug }: ServiceDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const scrollToCta = () => {
    const el = document.getElementById('cta-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // URL publik halaman ini diteruskan ke tombol share jadwal
  const pageUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : `/services/${currentSlug}`;

  return (
    <div className="bg-bg-snow min-h-screen text-text-dark font-sans selection:bg-[#0EA5A4]/20 selection:text-[#0EA5A4]">
      {/* 1. Hero Banner */}
      <ServiceHeroBanner service={service} onScrollToCta={scrollToCta} />

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Kolom Kiri: Informasi Utama, Prosedur, Harga, Galeri, FAQ */}
        <div className="lg:col-span-2 space-y-20">
          <ServiceDetailAbout service={service} />
          <ServiceProceduresList procedures={service.procedures} />
          <ServicePricingTable prices={service.vaccinePrices} currentSlug={currentSlug} />
          <ServiceGallerySection 
            gallery={service.gallery} 
            serviceTitle={service.title} 
            onSelectImage={setSelectedImage} 
          />
          <ServiceFaqSection faq={service.faq} />
        </div>

        {/* Kolom Kanan: Sidebar (Jam Praktek + Share, Fasilitas, Persiapan) */}
        <ServiceSidebar service={service} currentSlug={currentSlug} pageUrl={pageUrl} />
      </div>

      {/* 3. Call to Action */}
      <ServiceCtaSection whatsappUrl={service.contactInformation.whatsapp} />

      {/* 4. Lightbox Modal */}
      <ServiceLightboxModal 
        selectedImage={selectedImage} 
        onClose={() => setSelectedImage(null)} 
      />
    </div>
  );
}
