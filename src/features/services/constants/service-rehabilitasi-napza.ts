import { type ServiceData } from './services-data-types';

export const SERVICE_REHABILITASI_NAPZA: ServiceData = {
  id: 6,
  slug: 'rehabilitasi-napza',
  title: 'Unit Rehabilitasi Rawat Jalan Napza',
  shortDescription:
    'Layanan pemulihan dan konseling penyalahgunaan zat terlarang secara holistik, rahasia (konfidensial), dan didampingi konselor medis berpengalaman.',
  fullDescription:
    'Unit Rehabilitasi Napza Klinik Aisyiyah menyediakan program rehabilitasi rawat jalan bagi individu yang bertekad pulih dari ketergantungan narkotika, psikotropika, dan zat adiktif lainnya. Kami memprioritaskan privasi penuh pasien, menggunakan pendekatan terapi kognitif perilaku (CBT), serta dukungan spiritual yang membimbing kembali ke kehidupan sosial produktif.',
  purpose:
    'Membantu pasien melepaskan diri dari rantai kecanduan zat adiktif, meminimalkan gejala putus zat (sakau) secara medis, serta mencegah kekambuhan (relapse) melalui penguatan mental sosial.',
  benefits: [
    'Jaminan kerahasiaan identitas dan medis 100% (konfidensial).',
    'Program terapi rawat jalan yang tidak mengganggu aktivitas sekolah atau kerja.',
    'Pendekatan konseling psikososial berstandar nasional.',
    'Dukungan spiritual berkelanjutan.',
  ],
  targetAudience:
    'Individu yang memiliki masalah ketergantungan napza/alkohol yang membutuhkan bimbingan medis, konseling psikolog, serta pendampingan pemulihan mental.',
  heroImage:
    'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2070&auto=format&fit=crop',
  gallery: [
    'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2070&auto=format&fit=crop',
  ],
  facilities: [
    'Ruang Konseling Privat & Kedap Suara',
    'Laboratorium Tes Narkoba Urine Cepat',
    'Area Terapi Kelompok Outdoor yang Teduh',
    'Apotek Terpadu Terjaga Keamanan',
    'Buku Panduan Pemulihan Mandiri',
  ],
  doctors: [
    {
      name: 'dr. H. Rian Hidayat',
      specialty: 'Dokter Umum Pemeriksa Asesmen Medis',
      experience: '8 Tahun',
      schedule: 'Sesuai Perjanjian',
      image:
        'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop',
    },
    {
      name: 'Siti Rahmawati, S.Psi',
      specialty: 'Konselor Adiksi & Psikolog Klinis',
      experience: '6 Tahun',
      schedule: 'Sesuai Perjanjian',
      image:
        'https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=2000&auto=format&fit=crop',
    },
  ],
  operationalHours: {},
  workflow: [
    'Pasien/keluarga melakukan pendaftaran khusus konfidensial.',
    'Asesmen Medis & Asesmen Adiksi awal (menggunakan instrumen ASSIST).',
    'Penyusunan Rencana Terapi Rawat Jalan yang dipersonalisasi.',
    'Sesi Terapi Konseling Individu berkelanjutan (4-8 sesi).',
    'Pemeriksaan tes urine berkala untuk pemantauan kebersihan zat.',
    'Evaluasi pemulihan akhir dan penyusunan rencana pasca rehabilitasi.',
  ],
  preparation: [
    'Adanya komitmen internal dan kesadaran diri pasien untuk pulih dari kecanduan.',
    'Harus didampingi oleh orang tua/wali/keluarga dekat pada sesi asesmen pertama.',
    'Membawa kartu identitas (KTP/Kartu Pelajar).',
    'Bersedia mematuhi aturan program serta jadwal konseling yang telah disepakati bersama.',
  ],
  procedures: [
    {
      title: 'Asesmen Medis & Psikososial',
      description: 'Pemeriksaan tingkat kecanduan dan evaluasi kesehatan mental fisik pasien.',
      iconName: 'Activity',
    },
    {
      title: 'Konseling Adiksi Individual',
      description: 'Konseling psikologi privat berfokus pada motivasi diri untuk pulih dan pencegahan kambuh.',
      iconName: 'Smile',
    },
    {
      title: 'Terapi Perilaku Kognitif (CBT)',
      description: 'Metode terapi psikologi untuk merestrukturisasi pola pikir negatif pemicu adiksi.',
      iconName: 'HeartPulse',
    },
    {
      title: 'Tes Urine Skrining Narkoba',
      description: 'Skrining urine mendeteksi berbagai jenis narkotika secara cepat dan akurat.',
      iconName: 'ShieldCheck',
    },
  ],
  faq: [
    {
      question: 'Apakah data medis pasien rehabilitasi aman?',
      answer:
        'Kami menjamin kerahasiaan identitas dan data medis pasien rehabilitasi 100%. Hak privasi pasien dilindungi undang-undang medis serta etika profesional tertinggi.',
    },
    {
      question: 'Berapa lama durasi rehabilitasi rawat jalan ini?',
      answer:
        'Umumnya program dasar rehabilitasi rawat jalan memerlukan waktu 8 - 12 minggu, tergantung pada tingkat keparahan adiksi dan perkembangan motivasi pasien selama program.',
    },
  ],
  relatedServices: ['poli-umum', 'layanan-laboratorium'],
  contactInformation: {
    phone: '0878-3117-7100',
    whatsapp: 'https://wa.me/6287831177100',
    email: 'klinikaisyiyahpangkajene@gmail.com',
  },
  seo: {
    title: 'Unit Rehabilitasi Rawat Jalan Napza Pangkajene Sidrap - Klinik Aisyiyah',
    description:
      'Layanan rehabilitasi adiksi narkoba rawat jalan dengan pendampingan dokter & psikolog secara privat dan konfidensial.',
    keywords: ['rehabilitasi narkoba pangkajene', 'rehab rawat jalan', 'konseling kecanduan', 'psikolog adiksi', 'tes urine narkoba'],
  },
};
