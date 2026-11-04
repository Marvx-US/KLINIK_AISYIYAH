import type { SurveyResponseItem } from '../types';

interface ExportSurveyParams {
  responses: SurveyResponseItem[];
  startDate?: string;
  endDate?: string;
  serviceFilter?: string;
}

export function exportSurveysToExcel({
  responses,
  startDate,
  endDate,
  serviceFilter,
}: ExportSurveyParams) {
  if (responses.length === 0) {
    alert('Tidak ada data survei pada rentang waktu yang dipilih.');
    return;
  }

  // Hitung IKM Ringkasan untuk Periode Terpilih
  const total = responses.length;
  let totalScore = 0;
  const sums = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0, q7: 0, q8: 0, q9: 0 };

  responses.forEach((r) => {
    sums.q1 += r.q1;
    sums.q2 += r.q2;
    sums.q3 += r.q3;
    sums.q4 += r.q4;
    sums.q5 += r.q5;
    sums.q6 += r.q6;
    sums.q7 += r.q7;
    sums.q8 += r.q8;
    sums.q9 += r.q9;
    totalScore += (r.q1 + r.q2 + r.q3 + r.q4 + r.q5 + r.q6 + r.q7 + r.q8 + r.q9);
  });

  const nrr = totalScore / (9 * total);
  const ikmScore = Number((nrr * 25).toFixed(2));

  let ikmGrade = 'D';
  let ikmCategory = 'Tidak Baik';
  if (ikmScore >= 88.31) {
    ikmGrade = 'A';
    ikmCategory = 'Sangat Baik';
  } else if (ikmScore >= 76.61) {
    ikmGrade = 'B';
    ikmCategory = 'Baik';
  } else if (ikmScore >= 65.0) {
    ikmGrade = 'C';
    ikmCategory = 'Kurang Baik';
  }

  const periodText =
    startDate || endDate
      ? `${startDate || 'Awal'} s.d ${endDate || 'Sekarang'}`
      : 'Semua Periode';

  const rows: string[][] = [
    ['LAPORAN REKAPITULASI SURVEI KEPUASAN MASYARAKAT (SKM)'],
    ['KLINIK PRATAMA AISYIYAH PANGKAJENE - SIDENRENG RAPPANG'],
    [''],
    ['Periode', `"${periodText}"`],
    ['Filter Layanan', `"${serviceFilter === 'ALL' || !serviceFilter ? 'Semua Layanan' : serviceFilter}"`],
    ['Total Responden', `"${total} Pasien"`],
    ['Nilai IKM Konversi (25 - 100)', `"${ikmScore}"`],
    ['Mutu Pelayanan', `"Mutu ${ikmGrade} (${ikmCategory})"`],
    ['Tanggal Ekspor', `"${new Date().toLocaleString('id-ID')}"`],
    [''],
    ['REKAP RATA-RATA UNSUR PELAYANAN (SKALA 1.00 - 4.00)'],
    [
      'U1 (Persyaratan)',
      'U2 (Prosedur)',
      'U3 (Kecepatan)',
      'U4 (Biaya/Tarif)',
      'U5 (Kesesuaian Produk)',
      'U6 (Kompetensi Petugas)',
      'U7 (Kesopanan & Keramahan)',
      'U8 (Sarana Prasarana)',
      'U9 (Penanganan Pengaduan)',
    ],
    [
      `"${(sums.q1 / total).toFixed(2)}"`,
      `"${(sums.q2 / total).toFixed(2)}"`,
      `"${(sums.q3 / total).toFixed(2)}"`,
      `"${(sums.q4 / total).toFixed(2)}"`,
      `"${(sums.q5 / total).toFixed(2)}"`,
      `"${(sums.q6 / total).toFixed(2)}"`,
      `"${(sums.q7 / total).toFixed(2)}"`,
      `"${(sums.q8 / total).toFixed(2)}"`,
      `"${(sums.q9 / total).toFixed(2)}"`,
    ],
    [''],
    ['DAFTAR RINCIAN DATA RESPONDEN'],
    [
      'No',
      'Tanggal & Jam Pengisian',
      'Nama Responden',
      'Nomor Kontak (WhatsApp)',
      'Jenis Kelamin',
      'Usia (Tahun)',
      'Pendidikan Terakhir',
      'Pekerjaan',
      'Pekerjaan Lainnya',
      'Layanan yang Diterima',
      'U1 (Persyaratan)',
      'U2 (Prosedur)',
      'U3 (Kecepatan)',
      'U4 (Biaya)',
      'U5 (Produk)',
      'U6 (Kompetensi)',
      'U7 (Perilaku)',
      'U8 (Sarpras)',
      'U9 (Pengaduan)',
      'Rata-rata Skor (1-4)',
      'Saran / Kritik / Masukan',
    ],
  ];

  responses.forEach((r, idx) => {
    const dateFormatted = new Date(r.createdAt).toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const avgScore = Number(
      ((r.q1 + r.q2 + r.q3 + r.q4 + r.q5 + r.q6 + r.q7 + r.q8 + r.q9) / 9).toFixed(2)
    );

    const safeFeedback = (r.feedback || '-')
      .replace(/"/g, '""')
      .replace(/\r?\n/g, ' ');

    rows.push([
      `"${idx + 1}"`,
      `"${dateFormatted}"`,
      `"${r.respondentName.replace(/"/g, '""')}"`,
      `"'${r.contactNumber}"`, // Ditambah kutip satu agar 0 di depan nomor HP tidak hilang di Excel
      `"${r.gender === 'L' ? 'Laki-laki' : 'Perempuan'}"`,
      `"${r.age}"`,
      `"${r.education}"`,
      `"${r.occupation}"`,
      `"${(r.occupationOther || '-').replace(/"/g, '""')}"`,
      `"${r.serviceReceived.replace(/"/g, '""')}"`,
      `"${r.q1}"`,
      `"${r.q2}"`,
      `"${r.q3}"`,
      `"${r.q4}"`,
      `"${r.q5}"`,
      `"${r.q6}"`,
      `"${r.q7}"`,
      `"${r.q8}"`,
      `"${r.q9}"`,
      `"${avgScore}"`,
      `"${safeFeedback}"`,
    ]);
  });

  // Gabungkan dengan pemisah koma (CSV standar internasional)
  // Tambahkan \uFEFF (UTF-8 BOM) agar Microsoft Excel langsung mendeteksi encoding UTF-8 tanpa teks berantakan
  const csvContent = '\uFEFF' + rows.map((row) => row.join(',')).join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const nowStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `Rekap_Survei_Kepuasan_Aisyiyah_${nowStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
