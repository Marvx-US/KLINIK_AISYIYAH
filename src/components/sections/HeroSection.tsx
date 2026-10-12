'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface Banner {
  id: number;
  title: string;
  imageUrl: string;
}

export default function HeroSection({ 
  banners = [], 
}: { 
  banners?: Banner[], 
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

  return (
    <section 
      suppressHydrationWarning 
      className="relative w-full min-h-screen min-h-[100dvh] flex items-center justify-center overflow-hidden border-fine-b bg-slate-950 pt-24 pb-16 md:pt-28 md:pb-20"
    >
      {/* Background Banners */}
      {hasBanners && banners.map((banner, idx) => (
        <div 
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentIdx ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* 
            sizes responsif: browser memilih resolusi yang tepat per breakpoint.
            Ini mencegah download gambar full-1920px di layar mobile 375px.
            Kombinasi dengan WebP output dari sharp = LCP turun drastis.
          */}
          <Image 
            src={banner.imageUrl} 
            alt={banner.title} 
            fill
            priority={idx === 0}
            fetchPriority={idx === 0 ? 'high' : 'low'}
            loading={idx === 0 ? 'eager' : 'lazy'}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
            className="object-cover object-center opacity-85" 
          />
          {/* Overlay gradien gelap agar teks tetap terbaca tajam di mobile maupun desktop */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/65 to-slate-950/40 md:bg-gradient-to-r md:from-slate-950/95 md:via-slate-950/70 md:to-slate-950/35" />
        </div>
      ))}

      {/* Default glow ambient jika tidak ada banner */}
      {!hasBanners && <div className="glow-ambient" />}

      {/* Hero Content */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 my-auto">
        <div className="flex flex-col items-start text-left max-w-3xl">

          {/* Heading & CTA */}
          <h1 className={`font-heading font-extrabold text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.08] tracking-tight mb-5 md:mb-6 font-editorial-serif ${
            hasBanners ? 'text-white' : 'text-text-dark'
          }`}>
            Pelayanan Medis <span className="text-primary italic">Profesional</span> dengan
            Sentuhan Kasih.
          </h1>
          <p className={`text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mb-8 md:mb-10 ${
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
      </div>
        
      {/* Banner Navigasi (Dots) - Posisikan di paling bawah layar hero */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
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
    </section>
  );
}
