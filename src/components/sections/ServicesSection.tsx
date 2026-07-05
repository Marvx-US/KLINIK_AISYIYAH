import React from 'react';
import { HeartPulse, ShieldCheck, Activity, Award } from 'lucide-react';
import ServiceCard, { type ServiceCardData } from '@/components/ui/ServiceCard';
import SectionHeader from '@/components/ui/SectionHeader';

/** Data layanan klinik — dipusatkan di sini, mudah ditambah/diedit */
const SERVICES: ServiceCardData[] = [
  {
    title: 'Poli Umum',
    desc: 'Pemeriksaan kesehatan dasar oleh dokter berpengalaman untuk penanganan keluhan medis umum secara cepat.',
    icon: HeartPulse,
  },
  {
    title: 'Kesehatan Ibu & Anak (KIA)',
    desc: 'Layanan rutin kehamilan, tumbuh kembang balita, imunisasi anak, dan KB terpadu.',
    icon: ShieldCheck,
  },
  {
    title: 'Poli Gigi & Mulut',
    desc: 'Pembersihan karang gigi, penambalan, pencabutan, dan konsultasi kesehatan mulut keluarga.',
    icon: Activity,
  },
  {
    title: 'Layanan Laboratorium',
    desc: 'Pemeriksaan gula darah, kolesterol, asam urat, urin lengkap, dan tes diagnostik penunjang.',
    icon: Award,
  },
];

/**
 * ServicesSection — Section layanan medis terpadu di halaman beranda.
 */
export default function ServicesSection() {
  return (
    <section className="py-24 w-full px-6 sm:px-8 lg:px-12 border-fine-b bg-bg-snow">
      <SectionHeader
        eyebrow="Layanan Kami"
        heading="Solusi Layanan Medis Terpadu"
        description="Menyediakan berbagai fasilitas penunjang medis modern guna memberikan diagnosis yang tepat demi pengobatan optimal Anda."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {SERVICES.map((svc) => (
          <ServiceCard key={svc.title} service={svc} />
        ))}
      </div>
    </section>
  );
}
