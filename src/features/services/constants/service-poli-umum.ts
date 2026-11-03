import { type ServiceData } from './services-data-types';

export const SERVICE_POLI_UMUM: ServiceData = {
  id: 2,
  slug: 'poli-umum',
  title: 'Poli Umum Terpadu',
  shortDescription:
    'Layanan pemeriksaan kesehatan dasar dan konsultasi medis komprehensif oleh dokter umum berpengalaman untuk menjaga kesehatan Anda sekeluarga.',
  fullDescription:
    'Poli Umum Klinik Aisyiyah berfokus pada diagnosis awal, pengobatan penyakit umum harian, serta upaya promosi kesehatan preventif. Dokter-dokter umum kami siap memberikan waktu konsultasi yang cukup untuk mendengarkan keluhan medis Anda, melakukan pemeriksaan fisik komprehensif, serta merencanakan terapi yang paling sesuai.',
  purpose:
    'Memberikan pelayanan kesehatan tingkat pertama yang berfokus pada pencegahan, diagnosis dini, serta pengobatan berbagai keluhan kesehatan umum agar tidak berkembang menjadi lebih parah.',
  benefits: [
    'Konsultasi dokter yang ramah dan solutif.',
    'Sistem janji temu terpadu meminimalkan waktu antre.',
    'Terhubung langsung dengan fasilitas apotek internal.',
    'Rujukan terintegrasi jika pasien memerlukan dokter spesialis.',
  ],
  targetAudience:
    'Seluruh anggota keluarga, dari anak-anak hingga lansia, yang memiliki keluhan seperti demam, flu, batuk, diare, pusing, hipertensi, atau membutuhkan pemeriksaan kesehatan (medical check-up) rutin.',
  heroImage:
    'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2073&auto=format&fit=crop',
  gallery: [
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop',
  ],
  facilities: [
    'Ruang Konsultasi Dokter yang Nyaman',
    'Alat Pemeriksa Tensi Digital',
    'Termometer Infra merah',
    'Timbangan dan Stadiometer Akurat',
    'Sistem Rekam Medis Elektronik',
  ],
  doctors: [
    {
      name: 'dr. H. Rian Hidayat',
      specialty: 'Dokter Umum Keluarga',
      experience: '8 Tahun',
      schedule: 'Senin - Sabtu (13.00 - 20.00 WITA)',
      image:
        'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop',
    },
    {
      name: 'dr. Amalia Putri',
      specialty: 'Dokter Umum / Konsultan Preventif',
      experience: '5 Tahun',
      schedule: 'Senin - Sabtu (13.00 - 20.00 WITA)',
      image:
        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop',
    },
  ],
  operationalHours: {
    Senin: '13.00 - 20.00 WITA',
    Selasa: '13.00 - 20.00 WITA',
    Rabu: '13.00 - 20.00 WITA',
    Kamis: '13.00 - 20.00 WITA',
    Jumat: '13.00 - 20.00 WITA',
    Sabtu: '13.00 - 20.00 WITA',
    Minggu: 'Tutup',
  },
  workflow: [
    'Registrasi mandiri atau di meja pendaftaran.',
    'Pengukuran Tensi, Suhu, dan Berat Badan oleh Asisten Perawat.',
    'Masuk ke Ruang Konsultasi untuk diperiksa oleh Dokter.',
    'Pemberian Resep Obat atau rujukan laboratorium.',
    'Pembayaran di Kasir.',
    'Pengambilan Obat di unit Apotek Klinik.',
  ],
  preparation: [
    'Membawa kartu identitas (KTP/Kartu BPJS/Kartu Klinik).',
    'Mencatat riwayat alergi obat jika ada.',
    'Membawa hasil pemeriksaan laboratorium atau radiologi dari rumah sakit lain (jika ada).',
    'Datang 15 menit sebelum waktu konsultasi dimulai.',
  ],
  procedures: [
    {
      title: 'Konsultasi Medis Umum',
      description: 'Sesi tanya jawab mendalam dengan dokter untuk evaluasi keluhan kesehatan.',
      iconName: 'Stethoscope',
    },
    {
      title: 'Medical Check Up Fisik',
      description: 'Pemeriksaan fisik dasar untuk menilai kondisi kesehatan menyeluruh.',
      iconName: 'Activity',
    },
    {
      title: 'Penulisan Surat Sakit & Sehat',
      description: 'Pembuatan surat keterangan sehat/sakit resmi untuk kebutuhan dinas.',
      iconName: 'FileText',
    },
  ],
  faq: [
    {
      question: 'Apakah Poli Umum bekerja sama dengan BPJS Kesehatan?',
      answer:
        'Ya, kami melayani pasien BPJS Kesehatan tingkat pertama (Faskes 1). Pastikan faskes Anda telah terdaftar di Klinik Aisyiyah Pangkajene Sidrap.',
    },
    {
      question: 'Apakah bisa berkonsultasi secara online?',
      answer:
        'Saat ini konsultasi medis diwajibkan secara tatap muka agar pemeriksaan fisik dapat berjalan optimal dan akurat.',
    },
  ],
  relatedServices: ['poli-gigi', 'layanan-laboratorium'],
  contactInformation: {
    phone: '0878-3117-7100',
    whatsapp: 'https://wa.me/6287831177100',
    email: 'klinikaisyiyahpangkajene@gmail.com',
  },
  seo: {
    title: 'Poli Umum Terpadu Pangkajene Sidrap - Klinik Aisyiyah',
    description:
      'Pemeriksaan dokter umum profesional dengan pelayanan ramah dan rekam medis digital. Daftar konsultasi kesehatan Anda sekeluarga di Klinik Aisyiyah.',
    keywords: ['poli umum pangkajene', 'dokter umum terdekat', 'pendaftaran dokter online', 'check up kesehatan', 'faskes bpjs'],
  },
};
