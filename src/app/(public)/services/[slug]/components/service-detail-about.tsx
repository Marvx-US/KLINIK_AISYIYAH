'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Activity, Check } from 'lucide-react';
import type { ServiceDetailData } from '@/features/services/types/public-service';

interface ServiceDetailAboutProps {
  service: ServiceDetailData;
}

export default function ServiceDetailAbout({ service }: ServiceDetailAboutProps) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <span className="w-8 h-[2px] bg-[#0EA5A4]" />
          <span className="text-[#0EA5A4] font-bold text-xs uppercase tracking-widest">Detail Layanan</span>
        </div>
        <h2 className="text-3xl font-extrabold text-text-dark font-heading leading-tight">
          Deskripsi Lengkap & Tujuan Medis
        </h2>
        <p className="text-text-muted text-sm leading-relaxed font-medium">
          {service.fullDescription}
        </p>
        
        <div className="bg-[#0EA5A4]/5 p-6 rounded-[1.25rem] border border-[#0EA5A4]/10">
          <h4 className="font-extrabold text-sm text-[#0EA5A4] uppercase tracking-wider mb-2 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Tujuan Utama
          </h4>
          <p className="text-text-muted text-xs leading-relaxed font-semibold">
            {service.purpose}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden border border-border-fine/60 shadow-sm bg-slate-900/5 group">
          <Image 
            src={service.heroImage || service.gallery[0] || '/uploads/default.jpg'} 
            alt={`Foto Dokter / Tenaga Medis ${service.title}`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 pointer-events-none">
            <span className="text-white text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
              Foto Dokter / Tenaga Medis
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          <h4 className="font-extrabold text-sm text-text-dark">Manfaat & Keunggulan Layanan:</h4>
          <ul className="grid grid-cols-1 gap-2.5">
            {service.benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-text-muted font-medium">
                <Check className="w-4 h-4 text-[#0EA5A4] shrink-0 mt-0.5" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.section>
  );
}
