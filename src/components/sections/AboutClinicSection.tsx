'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, CheckCircle2, Phone, MapPin, ShieldCheck, HeartPulse, ArrowRight } from 'lucide-react';
import { KLINIK_INFO, KLINIK_HOURS } from '@/lib/constants';

interface AboutClinicSectionProps {
  heroPhoto?: string;
}

export default function AboutClinicSection({ heroPhoto }: AboutClinicSectionProps) {
  const displayPhoto = heroPhoto || '/uploads/1786371427727-896528188.jpg';

  return (
    <section className="py-8 md:py-12 w-full px-6 sm:px-8 lg:px-12 bg-white border-b border-border-fine relative overflow-hidden">
      {/* Glow ambient background element */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* FOTO TENTANG KLINIK & OVERLAY BADGE (LEFT SIDE - 6 COLS) */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-border-fine shadow-lg bg-bg-snow group">
              <Image
                src={displayPhoto}
                alt={`Fasilitas & Gedung ${KLINIK_INFO.name}`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              
              {/* Badge di atas foto */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full border border-white/40 shadow-md flex items-center gap-2 text-xs font-bold text-primary">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Faskes Resmi & Terakreditasi
              </div>

              {/* Caption di bawah foto */}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="font-heading font-extrabold text-xl leading-snug drop-shadow-md">
                  {KLINIK_INFO.name}
                </p>
                <p className="text-xs text-gray-200 mt-1 flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                  Sidenreng Rappang, Sulawesi Selatan
                </p>
              </div>
            </div>

            {/* Micro Feature Badges di bawah foto */}
            <div className="grid grid-cols-3 gap-3 w-full mt-4">
              <div className="bg-bg-snow p-3.5 rounded-2xl border border-border-fine text-center">
                <span className="block font-heading font-bold text-base text-primary">24 Jam</span>
                <span className="text-[10px] text-text-muted font-medium">IGD Siaga</span>
              </div>
              <div className="bg-bg-snow p-3.5 rounded-2xl border border-border-fine text-center">
                <span className="block font-heading font-bold text-base text-primary">BPJS</span>
                <span className="text-[10px] text-text-muted font-medium">Faskes 1 Resmi</span>
              </div>
              <div className="bg-bg-snow p-3.5 rounded-2xl border border-border-fine text-center">
                <span className="block font-heading font-bold text-base text-primary">Profesional</span>
                <span className="text-[10px] text-text-muted font-medium">Tim Medis Ahli</span>
              </div>
            </div>
          </div>

          {/* DESKRIPSI KLINIK & JAM OPERASIONAL (RIGHT SIDE - 6 COLS) */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* Header section */}
            <div className="mb-6">
              <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2">
                Profil & Pelayanan Medis
              </span>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-text-dark tracking-tight leading-tight font-editorial-serif">
                Tentang <span className="text-primary italic">{KLINIK_INFO.name}</span> & Jam Operasional
              </h2>
            </div>

            {/* Narasi Ringkas Tentang Klinik */}
            <p className="text-text-muted text-base leading-relaxed mb-6">
              {KLINIK_INFO.name} hadir memberikan layanan kesehatan komprehensif, mudah diakses, serta mengutamakan pendekatan medis yang hangat bagi seluruh masyarakat Sidenreng Rappang. Didukung oleh tim dokter, bidan, dan staf medis profesional yang berdedikasi.
            </p>

            {/* Poin Keunggulan Utama */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-text-dark">
                <CheckCircle2 className="w-4.5 h-4.5 text-primary shrink-0" />
                <span>Pelayanan Ramah & Responsif</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-text-dark">
                <CheckCircle2 className="w-4.5 h-4.5 text-primary shrink-0" />
                <span>Fasilitas & Peralatan Steril</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-text-dark">
                <CheckCircle2 className="w-4.5 h-4.5 text-primary shrink-0" />
                <span>Menerima Pasien BPJS & Umum</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-text-dark">
                <CheckCircle2 className="w-4.5 h-4.5 text-primary shrink-0" />
                <span>Rekam Medis Terintegrasi</span>
              </div>
            </div>

            {/* KOTAK JAM OPERASIONAL */}
            <div className="bg-bg-snow rounded-2xl border border-border-fine p-6 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-border-fine pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Clock className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-text-dark">Jadwal Operasional Klinik</h3>
                    <p className="text-[11px] text-text-muted">Siap melayani kebutuhan berobat keluarga Anda</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-200">
                  IGD 24 Jam Nonstop
                </span>
              </div>

              {/* Table / List Jam Operasional */}
              <div className="space-y-3 text-xs sm:text-sm">
                {KLINIK_HOURS.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center justify-between ${
                      idx < KLINIK_HOURS.length - 1 ? 'border-b border-border-fine/60 pb-2.5' : ''
                    }`}
                  >
                    <span className="font-semibold text-text-dark">{item.day}</span>
                    <span className={`font-bold ${item.closed ? 'text-amber-600' : 'text-primary'}`}>
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>

              {/* Call-to-action Whatsapp di dalam box */}
              <div className="mt-5 pt-4 border-t border-border-fine flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-text-dark">
                  <HeartPulse className="w-4 h-4 text-primary animate-pulse" />
                  <span>Butuh Konsultasi / Janji Temu?</span>
                </div>
                <a
                  href={`https://wa.me/${KLINIK_INFO.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-sans text-xs font-bold hover:bg-primary-dark transition-all duration-300 shadow-sm active:scale-[0.98]"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Hubungi Kontak Medis
                </a>
              </div>
            </div>

            {/* Navigation link ke halaman kontak */}
            <div className="mt-6">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-dark transition-colors group"
              >
                <span>Lihat Alamat Lengkap & Petunjuk Peta Google Maps</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
