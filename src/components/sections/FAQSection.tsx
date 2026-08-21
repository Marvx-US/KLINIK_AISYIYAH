'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Bagaimana cara mendaftar layanan?',
    answer: 'Anda dapat mendaftar langsung dengan datang ke meja pendaftaran klinik, atau menghubungi kami terlebih dahulu via WhatsApp untuk pendaftaran awal guna mempercepat proses administrasi di lokasi.',
  },
  {
    question: 'Apakah menerima BPJS?',
    answer: 'Saat ini Klinik Aisyiyah Pangkajene melayani pasien umum mandiri serta beberapa asuransi kemitraan korporasi. Kami sedang dalam proses integrasi sistem dengan BPJS Kesehatan untuk melayani Anda lebih luas di masa depan.',
  },
  {
    question: 'Bagaimana cara membuat janji?',
    answer: 'Membuat janji temu dengan dokter spesialis atau dokter gigi sangat mudah. Silakan klik tombol "Hubungi Kami" atau hubungi WhatsApp resmi kami, pilih dokter dan jadwal yang Anda inginkan, dan admin kami akan memberikan konfirmasi jadwal.',
  },
  {
    question: 'Bagaimana jam praktek pelayanan poliklinik?',
    answer: 'Jam praktek pelayanan poliklinik di Klinik Aisyiyah Pangkajene yaitu Poli Umum pukul 13.00 - 20.00 WITA, serta Poli KIA dan Poli Gigi pukul 16.00 - 18.00 WITA. Layanan Instalasi Gawat Darurat (IGD) tetap siaga 24 Jam Nonstop.',
  },
  {
    question: 'Apakah tersedia konsultasi online?',
    answer: 'Ya, kami menyediakan layanan telekonsultasi kesehatan dasar terbatas melalui layanan chat WhatsApp terpadu dokter kami untuk memantau keluhan ringan atau konsultasi hasil laboratorium pasca pemeriksaan fisik.',
  },
  {
    question: 'Bagaimana cara menghubungi klinik?',
    answer: 'Anda dapat menghubungi pusat kontak kami melalui Telepon/WhatsApp di 0878-3117-7100, email di klinikaisyiyahpangkajene@gmail.com, atau klik ikon chat WhatsApp yang melayang di pojok layar untuk berkomunikasi secara langsung dengan staf medis kami.',
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-12 md:py-16 w-full px-6 sm:px-8 lg:px-12 bg-bg-snow border-t border-border-fine/40 relative overflow-hidden">
      {/* Decorative Blur Ambient Background */}
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <ScrollReveal className="max-w-4xl mx-auto">
        <SectionHeader
          eyebrow="Tanya Jawab"
          heading="Pertanyaan yang Sering Diajukan"
          description="Temukan jawaban cepat atas pertanyaan umum seputar administrasi pendaftaran, asuransi, dan alur pelayanan medis di Klinik Aisyiyah."
        />

        <div className="mt-16 flex flex-col gap-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = activeIndex === index;
            return (
              <div
                key={index}
                className={`bg-white rounded-[1.25rem] border transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] ${
                  isOpen 
                    ? 'border-primary/40 shadow-[0_12px_24px_rgba(13,148,136,0.04)]' 
                    : 'border-border-fine/60 hover:border-primary/20 hover:shadow-[0_8px_16px_rgba(0,0,0,0.02)]'
                }`}
              >
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full text-left px-6 py-5 md:px-8 md:py-6 flex items-center justify-between gap-4 font-heading font-bold text-base md:text-lg text-text-dark focus:outline-none cursor-pointer"
                >
                  <span>{item.question}</span>
                  <div
                    className={`shrink-0 w-8 h-8 rounded-full bg-bg-snow border border-border-fine/40 flex items-center justify-center text-text-muted transition-transform duration-300 ease-out ${
                      isOpen ? 'rotate-180 text-primary bg-primary-light/50 border-primary/20' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Smooth Height Expansion with CSS Grid */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div suppressHydrationWarning className="px-6 pb-6 md:px-8 md:pb-8 border-t border-border-fine/30 pt-4 text-text-muted text-sm md:text-base leading-relaxed font-sans">
                      {item.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollReveal>
    </section>
  );
}
