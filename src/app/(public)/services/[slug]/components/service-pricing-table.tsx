'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { VaccinePriceItem } from '@/features/services/types/public-service';

interface ServicePricingTableProps {
  prices: VaccinePriceItem[] | null | undefined;
  currentSlug: string;
}

export default function ServicePricingTable({ prices, currentSlug }: ServicePricingTableProps) {
  if (!prices || prices.length === 0) return null;

  const isPoliGigi = currentSlug === 'poli-gigi';

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
          {isPoliGigi ? 'Daftar Harga Periksa Gigi' : 'Daftar Harga Vaksinasi Resmi'}
        </h2>
        <p className="text-text-muted text-xs">
          {isPoliGigi
            ? 'Estimasi biaya perawatan gigi diurutkan dari yang terendah ke tertinggi.'
            : 'Harga vaksin transparan diurutkan dari yang terendah ke tertinggi.'}
        </p>
      </div>

      <div className="bg-white rounded-[1.5rem] border border-border-fine/60 shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-snow border-b border-border-fine/60">
                <th className="py-4 px-6 font-bold text-xs text-text-dark uppercase tracking-wider">
                  {isPoliGigi ? 'Tindakan / Perawatan' : 'Nama Vaksin'}
                </th>
                <th className="py-4 px-6 font-bold text-xs text-text-dark uppercase tracking-wider text-right">
                  Harga Estimasi (Nett)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-fine/30">
              {prices.map((item, idx) => (
                <tr key={idx} className="hover:bg-bg-snow/30 transition-colors">
                  <td className="py-4 px-6 text-sm font-semibold text-text-muted flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5A4] shrink-0" />
                    {item.name}
                  </td>
                  <td className="py-4 px-6 text-sm font-extrabold text-[#0EA5A4] text-right">
                    Rp {item.price.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.section>
  );
}
