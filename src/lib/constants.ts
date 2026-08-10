// ============================================================
// KONSTANTA GLOBAL KLINIK AISYIYAH
// Ubah nilai di sini untuk memperbarui seluruh website sekaligus.
// ============================================================

export const KLINIK_INFO = {
  name: 'Klinik Aisyiyah',
  tagline: 'Kesehatan Masyarakat',
  address: 'Jl. Jenderal Sudirman No. 45, Pangkajene, Sidenreng Rappang, Sulawesi Selatan',
  phone: '+62 812-3456-7890',
  whatsapp: '6281234567890',
  email: 'info@klinikaisyiyah.com',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Klinik+Pratama+Aisyiyah+Pangkajene+Sidenreng+Rappang',
  mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15915.228509707323!2d119.7891244!3d-3.9248234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d95b966ed28987b%3A0xc07a4a9ad3d9d682!2sPangkajene%2C%20Maritengngae%2C%20Sidenreng%20Rappang%20Regency%2C%20South%20Sulawesi!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid',
  mapsDisplayCity: 'Pangkajene, Sidenreng Rappang, Sulawesi Selatan, Indonesia',
};

export const KLINIK_HOURS = [
  { day: 'Senin - Jumat', hours: '08.00 - 17.00 WITA', closed: false },
  { day: 'Sabtu', hours: '08.00 - 17.00 WITA', closed: false },
  { day: 'Minggu & Tanggal Merah', hours: 'Tutup', closed: true },
  { day: 'Poli KIA & Anak', hours: 'Selasa, Kamis, Sabtu (14.00 - 17.00 WITA)', closed: false },
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
