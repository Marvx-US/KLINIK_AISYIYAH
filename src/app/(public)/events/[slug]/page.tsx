import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { type Event } from '@prisma/client';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import { ArrowLeft, Calendar, MapPin, Tag, Share2, Info } from 'lucide-react';

export const revalidate = 0;

const fallbackEvents = [
  {
    id: 1,
    title: "Program Imunisasi Polio Gratis Anak Usia 0-7 Tahun",
    slug: "program-imunisasi-polio-gratis-anak-usia-0-7-tahun",
    content: `
      <p>Dalam rangka mensukseskan PIN Polio nasional dan melindungi anak-anak dari ancaman kelumpuhan permanen akibat virus Polio, Klinik Aisyiyah menyelenggarakan program pemberian tetes imunisasi polio gratis bagi semua anak usia 0 sampai dengan 7 tahun.</p>
      
      <h3>Mengapa Polio Berbahaya?</h3>
      <p>Polio adalah penyakit menular yang sangat berbahaya, menyerang sistem saraf, dan dapat menyebabkan kelumpuhan permanen dalam hitungan jam. Penyakit ini tidak dapat diobati, namun dapat dicegah 100% dengan imunisasi tetes (OPV) maupun suntik (IPV).</p>
      
      <h3>Detail Pelaksanaan Program</h3>
      <p>Pemberian imunisasi akan dilaksanakan secara massal bertempat di Aula Utama Klinik Aisyiyah. Anda cukup membawa Kartu Keluarga (KK) atau Buku KIA (KMS) sang buah hati untuk proses pencatatan data imunisasi.</p>
      
      <p>Mari bersama-sama wujudkan generasi sehat bebas polio di lingkungan kita. Silakan datang ke klinik sesuai dengan waktu pelaksanaan untuk mendapatkan pelayanan terbaik dari perawat dan bidan kami secara gratis tanpa dipungut biaya apapun.</p>
    `,
    eventDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    location: "Aula Pertemuan Utama Klinik Aisyiyah",
    createdAt: new Date(),
  },
  {
    id: 2,
    title: "Seminar Edukasi Pencegahan Stunting bersama Ahli Gizi",
    slug: "seminar-edukasi-pencegahan-stunting-bersama-ahli-gizi",
    content: `
      <p>Masalah stunting masih menjadi tantangan besar dalam tumbuh kembang anak di Indonesia. Stunting tidak hanya berdampak pada tinggi badan anak, tetapi juga perkembangan otak dan produktivitas mereka di masa depan.</p>
      
      <h3>Apa yang Akan Dibahas?</h3>
      <p>Dalam seminar interaktif ini, kita akan mengupas tuntas bersama ahli gizi dan dokter spesialis anak mengenai:</p>
      <ul>
        <li>Pemberian MPASI kaya protein hewani untuk pencegahan stunting.</li>
        <li>Cara membaca grafik tumbuh kembang anak di buku KIA.</li>
        <li>Tanda-tanda red flags keterlambatan tumbuh kembang balita.</li>
        <li>Peran pola asuh dan sanitasi lingkungan yang sehat.</li>
      </ul>
      
      <h3>Fasilitas Peserta</h3>
      <p>Setiap peserta seminar yang terdaftar secara resmi akan mendapatkan handout materi edukasi, suplemen vitamin anak gratis, kudapan sehat, serta sesi tanya jawab langsung bersama narasumber ahli gizi.</p>
      
      <p>Karena kapasitas ruangan terbatas untuk 50 peserta guna kenyamanan diskusi, segera daftarkan diri Anda dengan menghubungi WhatsApp admin klinik.</p>
    `,
    eventDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    location: "Ruang Edukasi Lt. 2 Klinik Aisyiyah",
    createdAt: new Date(),
  }
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  let event = null;

  try {
    event = await db.event.findUnique({
      where: { slug },
    });
  } catch (error) {
    // fallback
  }

  if (!event) {
    event = fallbackEvents.find((evt) => evt.slug === slug) as unknown as Event;
  }

  if (!event) {
    notFound();
  }

  // Fetch upcoming events as recommendations, excluding current event
  let upcomingEvents: Event[] = [];
  try {
    upcomingEvents = await db.event.findMany({
      where: {
        status: 'PUBLISHED',
        slug: { not: slug },
      },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });
  } catch (error) {
    // fallback
  }

  if (upcomingEvents.length === 0) {
    upcomingEvents = fallbackEvents.filter((evt) => evt.slug !== slug) as unknown as Event[];
  }

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

          {/* Event Cover Image (Optional/Placeholder) */}
          {event.coverImage && (
            <div className="aspect-video w-full rounded-2xl overflow-hidden border-fine mb-12">
              <img
                src={event.coverImage}
                alt={event.title}
                className="w-full h-full object-cover"
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
                  href={`https://wa.me/6281234567890?text=Halo%20Admin%20Klinik%20Aisyiyah,%20saya%20tertarik%20dengan%20kegiatan%20*${encodeURIComponent(event.title)}*`}
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
          <div className="bg-white p-8 rounded-2xl border-fine shadow-sm">
            <h3 className="font-heading font-bold text-sm tracking-widest uppercase text-text-dark mb-6 flex items-center gap-2">
              <Share2 className="h-4.5 w-4.5 text-primary" />
              Agenda Lainnya
            </h3>
            <div className="flex flex-col gap-6">
              {upcomingEvents.map((rec) => (
                <div key={rec.title} className="border-fine-b pb-6 last:border-b-0 last:pb-0">
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
        </aside>
      </div>
    </div>
  );
}
