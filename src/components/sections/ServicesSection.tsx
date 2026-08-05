import { HeartPulse, ShieldCheck, Activity, Award, ShieldAlert, Smile, Baby, Syringe } from 'lucide-react';
import ServiceCard, { type ServiceCardData } from '@/components/ui/ServiceCard';
import SectionHeader from '@/components/ui/SectionHeader';

/** Data layanan klinik statis — sebagai fallback jika database kosong */
export const STATIC_SERVICES: ServiceCardData[] = [
  {
    title: 'IGD (Instalasi Gawat Darurat) 24 Jam',
    slug: 'igd',
    desc: 'Layanan gawat darurat 24 jam dengan penanganan cepat, tepat, dan didukung oleh tim medis siaga.',
    icon: ShieldAlert,
  },
  {
    title: 'Poli Umum Terpadu',
    slug: 'poli-umum',
    desc: 'Pemeriksaan kesehatan dasar oleh dokter berpengalaman untuk penanganan keluhan medis umum secara cepat.',
    icon: HeartPulse,
  },
  {
    title: 'Poli Gigi & Mulut',
    slug: 'poli-gigi',
    desc: 'Pembersihan karang gigi, penambalan, pencabutan, dan konsultasi kesehatan mulut keluarga.',
    icon: Smile,
  },
  {
    title: 'Kesehatan Ibu & Anak (KIA)',
    slug: 'poli-kia',
    desc: 'Layanan rutin kehamilan, tumbuh kembang balita, imunisasi anak, dan KB terpadu.',
    icon: Baby,
  },
  {
    title: 'Vaksin Haji & Umrah',
    slug: 'vaksin-haji',
    desc: 'Layanan vaksinasi wajib dan anjuran untuk calon jemaah haji dan umrah guna perlindungan kesehatan optimal.',
    icon: Syringe,
  },
  {
    title: 'Rehabilitasi Napza',
    slug: 'rehabilitasi-napza',
    desc: 'Program pemulihan dan konseling penyalahgunaan napza secara terpadu, konfidensial, dan profesional.',
    icon: Activity,
  }
];

interface ServicesSectionProps {
  services?: any[];
}

/**
 * ServicesSection — Section layanan medis terpadu di halaman beranda.
 */
export default function ServicesSection({ services = [] }: ServicesSectionProps) {
  const displayServices = services.length > 0
    ? services.map((s) => ({
        title: s.name,
        slug: s.slug,
        desc: s.description,
        iconName: s.iconName,
      }))
    : STATIC_SERVICES;

  return (
    <section className="py-12 md:py-16 w-full px-6 sm:px-8 lg:px-12 border-fine-b bg-bg-snow">
      <SectionHeader
        eyebrow="Layanan Kami"
        heading="Solusi Layanan Medis Terpadu"
        description="Menyediakan berbagai fasilitas penunjang medis modern guna memberikan diagnosis yang tepat demi pengobatan optimal Anda."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayServices.map((svc) => (
          <ServiceCard key={svc.title} service={svc} />
        ))}
      </div>
    </section>
  );
}
