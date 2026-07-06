// ============================================================
// KONSTANTA GLOBAL KLINIK AISYIYAH
// Ubah nilai di sini untuk memperbarui seluruh website sekaligus.
// ============================================================

export const KLINIK_INFO = {
  name: 'Klinik Aisyiyah',
  tagline: 'Kesehatan Masyarakat',
  address: 'Jl. Jenderal Sudirman No. 45, Pangkajene, Indonesia',
  phone: '+62 812-3456-7890',
  whatsapp: '6281234567890',
  email: 'info@klinikaisyiyah.com',
  mapsUrl: 'https://maps.google.com',
  mapsDisplayCity: 'Yogyakarta, D.I. Yogyakarta, Indonesia',
};

export const KLINIK_HOURS = [
  { day: 'Senin - Jumat', hours: '08.00 - 21.00 WIB', closed: false },
  { day: 'Sabtu', hours: '08.00 - 17.00 WIB', closed: false },
  { day: 'Minggu & Tanggal Merah', hours: 'Tutup', closed: true },
  { day: 'Poli KIA & Anak', hours: 'Selasa, Kamis, Sabtu (14.00 - 17.00 WIB)', closed: false },
];

export const NAVIGATION_ITEMS = [
  { name: 'Beranda', href: '/' },
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
