import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, ShieldCheck } from 'lucide-react';
import { type LucideIcon } from 'lucide-react';
import { KLINIK_INFO, KLINIK_HOURS } from '@/lib/constants';

import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { getClinicSchema } from '@/lib/seoSchemas';

export const metadata: Metadata = {
  title: 'Kontak & Lokasi Klinik',
  description: 'Alamat lengkap, nomor telepon, WhatsApp pendaftaran, email resmi, dan petunjuk arah Google Maps Klinik Aisyiyah Pangkajene, Kab. Sidrap.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Kontak & Lokasi Klinik | Klinik Aisyiyah Pangkajene',
    description: 'Hubungi Klinik Aisyiyah Pangkajene atau kunjungi langsung gedung klinik di Jl. Andi Cammi No. 17 Pangkajene, Sidrap.',
    url: '/contact',
    siteName: KLINIK_INFO.name,
    locale: 'id_ID',
    type: 'website',
  },
};

interface ContactItem {
  title: string;
  desc: string;
  detail: string;
  icon: LucideIcon;
  actionText: string;
  actionHref: string;
}

const CONTACT_ITEMS: ContactItem[] = [
  {
    title: 'Telepon & WhatsApp',
    desc: 'Layanan pendaftaran janji temu pasien dan layanan informasi cepat.',
    detail: KLINIK_INFO.phone,
    icon: Phone,
    actionText: 'Chat via WhatsApp',
    actionHref: `https://wa.me/${KLINIK_INFO.whatsapp}`,
  },
  {
    title: 'Email Resmi',
    desc: 'Kirim surat kemitraan resmi, kritik, saran, atau pengaduan layanan.',
    detail: KLINIK_INFO.email,
    icon: Mail,
    actionText: 'Kirim Email',
    actionHref: `mailto:${KLINIK_INFO.email}`,
  },
  {
    title: 'Alamat Fisik',
    desc: 'Gedung Klinik Utama Aisyiyah di Pangkajene.',
    detail: KLINIK_INFO.address,
    icon: MapPin,
    actionText: 'Buka Google Maps',
    actionHref: KLINIK_INFO.mapsUrl,
  },
];

/**
 * ContactPage — Halaman kontak dan lokasi klinik.
 * Data kontak bersumber dari constants.ts.
 */
export default function ContactPage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const clinicSchema = getClinicSchema(baseUrl);

  return (
    <div className="pt-32 pb-16 md:pt-40 md:pb-24 w-full px-6 sm:px-8 lg:px-12 bg-bg-snow min-h-screen">
      <JsonLd data={clinicSchema} />

      {/* Page Header */}
      <div className="max-w-3xl mb-16">
        <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-3">
          Hubungi Kami
        </span>
        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-text-dark tracking-tight leading-[1.1] mb-6 font-editorial-serif">
          Kontak & Lokasi Klinik
        </h1>
        <p className="text-text-muted text-lg leading-relaxed">
          Kami siap membantu melayani kebutuhan kesehatan Anda. Hubungi kami melalui kontak resmi
          atau kunjungi langsung klinik kami.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Daftar Info Kontak */}
        <div className="lg:col-span-6 flex flex-col gap-8">
          {CONTACT_ITEMS.map((info) => (
            <div
              key={info.title}
              className="bg-white p-8 rounded-2xl border-fine transition-editorial hover-glow flex gap-6"
            >
              <div className="h-12 w-12 rounded-xl bg-primary-light flex items-center justify-center text-primary shrink-0">
                <info.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-text-dark mb-2">{info.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed mb-3">{info.desc}</p>
                <p className="font-heading font-bold text-text-dark text-base mb-4">{info.detail}</p>
                <a
                  href={info.actionHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary text-sm font-bold hover:text-primary-dark transition-colors"
                >
                  {info.actionText}
                  <MessageSquare className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Jam Operasional + Peta */}
        <div className="lg:col-span-6 flex flex-col gap-8">
          {/* Jam Operasional dari constants */}
          <div className="bg-white p-8 rounded-2xl border-fine shadow-sm">
            <h3 className="font-heading font-bold text-lg text-text-dark mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Jadwal Operasional
            </h3>
            <div className="flex flex-col gap-4 text-sm text-text-muted">
              {KLINIK_HOURS.map((item, index) => (
                <div
                  key={item.day}
                  className={`flex justify-between ${
                    index < KLINIK_HOURS.length - 1 ? 'border-fine-b pb-3' : ''
                  }`}
                >
                  <span className="font-semibold text-text-dark">{item.day}</span>
                  <span className={item.closed ? 'text-accent-gold font-medium' : ''}>
                    {item.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Peta Interactive Google Maps */}
          <div className="bg-white rounded-2xl border-fine overflow-hidden shadow-sm relative flex flex-col group">
            {/* Live Embedded Google Maps iframe */}
            <div className="w-full h-64 sm:h-72 relative bg-slate-100 overflow-hidden">
              <iframe
                title="Peta Lokasi Klinik Aisyiyah Pangkajene"
                src={KLINIK_INFO.mapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full filter saturate-[0.85] contrast-[1.05]"
              />
            </div>

            {/* Map Info & Direct Link Action */}
            <div className="p-6 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border-fine">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary-light flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-heading font-bold text-text-dark text-base">
                    Lokasi Klinik Utama Aisyiyah
                  </p>
                  <p className="text-text-muted text-xs mt-0.5 leading-relaxed">{KLINIK_INFO.mapsDisplayCity}</p>
                </div>
              </div>
              <a
                href={KLINIK_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-sans text-xs font-bold hover:bg-primary-dark transition-all duration-300 shadow-sm hover:shadow-md shrink-0 active:scale-[0.98]"
              >
                <ShieldCheck className="h-4 w-4" />
                Petunjuk Arah Rute Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
