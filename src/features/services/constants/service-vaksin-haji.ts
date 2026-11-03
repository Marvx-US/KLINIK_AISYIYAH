import { type ServiceData } from './services-data-types';

export const SERVICE_VAKSIN_HAJI: ServiceData = {
  id: 5,
  slug: 'vaksin-haji',
  title: 'Poli Vaksinasi & Sertifikasi Internasional (ICV)',
  shortDescription:
    'Layanan vaksinasi meningitis wajib dan vaksinasi influenza/pneumonia anjuran untuk calon jemaah haji, umrah, serta pelaku perjalanan internasional.',
  fullDescription:
    'Poli Vaksinasi Klinik Aisyiyah menyediakan berbagai perlindungan vaksinasi premium. Kami mengelola penyimpanan vaksin dengan standar "Cold Chain" ketat untuk menjaga efektivitasnya. Khusus untuk calon jemaah haji & umrah serta pelaku perjalanan luar negeri, kami melayani penerbitan Kartu Kuning Internasional (ICV - Yellow Card) resmi.',
  purpose:
    'Mencegah penularan penyakit berbahaya antar negara, melengkapi persyaratan perjalanan internasional, serta melindungi jemaah dari infeksi bakteri Meningitis selama ibadah.',
  benefits: [
    'Vaksinasi meningitis bersertifikasi resmi Kementerian Kesehatan.',
    'Pemberian Kartu Kuning Internasional (ICV) langsung selesai di tempat.',
    'Sediaan vaksin impor original yang dijamin kualitas penyimpanannya.',
    'Dokter pemeriksa bersertifikat keahlian kesehatan perjalanan.',
  ],
  targetAudience:
    'Calon jemaah Haji, calon jemaah Umrah, mahasiswa yang akan belajar ke luar negeri, tenaga kerja internasional, serta masyarakat umum yang membutuhkan perlindungan kekebalan tubuh.',
  heroImage:
    'https://images.unsplash.com/photo-1584308666744-24d5e74191c9?q=80&w=2070&auto=format&fit=crop',
  gallery: [
    'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1628532116035-714088a8f192?q=80&w=2070&auto=format&fit=crop',
  ],
  facilities: [
    'Kulkas Vaksin Standar Medis (Cold Chain)',
    'Ruang Observasi Pasca Vaksin',
    'Sistem Pencetakan Kartu ICV Digital',
    'Apotek Terpadu untuk Suplemen Tambahan',
    'AC & Kursi Observasi Nyaman',
  ],
  doctors: [
    {
      name: 'dr. H. Rian Hidayat',
      specialty: 'Dokter Umum Kesehatan Perjalanan',
      experience: '8 Tahun',
      schedule: 'Sesuai Perjanjian',
      image:
        'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop',
    },
  ],
  operationalHours: {},
  workflow: [
    'Registrasi dan verifikasi berkas paspor/KTP di loket pendaftaran.',
    'Pemeriksaan tanda vital (tensi, suhu) dan screening kesehatan singkat oleh Dokter.',
    'Penyuntikan vaksin oleh tenaga medis berpengalaman.',
    'Menunggu di Ruang Observasi selama 15 menit untuk memantau efek samping langsung (KIPI).',
    'Penerbitan dan tanda tangan Kartu Kuning Internasional (ICV) resmi oleh Dokter.',
    'Selesai, pasien dipersilakan pulang membawa buku vaksin.',
  ],
  preparation: [
    'Membawa Fotokopi Paspor dengan nama yang sesuai untuk penulisan di buku vaksin (ICV).',
    'Membawa fotokopi KTP dan pas foto ukuran 3x4 berwarna (2 lembar).',
    'Pastikan tubuh dalam kondisi fit, sehat, dan tidak sedang demam.',
    'Makan yang cukup sebelum divaksinasi untuk menghindari lemas.',
  ],
  procedures: [
    {
      title: 'Vaksinasi Meningitis Meningokokus',
      description: 'Vaksin wajib bagi jemaah haji & umrah untuk pencegahan radang selaput otak.',
      iconName: 'ShieldCheck',
    },
    {
      title: 'Vaksinasi Influenza',
      description: 'Vaksin pencegahan virus flu musiman, direkomendasikan karena padatnya jemaah di tanah suci.',
      iconName: 'Syringe',
    },
    {
      title: 'Vaksinasi Pneumonia (PCV)',
      description: 'Perlindungan dari infeksi bakteri pneumokokus yang menyerang saluran paru.',
      iconName: 'Activity',
    },
    {
      title: 'Penerbitan Sertifikat Vaksin ICV',
      description: 'Pemberian dokumen resmi ber-barcode internasional sebagai syarat legalitas imigrasi.',
      iconName: 'Award',
    },
  ],
  faq: [
    {
      question: 'Berapa hari sebelum keberangkatan saya harus disuntik vaksin Meningitis?',
      answer:
        'Vaksinasi meningitis wajib diberikan minimal 10 - 14 hari sebelum keberangkatan ke Arab Saudi. Hal ini dikarenakan tubuh memerlukan waktu sekitar 2 minggu untuk membentuk antibodi protektif secara sempurna.',
    },
    {
      question: 'Apa saja efek samping pasca vaksinasi (KIPI)?',
      answer:
        'Efek samping yang umum sangat ringan, berupa rasa pegal di lengan bekas suntikan, sakit kepala ringan, atau demam sumeng selama 1-2 hari. Ini adalah respon imun tubuh yang sehat. Anda dapat meminum Paracetamol jika merasa tidak nyaman.',
    },
  ],
  vaccinePrices: [
    { name: 'Vaksin Influenza (Flubio / Vaxigrip)', price: 250000 },
    { name: 'Vaksin Tifoid (Typhim Vi)', price: 300000 },
    { name: 'Vaksin Hepatitis B (Engerix B Dewasa)', price: 350000 },
    { name: 'Vaksin MR / Campak Rubella', price: 400000 },
    { name: 'Vaksin DPT (Pentabio / Hexaxim)', price: 750000 },
    { name: 'Vaksin PCV (Prevenar 13)', price: 950000 },
    { name: 'Vaksin HPV (Gardasil 4)', price: 1100000 },
    { name: 'Vaksin Dengue (Qdenga)', price: 1300000 },
  ].sort((a, b) => a.price - b.price),
  relatedServices: ['poli-umum', 'layanan-laboratorium'],
  contactInformation: {
    phone: '0878-3117-7100',
    whatsapp: 'https://wa.me/6287831177100',
    email: 'klinikaisyiyahpangkajene@gmail.com',
  },
  seo: {
    title: 'Vaksin Meningitis Haji & Umrah Resmi Pangkajene Sidrap - Klinik Aisyiyah',
    description:
      'Layanan vaksinasi wajib meningitis bagi calon jemaah haji & umrah lengkap dengan Kartu Kuning Internasional (ICV) ber-barcode resmi Kemenkes.',
    keywords: ['vaksin meningitis pangkajene', 'buku kuning icv umrah', 'vaksin influenza haji', 'sertifikat vaksin perjalanan', 'biaya vaksin meningitis'],
  },
};
