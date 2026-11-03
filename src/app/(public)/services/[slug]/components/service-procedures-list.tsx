'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, Scissors, Activity, Wind, Stethoscope, 
  Smile, ShieldCheck, Baby, Award, FileText, LucideIcon 
} from 'lucide-react';
import type { Procedure } from '@/features/services/types/public-service';

const PROCEDURES_ICON_MAP: Record<string, LucideIcon> = {
  HeartPulse: Heart,
  Scissors: Scissors,
  Activity: Activity,
  Wind: Wind,
  Stethoscope: Stethoscope,
  Smile: Smile,
  ShieldCheck: ShieldCheck,
  Baby: Baby,
  Award: Award,
  Heart: Heart,
  FileText: FileText
};

interface ServiceProceduresListProps {
  procedures: Procedure[];
}

export default function ServiceProceduresList({ procedures }: ServiceProceduresListProps) {
  if (!procedures || procedures.length === 0) return null;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-text-dark font-heading">
          Pelayanan & Tindakan Medis
        </h2>
        <p className="text-text-muted text-xs">
          Seluruh cakupan tindakan medis terstandar yang siap diberikan oleh dokter dan perawat.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {procedures.map((proc, index) => {
          const ProcIcon = PROCEDURES_ICON_MAP[proc.iconName] || Stethoscope;
          return (
            <div 
              key={index} 
              className="group bg-white p-6 rounded-[1.25rem] border border-border-fine/60 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:border-[#0EA5A4]/60 hover:shadow-[0_12px_24px_rgba(14,165,164,0.06)] hover:-translate-y-1 transition-all duration-300 flex items-start gap-4 cursor-default"
            >
              <div className="h-12 w-12 rounded-xl bg-bg-snow border border-border-fine flex items-center justify-center text-[#0EA5A4] group-hover:bg-[#0EA5A4] group-hover:text-white transition-all shrink-0">
                <ProcIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-text-dark group-hover:text-[#0EA5A4] transition-colors text-base mb-1.5">
                  {proc.title}
                </h4>
                <p className="text-text-muted text-xs leading-relaxed font-medium">
                  {proc.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
