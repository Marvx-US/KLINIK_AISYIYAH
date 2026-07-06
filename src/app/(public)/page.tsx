import React from 'react';
import { getActiveBanners } from '@/core/services/bannerService';
import { getActiveSchedules } from '@/core/services/scheduleService';
import { getActiveFacilities } from '@/core/services/facilityService';
import { getActivePartners } from '@/core/services/partnerService';
import { getPublishedArticles } from '@/core/services/articleService';
import { getPublishedEvents } from '@/core/services/eventService';
import { FALLBACK_ARTICLES, FALLBACK_EVENTS } from '@/lib/constants';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import SectionHeader from '@/components/ui/SectionHeader';
import ArticleCard, { type ArticleCardData } from '@/components/ui/ArticleCard';
import EventCard, { type EventCardData } from '@/components/ui/EventCard';
import dynamic from 'next/dynamic';

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
  
  const [rawArticles, rawEvents, banners, schedules, facilities, partners] = await Promise.all([
    getPublishedArticles().catch(() => []),
    getPublishedEvents().catch(() => []),
    getActiveBanners().catch(() => []),
    getActiveSchedules().catch(() => []),
    getActiveFacilities().catch(() => []),
    getActivePartners().catch(() => []),
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

  return (
    <div className="relative pb-24">
      <HeroSection banners={banners} schedules={schedules} />
      <ServicesSection />

      {/* Section Event & Berita */}
      <section className="py-24 w-full px-6 sm:px-8 lg:px-12 border-fine-b bg-bg-snow">
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

      {/* Section Artikel Kesehatan */}
      <section className="py-24 w-full px-6 sm:px-8 lg:px-12 bg-bg-snow">
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

      {/* Section Fasilitas & Ruangan */}
      {facilities.length > 0 && <FacilityGallerySection facilities={facilities} />}

      {/* Section Mitra Kerjasama */}
      {partners.length > 0 && <PartnersCarouselSection partners={partners} />}
    </div>
  );
}
