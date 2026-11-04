import * as XLSX from 'xlsx';
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
    totalScore += r.q1 + r.q2 + r.q3 + r.q4 + r.q5 + r.q6 + r.q7 + r.q8 + r.q9;
  });

  const nrrU = {
    u1: Number((sums.q1 / total).toFixed(3)),
    u2: Number((sums.q2 / total).toFixed(3)),
    u3: Number((sums.q3 / total).toFixed(3)),
    u4: Number((sums.q4 / total).toFixed(3)),
    u5: Number((sums.q5 / total).toFixed(3)),
    u6: Number((sums.q6 / total).toFixed(3)),
    u7: Number((sums.q7 / total).toFixed(3)),
    u8: Number((sums.q8 / total).toFixed(3)),
    u9: Number((sums.q9 / total).toFixed(3)),
  };

  // Nilai Rata-rata Tertimbang (NRR) = Total Skor / (9 * Total Responden)
  const nrrTertimbang = Number((totalScore / (9 * total)).toFixed(3));
  const ikmScore = Number((nrrTertimbang * 25).toFixed(2));

  let ikmGrade: 'A' | 'B' | 'C' | 'D' = 'D';
  let ikmCategory = 'Tidak Baik';
  let mutuPelayanan = 'D';
  let kinerjaUnit = 'Tidak Baik';

  if (ikmScore >= 88.31) {
    ikmGrade = 'A';
    ikmCategory = 'Sangat Baik';
    mutuPelayanan = 'A';
    kinerjaUnit = 'Sangat Baik';
  } else if (ikmScore >= 76.61) {
    ikmGrade = 'B';
    ikmCategory = 'Baik';
    mutuPelayanan = 'B';
    kinerjaUnit = 'Baik';
  } else if (ikmScore >= 65.0) {
    ikmGrade = 'C';
    ikmCategory = 'Kurang Baik';
    mutuPelayanan = 'C';
    kinerjaUnit = 'Kurang Baik';
  } else {
    ikmGrade = 'D';
    ikmCategory = 'Tidak Baik';
    mutuPelayanan = 'D';
    kinerjaUnit = 'Tidak Baik';
  }

  const periodText =
    startDate || endDate
      ? `${startDate || 'Awal'} s.d ${endDate || 'Sekarang'}`
      : 'Semua Periode';
  const filterLayananText =
    serviceFilter === 'ALL' || !serviceFilter ? 'Semua Layanan' : serviceFilter;
  const exportDateStr = new Date().toLocaleString('id-ID');

  // ==========================================
  // SHEET 1: Rekap_SKM (Format Rekap 5 Tahun PermenPAN-RB)
  // ==========================================
  const rekapRows: (string | number)[][] = [
    ['REKAPITULASI PENGOLAHAN DATA SURVEI KEPUASAN MASYARAKAT (SKM)'],
    [
      'Berdasarkan PermenPANRB Nomor 14 Tahun 2017 tentang Pedoman Penyusunan Survei Kepuasan Masyarakat Unit Penyelenggara Pelayanan Publik',
    ],
    ['UNIT PENYELENGGARA: KLINIK PRATAMA AISYIYAH PANGKAJENE - SIDENRENG RAPPANG'],
    [
      `Periode: ${periodText}`,
      '',
      `Filter Layanan: ${filterLayananText}`,
      '',
      `Tanggal Ekspor: ${exportDateStr}`,
    ],
    [],
    [
      'NO',
      'PERIODE SURVEI',
      'JUMLAH RESPONDEN',
      'U1 (Persyaratan)',
      'U2 (Prosedur)',
      'U3 (Waktu)',
      'U4 (Biaya/Tarif)',
      'U5 (Produk)',
      'U6 (Kompetensi)',
      'U7 (Perilaku)',
      'U8 (Sarpras)',
      'U9 (Pengaduan)',
      'INDEKS UNIT (NRR TERTIMBANG)',
      'NILAI IKM KONVERSI',
      'MUTU PELAYANAN',
      'KINERJA UNIT PELAYANAN',
    ],
    [
      1,
      periodText,
      total,
      nrrU.u1,
      nrrU.u2,
      nrrU.u3,
      nrrU.u4,
      nrrU.u5,
      nrrU.u6,
      nrrU.u7,
      nrrU.u8,
      nrrU.u9,
      nrrTertimbang,
      ikmScore,
      mutuPelayanan,
      kinerjaUnit,
    ],
    [],
    ['KETERANGAN UNSUR PELAYANAN (PERMENPAN RB NO. 14 TAHUN 2017)', '', '', '', 'KETERANGAN ISTILAH & RUMUS PERHITUNGAN'],
    ['Kode', 'Unsur Pelayanan', '', 'NRR Unsur', '', 'U1 s/d U9', 'Unsur-Unsur Pelayanan (9 Indikator Penilaian)'],
    ['U1', 'Persyaratan Pelayanan', '', '', '', 'NRR', 'Nilai Rata-Rata per unsur'],
    ['U2', 'Sistem, Mekanisme, dan Prosedur', '', '', '', 'IKM', 'Indeks Kepuasan Masyarakat'],
    ['U3', 'Waktu Penyelesaian / Kecepatan', '', '', '', 'Bobot Penimbang', '1 / 9 Unsur = 0,111'],
    ['U4', 'Biaya / Tarif Pelayanan', '', '', '', 'NRR Per Unsur', 'Jumlah nilai per unsur dibagi total kuesioner'],
    ['U5', 'Produk Spesifikasi Jenis Pelayanan', '', '', '', 'NRR Tertimbang', 'NRR per unsur x 0,111'],
    ['U6', 'Kompetensi Pelaksana / Petugas', '', '', '', 'Jumlah NRR IKM', 'Total penjumlahan NRR Tertimbang (U1 - U9)'],
    ['U7', 'Perilaku Pelaksana (Sopan & Ramah)', '', '', '', 'IKM Unit', 'Jumlah NRR Tertimbang x 25 (Skala 25 - 100)'],
    ['U8', 'Kualitas Sarana dan Prasarana'],
    ['U9', 'Penanganan Pengaduan, Saran & Masukan'],
    [],
    ['TABEL KATEGORI MUTU PELAYANAN & KINERJA (PERMENPAN RB NO. 14/2017)'],
    ['Nilai Persepsi', 'Nilai Interval (NI)', 'Nilai Interval Konversi (NIK)', 'Mutu Pelayanan', 'Kinerja Unit Pelayanan'],
    ['4', '3,5324 - 4,00', '88,31 - 100,00', 'A', 'Sangat Baik'],
    ['3', '3,0644 - 3,532', '76,61 - 88,30', 'B', 'Baik'],
    ['2', '2,60 - 3,064', '65,00 - 76,60', 'C', 'Kurang Baik'],
    ['1', '1,00 - 2,5996', '25,00 - 64,99', 'D', 'Tidak Baik'],
  ];

  const wsRekap = XLSX.utils.aoa_to_sheet(rekapRows);
  wsRekap['!cols'] = [
    { wch: 6 },  // NO
    { wch: 28 }, // PERIODE
    { wch: 18 }, // JML RESPONDEN
    { wch: 16 }, // U1
    { wch: 16 }, // U2
    { wch: 16 }, // U3
    { wch: 16 }, // U4
    { wch: 16 }, // U5
    { wch: 16 }, // U6
    { wch: 16 }, // U7
    { wch: 16 }, // U8
    { wch: 16 }, // U9
    { wch: 28 }, // NRR TERTIMBANG
    { wch: 20 }, // NILAI IKM
    { wch: 18 }, // MUTU
    { wch: 24 }, // KINERJA
  ];

  // ==========================================
  // SHEET 2: Data_Responden (Format Rincian Semester Template)
  // ==========================================
  const detailRows: (string | number)[][] = [
    ['PENGOLAHAN DATA SURVEI KEPUASAN MASYARAKAT PER RESPONDEN DAN PER UNSUR PELAYANAN'],
    [`KLINIK PRATAMA AISYIYAH PANGKAJENE — PERIODE: ${periodText} — LAYANAN: ${filterLayananText}`],
    [],
    [
      'NO. RESP',
      'TANGGAL & JAM PENGISIAN',
      'NAMA RESPONDEN',
      'NO. KONTAK (WA)',
      'JENIS KELAMIN',
      'USIA',
      'PENDIDIKAN',
      'PEKERJAAN',
      'LAYANAN DITERIMA',
      'U1 (Persyaratan)',
      'U2 (Prosedur)',
      'U3 (Waktu)',
      'U4 (Biaya)',
      'U5 (Produk)',
      'U6 (Kompetensi)',
      'U7 (Perilaku)',
      'U8 (Sarpras)',
      'U9 (Pengaduan)',
      'RATA-RATA RESPONDEN',
      'SARAN / MASUKAN',
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

    const safeFeedback = r.feedback || '-';
    const displayOccupation =
      r.occupation === 'LAINNYA' && r.occupationOther
        ? `${r.occupation} (${r.occupationOther})`
        : r.occupation;

    detailRows.push([
      idx + 1,
      dateFormatted,
      r.respondentName,
      `'${r.contactNumber}`, // Awalan kutip satu agar 0 tidak hilang di Excel
      r.gender === 'L' ? 'Laki-laki' : 'Perempuan',
      r.age,
      r.education,
      displayOccupation,
      r.serviceReceived,
      r.q1,
      r.q2,
      r.q3,
      r.q4,
      r.q5,
      r.q6,
      r.q7,
      r.q8,
      r.q9,
      avgScore,
      safeFeedback,
    ]);
  });

  // Baris Agregasi Bawah (Persis format Baris 57-62 Template PermenPAN-RB)
  detailRows.push(
    [],
    ['Jumlah Nilai Per Unsur', '', '', '', '', '', '', '', '', sums.q1, sums.q2, sums.q3, sums.q4, sums.q5, sums.q6, sums.q7, sums.q8, sums.q9],
    ['Jumlah Kuesioner Terisi', '', '', '', '', '', '', '', '', total, total, total, total, total, total, total, total, total],
    ['NRR Per Unsur', '', '', '', '', '', '', '', '', nrrU.u1, nrrU.u2, nrrU.u3, nrrU.u4, nrrU.u5, nrrU.u6, nrrU.u7, nrrU.u8, nrrU.u9],
    ['NRR Tertimbang Per Unsur (x 1/9)', '', '', '', '', '', '', '', '', Number((nrrU.u1 / 9).toFixed(3)), Number((nrrU.u2 / 9).toFixed(3)), Number((nrrU.u3 / 9).toFixed(3)), Number((nrrU.u4 / 9).toFixed(3)), Number((nrrU.u5 / 9).toFixed(3)), Number((nrrU.u6 / 9).toFixed(3)), Number((nrrU.u7 / 9).toFixed(3)), Number((nrrU.u8 / 9).toFixed(3)), Number((nrrU.u9 / 9).toFixed(3))],
    ['IKM Unit Pelayanan (x 25)', `Nilai IKM Konversi (Jumlah NRR Tertimbang x 25): ${ikmScore}`],
    ['Mutu & Kinerja Unit Pelayanan', `Kategori: Mutu ${ikmGrade} (${ikmCategory})`]
  );

  const wsDetail = XLSX.utils.aoa_to_sheet(detailRows);
  wsDetail['!cols'] = [
    { wch: 10 }, // No
    { wch: 22 }, // Tgl & Jam
    { wch: 24 }, // Nama
    { wch: 18 }, // No WA
    { wch: 14 }, // JK
    { wch: 8 },  // Usia
    { wch: 14 }, // Pendidikan
    { wch: 20 }, // Pekerjaan
    { wch: 22 }, // Layanan
    { wch: 10 }, // U1
    { wch: 10 }, // U2
    { wch: 10 }, // U3
    { wch: 10 }, // U4
    { wch: 10 }, // U5
    { wch: 10 }, // U6
    { wch: 10 }, // U7
    { wch: 10 }, // U8
    { wch: 10 }, // U9
    { wch: 14 }, // Rata-rata
    { wch: 40 }, // Saran / Masukan
  ];

  // ==========================================
  // BENTUK WORKBOOK (.XLSX)
  // ==========================================
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, wsRekap, 'Rekap_SKM');
  XLSX.utils.book_append_sheet(wb, wsDetail, 'Data_Responden');

  const nowFileStr = new Date().toISOString().slice(0, 10);
  const fileName = `SKM_KlinikAisyiyah_${nowFileStr}.xlsx`;

  // Tulis ke binary array & buat Blob Browser
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
