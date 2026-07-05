import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export interface ArticleCardData {
  id: number;
  title: string;
  slug: string;
  summary: string;
  category: string;
  coverImage?: string | null;
  createdAt: Date | string;
}

interface ArticleCardProps {
  article: ArticleCardData;
}

/**
 * ArticleCard — Kartu artikel yang digunakan di halaman beranda maupun daftar artikel.
 */
export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="bg-white rounded-2xl border-fine overflow-hidden transition-editorial hover-glow flex flex-col h-full group">
      {article.coverImage && (
        <div className="relative w-full h-48 overflow-hidden bg-gray-100 border-b border-border-fine">
          <Image 
            src={article.coverImage} 
            alt={article.title} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-8 flex flex-col h-full">
        <span className="text-xs font-bold text-primary uppercase tracking-wider mb-4 block">
          {article.category}
        </span>
        <h3 className="font-heading font-bold text-lg text-text-dark hover:text-primary transition-colors mb-4 leading-snug flex-grow break-words">
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h3>
        <p className="text-text-muted text-sm leading-relaxed mb-6 line-clamp-3 break-words">
          {article.summary}
        </p>
        <div className="border-fine-t pt-4 mt-auto flex items-center justify-between">
          <span className="text-xs text-text-muted font-sans">
            {new Date(article.createdAt).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <Link
            href={`/articles/${article.slug}`}
            className="inline-flex items-center gap-1 text-primary text-xs font-bold hover:underline"
          >
            Selengkapnya
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
