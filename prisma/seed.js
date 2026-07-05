const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Memulai proses seeding...');

  // 1. Buat User Admin Default
  const adminUsername = 'admin';
  const adminPasswordPlain = 'admin123';
  const hashedPassword = bcrypt.hashSync(adminPasswordPlain, 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { username: adminUsername },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        username: adminUsername,
        password: hashedPassword,
        name: 'Administrator Klinik',
        role: 'ADMIN',
      },
    });
    console.log(`User Admin sukses dibuat! Username: ${adminUsername}, Password: ${adminPasswordPlain}`);
  } else {
    console.log('User Admin sudah ada, melewati pembuatan user.');
  }

  // 2. Buat Artikel Contoh
  const articlesCount = await prisma.article.count();
  if (articlesCount === 0) {
    await prisma.article.createMany({
      data: [
        {
          title: 'Menjaga Kesehatan Jantung dengan Pola Makan Sehat',
          slug: 'menjaga-kesehatan-jantung-dengan-pola-makan-sehat',
          summary: 'Jantung adalah organ vital. Pelajari pola makan berserat tinggi dan makanan yang harus dihindari untuk kesehatan jantung optimal.',
          content: `
            <p>Jantung merupakan salah satu organ vital yang bekerja tanpa henti untuk memompa darah ke seluruh tubuh. Oleh karena itu, menjaga kesehatan jantung adalah investasi utama untuk kelangsungan hidup kita.</p>
            <h3>1. Konsumsi Makanan Kaya Serat</h3>
            <p>Makanan berserat tinggi seperti gandum utuh, beras merah, oats, serta sayuran dan buah-buahan sangat baik untuk jantung. Serat larut dalam makanan ini membantu mengikat kolesterol di usus dan membuangnya dari tubuh sebelum terserap ke aliran darah.</p>
            <h3>2. Batasi Lemak Jenuh dan Lemak Trans</h3>
            <p>Hindari konsumsi berlebih gorengan, daging merah berlemak, mentega, dan makanan cepat saji. Lemak jenuh dapat memicu pembentukan plak pada pembuluh darah (aterosklerosis) yang merupakan penyebab utama penyakit jantung koroner.</p>
            <h3>3. Pilihlah Lemak Sehat</h3>
            <p>Gantikan lemak jenuh dengan lemak tak jenuh ganda atau tunggal seperti yang terkandung dalam ikan salmon, tuna, alpukat, kacang almond, dan minyak zaitun.</p>
          `,
          category: 'Gaya Hidup',
          status: 'PUBLISHED',
        },
        {
          title: 'Pentingnya Imunisasi Dasar Lengkap pada Bayi',
          slug: 'pentingnya-imunisasi-dasar-lengkap-pada-bayi',
          summary: 'Imunisasi dasar lengkap membantu melindungi buah hati dari berbagai penyakit berbahaya. Simak jadwal terbaru dari Kemenkes.',
          content: `
            <p>Imunisasi merupakan salah satu upaya pencegahan penyakit menular yang paling efektif dan terbukti aman. Melalui pemberian vaksin, tubuh anak akan dirangsang untuk membentuk sistem kekebalan tubuh yang aktif terhadap virus atau bakteri tertentu.</p>
            <h3>Kenapa Harus Imunisasi Lengkap?</h3>
            <p>Pemberian vaksin secara bertahap dan lengkap sangat penting untuk memberikan perlindungan jangka panjang. Jika imunisasi tidak lengkap, kekebalan yang terbentuk dalam tubuh anak tidak akan maksimal.</p>
          `,
          category: 'Kesehatan Anak',
          status: 'PUBLISHED',
        },
        {
          title: 'Mengenal Gejala Diabetes Melitus Tipe 2 sejak Dini',
          slug: 'mengenal-gejala-diabetes-melitus-tipe-2-sejak-dini',
          summary: 'Diabetes sering kali tidak bergejala pada tahap awal. Pahami tanda-tanda klasik seperti sering haus dan luka yang lambat sembuh.',
          content: `
            <p>Diabetes Melitus (DM) Tipe 2 merupakan penyakit kronis yang ditandai dengan tingginya kadar gula (glukosa) dalam darah akibat tubuh tidak sensitif terhadap hormon insulin (resistensi insulin).</p>
            <h3>Gejala Klasik (3P)</h3>
            <ul>
              <li><strong>Poliuria (Sering Buang Air Kecil):</strong> Terutama pada malam hari.</li>
              <li><strong>Polidipsia (Sering Haus):</strong> Karena cairan tubuh terus terbuang lewat urin.</li>
              <li><strong>Polifagia (Mudah Lapar):</strong> Sel-sel tubuh tidak mendapatkan asupan gula sebagai energi.</li>
            </ul>
          `,
          category: 'Edukasi Medis',
          status: 'PUBLISHED',
        }
      ],
    });
    console.log('3 Artikel contoh sukses ditambahkan!');
  } else {
    console.log('Artikel sudah terisi, melewati proses.');
  }

  // 3. Buat Event Contoh
  const eventsCount = await prisma.event.count();
  if (eventsCount === 0) {
    await prisma.event.createMany({
      data: [
        {
          title: 'Program Imunisasi Polio Gratis Anak Usia 0-7 Tahun',
          slug: 'program-imunisasi-polio-gratis-anak-usia-0-7-tahun',
          content: `
            <p>Dalam rangka mensukseskan PIN Polio nasional dan melindungi anak-anak dari ancaman kelumpuhan permanen akibat virus Polio, Klinik Aisyiyah menyelenggarakan program pemberian tetes imunisasi polio gratis bagi semua anak usia 0 sampai dengan 7 tahun.</p>
            <p>Pemberian imunisasi akan dilaksanakan secara massal bertempat di Aula Utama Klinik Aisyiyah. Anda cukup membawa Kartu Keluarga (KK) atau Buku KIA (KMS) sang buah hati untuk proses pencatatan data.</p>
          `,
          eventDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          location: 'Aula Pertemuan Utama Klinik Aisyiyah',
          status: 'PUBLISHED',
        },
        {
          title: 'Seminar Edukasi Pencegahan Stunting bersama Ahli Gizi',
          slug: 'seminar-edukasi-pencegahan-stunting-bersama-ahli-gizi',
          content: `
            <p>Masalah stunting masih menjadi tantangan besar dalam tumbuh kembang anak di Indonesia. Stunting tidak hanya berdampak pada tinggi badan anak, tetapi juga perkembangan otak dan produktivitas mereka di masa depan.</p>
            <p>Dalam seminar interaktif ini, kita akan mengupas tuntas bersama ahli gizi mengenai pemberian MPASI kaya protein hewani untuk pencegahan stunting dan cara membaca grafik tumbuh kembang anak di buku KIA.</p>
          `,
          eventDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          location: 'Ruang Edukasi Lt. 2 Klinik Aisyiyah',
          status: 'PUBLISHED',
        }
      ],
    });
    console.log('2 Event contoh sukses ditambahkan!');
  } else {
    console.log('Event sudah terisi, melewati proses.');
  }

  console.log('Seeding selesai dengan sukses!');
}

main()
  .catch((e) => {
    console.error('Error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
