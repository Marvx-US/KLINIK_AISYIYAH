import React from 'react';
import { Search } from 'lucide-react';
import { getPublishedEvents } from '@/core/services/eventService';
import { FALLBACK_EVENTS } from '@/lib/constants';
import EventCard, { type EventCardData } from '@/components/ui/EventCard';
import EmptyState from '@/components/ui/EmptyState';

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

/** Mengambil event dari DB via Service, fallback jika DB kosong */
async function getFilteredEvents(searchQuery: string): Promise<EventCardData[]> {
  try {
    const all = await getPublishedEvents();

    const filtered = all.filter((evt) =>
      searchQuery
        ? evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (evt.location ?? '').toLowerCase().includes(searchQuery.toLowerCase())
        : true,
    );

    if (filtered.length > 0) {
      return filtered.map((e) => ({
        id: e.id,
        title: e.title,
        slug: e.slug,
        content: e.content,
        eventDate: e.eventDate ?? null,
        location: e.location ?? null,
        coverImage: e.coverImage ?? null,
      }));
    }

    return FALLBACK_EVENTS.filter((evt) =>
      searchQuery ? evt.title.toLowerCase().includes(searchQuery.toLowerCase()) : true,
    );
  } catch {
    return FALLBACK_EVENTS;
  }
}

/**
 * EventsPage — Halaman daftar event/kegiatan klinik.
 */
export default async function EventsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const searchQuery = params.q ?? '';

  const events = await getFilteredEvents(searchQuery);

  return (
    <div className="pt-32 pb-16 md:pt-40 md:pb-24 w-full px-6 sm:px-8 lg:px-12 bg-bg-snow min-h-screen">
      {/* Page Header */}
      <div className="max-w-3xl mb-16">
        <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-3">
          Agenda & Berita
        </span>
        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-text-dark tracking-tight leading-[1.1] mb-6 font-editorial-serif">
          Event & Kegiatan Klinik
        </h1>
        <p className="text-text-muted text-lg leading-relaxed">
          Ikuti berbagai agenda kegiatan sosial, imunisasi massal, seminar kesehatan gratis, dan
          kabar berita terbaru dari Klinik Aisyiyah.
        </p>
      </div>

      {/* Premium Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-12 bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-border-fine/50">
        <div className="text-sm text-text-muted font-sans font-medium px-4">
          Menampilkan <strong className="text-text-dark">{events.length}</strong> kegiatan aktif
        </div>
        <form action="/events" method="GET" className="relative w-full md:w-72">
          <input
            type="text"
            name="q"
            defaultValue={searchQuery}
            placeholder="Cari event/kegiatan..."
            className="w-full bg-bg-snow/50 border-0 rounded-xl py-2.5 pl-11 pr-4 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white text-text-dark transition-all placeholder:text-text-muted/60"
          />
          <Search className="absolute left-4 top-3 h-4 w-4 text-text-muted/70" />
        </form>
      </div>

      {/* Events Grid atau Empty State */}
      {events.length === 0 ? (
        <EmptyState
          title="Event tidak ditemukan"
          description="Coba gunakan kata kunci pencarian yang lain."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {events.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      )}
    </div>
  );
}
