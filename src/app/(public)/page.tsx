import React from 'react';
import { getActiveBanners } from '@/core/services/bannerService';
import { getActiveFacilities } from '@/core/services/facilityService';
import { getActivePartners } from '@/core/services/partnerService';
import { getPublishedArticles } from '@/core/services/articleService';
import { getPublishedEvents } from '@/core/services/eventService';
import { getActiveServices } from '@/core/services/serviceService';
import { getAboutImageUrl } from '@/core/services/siteSettingService';
import { FALLBACK_ARTICLES, FALLBACK_EVENTS, FAQ_ITEMS } from '@/lib/constants';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import SectionHeader from '@/components/ui/SectionHeader';
import ArticleCard, { type ArticleCardData } from '@/components/ui/ArticleCard';
import EventCard, { type EventCardData } from '@/components/ui/EventCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import FAQSection from '@/components/sections/FAQSection';
import JsonLd from '@/components/seo/JsonLd';
import { getClinicSchema, getFaqSchema } from '@/lib/seoSchemas';

import dynamic from 'next/dynamic';


const AboutClinicSection = dynamic(
  () => import('@/components/sections/AboutClinicSection'),
  { ssr: true }
);
const FacilityGallerySection = dynamic(
  () => import('@/components/sections/FacilityGallerySection'),
  { ssr: true }
);
const PartnersCarouselSection = dynamic(
  () => import('@/components/sections/PartnersCarouselSection'),
  { ssr: true }
);

export const revalidate = 60; // ISR: re-generate tiap 1 menit

/**
 * HomePage — Halaman utama website Klinik Aisyiyah.
 * Semua data diambil via Service Layer (bukan langsung ke DB).
 */
export default async function HomePage() {

  const [rawArticles, rawEvents, banners, facilities, partners, services, aboutImageSetting] = await Promise.all([
    getPublishedArticles().catch(() => []),
    getPublishedEvents().catch(() => []),
    getActiveBanners().catch(() => []),
    getActiveFacilities().catch(() => []),
    getActivePartners().catch(() => []),
    getActiveServices().catch(() => []),
    getAboutImageUrl().catch(() => null),
  ]);

  // Fallback jika database kosong
  const articles: ArticleCardData[] = rawArticles.length > 0
    ? rawArticles.slice(0, 3).map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      summary: a.summary,
      category: a.category,
      coverImage: a.coverImage ?? null,
      createdAt: a.createdAt,
    }))
    : FALLBACK_ARTICLES;

  const events: EventCardData[] = rawEvents.length > 0
    ? rawEvents.slice(0, 2).map((e) => ({
      id: e.id,
      title: e.title,
      slug: e.slug,
      content: e.content,
      eventDate: e.eventDate ?? null,
      location: e.location ?? null,
      coverImage: e.coverImage ?? null,
    }))
    : FALLBACK_EVENTS;

  // Foto Tentang Klinik: diambil dari SiteSetting (menu Foto Utama Klinik di admin)
  const heroPhoto = aboutImageSetting || undefined;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const clinicSchema = getClinicSchema(baseUrl);
  const faqSchema = getFaqSchema(FAQ_ITEMS);

  return (
    <div className="relative pb-12">
      <JsonLd data={[clinicSchema, faqSchema]} />
      <HeroSection banners={banners} />


      {/* Section Tentang Klinik & Jam Operasional dengan Foto */}
      <ScrollReveal>
        <AboutClinicSection heroPhoto={heroPhoto} />
      </ScrollReveal>

      <ScrollReveal>
        <ServicesSection services={services} />
      </ScrollReveal>

      {/* Section Event & Berita */}
      <ScrollReveal delay={100}>
        <section className="py-8 md:py-12 w-full px-6 sm:px-8 lg:px-12 border-fine-b bg-bg-snow">
          <SectionHeader
            eyebrow="Berita & Kegiatan"
            heading="Kegiatan & Agenda Mendatang"
            linkText="Lihat Semua Berita"
            linkHref="/events"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {events.map((evt: EventCardData) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Section Artikel Kesehatan */}
      <ScrollReveal delay={100}>
        <section className="py-8 md:py-12 w-full px-6 sm:px-8 lg:px-12 bg-bg-snow">
          <SectionHeader
            eyebrow="Artikel Kesehatan"
            heading="Edukasi Kesehatan Terbaru"
            linkText="Lihat Semua Artikel"
            linkHref="/articles"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((art: ArticleCardData) => (
              <ArticleCard key={art.id} article={art} />
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Section Fasilitas & Ruangan */}
      {facilities.length > 0 && (
        <ScrollReveal>
          <FacilityGallerySection facilities={facilities} />
        </ScrollReveal>
      )}

      {/* Section FAQ (Tanya Jawab) */}
      <FAQSection />

      {/* Section Mitra Kerjasama */}
      {partners.length > 0 && (
        <ScrollReveal>
          <PartnersCarouselSection partners={partners} />
        </ScrollReveal>
      )}
    </div>
  );
}
