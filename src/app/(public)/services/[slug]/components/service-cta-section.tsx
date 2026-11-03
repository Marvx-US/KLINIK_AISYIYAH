'use client';

import React from 'react';
import Link from 'next/link';
import { Phone } from 'lucide-react';

interface ServiceCtaSectionProps {
  whatsappUrl: string;
}

export default function ServiceCtaSection({ whatsappUrl }: ServiceCtaSectionProps) {
  return (
    <section id="cta-section" className="bg-[#0EA5A4] py-16 text-white text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold font-editorial-serif leading-tight">
          Ingin Berkonsultasi atau Mendaftar Layanan Ini?
        </h2>
        <p className="text-white/80 max-w-xl mx-auto text-sm sm:text-base font-medium leading-relaxed">
          Dapatkan respon cepat dan penjadwalan janji temu dokter yang mudah langsung melalui WhatsApp kami tanpa perlu antre di klinik.
        </p>
        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <Link 
            href={whatsappUrl}
            target="_blank"
            className="px-8 py-4 bg-white text-[#0EA5A4] font-bold rounded-full transition-all shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2"
          >
            <Phone className="w-5 h-5" />
            Hubungi via WhatsApp
          </Link>
        </div>
      </div>
    </section>
  );
}
