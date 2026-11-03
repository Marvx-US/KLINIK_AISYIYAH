'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

interface ServiceGallerySectionProps {
  gallery: string[];
  serviceTitle: string;
  onSelectImage: (url: string) => void;
}

export default function ServiceGallerySection({
  gallery,
  serviceTitle,
  onSelectImage,
}: ServiceGallerySectionProps) {
  if (!gallery || gallery.length === 0) return null;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-text-dark font-heading">
          Galeri Foto Ruangan & Fasilitas
        </h2>
        <p className="text-text-muted text-xs">
          Dokumentasi asli kebersihan dan kerapian ruang tindakan medis kami.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {gallery.map((imgUrl, idx) => (
          <div 
            key={idx} 
            onClick={() => onSelectImage(imgUrl)}
            className="group relative aspect-[4/3] rounded-[1.25rem] overflow-hidden border border-border-fine bg-slate-900/5 flex items-center justify-center p-2 cursor-pointer shadow-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={imgUrl} 
              alt={`Galeri ${serviceTitle} ${idx + 1}`} 
              onError={(e) => {
                const parent = e.currentTarget.parentElement;
                if (parent) parent.style.display = 'none';
              }}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
