export interface Procedure {
  title: string;
  description: string;
  iconName: string;
}

export interface Doctor {
  name: string;
  specialty: string;
  experience: string;
  schedule: string;
  image: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ServiceData {
  id: number;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  purpose: string;
  benefits: string[];
  targetAudience: string;
  heroImage: string;
  gallery: string[];
  facilities: string[];
  doctors: Doctor[];
  operationalHours: Record<string, string>;
  workflow: string[];
  preparation: string[];
  procedures: Procedure[];
  faq: FAQItem[];
  relatedServices: string[];
  contactInformation: {
    phone: string;
    whatsapp: string;
    email: string;
  };
  vaccinePrices?: { name: string; price: number }[] | null;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const SERVICES_DATA: Record<string, ServiceData> = {
  'igd': {
    id: 1,
    slug: 'igd',
    title: 'Instalasi Gawat Darurat (IGD) 24 Jam',
    shortDescription: 'Layanan medis darurat yang beroperasi 24 jam sehari, 7 hari seminggu, siap menangani kondisi kritis dengan tim medis bersertifikasi.',
    fullDescription: 'Instalasi Gawat Darurat (IGD) Klinik Aisyiyah dirancang untuk memberikan perawatan medis darurat segera kepada pasien dengan penyakit atau cedera akut yang mengancam jiwa. Didukung oleh tim dokter gawat darurat, perawat terlatih resusitasi (ATLS/BTCLS), dan peralatan medis canggih untuk memberikan penanganan terbaik dalam hitungan detik berharga Anda.',
    purpose: 'Tujuan utama IGD adalah memberikan stabilisasi medis yang cepat dan penanganan awal bagi pasien yang mengalami cedera atau penyakit akut yang memerlukan intervensi medis segera.',
    benefits: [
      'Pelayanan non-stop 24 jam sehari, 365 hari setahun.',
      'Sistem triase terstandarisasi untuk penanganan prioritas kondisi kritis.',
      'Akses ambulans darurat cepat tanggap.',
      'Tim medis bersertifikat keahlian kegawatdaruratan (ACLS, ATLS, BTCLS).'
    ],
    targetAudience: 'Pasien dari segala usia yang mengalami kecelakaan berat, serangan jantung, sesak napas akut, cedera kepala, kejang hebat, keracunan, atau kondisi darurat medis lainnya.',
    heroImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2073&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1579684389782-64d84b5e905d?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop'
    ],
    facilities: ['Ruang Resusitasi Jantung-Paru', 'Ruang Tindakan Bedah Minor', 'Ruang Observasi Intensif', 'Ambulans Gawat Darurat 24 Jam', 'Peralatan Oksigen Terintegrasi', 'Defibrillator (AED)', 'EKG 12 Lead'],
    doctors: [
      {
        name: 'dr. Ahmad Fauzi, Sp.EM',
        specialty: 'Spesialis Kedokteran Kedaruratan Medis',
        experience: '12 Tahun',
        schedule: 'Senin - Jumat (Shift Pagi & Sore)',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2000&auto=format&fit=crop'
      },
      {
        name: 'dr. Sarah Wijaya',
        specialty: 'Dokter Umum Jaga IGD (ATLS/ACLS)',
        experience: '6 Tahun',
        schedule: 'Setiap Hari (Sesuai Jadwal Shift Jaga)',
        image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=2000&auto=format&fit=crop'
      }
    ],
    operationalHours: {
      'Senin': '24 Jam',
      'Selasa': '24 Jam',
      'Rabu': '24 Jam',
      'Kamis': '24 Jam',
      'Jumat': '24 Jam',
      'Sabtu': '24 Jam',
      'Minggu': '24 Jam'
    },
    workflow: [
      'Penerimaan Pasien di area Drop-off IGD.',
      'Proses Triase (Pemeriksaan awal tingkat keparahan oleh perawat).',
      'Tindakan Stabilisasi Jantung/Napas atau luka akut.',
      'Pemeriksaan mendalam oleh Dokter Jaga.',
      'Pemeriksaan Penunjang (Laboratorium/Ekg jika diperlukan).',
      'Keputusan Medis (Rawat inap, rawat jalan, atau rujuk ke RS tipe lebih tinggi).'
    ],
    preparation: [
      'Membawa KTP asli/Kartu Keluarga untuk verifikasi data (bisa menyusul oleh pendamping).',
      'Membawa kartu asuransi atau BPJS Kesehatan jika ada.',
      'Menginformasikan semua obat-obatan yang sedang dikonsumsi pasien.',
      'Menyiapkan kontak darurat keluarga terdekat yang dapat dihubungi.'
    ],
    procedures: [
      { title: 'Resusitasi Jantung Paru (RJP)', description: 'Tindakan penyelamatan jiwa untuk mengembalikan sirkulasi darah dan fungsi napas.', iconName: 'HeartPulse' },
      { title: 'Bedah Minor & Penjahitan Luka', description: 'Tindakan pembedahan kecil untuk penjahitan luka robek akibat kecelakaan.', iconName: 'Scissors' },
      { title: 'Tindakan EKG & Monitoring Jantung', description: 'Perekaman aktivitas kelistrikan jantung untuk deteksi cepat serangan jantung.', iconName: 'Activity' },
      { title: 'Pemasangan Intubasi & Ventilasi', description: 'Pemberian alat bantu napas buatan pada pasien gagal napas.', iconName: 'Wind' }
    ],
    faq: [
      { question: 'Apakah IGD melayani pasien non-darurat?', answer: 'IGD memprioritaskan kondisi gawat darurat medis. Untuk kasus non-darurat, kami menyarankan untuk berobat melalui poli umum agar pelayanan IGD dapat berjalan maksimal bagi pasien kritis.' },
      { question: 'Berapa biaya penanganan awal di IGD?', answer: 'Biaya tergantung pada tindakan medis, pemakaian obat-obatan darurat, serta pemeriksaan penunjang yang dilakukan. Kami menerima pasien BPJS Kesehatan sesuai dengan regulasi kegawatdaruratan nasional.' }
    ],
    relatedServices: ['poli-umum', 'poli-kia'],
    contactInformation: {
      phone: '(0274) 555-999',
      whatsapp: 'https://wa.me/6281122334455',
      email: 'igd@klinikaisyiyah.com'
    },
    seo: {
      title: 'Instalasi Gawat Darurat (IGD) 24 Jam - Klinik Aisyiyah',
      description: 'Layanan gawat darurat 24 jam dengan tim medis siaga ahli ACLS/ATLS. Hubungi IGD Klinik Aisyiyah untuk penanganan darurat terbaik.',
      keywords: ['igd 24 jam', 'gawat darurat', 'klinik darurat', 'dokter jaga 24 jam', 'ambulans aisyiyah']
    }
  },
  'poli-umum': {
    id: 2,
    slug: 'poli-umum',
    title: 'Poli Umum Terpadu',
    shortDescription: 'Layanan pemeriksaan kesehatan dasar dan konsultasi medis komprehensif oleh dokter umum berpengalaman untuk menjaga kesehatan Anda sekeluarga.',
    fullDescription: 'Poli Umum Klinik Aisyiyah berfokus pada diagnosis awal, pengobatan penyakit umum harian, serta upaya promosi kesehatan preventif. Dokter-dokter umum kami siap memberikan waktu konsultasi yang cukup untuk mendengarkan keluhan medis Anda, melakukan pemeriksaan fisik komprehensif, serta merencanakan terapi yang paling sesuai.',
    purpose: 'Memberikan pelayanan kesehatan tingkat pertama yang berfokus pada pencegahan, diagnosis dini, serta pengobatan berbagai keluhan kesehatan umum agar tidak berkembang menjadi lebih parah.',
    benefits: [
      'Konsultasi dokter yang ramah dan solutif.',
      'Sistem janji temu terpadu meminimalkan waktu antre.',
      'Terhubung langsung dengan fasilitas apotek internal.',
      'Rujukan terintegrasi jika pasien memerlukan dokter spesialis.'
    ],
    targetAudience: 'Seluruh anggota keluarga, dari anak-anak hingga lansia, yang memiliki keluhan seperti demam, flu, batuk, diare, pusing, hipertensi, atau membutuhkan pemeriksaan kesehatan (medical check-up) rutin.',
    heroImage: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2073&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop'
    ],
    facilities: ['Ruang Konsultasi Dokter yang Nyaman', 'Alat Pemeriksa Tensi Digital', 'Termometer Infra merah', 'Timbangan dan Stadiometer Akurat', 'Sistem Rekam Medis Elektronik'],
    doctors: [
      {
        name: 'dr. H. Rian Hidayat',
        specialty: 'Dokter Umum Keluarga',
        experience: '8 Tahun',
        schedule: 'Senin - Sabtu (08:00 - 14:00 WIB)',
        image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop'
      },
      {
        name: 'dr. Amalia Putri',
        specialty: 'Dokter Umum / Konsultan Preventif',
        experience: '5 Tahun',
        schedule: 'Senin - Jumat (14:00 - 20:00 WIB)',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop'
      }
    ],
    operationalHours: {
      'Senin': '08:00 - 20:00 WIB',
      'Selasa': '08:00 - 20:00 WIB',
      'Rabu': '08:00 - 20:00 WIB',
      'Kamis': '08:00 - 20:00 WIB',
      'Jumat': '08:00 - 20:00 WIB',
      'Sabtu': '08:00 - 17:00 WIB',
      'Minggu': 'Tutup'
    },
    workflow: [
      'Registrasi mandiri atau di meja pendaftaran.',
      'Pengukuran Tensi, Suhu, dan Berat Badan oleh Asisten Perawat.',
      'Masuk ke Ruang Konsultasi untuk diperiksa oleh Dokter.',
      'Pemberian Resep Obat atau rujukan laboratorium.',
      'Pembayaran di Kasir.',
      'Pengambilan Obat di unit Apotek Klinik.'
    ],
    preparation: [
      'Membawa kartu identitas (KTP/Kartu BPJS/Kartu Klinik).',
      'Mencatat riwayat alergi obat jika ada.',
      'Membawa hasil pemeriksaan laboratorium atau radiologi dari rumah sakit lain (jika ada).',
      'Datang 15 menit sebelum waktu konsultasi dimulai.'
    ],
    procedures: [
      { title: 'Konsultasi Medis Umum', description: 'Sesi tanya jawab mendalam dengan dokter untuk evaluasi keluhan kesehatan.', iconName: 'Stethoscope' },
      { title: 'Medical Check Up Fisik', description: 'Pemeriksaan fisik dasar untuk menilai kondisi kesehatan menyeluruh.', iconName: 'Activity' },
      { title: 'Penulisan Surat Sakit & Sehat', description: 'Pembuatan surat keterangan sehat/sakit resmi untuk kebutuhan dinas.', iconName: 'FileText' }
    ],
    faq: [
      { question: 'Apakah Poli Umum bekerja sama dengan BPJS Kesehatan?', answer: 'Ya, kami melayani pasien BPJS Kesehatan tingkat pertama (Faskes 1). Pastikan faskes Anda telah terdaftar di Klinik Aisyiyah Yogyakarta.' },
      { question: 'Apakah bisa berkonsultasi secara online?', answer: 'Saat ini konsultasi medis diwajibkan secara tatap muka agar pemeriksaan fisik dapat berjalan optimal dan akurat.' }
    ],
    relatedServices: ['poli-gigi', 'layanan-laboratorium'],
    contactInformation: {
      phone: '(0274) 555-888',
      whatsapp: 'https://wa.me/6281122334455',
      email: 'poliumum@klinikaisyiyah.com'
    },
    seo: {
      title: 'Poli Umum Terpadu Yogyakarta - Klinik Aisyiyah',
      description: 'Pemeriksaan dokter umum profesional dengan pelayanan ramah dan rekam medis digital. Daftar konsultasi kesehatan Anda sekeluarga di Klinik Aisyiyah.',
      keywords: ['poli umum jogja', 'dokter umum terdekat', 'pendaftaran dokter online', 'check up kesehatan', 'faskes bpjs']
    }
  },
  'poli-gigi': {
    id: 3,
    slug: 'poli-gigi',
    title: 'Poli Gigi & Mulut Spesialis',
    shortDescription: 'Perawatan komprehensif untuk kesehatan gigi dan estetika senyum Anda, ditangani oleh dokter gigi profesional dengan teknologi modern.',
    fullDescription: 'Poli Gigi Klinik Aisyiyah menyediakan berbagai macam perawatan gigi preventif, restoratif, dan kosmetik. Kami memahami bahwa kunjungan ke dokter gigi dapat memicu kecemasan, oleh karena itu kami menerapkan pendekatan yang lembut, ramah anak, dan informatif untuk memastikan kenyamanan penuh pasien selama tindakan berlangsung.',
    purpose: 'Membantu pasien mempertahankan kesehatan gigi dan mulut yang optimal, mengatasi nyeri gigi akut, serta memberikan restorasi estetika untuk senyum yang sehat percaya diri.',
    benefits: [
      'Peralatan dental unit modern dan higienis bersertifikasi steril.',
      'Layanan penambalan estetika sewarna gigi asli.',
      'Dokter gigi anak berpengalaman dengan teknik pendekatan santai.',
      'Konsultasi edukatif tentang cara merawat gigi di rumah.'
    ],
    targetAudience: 'Semua orang yang membutuhkan pembersihan karang gigi rutin, penambalan berlubang, pencabutan gigi bungsu, hingga pemasangan kawat gigi (orthodontic) dan veneer estetika.',
    heroImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2070&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?q=80&w=2000&auto=format&fit=crop'
    ],
    facilities: ['Modern Dental Unit dengan Monitor', 'Alat Sterilisasi Autoclave Standar Internasional', 'Intraoral Camera (Foto Gigi Langsung)', 'Ruang Tunggu Khusus Poli Gigi', 'Akses Wi-Fi Kecepatan Tinggi'],
    doctors: [
      {
        name: 'drg. Shinta Wulandari',
        specialty: 'Dokter Gigi Restorasi & Konservasi',
        experience: '7 Tahun',
        schedule: 'Senin, Rabu, Jumat (09:00 - 15:00 WIB)',
        image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=2000&auto=format&fit=crop'
      },
      {
        name: 'drg. Rahmat Setiawan',
        specialty: 'Dokter Gigi Umum & Estetika Gigi',
        experience: '9 Tahun',
        schedule: 'Selasa, Kamis, Sabtu (13:00 - 19:00 WIB)',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2000&auto=format&fit=crop'
      }
    ],
    operationalHours: {
      'Senin': '09:00 - 19:00 WIB',
      'Selasa': '09:00 - 19:00 WIB',
      'Rabu': '09:00 - 19:00 WIB',
      'Kamis': '09:00 - 19:00 WIB',
      'Jumat': '09:00 - 19:00 WIB',
      'Sabtu': '09:00 - 15:00 WIB',
      'Minggu': 'Tutup'
    },
    workflow: [
      'Melakukan registrasi poli gigi.',
      'Masuk ke Ruang Tindakan Gigi.',
      'Dokter gigi melakukan pemeriksaan awal dan mendokumentasikan dengan kamera intraoral.',
      'Penyampaian diagnosa, opsi tindakan, serta persetujuan estimasi biaya.',
      'Proses Tindakan Gigi (Scaling, tambal, atau cabut).',
      'Edukasi pasca tindakan, pembayaran, dan penjadwalan kontrol berikutnya.'
    ],
    preparation: [
      'Menyikat gigi dengan bersih di rumah sebelum berkunjung.',
      'Membawa kartu identitas medis dan kartu asuransi.',
      'Menginformasikan kepada dokter gigi jika memiliki riwayat sakit jantung, diabetes, atau sedang hamil.',
      'Menghindari konsumsi kafein berlebih sebelum tindakan gigi.'
    ],
    procedures: [
      { title: 'Scaling (Pembersihan Karang Gigi)', description: 'Tindakan membersihkan tumpukan karang gigi untuk mencegah radang gusi.', iconName: 'Smile' },
      { title: 'Penambalan Komposit Estetis', description: 'Penambalan gigi berlubang menggunakan bahan sewarna gigi asli agar terlihat alami.', iconName: 'ShieldCheck' },
      { title: 'Pencabutan Gigi (Ekstraksi)', description: 'Tindakan pencabutan gigi berlubang parah atau gigi bungsu yang impaksi.', iconName: 'Activity' },
      { title: 'Perawatan Saluran Akar (PSA)', description: 'Tindakan mempertahankan gigi asli yang infeksinya sudah mencapai saraf gigi.', iconName: 'HeartPulse' }
    ],
    faq: [
      { question: 'Apakah membersihkan karang gigi terasa sakit?', answer: 'Pembersihan karang gigi menggunakan alat ultrasonik yang sangat aman. Terkadang ada rasa ngilu sedikit di area gigi sensitif, namun ini wajar dan dokter gigi kami akan menyesuaikan getarannya agar nyaman.' },
      { question: 'Apakah Poli Gigi melayani pasien BPJS?', answer: 'Ya, BPJS Kesehatan mencakup beberapa tindakan gigi seperti tambal gigi, cabut gigi biasa, dan scaling gigi satu kali dalam setahun atas indikasi medis.' }
    ],
    relatedServices: ['poli-umum', 'layanan-laboratorium'],
    contactInformation: {
      phone: '(0274) 555-777',
      whatsapp: 'https://wa.me/6281122334455',
      email: 'poligigi@klinikaisyiyah.com'
    },
    seo: {
      title: 'Poli Gigi & Mulut Spesialis - Klinik Aisyiyah',
      description: 'Dapatkan senyum sehat dan bebas karang gigi bersama dokter gigi ramah dan profesional Klinik Aisyiyah. Melayani scaling, penambalan, dan cabut gigi.',
      keywords: ['dokter gigi jogja', 'scaling gigi terdekat', 'tambal gigi estetis', 'cabut gigi bungsu', 'bpjs gigi']
    }
  },
  'poli-kia': {
    id: 4,
    slug: 'poli-kia',
    title: 'Kesehatan Ibu & Anak (KIA) & Kebidanan',
    shortDescription: 'Layanan holistik kehamilan, tumbuh kembang anak, keluarga berencana (KB), serta imunisasi dasar anak demi masa depan keluarga sehat ceria.',
    fullDescription: 'Poli KIA & Kebidanan Klinik Aisyiyah berkomitmen memberikan pendampingan penuh bagi para calon ibu mulai dari masa pra-nikah, kehamilan, persalinan, menyusui, hingga pengawasan tumbuh kembang balita. Bidan-bidan kami ramah dan sabar, serta didampingi oleh alat USG untuk deteksi dini kesejahteraan janin.',
    purpose: 'Memastikan ibu hamil menjalani kehamilan dengan aman dan bahagia, menurunkan angka kematian ibu-bayi, serta memastikan anak tumbuh kembang optimal melalui program imunisasi dan gizi.',
    benefits: [
      'Bidan bersertifikasi bidan delima dan ramah pasien.',
      'Konseling KB terpadu (Suntik, Pil, IUD, Implan).',
      'Pemeriksaan USG 2D/4D berbiaya terjangkau.',
      'Kelas Ibu Hamil dan Senam Hamil terjadwal.'
    ],
    targetAudience: 'Ibu hamil yang ingin memeriksakan kehamilan rutin, pasangan suami istri yang konsultasi KB, bayi dan balita yang memerlukan imunisasi dasar atau pemantauan stunting.',
    heroImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=2038&auto=format&fit=crop'
    ],
    facilities: ['Ruang KIA Ber-AC dan Ramah Anak', 'Alat Pemeriksa USG Kebidanan', 'Alat Deteksi Detak Jantung Janin (Doppler)', 'Pojok Laktasi Pribadi', 'Timbangan Bayi Digital Akurat'],
    doctors: [
      {
        name: 'Bidan Maryati, S.Tr.Keb',
        specialty: 'Bidan Koordinator KIA & Laktasi',
        experience: '15 Tahun',
        schedule: 'Senin - Sabtu (08:00 - 14:00 WIB)',
        image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=2000&auto=format&fit=crop'
      },
      {
        name: 'dr. H. Rian Hidayat (USG)',
        specialty: 'Dokter Pemeriksa USG Kebidanan',
        experience: '8 Tahun',
        schedule: 'Selasa & Kamis (16:00 - 18:00 WIB)',
        image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop'
      }
    ],
    operationalHours: {
      'Senin': '08:00 - 17:00 WIB',
      'Selasa': '08:00 - 17:00 WIB',
      'Rabu': '08:00 - 17:00 WIB',
      'Kamis': '08:00 - 17:00 WIB',
      'Jumat': '08:00 - 17:00 WIB',
      'Sabtu': '08:00 - 14:00 WIB',
      'Minggu': 'Tutup'
    },
    workflow: [
      'Melakukan registrasi di loket KIA.',
      'Penimbangan berat badan dan pengukuran lingkar perut ibu hamil.',
      'Pemeriksaan fisik oleh bidan (Tekanan darah, palpasi Leopold).',
      'Pemeriksaan detak jantung janin menggunakan Doppler/USG.',
      'Sesi konseling laktasi atau gizi balita.',
      'Pencatatan di Buku KIA (KMS), pembayaran, dan pemberian vitamin/imunisasi.'
    ],
    preparation: [
      'Wajib membawa **Buku Pink KIA (Buku Ibu dan Anak)** untuk mencatat riwayat kehamilan dan anak.',
      'Memakai pakaian yang longgar di area perut untuk memudahkan pemeriksaan.',
      'Membawa KTP dan kartu BPJS (untuk klaim antenatal care gratis).',
      'Menyiapkan daftar pertanyaan terkait keluhan kehamilan/tumbuh kembang anak.'
    ],
    procedures: [
      { title: 'Antenatal Care (ANC)', description: 'Pemeriksaan kehamilan rutin oleh bidan untuk memastikan tumbuh kembang janin sehat.', iconName: 'Heart' },
      { title: 'Pemeriksaan USG Kandungan', description: 'Visualisasi janin di dalam rahim menggunakan gelombang suara untuk memantau posisi dan detak jantung.', iconName: 'Activity' },
      { title: 'Pelayanan Keluarga Berencana (KB)', description: 'Konseling serta pemasangan alat kontrasepsi IUD, implan, pil, maupun suntik KB.', iconName: 'ShieldCheck' },
      { title: 'Imunisasi Bayi & Balita', description: 'Pemberian vaksin wajib nasional seperti BCG, DPT, Polio, Campak, dan Hepatitis B.', iconName: 'Baby' }
    ],
    faq: [
      { question: 'Kapan sebaiknya ibu hamil mulai melakukan pemeriksaan ANC?', answer: 'Pemeriksaan ANC sebaiknya dimulai segera setelah ibu mendapati hasil tes kehamilan positif. Semakin cepat terdeteksi, bidan dapat memberikan suplementasi asam folat yang penting untuk pencegahan cacat janin.' },
      { question: 'Apakah bisa melahirkan normal di Klinik Aisyiyah?', answer: 'Kami menyediakan layanan persalinan normal 24 jam dipimpin bidan berpengalaman bagi kehamilan berisiko rendah. Jika ada penyulit medis, tim kami akan merujuk ke RS bersalin mitra kami.' }
    ],
    relatedServices: ['poli-umum', 'vaksin-haji'],
    contactInformation: {
      phone: '(0274) 555-666',
      whatsapp: 'https://wa.me/6281122334455',
      email: 'kia@klinikaisyiyah.com'
    },
    seo: {
      title: 'Kesehatan Ibu & Anak (KIA) & Kebidanan - Klinik Aisyiyah',
      description: 'Dapatkan pemeriksaan kehamilan ANC, USG, pelayanan KB terpadu, dan imunisasi balita lengkap bersama bidan kooperatif Klinik Aisyiyah.',
      keywords: ['bidan kia jogja', 'usg kehamilan terdekat', 'imunisasi anak gratis', 'kb spiral implan', 'kelas bumil']
    }
  },
  'vaksin-haji': {
    id: 5,
    slug: 'vaksin-haji',
    title: 'Poli Vaksinasi & Sertifikasi Internasional (ICV)',
    shortDescription: 'Layanan vaksinasi meningitis wajib dan vaksinasi influenza/pneumonia anjuran untuk calon jemaah haji, umrah, serta pelaku perjalanan internasional.',
    fullDescription: 'Poli Vaksinasi Klinik Aisyiyah menyediakan berbagai perlindungan vaksinasi premium. Kami mengelola penyimpanan vaksin dengan standar "Cold Chain" ketat untuk menjaga efektivitasnya. Khusus untuk calon jemaah haji & umrah serta pelaku perjalanan luar negeri, kami melayani penerbitan Kartu Kuning Internasional (ICV - Yellow Card) resmi.',
    purpose: 'Mencegah penularan penyakit berbahaya antar negara, melengkapi persyaratan perjalanan internasional, serta melindungi jemaah dari infeksi bakteri Meningitis selama ibadah.',
    benefits: [
      'Vaksinasi meningitis bersertifikasi resmi Kementerian Kesehatan.',
      'Pemberian Kartu Kuning Internasional (ICV) langsung selesai di tempat.',
      'Sediaan vaksin impor original yang dijamin kualitas penyimpanannya.',
      'Dokter pemeriksa bersertifikat keahlian kesehatan perjalanan.'
    ],
    targetAudience: 'Calon jemaah Haji, calon jemaah Umrah, mahasiswa yang akan belajar ke luar negeri, tenaga kerja internasional, serta masyarakat umum yang membutuhkan perlindungan kekebalan tubuh.',
    heroImage: 'https://images.unsplash.com/photo-1584308666744-24d5e74191c9?q=80&w=2070&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1628532116035-714088a8f192?q=80&w=2070&auto=format&fit=crop'
    ],
    facilities: ['Kulkas Vaksin Standar Medis (Cold Chain)', 'Ruang Observasi Pasca Vaksin', 'Sistem Pencetakan Kartu ICV Digital', 'Apotek Terpadu untuk Suplemen Tambahan', 'AC & Kursi Observasi Nyaman'],
    doctors: [
      {
        name: 'dr. H. Rian Hidayat',
        specialty: 'Dokter Umum Kesehatan Perjalanan',
        experience: '8 Tahun',
        schedule: 'Senin - Jumat (09:00 - 13:00 WIB)',
        image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop'
      }
    ],
    operationalHours: {
      'Senin': '08:00 - 15:00 WIB',
      'Selasa': '08:00 - 15:00 WIB',
      'Rabu': '08:00 - 15:00 WIB',
      'Kamis': '08:00 - 15:00 WIB',
      'Jumat': '08:00 - 15:00 WIB',
      'Sabtu': '08:00 - 12:00 WIB',
      'Minggu': 'Tutup'
    },
    workflow: [
      'Registrasi dan verifikasi berkas paspor/KTP di loket pendaftaran.',
      'Pemeriksaan tanda vital (tensi, suhu) dan screening kesehatan singkat oleh Dokter.',
      'Penyuntikan vaksin oleh tenaga medis berpengalaman.',
      'Menunggu di Ruang Observasi selama 15 menit untuk memantau efek samping langsung (KIPI).',
      'Penerbitan dan tanda tangan Kartu Kuning Internasional (ICV) resmi oleh Dokter.',
      'Selesai, pasien dipersilakan pulang membawa buku vaksin.'
    ],
    preparation: [
      'Membawa **Fotokopi Paspor** dengan nama yang sesuai untuk penulisan di buku vaksin (ICV).',
      'Membawa fotokopi KTP dan pas foto ukuran 3x4 berwarna (2 lembar).',
      'Pastikan tubuh dalam kondisi fit, sehat, dan tidak sedang demam.',
      'Makan yang cukup sebelum divaksinasi untuk menghindari lemas.'
    ],
    procedures: [
      { title: 'Vaksinasi Meningitis Meningokokus', description: 'Vaksin wajib bagi jemaah haji & umrah untuk pencegahan radang selaput otak.', iconName: 'ShieldCheck' },
      { title: 'Vaksinasi Influenza', description: 'Vaksin pencegahan virus flu musiman, direkomendasikan karena padatnya jemaah di tanah suci.', iconName: 'Syringe' },
      { title: 'Vaksinasi Pneumonia (PCV)', description: 'Perlindungan dari infeksi bakteri pneumokokus yang menyerang saluran paru.', iconName: 'Activity' },
      { title: 'Penerbitan Sertifikat Vaksin ICV', description: 'Pemberian dokumen resmi ber-barcode internasional sebagai syarat legalitas imigrasi.', iconName: 'Award' }
    ],
    faq: [
      { question: 'Berapa hari sebelum keberangkatan saya harus disuntik vaksin Meningitis?', answer: 'Vaksinasi meningitis wajib diberikan **minimal 10 - 14 hari sebelum keberangkatan** ke Arab Saudi. Hal ini dikarenakan tubuh memerlukan waktu sekitar 2 minggu untuk membentuk antibodi protektif secara sempurna.' },
      { question: 'Apa saja efek samping pasca vaksinasi (KIPI)?', answer: 'Efek samping yang umum sangat ringan, berupa rasa pegal di lengan bekas suntikan, sakit kepala ringan, atau demam sumeng selama 1-2 hari. Ini adalah respon imun tubuh yang sehat. Anda dapat meminum Paracetamol jika merasa tidak nyaman.' }
    ],
    relatedServices: ['poli-umum', 'layanan-laboratorium'],
    contactInformation: {
      phone: '(0274) 555-555',
      whatsapp: 'https://wa.me/6281122334455',
      email: 'vaksin@klinikaisyiyah.com'
    },
    seo: {
      title: 'Vaksin Meningitis Haji & Umrah Resmi Yogyakarta - Klinik Aisyiyah',
      description: 'Layanan vaksinasi wajib meningitis bagi calon jemaah haji & umrah lengkap dengan Kartu Kuning Internasional (ICV) ber-barcode resmi Kemenkes.',
      keywords: ['vaksin meningitis jogja', 'buku kuning icv umrah', 'vaksin influenza haji', 'sertifikat vaksin perjalanan', 'biaya vaksin meningitis']
    },
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
  },
  'rehabilitasi-napza': {
    id: 6,
    slug: 'rehabilitasi-napza',
    title: 'Unit Rehabilitasi Rawat Jalan Napza',
    shortDescription: 'Layanan pemulihan dan konseling penyalahgunaan zat terlarang secara holistik, rahasia (konfidensial), dan didampingi konselor medis berpengalaman.',
    fullDescription: 'Unit Rehabilitasi Napza Klinik Aisyiyah menyediakan program rehabilitasi rawat jalan bagi individu yang bertekad pulih dari ketergantungan narkotika, psikotropika, dan zat adiktif lainnya. Kami memprioritaskan privasi penuh pasien, menggunakan pendekatan terapi kognitif perilaku (CBT), serta dukungan spiritual yang membimbing kembali ke kehidupan sosial produktif.',
    purpose: 'Membantu pasien melepaskan diri dari rantai kecanduan zat adiktif, meminimalkan gejala putus zat (sakau) secara medis, serta mencegah kekambuhan (relapse) melalui penguatan mental sosial.',
    benefits: [
      'Jaminan kerahasiaan identitas dan medis 100% (konfidensial).',
      'Program terapi rawat jalan yang tidak mengganggu aktivitas sekolah atau kerja.',
      'Pendekatan konseling psikososial berstandar nasional.',
      'Dukungan spiritual berkelanjutan.'
    ],
    targetAudience: 'Individu yang memiliki masalah ketergantungan napza/alkohol yang membutuhkan bimbingan medis, konseling psikolog, serta pendampingan pemulihan mental.',
    heroImage: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2070&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2070&auto=format&fit=crop'
    ],
    facilities: ['Ruang Konseling Privat & Kedap Suara', 'Laboratorium Tes Narkoba Urine Cepat', 'Area Terapi Kelompok Outdoor yang Teduh', 'Apotek Terpadu Terjaga Keamanan', 'Buku Panduan Pemulihan Mandiri'],
    doctors: [
      {
        name: 'dr. H. Rian Hidayat',
        specialty: 'Dokter Umum Pemeriksa Asesmen Medis',
        experience: '8 Tahun',
        schedule: 'Selasa & Jumat (15:00 - 18:00 WIB)',
        image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop'
      },
      {
        name: 'Siti Rahmawati, S.Psi',
        specialty: 'Konselor Adiksi & Psikolog Klinis',
        experience: '6 Tahun',
        schedule: 'Senin - Kamis (13:00 - 17:00 WIB)',
        image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=2000&auto=format&fit=crop'
      }
    ],
    operationalHours: {
      'Senin': '09:00 - 17:00 WIB',
      'Selasa': '09:00 - 17:00 WIB',
      'Rabu': '09:00 - 17:00 WIB',
      'Kamis': '09:00 - 17:00 WIB',
      'Jumat': '09:00 - 17:00 WIB',
      'Sabtu': 'Tutup',
      'Minggu': 'Tutup'
    },
    workflow: [
      'Pasien/keluarga melakukan pendaftaran khusus konfidensial.',
      'Asesmen Medis & Asesmen Asiksi awal (menggunakan instrumen ASSIST).',
      'Penyusunan Rencana Terapi Rawat Jalan yang dipersonalisasi.',
      'Sesi Terapi Konseling Individu berkelanjutan (4-8 sesi).',
      'Pemeriksaan tes urine berkala untuk pemantauan kebersihan zat.',
      'Evaluasi pemulihan akhir dan penyusunan rencana pasca rehabilitasi.'
    ],
    preparation: [
      'Adanya komitmen internal dan kesadaran diri pasien untuk pulih dari kecanduan.',
      'Harus didampingi oleh orang tua/wali/keluarga dekat pada sesi asesmen pertama.',
      'Membawa kartu identitas (KTP/Kartu Pelajar).',
      'Bersedia mematuhi aturan program serta jadwal konseling yang telah disepakati bersama.'
    ],
    procedures: [
      { title: 'Asesmen Medis & Psikososial', description: 'Pemeriksaan tingkat kecanduan dan evaluasi kesehatan mental fisik pasien.', iconName: 'Activity' },
      { title: 'Konseling Adiksi Individual', description: 'Konseling psikologi privat berfokus pada motivasi diri untuk pulih dan pencegahan kambuh.', iconName: 'Smile' },
      { title: 'Terapi Perilaku Kognitif (CBT)', description: 'Metode terapi psikologi untuk merestrukturisasi pola pikir negatif pemicu adiksi.', iconName: 'HeartPulse' },
      { title: 'Tes Urine Skrining Narkoba', description: 'Skrining urine mendeteksi berbagai jenis narkotika secara cepat dan akurat.', iconName: 'ShieldCheck' }
    ],
    faq: [
      { question: 'Apakah data medis pasien rehabilitasi aman?', answer: 'Kami menjamin kerahasiaan identitas dan data medis pasien rehabilitasi 100%. Hak privasi pasien dilindungi undang-undang medis serta etika profesional tertinggi.' },
      { question: 'Berapa lama durasi rehabilitasi rawat jalan ini?', answer: 'Umumnya program dasar rehabilitasi rawat jalan memerlukan waktu 8 - 12 minggu, tergantung pada tingkat keparahan adiksi dan perkembangan motivasi pasien selama program.' }
    ],
    relatedServices: ['poli-umum', 'layanan-laboratorium'],
    contactInformation: {
      phone: '(0274) 555-444',
      whatsapp: 'https://wa.me/6281122334455',
      email: 'rehab@klinikaisyiyah.com'
    },
    seo: {
      title: 'Unit Rehabilitasi Rawat Jalan Napza Yogyakarta - Klinik Aisyiyah',
      description: 'Layanan rehabilitasi adiksi narkoba rawat jalan dengan pendampingan dokter & psikolog secara privat dan konfidensial.',
      keywords: ['rehabilitasi narkoba jogja', 'rehab rawat jalan', 'konseling kecanduan', 'psikolog adiksi', 'tes urine narkoba']
    }
  }
};
