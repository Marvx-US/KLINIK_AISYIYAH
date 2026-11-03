'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, ClipboardList, Award, Users, Wind, 
  Wifi, ShieldAlert, Activity, Stethoscope, Check, LucideIcon 
} from 'lucide-react';
import type { ServiceDetailData } from '@/features/services/types/public-service';
import ScheduleShareButton from '@/components/ui/schedule-share-button';

function getFacilityIcon(name: string): LucideIcon {
  const n = name.toLowerCase();
  if (n.includes('tunggu')) return Users;
  if (n.includes('ac')) return Wind;
  if (n.includes('wi-fi') || n.includes('wifi')) return Wifi;
  if (n.includes('ambulans') || n.includes('ambulance')) return ShieldAlert;
  if (n.includes('doppler') || n.includes('ekg') || n.includes('observasi') || n.includes('defibrillator')) return Activity;
  if (n.includes('apotek') || n.includes('laboratorium') || n.includes('resusitasi')) return Stethoscope;
  return Check;
}

interface ServiceSidebarProps {
  service: ServiceDetailData;
  currentSlug: string;
  /** URL publik halaman ini — diteruskan ke tombol share jadwal. */
  pageUrl?: string;
}

export default function ServiceSidebar({ service, currentSlug, pageUrl }: ServiceSidebarProps) {
  const showHours = ['poli-umum', 'poli-kia', 'poli-gigi'].includes(currentSlug) && 
    Object.keys(service.operationalHours).length > 0;

  return (
    <div className="space-y-8">
      {/* Jadwal Pelayanan */}
      {showHours && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 rounded-[1.5rem] border border-border-fine/60 shadow-[0_8px_30px_rgba(0,0,0,0.03)]"
        >
          {/* Header kartu jam praktek + tombol share */}
          <div className="flex items-start justify-between gap-2 mb-4">
            <h3 className="font-extrabold text-lg text-text-dark flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#0EA5A4]" />
              Jam Praktek
            </h3>
            <ScheduleShareButton
              poli={service.title}
              doctorName={
                service.doctors && service.doctors.length > 0
                  ? service.doctors.map((d) => d.name).join(', ')
                  : 'Tim Dokter Klinik Aisyiyah'
              }
              scheduleInfo={Object.entries(service.operationalHours)
                .filter(([, time]) => Boolean(time))
                .map(([day, time]) => `${day}: ${time}`)
                .join(' | ')}
              serviceUrl={pageUrl}
              triggerVariant="icon-text"
              className="shrink-0"
            />
          </div>

          <div className="space-y-3.5">
            {Object.entries(service.operationalHours).map(([day, time]) => (
              <div key={day} className="flex justify-between items-center text-xs font-semibold py-2 border-b border-border-fine/30 last:border-0">
                <span className="text-text-muted">{day}</span>
                {time ? (
                  <span className="text-text-dark font-bold">{time}</span>
                ) : null}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Fasilitas Pendukung */}
      {service.facilities && service.facilities.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 rounded-[1.5rem] border border-border-fine/60 shadow-[0_8px_30px_rgba(0,0,0,0.03)]"
        >
          <h3 className="font-extrabold text-lg text-text-dark mb-6 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-[#0EA5A4]" />
            Fasilitas Pendukung
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {service.facilities.map((fac, i) => {
              const FacIcon = getFacilityIcon(fac);
              return (
                <div key={i} className="flex items-center gap-3 p-3 bg-bg-snow rounded-xl border border-border-fine/40">
                  <div className="w-8 h-8 rounded-lg bg-white border border-border-fine flex items-center justify-center text-[#0EA5A4]">
                    <FacIcon className="w-4 h-4" />
                  </div>
                  <span className="text-text-muted text-[11px] font-bold leading-tight truncate">{fac}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Persiapan Sebelum Berkunjung */}
      {service.preparation && service.preparation.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 rounded-[1.5rem] border border-border-fine/60 shadow-[0_8px_30px_rgba(0,0,0,0.03)]"
        >
          <h3 className="font-extrabold text-lg text-text-dark mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#0EA5A4]" />
            Persiapan Berkunjung
          </h3>

          <ul className="space-y-4">
            {service.preparation.map((prep, i) => (
              <li key={i} className="flex items-start gap-3 text-xs text-text-muted font-semibold leading-relaxed">
                <div className="w-5 h-5 rounded-full bg-[#0EA5A4]/10 flex items-center justify-center text-[#0EA5A4] shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <span>{prep}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}
