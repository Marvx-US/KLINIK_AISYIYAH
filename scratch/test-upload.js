const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testUploadComprehensive() {
  console.log('Memulai proses pengunggahan artikel & berita dengan SEMUA fitur Rich Text...');

  const timestamp = Date.now();

  // 1. Artikel dengan Seluruh Tag HTML Rich Text yang Didukung & Disanitasi
  const articleTitle = `Pengujian Komprehensif Fitur Editor & Sanitasi HTML - ${timestamp}`;
  const articleSlug = `test-komprehensif-editor-${timestamp}`;
  const articleSummary = 'Artikel khusus untuk menguji semua pemformatan teks, tabel, kutipan, list, gambar, dan tautan dalam satu halaman penuh.';
  const articleContent = `
    <p>Ini adalah pengujian menyeluruh (<strong>komprehensif</strong>) untuk fitur Rich Text Editor dan Sanitizer HTML Klinik Aisyiyah.</p>
    <hr />
    <h2>1. Heading Tingkat 2 (H2)</h2>
    <h3>1.1 Heading Tingkat 3 (H3)</h3>
    <h4>1.1.1 Heading Tingkat 4 (H4)</h4>
    <p>Berikut adalah pengujian untuk variasi gaya teks: <strong>Teks Tebal (strong)</strong>, <b>Teks Tebal (b)</b>, <em>Teks Miring (em)</em>, <i>Teks Miring (i)</i>, <u>Teks Bergaris Bawah (u)</u>, <s>Teks Dicoret (s)</s>, <mark>Teks Sorotan (mark)</mark>, dan <small>Teks Kecil (small)</small>.</p>
    
    <blockquote>
      "Ini adalah contoh kutipan (blockquote) untuk menekankan pernyataan penting dalam artikel kesehatan."
    </blockquote>
    
    <p>Di bawah ini adalah contoh blok kode atau teks preformatted untuk menampilkan instruksi teknis:</p>
    <pre><code>// Contoh JavaScript Code
const status = "AMAN";
console.log(\`Status XSS: \${status}\`);</code></pre>

    <h2>2. Pengujian Struktur List (Daftar)</h2>
    <p>Daftar tidak berurutan (Unordered List):</p>
    <ul>
      <li>Poin pertama artikel.</li>
      <li>Poin kedua artikel dengan <strong>penekanan tebal</strong>.</li>
      <li>Poin ketiga dengan <a href="https://google.com">Tautan Tersemat</a>.</li>
    </ul>
    
    <p>Daftar berurutan (Ordered List):</p>
    <ol>
      <li>Langkah pertama pemeriksaan kesehatan.</li>
      <li>Langkah kedua konsultasi dokter.</li>
      <li>Langkah ketiga penebusan obat.</li>
    </ol>

    <h2>3. Pengujian Tabel Data Kesehatan</h2>
    <table class="w-full border-collapse border border-border-fine my-6 text-sm text-left">
      <thead>
        <tr class="bg-gray-100">
          <th scope="col" colspan="2" class="border border-border-fine p-3 font-bold text-text-dark">Kategori Pemeriksaan</th>
          <th scope="col" class="border border-border-fine p-3 font-bold text-text-dark">Nilai Normal</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td rowspan="2" class="border border-border-fine p-3 font-medium">Tekanan Darah</td>
          <td class="border border-border-fine p-3">Sistolik</td>
          <td class="border border-border-fine p-3">&lt; 120 mmHg</td>
        </tr>
        <tr>
          <td class="border border-border-fine p-3">Diastolik</td>
          <td class="border border-border-fine p-3">&lt; 80 mmHg</td>
        </tr>
        <tr class="bg-gray-50/50">
          <td colspan="2" class="border border-border-fine p-3 font-medium">Gula Darah Sewaktu (GDS)</td>
          <td class="border border-border-fine p-3">&lt; 200 mg/dL</td>
        </tr>
      </tbody>
    </table>

    <h2>4. Pengujian Gambar dan Tautan Aman</h2>
    <p>Berikut adalah contoh gambar dengan atribut lengkap:</p>
    <figure class="my-6 text-center">
      <img src="https://images.unsplash.com/photo-1511295742364-92767fa62d9f?w=600&auto=format&fit=crop&q=60" alt="Alat Kedokteran" width="600" height="350" class="rounded-xl mx-auto shadow-md" />
      <figcaption class="text-xs text-text-muted mt-2">Gambar 1: Stetoskop sebagai alat diagnosis utama dokter.</figcaption>
    </figure>
    
    <p>Pengujian tautan eksternal dan internal:</p>
    <ul>
      <li>Tautan Eksternal (harus otomatis open in new tab & noopener): <a href="https://example.com" target="_blank">Buka Example.com</a></li>
      <li>Tautan Internal (relatif): <a href="/contact">Hubungi Hubungan Masyarakat Klinik</a></li>
      <li>Tautan Jangkar (anchor): <a href="#top">Kembali ke Atas</a></li>
    </ul>
  `;

  const newArticle = await prisma.article.create({
    data: {
      title: articleTitle,
      slug: articleSlug,
      summary: articleSummary,
      content: articleContent,
      category: 'Edukasi Medis',
      status: 'PUBLISHED',
      coverImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=60' // Contoh gambar medis
    }
  });

  console.log('✅ Artikel Komprehensif Berhasil Diunggah:', newArticle.title);

  // 2. Berita/Event dengan Format Rich Text Serupa
  const eventTitle = `Milad Ke-20 Klinik Aisyiyah & Bakti Sosial Akbar - ${timestamp}`;
  const eventSlug = `milad-20-bakti-sosial-${timestamp}`;
  const eventContent = `
    <p>Menyambut Milad Ke-20, Klinik Aisyiyah mengadakan serangkaian kegiatan sosial yang ditujukan untuk meningkatkan derajat kesehatan masyarakat.</p>
    <hr />
    <h2>Rangkaian Agenda Kegiatan Milad:</h2>
    <ol>
      <li><strong>Pemeriksaan Kesehatan Gratis</strong> (Tensi, Kolesterol, Asam Urat, Gula Darah).</li>
      <li><strong>Donor Darah Massal</strong> bekerja sama dengan PMI wilayah setempat.</li>
      <li><strong>Khitanan Massal Gratis</strong> bagi anak-anak keluarga kurang mampu.</li>
    </ol>
    
    <blockquote>
      "Klinik Aisyiyah berkomitmen untuk terus menebar manfaat dan menjadi garda terdepan kesehatan umat."
    </blockquote>

    <h2>Jadwal Pelaksanaan:</h2>
    <table class="w-full border-collapse border border-border-fine my-4 text-sm text-left">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-border-fine p-3 font-bold">Kegiatan</th>
          <th class="border border-border-fine p-3 font-bold">Waktu</th>
          <th class="border border-border-fine p-3 font-bold">Lokasi</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="border border-border-fine p-3 font-semibold">Bakti Sosial & Donor Darah</td>
          <td class="border border-border-fine p-3">Sabtu, 08:00 - 13:00 WIB</td>
          <td class="border border-border-fine p-3">Aula Lt. 1 Klinik</td>
        </tr>
        <tr>
          <td class="border border-border-fine p-3 font-semibold">Khitanan Massal</td>
          <td class="border border-border-fine p-3">Ahad, 07:30 - selesai</td>
          <td class="border border-border-fine p-3">Poli KIA & Anak</td>
        </tr>
      </tbody>
    </table>
  `;

  const newEvent = await prisma.event.create({
    data: {
      title: eventTitle,
      slug: eventSlug,
      content: eventContent,
      eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 hari ke depan
      location: 'Seluruh Kompleks Klinik Aisyiyah',
      status: 'PUBLISHED',
      coverImage: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&auto=format&fit=crop&q=60' // Contoh gambar baksos
    }
  });

  console.log('✅ Event Komprehensif Berhasil Diunggah:', newEvent.title);
}

testUploadComprehensive()
  .catch((e) => {
    console.error('❌ Gagal melakukan pengunggahan komprehensif:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
