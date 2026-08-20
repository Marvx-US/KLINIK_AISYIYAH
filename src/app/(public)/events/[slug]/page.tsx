import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEventBySlug, getPublishedEvents } from '@/core/services/eventService';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import { ArrowLeft, Calendar, MapPin, Tag, Share2, Info } from 'lucide-react';

export const revalidate = 60; // ISR: re-generate tiap 1 menit

export async function generateStaticParams() {
  try {
    const events = await getPublishedEvents();
    return events.map((e) => ({ slug: e.slug }));
  } catch {
    return [];
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

import type { Metadata, ResolvingMetadata } from 'next';
import { KLINIK_INFO } from '@/lib/constants';

export async function generateMetadata({ params }: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug).catch(() => null);
  
  if (!event) return { title: 'Event Tidak Ditemukan' };

  return {
    title: event.title,
    description: `Ikuti kegiatan ${event.title} di Klinik Aisyiyah. Temukan informasi lengkap seputar jadwal, lokasi, dan detail acara.`,
    openGraph: {
      title: event.title,
      description: `Ikuti kegiatan ${event.title} di Klinik Aisyiyah. Temukan informasi lengkap seputar jadwal, lokasi, dan detail acara.`,
      url: `/events/${slug}`,
      siteName: KLINIK_INFO.name,
      images: event.coverImage ? [
        {
          url: event.coverImage,
          width: 1200,
          height: 630,
          alt: event.title,
        }
      ] : [],
      locale: 'id_ID',
      type: 'article',
      authors: ['Klinik Aisyiyah'],
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description: `Ikuti kegiatan ${event.title} di Klinik Aisyiyah.`,
      images: event.coverImage ? [event.coverImage] : [],
    },
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const event = await getEventBySlug(slug).catch(() => null);
  if (!event) notFound();

  // Event rekomendasi lainnya
  const upcomingEvents = await getPublishedEvents()
    .then((all) => all.filter((e) => e.slug !== slug).slice(0, 3))
    .catch(() => []);

  return (
    <div className="pt-32 pb-16 md:pt-40 md:pb-24 w-full px-6 sm:px-8 lg:px-12 bg-bg-snow min-h-screen">
      {/* Back button */}
      <Link
        href="/events"
        className="inline-flex items-center gap-3 px-5 py-2.5 bg-white border border-border-fine rounded-2xl text-text-muted hover:text-primary hover:border-primary/30 hover:bg-primary-light/50 shadow-sm transition-all duration-300 mb-12 text-sm font-bold group"
      >
        <span className="h-7 w-7 rounded-full bg-bg-snow flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        </span>
        Kembali ke Kegiatan
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Main Content */}
        <article className="lg:col-span-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-semibold tracking-wide uppercase mb-6 border border-primary/10">
            <Tag className="h-3.5 w-3.5" />
            Agenda Kegiatan
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-text-dark tracking-tight leading-[1.1] mb-8 font-editorial-serif">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-text-muted text-sm mb-12">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-border-fine shadow-sm hover:shadow-md transition-shadow">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="font-medium">{event.eventDate ? new Date(event.eventDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Segera Hadir'}</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-border-fine shadow-sm hover:shadow-md transition-shadow">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">{event.location || 'Klinik Aisyiyah'}</span>
            </div>
          </div>

          {/* Event Cover Image */}
          {event.coverImage && (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border-fine mb-12">
              <Image
                src={event.coverImage}
                alt={event.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            </div>
          )}

          {/* Rich Content Render — konten disanitasi untuk mencegah XSS */}
          <div
            className="prose prose-neutral max-w-none font-sans text-text-dark/95 leading-relaxed text-base space-y-6
              prose-headings:font-heading prose-headings:font-bold prose-headings:text-text-dark prose-headings:tracking-tight
              prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
              prose-p:mb-4
              prose-strong:text-text-dark prose-strong:font-semibold
              prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-ul:space-y-2
              prose-li:text-text-muted"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.content ?? '') }}
          />
        </article>

        {/* Sidebar Info Summary */}
        <aside className="lg:col-span-4 flex flex-col gap-12">
          {/* Quick Info Box */}
          <div className="bg-white p-8 rounded-2xl border-fine shadow-sm">
            <h3 className="font-heading font-bold text-sm tracking-widest uppercase text-text-dark mb-6 flex items-center gap-2">
              <Info className="h-4.5 w-4.5 text-primary" />
              Ringkasan Kegiatan
            </h3>
            <div className="flex flex-col gap-5 text-sm text-text-muted">
              <div>
                <p className="text-xs uppercase text-text-muted tracking-wider font-semibold">Tanggal Pelaksanaan</p>
                <p className="font-heading font-bold text-text-dark text-sm mt-1">
                  {event.eventDate ? new Date(event.eventDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Segera Diumumkan'}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-text-muted tracking-wider font-semibold">Tempat/Lokasi</p>
                <p className="font-heading font-bold text-text-dark text-sm mt-1">
                  {event.location || 'Klinik Aisyiyah'}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-text-muted tracking-wider font-semibold">Status Pendaftaran</p>
                <p className="font-heading font-bold text-primary text-sm mt-1">
                  Terbuka untuk Umum (Tanpa Pendaftaran)
                </p>
              </div>
              <div className="border-t border-border-fine pt-4 mt-2">
                <a
                  href={`https://wa.me/${KLINIK_INFO.whatsapp}?text=Halo%20Admin%20Klinik%20Aisyiyah,%20saya%20tertarik%20dengan%20kegiatan%20*${encodeURIComponent(event.title)}*`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full py-3 rounded-full bg-primary text-white font-sans text-xs font-bold transition-all duration-300 hover:bg-primary-dark active:scale-[0.98]"
                >
                  Tanyakan via WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Agenda Lainnya */}
          {upcomingEvents.length > 0 && (
            <div className="bg-white p-8 rounded-2xl border-fine shadow-sm">
              <h3 className="font-heading font-bold text-sm tracking-widest uppercase text-text-dark mb-6 flex items-center gap-2">
                <Share2 className="h-4.5 w-4.5 text-primary" />
                Agenda Lainnya
              </h3>
              <div className="flex flex-col gap-6">
                {upcomingEvents.map((rec) => (
                  <div key={rec.slug} className="border-fine-b pb-6 last:border-b-0 last:pb-0">
                    <h4 className="font-heading font-bold text-sm text-text-dark hover:text-primary transition-colors leading-snug">
                      <Link href={`/events/${rec.slug}`}>{rec.title}</Link>
                    </h4>
                    <span className="text-[10px] text-text-muted mt-2 block flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {rec.eventDate ? new Date(rec.eventDate).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }) : 'Info'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
