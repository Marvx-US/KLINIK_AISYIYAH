import React from 'react';
import { db } from '@/lib/db';
import { FALLBACK_ARTICLES, FALLBACK_EVENTS } from '@/lib/constants';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import SectionHeader from '@/components/ui/SectionHeader';
import ArticleCard, { type ArticleCardData } from '@/components/ui/ArticleCard';
import EventCard, { type EventCardData } from '@/components/ui/EventCard';
import FacilityGallerySection from '@/components/sections/FacilityGallerySection';
import PartnersCarouselSection from '@/components/sections/PartnersCarouselSection';

export const revalidate = 0;

/** Mengambil artikel terbaru dari database, fallback ke data statis jika DB kosong */
async function getLatestArticles(): Promise<ArticleCardData[]> {
  try {
    const articles = await db.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: { id: true, title: true, slug: true, summary: true, category: true, coverImage: true, createdAt: true },
    });
    return articles.length > 0 ? articles : FALLBACK_ARTICLES;
  } catch {
    return FALLBACK_ARTICLES;
  }
}

/** Mengambil event/berita terbaru dari database, fallback ke data statis jika DB kosong */
async function getUpcomingEvents(): Promise<EventCardData[]> {
  try {
    const events = await db.event.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { eventDate: 'asc' },
      take: 2,
      select: { id: true, title: true, slug: true, content: true, eventDate: true, location: true, coverImage: true },
    });
    return events.length > 0 ? events : FALLBACK_EVENTS;
  } catch {
    return FALLBACK_EVENTS;
  }
}

/** Mengambil daftar banner aktif dari database */
async function getActiveBanners() {
  try {
    return await (db as any).banner.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, imageUrl: true },
    });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return [];
  }
}

/** Mengambil daftar jadwal dokter aktif dari database */
async function getActiveSchedules() {
  try {
    return await (db as any).doctorSchedule.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
      select: { id: true, poli: true, doctorName: true, scheduleInfo: true },
    });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return [];
  }
}

/** Mengambil daftar fasilitas aktif dari database */
async function getActiveFacilities() {
  try {
    return await (db as any).facility.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, description: true, imageUrl: true },
    });
  } catch (error) {
    console.error('Error fetching facilities:', error);
    return [];
  }
}

/** Mengambil daftar logo mitra kerjasama aktif */
async function getActivePartners() {
  try {
    return await (db as any).partner.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, logoUrl: true },
    });
  } catch (error) {
    console.error('Error fetching partners:', error);
    return [];
  }
}

/**
 * HomePage — Halaman utama website Klinik Aisyiyah.
 * Menggunakan komponen section yang terpisah agar mudah dikelola.
 */
export default async function HomePage() {
  // Fetch data secara paralel untuk performa optimal
  const [articles, events, banners, schedules, facilities, partners] = await Promise.all([
    getLatestArticles(), 
    getUpcomingEvents(), 
    getActiveBanners(), 
    getActiveSchedules(),
    getActiveFacilities(),
    getActivePartners()
  ]);

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
