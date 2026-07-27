import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getPublishedArticles } from '@/core/services/articleService';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import { ArrowLeft, Calendar, User, Tag, Heart } from 'lucide-react';

export const revalidate = 60; // ISR: re-generate tiap 1 menit

export async function generateStaticParams() {
  try {
    const articles = await getPublishedArticles();
    return articles.map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

import type { Metadata, ResolvingMetadata } from 'next';
import { KLINIK_INFO } from '@/lib/constants';


export async function generateMetadata({ params }: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug).catch(() => null);
  
  if (!article) return { title: 'Artikel Tidak Ditemukan' };

  return {
    title: article.title,
    description: article.summary || `Baca artikel tentang ${article.title} di Klinik Aisyiyah.`,
    openGraph: {
      title: article.title,
      description: article.summary || `Baca artikel tentang ${article.title} di Klinik Aisyiyah.`,
      url: `/articles/${slug}`,
      siteName: KLINIK_INFO.name,
      images: article.coverImage ? [
        {
          url: article.coverImage,
          width: 1200,
          height: 630,
          alt: article.title,
        }
      ] : [],
      locale: 'id_ID',
      type: 'article',
      publishedTime: new Date(article.createdAt).toISOString(),
      authors: ['Klinik Aisyiyah'],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary || '',
      images: article.coverImage ? [article.coverImage] : [],
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const article = await getArticleBySlug(slug).catch(() => null);
  if (!article) notFound();

  // Artikel rekomendasi lainnya
  const recentArticles = await getPublishedArticles()
    .then((all) => all.filter((a) => a.slug !== slug).slice(0, 3))
    .catch(() => []);

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

          {/* Article Cover Image */}
          {article.coverImage && (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border-fine mb-12">
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
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
                <div key={rec.slug} className="border-fine-b pb-6 last:border-b-0 last:pb-0">
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
