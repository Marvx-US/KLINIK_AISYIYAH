export interface VaccinePrice {
  name: string;
  price: number;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ServiceDetail {
  slug: string;
  roomImage: string;
  longDescription: string;
  faqs: FAQ[];
  vaccinePrices?: VaccinePrice[];
}

export const MOCK_SERVICE_DETAILS: Record<string, ServiceDetail> = {
  'poli-umum': {
    slug: 'poli-umum',
    roomImage: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2073&auto=format&fit=crop',
    longDescription: 'Poli Umum Klinik Aisyiyah memberikan pelayanan kesehatan dasar yang menyeluruh bagi seluruh anggota keluarga. Dokter umum kami yang berpengalaman siap membantu menangani berbagai keluhan medis harian, memberikan diagnosis yang akurat, serta meresepkan pengobatan yang tepat. Ruangan kami didesain mengutamakan kenyamanan dan privasi pasien selama sesi konsultasi.',
    faqs: [
      { question: 'Apakah saya perlu membuat janji temu terlebih dahulu?', answer: 'Anda dapat langsung datang ke klinik (walk-in), namun kami menyarankan untuk membuat janji temu agar waktu tunggu lebih singkat.' },
      { question: 'Apakah Poli Umum melayani pembuatan surat keterangan sehat?', answer: 'Ya, kami melayani pembuatan surat keterangan sehat untuk keperluan kerja, sekolah, maupun keperluan lainnya setelah dilakukan pemeriksaan fisik dasar.' }
    ]
  },
  'kesehatan-ibu-anak-kia': {
    slug: 'kesehatan-ibu-anak-kia',
    roomImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop',
    longDescription: 'Layanan Kesehatan Ibu dan Anak (KIA) di klinik kami fokus pada perawatan komprehensif bagi ibu hamil, ibu menyusui, serta pemantauan tumbuh kembang bayi dan balita. Dilengkapi dengan fasilitas modern dan ditangani oleh tenaga medis terampil yang ramah anak, kami memastikan setiap tahap perkembangan si kecil terpantau dengan baik, termasuk layanan imunisasi dasar.',
    faqs: [
      { question: 'Apakah ada layanan konsultasi laktasi?', answer: 'Ya, bidan dan dokter kami siap membantu memberikan konseling dan bantuan terkait masalah menyusui.' },
      { question: 'Kapan jadwal buka layanan KIA?', answer: 'Layanan KIA buka setiap hari kerja. Khusus untuk jadwal imunisasi, disarankan untuk konfirmasi terlebih dahulu.' }
    ]
  },
  'poli-gigi-mulut': {
    slug: 'poli-gigi-mulut',
    roomImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2070&auto=format&fit=crop',
    longDescription: 'Dapatkan senyum sehat dan cerah dengan layanan Poli Gigi dan Mulut kami. Kami menawarkan berbagai perawatan mulai dari pembersihan karang gigi (scaling), penambalan estetik, pencabutan gigi, hingga perawatan saluran akar. Dokter gigi kami menggunakan peralatan steril berstandar tinggi untuk menjamin kenyamanan dan keamanan Anda selama tindakan.',
    faqs: [
      { question: 'Apakah melayani pasien anak-anak?', answer: 'Tentu, kami memiliki pendekatan khusus agar anak-anak merasa nyaman dan tidak takut saat diperiksa giginya.' },
      { question: 'Seberapa sering saya harus memeriksakan gigi?', answer: 'Idealnya, pemeriksaan gigi rutin dan pembersihan karang gigi dilakukan setiap 6 bulan sekali.' }
    ]
  },
  'layanan-laboratorium': {
    slug: 'layanan-laboratorium',
    roomImage: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2070&auto=format&fit=crop',
    longDescription: 'Fasilitas laboratorium internal kami dilengkapi dengan peralatan mutakhir untuk mendukung diagnosis medis yang cepat dan akurat. Kami melayani berbagai macam tes darah rutin, tes urin, profil lipid (kolesterol), gula darah, hingga pemeriksaan asam urat. Hasil tes dapat langsung dikonsultasikan dengan dokter poli kami di hari yang sama.',
    faqs: [
      { question: 'Apakah perlu puasa sebelum cek darah?', answer: 'Beberapa tes seperti pemeriksaan gula darah puasa dan kolesterol mewajibkan Anda berpuasa 10-12 jam sebelumnya. Tes lainnya bisa dilakukan tanpa puasa.' },
      { question: 'Berapa lama hasil lab keluar?', answer: 'Mayoritas hasil tes rutin dapat diketahui dalam waktu kurang dari 1 jam.' }
    ]
  },
  'poli-vaksinasi': {
    slug: 'poli-vaksinasi',
    roomImage: 'https://images.unsplash.com/photo-1584308666744-24d5e74191c9?q=80&w=2070&auto=format&fit=crop',
    longDescription: 'Poli Vaksinasi Klinik Aisyiyah menyediakan berbagai pilihan vaksin untuk melengkapi perlindungan imunitas tubuh Anda dan keluarga. Mulai dari vaksin dasar untuk anak-anak hingga vaksin dewasa seperti Influenza, Hepatitis, dan vaksin untuk perjalanan (travel vaccine). Tim kami memastikan rantai dingin (cold chain) penyimpanan vaksin terjaga sempurna agar efektivitas vaksin selalu optimal.',
    faqs: [
      { question: 'Apakah saya bisa vaksin jika sedang batuk pilek ringan?', answer: 'Sebaiknya konsultasikan terlebih dahulu dengan dokter sebelum divaksin. Umumnya, batuk pilek ringan tanpa demam bukan halangan untuk vaksinasi.' },
      { question: 'Apakah vaksin dewasa ditanggung asuransi?', answer: 'Hal ini bergantung pada polis asuransi Anda. Anda bisa mengecek kebijakan perusahaan asuransi terkait perlindungan vaksin preventif.' }
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
    ].sort((a, b) => a.price - b.price)
  }
};
