import React from 'react';

export interface PartnerData {
  id: number;
  name: string;
  logoUrl: string;
}

interface PartnersCarouselSectionProps {
  partners: PartnerData[];
}

export default function PartnersCarouselSection({ partners }: PartnersCarouselSectionProps) {
  if (!partners || partners.length === 0) return null;

  // Menduplikasi array partner 2 kali agar animasi looping terlihat mulus
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className="py-16 md:py-24 w-full bg-transparent overflow-hidden flex flex-col justify-center items-center">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center w-full flex flex-col items-center">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-border-fine shadow-sm text-xs font-bold tracking-widest uppercase text-primary mb-3">
          Jaringan Kemitraan
        </span>
        <h3 className="font-heading font-extrabold text-2xl md:text-3xl text-text-dark tracking-tight">
          Telah Dipercaya Oleh
        </h3>
      </div>
      
      {/* Marquee Container with CSS Mask for organic fade edges */}
      <div 
        className="relative w-full max-w-7xl mx-auto overflow-hidden hover-pause group flex gap-8"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
        }}
      >
        {/* First track */}
        <div className="flex animate-marquee gap-8 shrink-0 min-w-full justify-around">
          {duplicatedPartners.map((partner, idx) => (
            <div 
              key={`${partner.id}-${idx}`} 
              className="flex shrink-0 items-center justify-center h-20 w-32 md:w-48 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer hover:scale-110"
              title={partner.name}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={partner.logoUrl} 
                alt={partner.name} 
                className="max-h-full max-w-full object-contain filter drop-shadow-sm"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Second track (exact duplicate required for seamless loop) */}
        <div className="flex animate-marquee gap-8 shrink-0 min-w-full justify-around" aria-hidden="true">
          {duplicatedPartners.map((partner, idx) => (
            <div 
              key={`dup-${partner.id}-${idx}`} 
              className="flex shrink-0 items-center justify-center h-20 w-32 md:w-48 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer hover:scale-110"
              title={partner.name}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={partner.logoUrl} 
                alt={partner.name} 
                className="max-h-full max-w-full object-contain filter drop-shadow-sm"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
