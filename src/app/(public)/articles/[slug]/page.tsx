import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { type Article } from '@prisma/client';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import { ArrowLeft, Calendar, User, Tag, Heart } from 'lucide-react';

export const revalidate = 0;

const fallbackArticles = [
  {
    id: 1,
    title: "Menjaga Kesehatan Jantung dengan Pola Makan Sehat",
    slug: "menjaga-kesehatan-jantung-dengan-pola-makan-sehat",
    summary: "Jantung adalah organ vital. Pelajari pola makan berserat tinggi dan makanan yang harus dihindari untuk kesehatan jantung optimal.",
    content: `
      <p>Jantung merupakan salah satu organ vital yang bekerja tanpa henti untuk memompa darah ke seluruh tubuh. Oleh karena itu, menjaga kesehatan jantung adalah investasi utama untuk kelangsungan hidup kita.</p>
      
      <h3>1. Konsumsi Makanan Kaya Serat</h3>
      <p>Makanan berserat tinggi seperti gandum utuh, beras merah, oats, serta sayuran dan buah-buahan sangat baik untuk jantung. Serat larut dalam makanan ini membantu mengikat kolesterol di usus dan membuangnya dari tubuh sebelum terserap ke aliran darah.</p>
      
      <h3>2. Batasi Lemak Jenuh dan Lemak Trans</h3>
      <p>Hindari konsumsi berlebih gorengan, daging merah berlemak, mentega, dan makanan cepat saji. Lemak jenuh dapat memicu pembentukan plak pada pembuluh darah (aterosklerosis) yang merupakan penyebab utama penyakit jantung koroner.</p>
      
      <h3>3. Pilihlah Lemak Sehat</h3>
      <p>Gantikan lemak jenuh dengan lemak tak jenuh ganda atau tunggal seperti yang terkandung dalam ikan salmon, tuna, alpukat, kacang almond, dan minyak zaitun. Asam lemak omega-3 yang tinggi pada ikan sangat baik untuk menjaga detak jantung tetap stabil dan menurunkan tekanan darah.</p>
      
      <h3>4. Kurangi Konsumsi Garam dan Gula</h3>
      <p>Kadar garam yang tinggi memicu hipertensi (tekanan darah tinggi), yang lambat laun akan membebani kerja jantung. Konsumsi gula berlebih juga berisiko menimbulkan diabetes, salah satu faktor risiko utama penyakit kardiovaskular.</p>
      
      <p>Mulai hari ini, mari ubah isi piring kita menjadi lebih sehat demi jantung yang kuat dan sehat hingga hari tua. Jangan ragu berkonsultasi dengan dokter di Klinik Aisyiyah untuk merancang program diet sehat Anda.</p>
    `,
    category: "Gaya Hidup",
    createdAt: new Date(),
  },
  {
    id: 2,
    title: "Pentingnya Imunisasi Dasar Lengkap pada Bayi",
    slug: "pentingnya-imunisasi-dasar-lengkap-pada-bayi",
    summary: "Imunisasi dasar lengkap membantu melindungi buah hati dari berbagai penyakit berbahaya. Simak jadwal terbaru dari Kemenkes.",
    content: `
      <p>Imunisasi merupakan salah satu upaya pencegahan penyakit menular yang paling efektif dan terbukti aman. Melalui pemberian vaksin, tubuh anak akan dirangsang untuk membentuk sistem kekebalan tubuh yang aktif terhadap virus atau bakteri tertentu.</p>
      
      <h3>Kenapa Harus Imunisasi Lengkap?</h3>
      <p>Pemberian vaksin secara bertahap dan lengkap sangat penting untuk memberikan perlindungan jangka panjang. Jika imunisasi tidak lengkap, kekebalan yang terbentuk dalam tubuh anak tidak akan maksimal, sehingga anak tetap berisiko tertular penyakit berbahaya seperti polio, campak, difteri, pertusis (batuk rejan), tetanus, dan hepatitis B.</p>
      
      <h3>Daftar Imunisasi Dasar Wajib</h3>
      <ul>
        <li><strong>Hepatitis B (HB-0):</strong> Diberikan kurang dari 24 jam setelah bayi lahir.</li>
        <li><strong>BCG & Polio 1:</strong> Melindungi bayi dari tuberkulosis (TB) paru berat dan polio. Diberikan pada usia 1 bulan.</li>
        <li><strong>DPT-HB-Hib & Polio:</strong> Kombinasi pelindung dari Difteri, Tetanus, Pertusis, Hepatitis B, dan infeksi Hib. Diberikan pada usia 2, 3, dan 4 bulan.</li>
        <li><strong>Campak-Rubella (MR):</strong> Mencegah penyakit campak dan rubella yang memicu sindrom rubella kongenital. Diberikan pada usia 9 bulan.</li>
      </ul>
      
      <p>Klinik Aisyiyah menyediakan layanan imunisasi anak lengkap setiap hari kerja di Poli Kesehatan Ibu dan Anak (KIA). Mari pastikan tumbuh kembang optimal buah hati kita bebas dari ancaman penyakit menular.</p>
    `,
    category: "Kesehatan Anak",
    createdAt: new Date(),
  },
  {
    id: 3,
    title: "Mengenal Gejala Diabetes Melitus Tipe 2 sejak Dini",
    slug: "mengenal-gejala-diabetes-melitus-tipe-2-sejak-dini",
    summary: "Diabetes sering kali tidak bergejala pada tahap awal. Pahami tanda-tanda klasik seperti sering haus dan luka yang lambat sembuh.",
    content: `
      <p>Diabetes Melitus (DM) Tipe 2 merupakan penyakit kronis yang ditandai dengan tingginya kadar gula (glukosa) dalam darah akibat tubuh tidak sensitif terhadap hormon insulin (resistensi insulin) atau produksi insulin yang tidak mencukupi.</p>
      
      <h3>Gejala Klasik (3P)</h3>
      <ul>
        <li><strong>Poliuria (Sering Buang Air Kecil):</strong> Terutama pada malam hari. Ginjal berusaha membuang kelebihan gula darah melalui urin.</li>
        <li><strong>Polidipsia (Sering Haus):</strong> Karena cairan tubuh terus terbuang lewat urin, tubuh akan mengirim sinyal haus terus-menerus.</li>
        <li><strong>Polifagia (Mudah Lapar):</strong> Sel-sel tubuh tidak mendapatkan asupan gula sebagai energi karena terhambat masuknya insulin, sehingga tubuh merasa kelaparan meski baru selesai makan.</li>
      </ul>
      
      <h3>Gejala Pendukung Lainnya</h3>
      <p>Selain gejala klasik di atas, diabetes sering kali disertai dengan gejala penyerta seperti penurunan berat badan drastis tanpa sebab jelas, rasa cepat lelah, pandangan kabur secara tiba-tiba, luka yang lambat sekali sembuh, serta sering mengalami infeksi kulit atau gusi.</p>
      
      <p>Jika Anda atau keluarga mengalami gejala-gejala tersebut, segera lakukan pemeriksaan glukosa darah. Klinik Aisyiyah menyediakan paket skrining laboratorium diabetes lengkap dan konsultasi pengelolaan pola hidup bersama dokter spesialis/umum kami.</p>
    `,
    category: "Edukasi Medis",
    createdAt: new Date(),
  }
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  let article = null;

  try {
    article = await db.article.findUnique({
      where: { slug },
    });
  } catch (error) {
    // Falls back to memory list if db is not connected
  }

  if (!article) {
    article = fallbackArticles.find((art) => art.slug === slug) as unknown as Article;
  }

  if (!article) {
    notFound();
  }

  // Fetch recent articles as recommendations, excluding current article
  let recentArticles: Article[] = [];
  try {
    recentArticles = await db.article.findMany({
      where: {
        status: 'PUBLISHED',
        slug: { not: slug },
      },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });
  } catch (error) {
    // fallback
  }

  if (recentArticles.length === 0) {
    recentArticles = fallbackArticles.filter((art) => art.slug !== slug) as unknown as Article[];
  }

  return (
    <div className="pt-32 pb-16 md:pt-40 md:pb-24 w-full px-6 sm:px-8 lg:px-12 bg-bg-snow min-h-screen">
      {/* Back button */}
      <Link
        href="/articles"
        className="inline-flex items-center gap-3 px-5 py-2.5 bg-white border border-border-fine rounded-2xl text-text-muted hover:text-primary hover:border-primary/30 hover:bg-primary-light/50 shadow-sm transition-all duration-300 mb-12 text-sm font-bold group"
      >
        <div className="p-1.5 rounded-lg bg-bg-snow group-hover:bg-white transition-colors shadow-sm">
          <ArrowLeft className="h-4 w-4 text-text-muted group-hover:text-primary group-hover:-translate-x-0.5 transition-all" />
        </div>
        Kembali ke Artikel
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Main Content */}
        <article className="lg:col-span-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-semibold tracking-wide uppercase mb-6 border border-primary/10">
            <Tag className="h-3.5 w-3.5" />
            {article.category}
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-text-dark tracking-tight leading-[1.1] mb-8 font-editorial-serif">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-text-muted text-sm mb-12">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-border-fine shadow-sm hover:shadow-md transition-shadow">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="font-medium">{new Date(article.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-border-fine shadow-sm hover:shadow-md transition-shadow">
              <User className="h-4 w-4 text-primary" />
              <span className="font-medium">Tim Medis Klinik Aisyiyah</span>
            </div>
          </div>

          {/* Article Cover Image (Optional/Placeholder) */}
          {article.coverImage && (
            <div className="aspect-video w-full rounded-2xl overflow-hidden border-fine mb-12">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Rich Content Render — konten disanitasi untuk mencegah XSS */}
          <div
            className="prose prose-neutral max-w-none font-sans text-text-dark/95 leading-relaxed text-base space-y-6 break-words
              prose-headings:font-heading prose-headings:font-bold prose-headings:text-text-dark prose-headings:tracking-tight
              prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
              prose-p:mb-4
              prose-strong:text-text-dark prose-strong:font-semibold
              prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-ul:space-y-2
              prose-li:text-text-muted"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content ?? '') }}
          />
        </article>

        {/* Sidebar recommendations */}
        <aside className="lg:col-span-4 flex flex-col gap-12">
          <div className="bg-white p-8 rounded-2xl border-fine shadow-sm">
            <h3 className="font-heading font-bold text-sm tracking-widest uppercase text-text-dark mb-6 flex items-center gap-2">
              <Heart className="h-4.5 w-4.5 text-primary" />
              Artikel Terbaru Lainnya
            </h3>
            <div className="flex flex-col gap-6">
              {recentArticles.map((rec) => (
                <div key={rec.title} className="border-fine-b pb-6 last:border-b-0 last:pb-0">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-2">
                    {rec.category}
                  </span>
                  <h4 className="font-heading font-bold text-sm text-text-dark hover:text-primary transition-colors leading-snug">
                    <Link href={`/articles/${rec.slug}`}>{rec.title}</Link>
                  </h4>
                  <span className="text-[10px] text-text-muted mt-2 block">
                    {new Date(rec.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
