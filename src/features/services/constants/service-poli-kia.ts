import { type ServiceData } from './services-data-types';

export const SERVICE_POLI_KIA: ServiceData = {
  id: 4,
  slug: 'poli-kia',
  title: 'Kesehatan Ibu & Anak (KIA) & Kebidanan',
  shortDescription:
    'Layanan holistik kehamilan, tumbuh kembang anak, keluarga berencana (KB), serta imunisasi dasar anak demi masa depan keluarga sehat ceria.',
  fullDescription:
    'Poli KIA & Kebidanan Klinik Aisyiyah berkomitmen memberikan pendampingan penuh bagi para calon ibu mulai dari masa pra-nikah, kehamilan, persalinan, menyusui, hingga pengawasan tumbuh kembang balita. Bidan-bidan kami ramah dan sabar, serta didampingi oleh alat USG untuk deteksi dini kesejahteraan janin.',
  purpose:
    'Memastikan ibu hamil menjalani kehamilan dengan aman dan bahagia, menurunkan angka kematian ibu-bayi, serta memastikan anak tumbuh kembang optimal melalui program imunisasi dan gizi.',
  benefits: [
    'Bidan bersertifikasi bidan delima dan ramah pasien.',
    'Konseling KB terpadu (Suntik, Pil, IUD, Implan).',
    'Pemeriksaan USG 2D/4D berbiaya terjangkau.',
    'Kelas Ibu Hamil dan Senam Hamil terjadwal.',
  ],
  targetAudience:
    'Ibu hamil yang ingin memeriksakan kehamilan rutin, pasangan suami istri yang konsultasi KB, bayi dan balita yang memerlukan imunisasi dasar atau pemantauan stunting.',
  heroImage:
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop',
  gallery: [
    'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=2038&auto=format&fit=crop',
  ],
  facilities: [
    'Ruang KIA Ber-AC dan Ramah Anak',
    'Alat Pemeriksa USG Kebidanan',
    'Alat Deteksi Detak Jantung Janin (Doppler)',
    'Pojok Laktasi Pribadi',
    'Timbangan Bayi Digital Akurat',
  ],
  doctors: [
    {
      name: 'Bidan Maryati, S.Tr.Keb',
      specialty: 'Bidan Koordinator KIA & Laktasi',
      experience: '15 Tahun',
      schedule: 'Senin - Sabtu (16.00 - 18.00 WITA)',
      image:
        'https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=2000&auto=format&fit=crop',
    },
    {
      name: 'dr. H. Rian Hidayat (USG)',
      specialty: 'Dokter Pemeriksa USG Kebidanan',
      experience: '8 Tahun',
      schedule: 'Senin - Sabtu (16.00 - 18.00 WITA)',
      image:
        'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop',
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
    'Melakukan registrasi di loket KIA.',
    'Penimbangan berat badan dan pengukuran lingkar perut ibu hamil.',
    'Pemeriksaan fisik oleh bidan (Tekanan darah, palpasi Leopold).',
    'Pemeriksaan detak jantung janin menggunakan Doppler/USG.',
    'Sesi konseling laktasi atau gizi balita.',
    'Pencatatan di Buku KIA (KMS), pembayaran, dan pemberian vitamin/imunisasi.',
  ],
  preparation: [
    'Wajib membawa Buku Pink KIA (Buku Ibu dan Anak) untuk mencatat riwayat kehamilan dan anak.',
    'Memakai pakaian yang longgar di area perut untuk memudahkan pemeriksaan.',
    'Membawa KTP dan kartu BPJS (untuk klaim antenatal care gratis).',
    'Menyiapkan daftar pertanyaan terkait keluhan kehamilan/tumbuh kembang anak.',
  ],
  procedures: [
    {
      title: 'Antenatal Care (ANC)',
      description: 'Pemeriksaan kehamilan rutin oleh bidan untuk memastikan tumbuh kembang janin sehat.',
      iconName: 'Heart',
    },
    {
      title: 'Pemeriksaan USG Kandungan',
      description:
        'Visualisasi janin di dalam rahim menggunakan gelombang suara untuk memantau posisi dan detak jantung.',
      iconName: 'Activity',
    },
    {
      title: 'Pelayanan Keluarga Berencana (KB)',
      description: 'Konseling serta pemasangan alat kontrasepsi IUD, implan, pil, maupun suntik KB.',
      iconName: 'ShieldCheck',
    },
    {
      title: 'Imunisasi Bayi & Balita',
      description: 'Pemberian vaksin wajib nasional seperti BCG, DPT, Polio, Campak, dan Hepatitis B.',
      iconName: 'Baby',
    },
  ],
  faq: [
    {
      question: 'Kapan sebaiknya ibu hamil mulai melakukan pemeriksaan ANC?',
      answer:
        'Pemeriksaan ANC sebaiknya dimulai segera setelah ibu mendapati hasil tes kehamilan positif. Semakin cepat terdeteksi, bidan dapat memberikan suplementasi asam folat yang penting untuk pencegahan cacat janin.',
    },
    {
      question: 'Apakah bisa melahirkan normal di Klinik Aisyiyah?',
      answer:
        'Kami menyediakan layanan persalinan normal 24 jam dipimpin bidan berpengalaman bagi kehamilan berisiko rendah. Jika ada penyulit medis, tim kami akan merujuk ke RS bersalin mitra kami.',
    },
  ],
  relatedServices: ['poli-umum', 'vaksin-haji'],
  contactInformation: {
    phone: '0878-3117-7100',
    whatsapp: 'https://wa.me/6287831177100',
    email: 'klinikaisyiyahpangkajene@gmail.com',
  },
  seo: {
    title: 'Kesehatan Ibu & Anak (KIA) & Kebidanan - Klinik Aisyiyah',
    description:
      'Dapatkan pemeriksaan kehamilan ANC, USG, pelayanan KB terpadu, dan imunisasi balita lengkap bersama bidan kooperatif Klinik Aisyiyah.',
    keywords: ['bidan kia pangkajene', 'usg kehamilan terdekat', 'imunisasi anak gratis', 'kb spiral implan', 'kelas bumil'],
  },
};
