import React from 'react';
import Link from 'next/link';
import { 
  type LucideIcon, HeartPulse, Smile, Baby, Syringe, 
  Activity, ShieldAlert, Stethoscope, Heart, Award, ShieldCheck, HelpCircle 
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  HeartPulse,
  Smile,
  Baby,
  Syringe,
  Activity,
  ShieldAlert,
  Stethoscope,
  Heart,
  Award,
  ShieldCheck,
};

export interface ServiceCardData {
  title: string;
  desc: string;
  icon?: LucideIcon;
  iconName?: string;
  slug?: string;
}

interface ServiceCardProps {
  service: ServiceCardData;
}

/**
 * ServiceCard — Kartu layanan medis pada halaman beranda atau halaman layanan.
 */
export default function ServiceCard({ service }: ServiceCardProps) {
  const Icon = service.icon || (service.iconName ? ICON_MAP[service.iconName] : null) || Activity;
  const content = (
    <div className="group relative bg-white p-8 rounded-[1.25rem] border border-border-fine/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-primary/80 hover:shadow-[0_16px_32px_rgba(13,148,136,0.08)] hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col h-full overflow-hidden cursor-pointer">
      {/* Decorative ambient blur */}
      <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500 pointer-events-none" />
      
      <div className="relative flex justify-between items-start mb-8">
        <div className="h-14 w-14 rounded-2xl bg-bg-snow border border-border-fine/50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:shadow-md group-hover:shadow-primary/20 transition-all duration-300 ease-out z-10">
          <Icon className="h-6 w-6 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-3" />
        </div>
      </div>

      <h3 className="relative font-heading font-extrabold text-lg text-text-dark mb-3 group-hover:text-primary transition-colors duration-300 z-10">{service.title}</h3>
      <p className="relative text-text-muted text-sm leading-relaxed flex-grow z-10">{service.desc}</p>
    </div>
  );

  if (service.slug) {
    return (
      <Link href={`/services/${service.slug}`} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}
