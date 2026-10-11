// ============================================================
// KONSTANTA GLOBAL KLINIK AISYIYAH
// Ubah nilai di sini untuk memperbarui seluruh website sekaligus.
// ============================================================

export const KLINIK_INFO = {
  name: 'Klinik Aisyiyah Pangkajene',
  tagline: 'Kesehatan Masyarakat',
  address: 'Jl. Andi Cammi No. 17 Pangkajene, Kec. Maritengngae, Kab. Sidrap, Sulawesi Selatan',
  phone: '0878-3117-7100',
  whatsapp: '6287831177100',
  email: 'klinikaisyiyahpangkajene@gmail.com',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Klinik+Pratama+Aisyiyah+Pangkajene+Sidenreng+Rappang',
  mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15915.228509707323!2d119.7891244!3d-3.9248234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d95b966ed28987b%3A0xc07a4a9ad3d9d682!2sPangkajene%2C%20Maritengngae%2C%20Sidenreng%20Rappang%20Regency%2C%20South%20Sulawesi!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid',
  mapsDisplayCity: 'Pangkajene, Sidenreng Rappang, Sulawesi Selatan, Indonesia',
};

export const KLINIK_HOURS = [
  { day: 'Senin - Sabtu', hours: '08.00 - 20.00 WITA', closed: false },
  { day: 'Minggu & Tanggal Merah', hours: 'Tutup (IGD mengikuti jam klinik)', closed: true },
];

export const NAVIGATION_ITEMS = [
  { name: 'Beranda', href: '/' },
  { name: 'Layanan', href: '/services' },
  { name: 'Artikel Kesehatan', href: '/articles' },
  { name: 'Event & Berita', href: '/events' },
  { name: 'Kontak', href: '/contact' },
];

export const ARTICLE_CATEGORIES = [
  'Gaya Hidup',
  'Kesehatan Anak',
  'Edukasi Medis',
  'Info Klinik',
] as const;

export const ARTICLE_CATEGORIES_FILTER = ['Semua', ...ARTICLE_CATEGORIES];

// Fallback data jika database kosong atau belum tersedia
export const FALLBACK_ARTICLES = [
  {
    id: 1,
    title: 'Menjaga Kesehatan Jantung dengan Pola Makan Sehat',
    slug: 'menjaga-kesehatan-jantung-dengan-pola-makan-sehat',
    summary:
      'Jantung adalah organ vital. Pelajari pola makan berserat tinggi dan makanan yang harus dihindari untuk kesehatan jantung optimal.',
    category: 'Gaya Hidup',
    createdAt: new Date(),
  },
  {
    id: 2,
    title: 'Pentingnya Imunisasi Dasar Lengkap pada Bayi',
    slug: 'pentingnya-imunisasi-dasar-lengkap-pada-bayi',
    summary:
      'Imunisasi dasar lengkap membantu melindungi buah hati dari berbagai penyakit berbahaya. Simak jadwal terbaru dari Kemenkes.',
    category: 'Kesehatan Anak',
    createdAt: new Date(),
  },
  {
    id: 3,
    title: 'Mengenal Gejala Diabetes Melitus Tipe 2 sejak Dini',
    slug: 'mengenal-gejala-diabetes-melitus-tipe-2-sejak-dini',
    summary:
      'Diabetes sering kali tidak bergejala pada tahap awal. Pahami tanda-tanda klasik seperti sering haus dan luka yang lambat sembuh.',
    category: 'Edukasi Medis',
    createdAt: new Date(),
  },
];

export const FALLBACK_EVENTS = [
  {
    id: 1,
    title: 'Program Imunisasi Polio Gratis Anak Usia 0-7 Tahun',
    slug: 'program-imunisasi-polio-gratis-anak-usia-0-7-tahun',
    summary:
      'Dalam rangka mensukseskan PIN Polio nasional, Klinik Aisyiyah menyelenggarakan imunisasi polio tetes gratis bagi semua anak balita.',
    eventDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    location: 'Aula Pertemuan Utama Klinik Aisyiyah',
    createdAt: new Date(),
  },
  {
    id: 2,
    title: 'Seminar Edukasi Pencegahan Stunting bersama Ahli Gizi',
    slug: 'seminar-edukasi-pencegahan-stunting-bersama-ahli-gizi',
    summary:
      'Temukan tips pemenuhan nutrisi MPASI optimal bagi buah hati dan cara mendeteksi stunting sejak dini bersama narasumber dr. Fitriani.',
    eventDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    location: 'Ruang Edukasi Lt. 2 Klinik Aisyiyah',
    createdAt: new Date(),
  },
];

export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Bagaimana cara mendaftar layanan?',
    answer: 'Anda dapat mendaftar langsung dengan datang ke meja pendaftaran klinik, atau menghubungi kami terlebih dahulu via WhatsApp untuk pendaftaran awal guna mempercepat proses administrasi di lokasi.',
  },
  {
    question: 'Apakah menerima BPJS?',
    answer: 'Saat ini Klinik Aisyiyah Pangkajene melayani pasien umum mandiri serta beberapa asuransi kemitraan korporasi. Kami sedang dalam proses integrasi sistem dengan BPJS Kesehatan untuk melayani Anda lebih luas di masa depan.',
  },
  {
    question: 'Bagaimana cara membuat janji?',
    answer: 'Membuat janji temu dengan dokter spesialis atau dokter gigi sangat mudah. Silakan klik tombol "Hubungi Kami" atau hubungi WhatsApp resmi kami, pilih dokter dan jadwal yang Anda inginkan, dan admin kami akan memberikan konfirmasi jadwal.',
  },
  {
    question: 'Bagaimana jam praktek pelayanan poliklinik?',
    answer: 'Jam praktek pelayanan poliklinik di Klinik Aisyiyah Pangkajene yaitu Poli Umum pukul 13.00 - 20.00 WITA, serta Poli KIA dan Poli Gigi pukul 16.00 - 18.00 WITA. Layanan Instalasi Gawat Darurat (IGD) tetap siaga 24 Jam Nonstop.',
  },
  {
    question: 'Apakah tersedia konsultasi online?',
    answer: 'Ya, kami menyediakan layanan telekonsultasi kesehatan dasar terbatas melalui layanan chat WhatsApp terpadu dokter kami untuk memantau keluhan ringan atau konsultasi hasil laboratorium pasca pemeriksaan fisik.',
  },
  {
    question: 'Bagaimana cara menghubungi klinik?',
    answer: 'Anda dapat menghubungi pusat kontak kami melalui Telepon/WhatsApp di 0878-3117-7100, email di klinikaisyiyahpangkajene@gmail.com, atau klik ikon chat WhatsApp yang melayang di pojok layar untuk berkomunikasi secara langsung dengan staf medis kami.',
  },
];

