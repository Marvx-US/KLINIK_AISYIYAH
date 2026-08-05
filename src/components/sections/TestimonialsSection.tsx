'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import Image from 'next/image';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface Testimonial {
  id: number;
  name: string;
  role: string; // Layanan yang digunakan
  rating: number;
  content: string;
  imageUrl: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Andi Wijaya',
    role: 'Pasien Poli Umum',
    rating: 5,
    content: 'Pelayanan di Klinik Aisyiyah sangat ramah dan efisien. Dokter umum yang memeriksa saya sangat sabar menjelaskan penyebab penyakit dan memberikan tips pencegahannya secara gamblang. Antreannya pun tertib.',
    imageUrl: '/uploads/patient_1.jpg',
  },
  {
    id: 2,
    name: 'Siti Rahma',
    role: 'Pasien Poli KIA / Bersalin',
    rating: 5,
    content: 'Saya mempercayakan pemeriksaan kandungan saya dari trimester pertama hingga melahirkan di sini. Bidan dan perawat sangat siaga, fasilitas ruang bersalinnya bersih dan nyaman, memberikan rasa tenang luar biasa bagi ibu baru.',
    imageUrl: '/uploads/patient_2.jpg',
  },
  {
    id: 3,
    name: 'Budi Santoso',
    role: 'Pasien Poli Gigi',
    rating: 5,
    content: 'Pencabutan gigi bungsu di poli gigi berjalan tanpa rasa sakit berlebih. Dokter giginya sangat terampil dan menggunakan peralatan modern. Tarifnya pun sangat terjangkau dibandingkan dengan spesialis lain.',
    imageUrl: '/uploads/patient_3.jpg',
  },
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      handleNext();
    }, 6000);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const changeSlide = (newIndex: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(newIndex);
      setIsTransitioning(false);
    }, 300);
    resetTimer();
  };

  const handlePrev = () => {
    const newIndex = activeIndex === 0 ? TESTIMONIALS.length - 1 : activeIndex - 1;
    changeSlide(newIndex);
  };

  const handleNext = () => {
    const newIndex = (activeIndex + 1) % TESTIMONIALS.length;
    changeSlide(newIndex);
  };

  return (
    <section className="py-24 w-full px-6 sm:px-8 lg:px-12 bg-white border-t border-border-fine/40 relative overflow-hidden">
      {/* Background shapes */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <ScrollReveal className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-snow border border-border-fine shadow-sm text-xs font-bold tracking-widest uppercase text-primary mb-3">
            Testimoni Pasien
          </span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-text-dark tracking-tight">
            Apa Kata Mereka Tentang Kami
          </h2>
          <p className="text-text-muted mt-4 max-w-2xl mx-auto text-sm md:text-base">
            Ulasan jujur dari pasien yang telah merasakan langsung kualitas layanan medis profesional di Klinik Pratama Aisyiyah.
          </p>
        </div>

        <div className="relative bg-bg-snow rounded-[1.5rem] border border-border-fine/50 p-8 md:p-12 shadow-sm min-h-[350px] md:min-h-[300px] flex flex-col justify-between">
          {/* Quote Icon overlay */}
          <div className="absolute top-8 right-8 text-primary/10">
            <Quote className="w-16 h-16 fill-current rotate-180" />
          </div>

          {/* Slide Content */}
          <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
            {/* Rating Stars */}
            <div className="flex gap-1 text-accent-gold mb-6">
              {Array.from({ length: TESTIMONIALS[activeIndex].rating }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>

            {/* Testimonial Text */}
            <p className="text-text-dark font-sans text-base md:text-lg leading-relaxed italic mb-8">
              "{TESTIMONIALS[activeIndex].content}"
            </p>
          </div>

          {/* Patient Details & Navigation */}
          <div className="border-t border-border-fine/60 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className={`flex items-center gap-4 transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-x-2' : 'opacity-100 translate-x-0'}`}>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark border-2 border-primary/20 shrink-0 flex items-center justify-center text-white font-heading font-extrabold text-sm shadow-sm select-none">
                {TESTIMONIALS[activeIndex].name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <h4 className="font-heading font-extrabold text-sm md:text-base text-text-dark">
                  {TESTIMONIALS[activeIndex].name}
                </h4>
                <p className="text-xs text-primary font-bold mt-0.5">
                  {TESTIMONIALS[activeIndex].role}
                </p>
              </div>
            </div>

            {/* Carousel Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                aria-label="Previous Testimonial"
                className="w-10 h-10 rounded-full border border-border-fine/60 bg-white flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/40 hover:bg-white active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {/* Pagination Dots */}
              <div className="flex gap-1.5 px-2">
                {TESTIMONIALS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => changeSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                      activeIndex === idx ? 'bg-primary w-6' : 'bg-border-fine/80 hover:bg-text-muted/40'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                aria-label="Next Testimonial"
                className="w-10 h-10 rounded-full border border-border-fine/60 bg-white flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/40 hover:bg-white active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
