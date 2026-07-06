'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ArrowRight, Clock } from 'lucide-react';

interface Banner {
  id: number;
  title: string;
  imageUrl: string;
}

export interface ScheduleInfo {
  id: number;
  poli: string;
  doctorName: string;
  scheduleInfo: string;
}

export default function HeroSection({ 
  banners = [], 
  schedules = [] 
}: { 
  banners?: Banner[], 
  schedules?: ScheduleInfo[] 
}) {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % banners.length);
    }, 6000); 
    return () => clearInterval(timer);
  }, [banners.length]);

  const hasBanners = banners.length > 0;
  const hasSchedules = schedules.length > 0;

  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 min-h-screen flex items-center overflow-hidden border-fine-b bg-bg-snow">
      {/* Background Banners */}
      {hasBanners && banners.map((banner, idx) => (
        <div 
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentIdx ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Menggunakan Next.js Image Component dengan prioritas tinggi untuk hero section */}
          <Image 
            src={banner.imageUrl} 
            alt={banner.title} 
            fill
            priority={idx === 0}
            fetchPriority={idx === 0 ? 'high' : 'low'}
            sizes="(max-width: 768px) 100vw, 100vw"
            className="object-cover" 
          />
          {/* Overlay gradien gelap agar teks tetap terbaca */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/40" />
        </div>
      ))}

      {/* Default glow ambient jika tidak ada banner */}
      {!hasBanners && <div className="glow-ambient" />}

      <div className="w-full px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Kiri: Heading & CTA */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-6 border ${
              hasBanners ? 'bg-white/20 text-white border-white/30 backdrop-blur-sm shadow-sm' : 'bg-primary-light text-primary border-primary/10'
            }`}>
              <Heart className="h-3 w-3 fill-current" />
              Mitra Kesehatan Keluarga Anda
            </span>
            <h1 className={`font-heading font-extrabold text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] tracking-tighter mb-8 font-editorial-serif ${
              hasBanners ? 'text-white' : 'text-text-dark'
            }`}>
              Pelayanan Medis <span className="text-primary italic">Profesional</span> dengan
              Sentuhan Kasih.
            </h1>
            <p className={`text-lg sm:text-xl leading-relaxed max-w-2xl mb-10 ${
              hasBanners ? 'text-gray-200 font-medium' : 'text-text-muted'
            }`}>
              Klinik Aisyiyah berkomitmen memberikan layanan kesehatan bermutu tinggi, mudah
              diakses, serta ramah bagi seluruh anggota masyarakat Sidenreng Rappang.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-sans text-base font-semibold transition-all duration-300 hover:bg-primary-dark active:scale-[0.98] shadow-md hover:shadow-lg text-center"
              >
                Daftar Layanan
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/articles"
                className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border font-sans text-base font-semibold transition-all duration-300 active:scale-[0.98] text-center ${
                  hasBanners 
                    ? 'border-white/40 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md shadow-sm hover:shadow-md'
                    : 'border-border-fine bg-white text-text-dark hover:bg-bg-snow shadow-sm hover:shadow-md'
                }`}
              >
                Edukasi Kesehatan
              </Link>
            </div>
          </div>

          {/* Kanan: Widget Jadwal Dokter */}
          <div className="lg:col-span-5 w-full">
            <div className={`rounded-3xl p-8 shadow-2xl transition-editorial hover-glow relative overflow-hidden ${
              hasBanners 
                ? 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]' 
                : 'bg-white border border-fine shadow-sm'
            }`}>
              {/* Dekorasi Pojok */}
              <div className={`absolute top-0 right-0 h-24 w-24 rounded-bl-full pointer-events-none -mr-4 -mt-4 ${
                hasBanners ? 'bg-white/10 backdrop-blur-sm' : 'bg-primary/5'
              }`} />
              
              <h3 className={`font-heading font-extrabold text-xl mb-8 flex items-center gap-3 ${
                hasBanners ? 'text-white' : 'text-text-dark'
              }`}>
                <Clock className="h-6 w-6 text-primary drop-shadow-md" />
                Jadwal Dokter Hari Ini
              </h3>
              
              <div className="flex flex-col gap-6">
                {hasSchedules ? (
                  schedules.map((item, index) => (
                    <div
                      key={item.id}
                      className={index < schedules.length - 1 ? `border-b pb-5 ${hasBanners ? 'border-white/10' : 'border-fine'}` : ''}
                    >
                      <p className={`text-[11px] uppercase tracking-[0.15em] font-extrabold ${
                        hasBanners ? 'text-gray-300' : 'text-text-muted'
                      }`}>
                        {item.poli}
                      </p>
                      <p className={`font-heading font-bold text-lg mt-1 mb-1 ${
                        hasBanners ? 'text-white drop-shadow-sm' : 'text-text-dark'
                      }`}>
                        {item.doctorName}
                      </p>
                      <p className={`text-sm font-semibold tracking-wide flex items-center gap-1.5 ${
                        hasBanners ? 'text-primary drop-shadow-sm' : 'text-primary'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        {item.scheduleInfo}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className={`text-sm italic opacity-80 ${hasBanners ? 'text-white' : 'text-text-muted'}`}>
                    Tidak ada jadwal yang tersedia hari ini.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Banner Navigasi (Dots) */}
        {banners.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                className={`transition-all duration-300 rounded-full shadow-sm ${
                  idx === currentIdx ? 'w-8 h-2.5 bg-primary' : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
