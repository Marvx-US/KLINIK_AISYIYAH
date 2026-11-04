export const GENDER_OPTIONS = [
  { label: 'Laki-laki', value: 'L' },
  { label: 'Perempuan', value: 'P' },
] as const;

export const EDUCATION_OPTIONS = [
  'SD',
  'SMP',
  'SMA',
  'D3',
  'S1',
  'S2',
] as const;

export const OCCUPATION_OPTIONS = [
  'PNS',
  'TNI',
  'POLRI',
  'SWASTA',
  'WIRAUSAHA',
  'LAINNYA',
] as const;

export const SERVICE_OPTIONS = [
  'Poli Umum',
  'Poli Gigi & Mulut',
  'Poli KIA & KB',
  'Instalasi Gawat Darurat (IGD)',
  'Farmasi / Apotek',
  'Laboratorium Klinis',
  'Fisioterapi',
  'Pemeriksaan Ibu Hamil & USG',
  'Lainnya',
] as const;

export interface SurveyQuestionItem {
  id: 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7' | 'q8' | 'q9';
  title: string;
  options: {
    label: string;
    score: number;
  }[];
}

export const SURVEY_QUESTIONS: SurveyQuestionItem[] = [
  {
    id: 'q1',
    title: 'Bagaimana pendapat Saudara tentang kesesuaian persyaratan pelayanan dengan jenis pelayanan?',
    options: [
      { label: 'Tidak Sesuai', score: 1 },
      { label: 'Kurang Sesuai', score: 2 },
      { label: 'Sesuai', score: 3 },
      { label: 'Sangat Sesuai', score: 4 },
    ],
  },
  {
    id: 'q2',
    title: 'Bagaimana pemahaman saudara tentang kemudahan prosedur pelayanan di unit ini?',
    options: [
      { label: 'Tidak Mudah', score: 1 },
      { label: 'Kurang Mudah', score: 2 },
      { label: 'Mudah', score: 3 },
      { label: 'Sangat Mudah', score: 4 },
    ],
  },
  {
    id: 'q3',
    title: 'Bagaimana pendapat saudara tentang kecepatan waktu dalam memberikan pelayanan?',
    options: [
      { label: 'Tidak Cepat', score: 1 },
      { label: 'Kurang Cepat', score: 2 },
      { label: 'Cepat', score: 3 },
      { label: 'Sangat Cepat', score: 4 },
    ],
  },
  {
    id: 'q4',
    title: 'Bagaimana pendapat Saudara tentang kewajaran biaya/tarif dalam pelayanan?',
    options: [
      { label: 'Sangat Mahal', score: 1 },
      { label: 'Cukup Mahal', score: 2 },
      { label: 'Murah', score: 3 },
      { label: 'Gratis / Sangat Terjangkau', score: 4 },
    ],
  },
  {
    id: 'q5',
    title: 'Bagaimana pendapat saudara tentang kesesuaian produk pelayanan antara yang tercantum dalam standar pelayanan dengan hasil yang diberikan?',
    options: [
      { label: 'Tidak Sesuai', score: 1 },
      { label: 'Kurang Sesuai', score: 2 },
      { label: 'Sesuai', score: 3 },
      { label: 'Sangat Sesuai', score: 4 },
    ],
  },
  {
    id: 'q6',
    title: 'Bagaimana pendapat saudara tentang kompetensi/kemampuan petugas dalam pelayanan?',
    options: [
      { label: 'Tidak Kompeten', score: 1 },
      { label: 'Kurang Kompeten', score: 2 },
      { label: 'Kompeten', score: 3 },
      { label: 'Sangat Kompeten', score: 4 },
    ],
  },
  {
    id: 'q7',
    title: 'Bagaimana pendapat saudara perilaku petugas dalam pelayanan terkait kesopanan dan keramahan?',
    options: [
      { label: 'Tidak Sopan dan Ramah', score: 1 },
      { label: 'Kurang Sopan dan Ramah', score: 2 },
      { label: 'Sopan dan Ramah', score: 3 },
      { label: 'Sangat Sopan dan Ramah', score: 4 },
    ],
  },
  {
    id: 'q8',
    title: 'Bagaimana pendapat saudara tentang kualitas sarana dan prasarana?',
    options: [
      { label: 'Buruk', score: 1 },
      { label: 'Cukup', score: 2 },
      { label: 'Baik', score: 3 },
      { label: 'Sangat Baik', score: 4 },
    ],
  },
  {
    id: 'q9',
    title: 'Bagaimana pendapat saudara tentang penanganan pengaduan penggunaan pelayanan?',
    options: [
      { label: 'Tidak Ada', score: 1 },
      { label: 'Ada Tetapi Tidak Berfungsi', score: 2 },
      { label: 'Berfungsi Tidak Maksimal', score: 3 },
      { label: 'Dikelola dengan Baik', score: 4 },
    ],
  },
];

