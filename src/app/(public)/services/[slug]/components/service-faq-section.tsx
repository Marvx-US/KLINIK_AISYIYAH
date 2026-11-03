'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import type { FAQItem } from '@/features/services/types/public-service';

interface ServiceFaqSectionProps {
  faq: FAQItem[];
}

export default function ServiceFaqSection({ faq }: ServiceFaqSectionProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  if (!faq || faq.length === 0) return null;

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
          Tanya Jawab Layanan (FAQ)
        </h2>
        <p className="text-text-muted text-xs">
          Jawaban atas keraguan atau pertanyaan umum sebelum berkunjung.
        </p>
      </div>

      <div className="space-y-4">
        {faq.map((item, idx) => {
          const isOpen = activeFaq === idx;
          return (
            <div 
              key={idx} 
              className="bg-white rounded-2xl border border-border-fine/60 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.005)] transition-all"
            >
              <button 
                onClick={() => setActiveFaq(isOpen ? null : idx)}
                className="w-full p-6 text-left font-bold text-text-dark flex items-center justify-between gap-4 hover:bg-bg-snow/30 transition-colors"
              >
                <span className="text-base">{item.question}</span>
                <span className={`w-8 h-8 rounded-full border border-border-fine flex items-center justify-center text-text-muted shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45 bg-[#0EA5A4]/10 border-[#0EA5A4]/20 text-[#0EA5A4]' : ''}`}>
                  <Plus className="w-4 h-4" />
                </span>
              </button>
              
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 pt-1 text-sm text-text-muted leading-relaxed font-medium border-t border-border-fine/30">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
