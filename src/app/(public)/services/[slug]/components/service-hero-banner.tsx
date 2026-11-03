'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { ServiceDetailData } from '@/features/services/types/public-service';

interface ServiceHeroBannerProps {
  service: ServiceDetailData;
  onScrollToCta: () => void;
}

export default function ServiceHeroBanner({ service, onScrollToCta }: ServiceHeroBannerProps) {
  return (
    <section className="relative w-full bg-slate-950 overflow-hidden" style={{ minHeight: '420px', paddingTop: '9rem', paddingBottom: '5rem' }}>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.55 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <Image 
          src={service.bannerImage || service.gallery[0] || service.heroImage} 
          alt={service.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center select-none pointer-events-none"
        />
      </motion.div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-bg-snow via-slate-950/50 to-transparent z-10" />

      <div className="relative z-20 max-w-7xl mx-auto w-full px-6 sm:px-12 lg:px-24">
        <div className="max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-white/70 text-xs font-semibold uppercase tracking-wider mb-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full w-fit border border-white/15"
          >
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/services" className="hover:text-white transition-colors">Layanan</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-extrabold">{service.title}</span>
          </motion.div>

          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-editorial-serif tracking-tight leading-[1.1] mb-6"
          >
            {service.title}
          </motion.h1>
          
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/80 text-base sm:text-lg mb-8 leading-relaxed max-w-2xl font-medium"
          >
            {service.shortDescription}
          </motion.p>
          
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <button 
              onClick={onScrollToCta}
              className="px-8 py-4 bg-[#0EA5A4] hover:bg-[#0c8c8b] text-white font-bold rounded-full transition-all shadow-lg shadow-[#0EA5A4]/25 hover:shadow-xl hover:shadow-[#0EA5A4]/35 hover:-translate-y-0.5"
            >
              Daftar Sekarang
            </button>
            <Link 
              href={service.contactInformation.whatsapp}
              target="_blank"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full border border-white/20 hover:border-white/40 transition-all backdrop-blur-md flex items-center gap-2"
            >
              Hubungi Kami
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
