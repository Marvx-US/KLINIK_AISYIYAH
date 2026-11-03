import { type ServiceData } from './services-data-types';

export const SERVICE_POLI_GIGI: ServiceData = {
  id: 3,
  slug: 'poli-gigi',
  title: 'Poli Gigi & Mulut Spesialis',
  shortDescription:
    'Perawatan komprehensif untuk kesehatan gigi dan estetika senyum Anda, ditangani oleh dokter gigi profesional dengan teknologi modern.',
  fullDescription:
    'Poli Gigi Klinik Aisyiyah menyediakan berbagai macam perawatan gigi preventif, restoratif, dan kosmetik. Kami memahami bahwa kunjungan ke dokter gigi dapat memicu kecemasan, oleh karena itu kami menerapkan pendekatan yang lembut, ramah anak, dan informatif untuk memastikan kenyamanan penuh pasien selama tindakan berlangsung.',
  purpose:
    'Membantu pasien mempertahankan kesehatan gigi dan mulut yang optimal, mengatasi nyeri gigi akut, serta memberikan restorasi estetika untuk senyum yang sehat percaya diri.',
  benefits: [
    'Peralatan dental unit modern dan higienis bersertifikasi steril.',
    'Layanan penambalan estetika sewarna gigi asli.',
    'Dokter gigi anak berpengalaman dengan teknik pendekatan santai.',
    'Konsultasi edukatif tentang cara merawat gigi di rumah.',
  ],
  targetAudience:
    'Semua orang yang membutuhkan pembersihan karang gigi rutin, penambalan berlubang, pencabutan gigi bungsu, hingga pemasangan kawat gigi (orthodontic) dan veneer estetika.',
  heroImage:
    'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2070&auto=format&fit=crop',
  gallery: [
    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?q=80&w=2000&auto=format&fit=crop',
  ],
  facilities: [
    'Modern Dental Unit dengan Monitor',
    'Alat Sterilisasi Autoclave Standar Internasional',
    'Intraoral Camera (Foto Gigi Langsung)',
    'Ruang Tunggu Khusus Poli Gigi',
    'Akses Wi-Fi Kecepatan Tinggi',
  ],
  doctors: [
    {
      name: 'drg. Shinta Wulandari',
      specialty: 'Dokter Gigi Restorasi & Konservasi',
      experience: '7 Tahun',
      schedule: 'Senin, Rabu, Jumat (16.00 - 18.00 WITA)',
      image:
        'https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=2000&auto=format&fit=crop',
    },
    {
      name: 'drg. Rahmat Setiawan',
      specialty: 'Dokter Gigi Umum & Estetika Gigi',
      experience: '9 Tahun',
      schedule: 'Selasa, Kamis, Sabtu (16.00 - 18.00 WITA)',
      image:
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2000&auto=format&fit=crop',
    },
  ],
  operationalHours: {
    Senin: '16.00 - 18.00 WITA',
    Selasa: '16.00 - 18.00 WITA',
    Rabu: '16.00 - 18.00 WITA',
    Kamis: '16.00 - 18.00 WITA',
    Jumat: '16.00 - 18.00 WITA',
    Sabtu: '16.00 - 18.00 WITA',
    Minggu: 'Tutup',
  },
  workflow: [
    'Melakukan registrasi poli gigi.',
    'Masuk ke Ruang Tindakan Gigi.',
    'Dokter gigi melakukan pemeriksaan awal dan mendokumentasikan dengan kamera intraoral.',
    'Penyampaian diagnosa, opsi tindakan, serta persetujuan estimasi biaya.',
    'Proses Tindakan Gigi (Scaling, tambal, atau cabut).',
    'Edukasi pasca tindakan, pembayaran, dan penjadwalan kontrol berikutnya.',
  ],
  preparation: [
    'Menyikat gigi dengan bersih di rumah sebelum berkunjung.',
    'Membawa kartu identitas medis dan kartu asuransi.',
    'Menginformasikan kepada dokter gigi jika memiliki riwayat sakit jantung, diabetes, atau sedang hamil.',
    'Menghindari konsumsi kafein berlebih sebelum tindakan gigi.',
  ],
  procedures: [
    {
      title: 'Scaling (Pembersihan Karang Gigi)',
      description: 'Tindakan membersihkan tumpukan karang gigi untuk mencegah radang gusi.',
      iconName: 'Smile',
    },
    {
      title: 'Penambalan Komposit Estetis',
      description: 'Penambalan gigi berlubang menggunakan bahan sewarna gigi asli agar terlihat alami.',
      iconName: 'ShieldCheck',
    },
    {
      title: 'Pencabutan Gigi (Ekstraksi)',
      description: 'Tindakan pencabutan gigi berlubang parah atau gigi bungsu yang impaksi.',
      iconName: 'Activity',
    },
    {
      title: 'Perawatan Saluran Akar (PSA)',
      description: 'Tindakan mempertahankan gigi asli yang infeksinya sudah mencapai saraf gigi.',
      iconName: 'HeartPulse',
    },
  ],
  faq: [
    {
      question: 'Apakah membersihkan karang gigi terasa sakit?',
      answer:
        'Pembersihan karang gigi menggunakan alat ultrasonik yang sangat aman. Terkadang ada rasa ngilu sedikit di area gigi sensitif, namun ini wajar dan dokter gigi kami akan menyesuaikan getarannya agar nyaman.',
    },
    {
      question: 'Apakah Poli Gigi melayani pasien BPJS?',
      answer:
        'Ya, BPJS Kesehatan mencakup beberapa tindakan gigi seperti tambal gigi, cabut gigi biasa, dan scaling gigi satu kali dalam setahun atas indikasi medis.',
    },
  ],
  vaccinePrices: [
    { name: 'Konsultasi & Check-up Gigi', price: 50000 },
    { name: 'Pencabutan Gigi Sederhana', price: 150000 },
    { name: 'Scaling / Pembersihan Karang Gigi', price: 200000 },
    { name: 'Penambalan Gigi Komposit (Estetis)', price: 250000 },
    { name: 'Perawatan Saluran Akar (PSA)', price: 350000 },
    { name: 'Pencabutan Gigi Bungsu / Odontektomi', price: 750000 },
  ],
  relatedServices: ['poli-umum', 'layanan-laboratorium'],
  contactInformation: {
    phone: '0878-3117-7100',
    whatsapp: 'https://wa.me/6287831177100',
    email: 'klinikaisyiyahpangkajene@gmail.com',
  },
  seo: {
    title: 'Poli Gigi & Mulut Spesialis - Klinik Aisyiyah',
    description:
      'Dapatkan senyum sehat dan bebas karang gigi bersama dokter gigi ramah dan profesional Klinik Aisyiyah. Melayani scaling, penambalan, dan cabut gigi.',
    keywords: ['dokter gigi pangkajene', 'scaling gigi terdekat', 'tambal gigi estetis', 'cabut gigi bungsu', 'bpjs gigi'],
  },
};
