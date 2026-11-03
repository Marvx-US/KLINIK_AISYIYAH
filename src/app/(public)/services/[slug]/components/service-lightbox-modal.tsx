'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ServiceLightboxModalProps {
  selectedImage: string | null;
  onClose: () => void;
}

export default function ServiceLightboxModal({
  selectedImage,
  onClose,
}: ServiceLightboxModalProps) {
  return (
    <AnimatePresence>
      {selectedImage && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-white hover:text-[#0EA5A4] transition-colors bg-white/10 p-2 rounded-full border border-white/10"
            aria-label="Tutup pratinjau gambar"
          >
            <X className="w-6 h-6" />
          </button>
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[80vh] aspect-[4/3] rounded-[1.5rem] overflow-hidden border border-white/10 shadow-2xl"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={selectedImage} 
              alt="Zoomed Ruangan" 
              className="w-full h-full object-contain bg-black/50 p-2"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
