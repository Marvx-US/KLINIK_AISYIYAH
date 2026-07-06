import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, ShieldCheck } from 'lucide-react';
import { type LucideIcon } from 'lucide-react';
import { KLINIK_INFO, KLINIK_HOURS } from '@/lib/constants';

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
  return (
    <div className="pt-32 pb-16 md:pt-40 md:pb-24 w-full px-6 sm:px-8 lg:px-12 bg-bg-snow min-h-screen">
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

          {/* Peta Mockup */}
          <div className="bg-white rounded-2xl border-fine overflow-hidden shadow-sm aspect-video relative flex items-center justify-center bg-primary/5">
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="relative text-center p-8 flex flex-col items-center gap-4">
              <MapPin className="h-10 w-10 text-primary animate-bounce" />
              <div>
                <p className="font-heading font-bold text-text-dark text-base">
                  Lokasi Klinik Utama Aisyiyah
                </p>
                <p className="text-text-muted text-xs mt-1">{KLINIK_INFO.mapsDisplayCity}</p>
              </div>
              <a
                href={KLINIK_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-primary text-white font-sans text-xs font-semibold hover:bg-primary-dark transition-all duration-300 shadow-sm"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Petunjuk Arah Rute Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
