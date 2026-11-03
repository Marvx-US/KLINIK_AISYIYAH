import { type ServiceData } from './services-data-types';

export const SERVICE_IGD: ServiceData = {
  id: 1,
  slug: 'igd',
  title: 'Instalasi Gawat Darurat (IGD) 24 Jam',
  shortDescription:
    'Layanan medis darurat yang beroperasi 24 jam sehari, 7 hari seminggu, siap menangani kondisi kritis dengan tim medis bersertifikasi.',
  fullDescription:
    'Instalasi Gawat Darurat (IGD) Klinik Aisyiyah dirancang untuk memberikan perawatan medis darurat segera kepada pasien dengan penyakit atau cedera akut yang mengancam jiwa. Didukung oleh tim dokter gawat darurat, perawat terlatih resusitasi (ATLS/BTCLS), dan peralatan medis canggih untuk memberikan penanganan terbaik dalam hitungan detik berharga Anda.',
  purpose:
    'Tujuan utama IGD adalah memberikan stabilisasi medis yang cepat dan penanganan awal bagi pasien yang mengalami cedera atau penyakit akut yang memerlukan intervensi medis segera.',
  benefits: [
    'Pelayanan non-stop 24 jam sehari, 365 hari setahun.',
    'Sistem triase terstandarisasi untuk penanganan prioritas kondisi kritis.',
    'Akses ambulans darurat cepat tanggap.',
    'Tim medis bersertifikat keahlian kegawatdaruratan (ACLS, ATLS, BTCLS).',
  ],
  targetAudience:
    'Pasien dari segala usia yang mengalami kecelakaan berat, serangan jantung, sesak napas akut, cedera kepala, kejang hebat, keracunan, atau kondisi darurat medis lainnya.',
  heroImage:
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop',
  gallery: [
    'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2073&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop',
  ],
  facilities: [
    'Ruang Resusitasi Jantung-Paru',
    'Ruang Tindakan Bedah Minor',
    'Ruang Observasi Intensif',
    'Ambulans Gawat Darurat 24 Jam',
    'Peralatan Oksigen Terintegrasi',
    'Defibrillator (AED)',
    'EKG 12 Lead',
  ],
  doctors: [
    {
      name: 'dr. Ahmad Fauzi, Sp.EM',
      specialty: 'Spesialis Kedokteran Kedaruratan Medis',
      experience: '12 Tahun',
      schedule: 'Senin - Jumat (Shift Pagi & Sore)',
      image:
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2000&auto=format&fit=crop',
    },
    {
      name: 'dr. Sarah Wijaya',
      specialty: 'Dokter Umum Jaga IGD (ATLS/ACLS)',
      experience: '6 Tahun',
      schedule: 'Setiap Hari (Sesuai Jadwal Shift Jaga)',
      image:
        'https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=2000&auto=format&fit=crop',
    },
  ],
  operationalHours: {},
  workflow: [
    'Penerimaan Pasien di area Drop-off IGD.',
    'Proses Triase (Pemeriksaan awal tingkat keparahan oleh perawat).',
    'Tindakan Stabilisasi Jantung/Napas atau luka akut.',
    'Pemeriksaan mendalam oleh Dokter Jaga.',
    'Pemeriksaan Penunjang (Laboratorium/Ekg jika diperlukan).',
    'Keputusan Medis (Rawat inap, rawat jalan, atau rujuk ke RS tipe lebih tinggi).',
  ],
  preparation: [
    'Membawa KTP asli/Kartu Keluarga untuk verifikasi data (bisa menyusul oleh pendamping).',
    'Membawa kartu asuransi atau BPJS Kesehatan jika ada.',
    'Menginformasikan semua obat-obatan yang sedang dikonsumsi pasien.',
    'Menyiapkan kontak darurat keluarga terdekat yang dapat dihubungi.',
  ],
  procedures: [
    {
      title: 'Resusitasi Jantung Paru (RJP)',
      description: 'Tindakan penyelamatan jiwa untuk mengembalikan sirkulasi darah dan fungsi napas.',
      iconName: 'HeartPulse',
    },
    {
      title: 'Bedah Minor & Penjahitan Luka',
      description: 'Tindakan pembedahan kecil untuk penjahitan luka robek akibat kecelakaan.',
      iconName: 'Scissors',
    },
    {
      title: 'Tindakan EKG & Monitoring Jantung',
      description: 'Perekaman aktivitas kelistrikan jantung untuk deteksi cepat serangan jantung.',
      iconName: 'Activity',
    },
    {
      title: 'Pemasangan Intubasi & Ventilasi',
      description: 'Pemberian alat bantu napas buatan pada pasien gagal napas.',
      iconName: 'Wind',
    },
  ],
  faq: [
    {
      question: 'Apakah IGD melayani pasien non-darurat?',
      answer:
        'IGD memprioritaskan kondisi gawat darurat medis. Untuk kasus non-darurat, kami menyarankan untuk berobat melalui poli umum agar pelayanan IGD dapat berjalan maksimal bagi pasien kritis.',
    },
    {
      question: 'Berapa biaya penanganan awal di IGD?',
      answer:
        'Biaya tergantung pada tindakan medis, pemakaian obat-obatan darurat, serta pemeriksaan penunjang yang dilakukan. Kami menerima pasien BPJS Kesehatan sesuai dengan regulasi kegawatdaruratan nasional.',
    },
  ],
  relatedServices: ['poli-umum', 'poli-kia'],
  contactInformation: {
    phone: '0878-3117-7100',
    whatsapp: 'https://wa.me/6287831177100',
    email: 'klinikaisyiyahpangkajene@gmail.com',
  },
  seo: {
    title: 'Instalasi Gawat Darurat (IGD) 24 Jam - Klinik Aisyiyah',
    description:
      'Layanan gawat darurat 24 jam dengan tim medis siaga ahli ACLS/ATLS. Hubungi IGD Klinik Aisyiyah untuk penanganan darurat terbaik.',
    keywords: ['igd 24 jam', 'gawat darurat', 'klinik darurat', 'dokter jaga 24 jam', 'ambulans aisyiyah'],
  },
};
