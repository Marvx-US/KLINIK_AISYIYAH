import React from 'react';
import { type LucideIcon, ArrowUpRight } from 'lucide-react';

export interface ServiceCardData {
  title: string;
  desc: string;
  icon: LucideIcon;
}

interface ServiceCardProps {
  service: ServiceCardData;
}

/**
 * ServiceCard — Kartu layanan medis pada halaman beranda.
 */
export default function ServiceCard({ service }: ServiceCardProps) {
  const Icon = service.icon;
  return (
    <div className="group relative bg-white p-8 rounded-[2rem] border border-border-fine/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(13,148,136,0.08)] hover:-translate-y-1 transition-all duration-500 flex flex-col h-full overflow-hidden cursor-pointer">
      {/* Decorative ambient blur */}
      <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/15 transition-colors duration-700 pointer-events-none" />
      
      <div className="relative flex justify-between items-start mb-10">
        <div className="h-14 w-14 rounded-2xl bg-bg-snow border border-border-fine/50 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-500 z-10">
          <Icon className="h-6 w-6" />
        </div>
        
        {/* Hover Action Arrow */}
        <div className="h-10 w-10 rounded-full bg-bg-snow border border-border-fine/50 flex items-center justify-center text-text-muted opacity-0 -translate-x-4 translate-y-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-out z-10">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>

      <h3 className="relative font-heading font-extrabold text-xl text-text-dark mb-3 group-hover:text-primary transition-colors duration-300 z-10">{service.title}</h3>
      <p className="relative text-text-muted text-sm leading-relaxed flex-grow z-10">{service.desc}</p>
    </div>
  );
}
