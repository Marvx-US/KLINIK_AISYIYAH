import React from 'react';
import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';

export interface FacilityData {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

interface FacilityGallerySectionProps {
  facilities: FacilityData[];
}

export default function FacilityGallerySection({ facilities }: FacilityGallerySectionProps) {
  if (!facilities || facilities.length === 0) return null;

  return (
    <section className="py-24 w-full px-6 sm:px-8 lg:px-12 border-fine-b bg-bg-snow relative">
      <SectionHeader
        eyebrow="Fasilitas & Ruangan"
        heading="Kenyamanan & Teknologi Medis Terdepan"
        description="Jelajahi berbagai fasilitas modern di Klinik Aisyiyah yang dirancang khusus untuk kenyamanan dan keamanan Anda selama masa perawatan."
      />
      
      {/* Masonry Layout using CSS Columns */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {facilities.map((facility) => (
          <div 
            key={facility.id} 
            className="break-inside-avoid relative group rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
          >
            <Image 
              src={facility.imageUrl} 
              alt={facility.name} 
              width={600}
              height={450}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
              className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            
            {/* Glassmorphism Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
              <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <h3 className="font-heading font-extrabold text-white text-xl md:text-2xl tracking-tight mb-2">
                  {facility.name}
                </h3>
                <p className="text-white/90 text-sm md:text-base line-clamp-3 font-sans">
                  {facility.description}
                </p>
              </div>
            </div>
            
            {/* Static Gradient (only at very bottom) for mobile visibility without hover */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent md:hidden pointer-events-none" />
            <div className="absolute bottom-4 left-6 right-6 md:hidden pointer-events-none">
              <h3 className="font-heading font-extrabold text-white text-lg tracking-tight shadow-black/50">
                {facility.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
