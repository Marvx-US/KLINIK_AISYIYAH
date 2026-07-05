import React from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { getPublishedArticles } from '@/core/services/articleService';
import { FALLBACK_ARTICLES, ARTICLE_CATEGORIES_FILTER } from '@/lib/constants';
import ArticleCard, { type ArticleCardData } from '@/components/ui/ArticleCard';
import EmptyState from '@/components/ui/EmptyState';

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

/** Mengambil artikel dari DB via Service, fallback jika DB kosong */
async function getFilteredArticles(
  searchQuery: string,
  selectedCategory: string,
): Promise<ArticleCardData[]> {
  try {
    const all = await getPublishedArticles();

    const filtered = all.filter((art) => {
      const matchSearch = searchQuery
        ? art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          art.summary.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchCategory =
        selectedCategory && selectedCategory !== 'Semua'
          ? art.category === selectedCategory
          : true;
      return matchSearch && matchCategory;
    });

    if (filtered.length > 0) {
      return filtered.map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        summary: a.summary,
        category: a.category,
        coverImage: a.coverImage ?? null,
        createdAt: a.createdAt,
      }));
    }

    // Fallback dengan filter lokal
    return FALLBACK_ARTICLES.filter((art) => {
      const matchSearch = searchQuery
        ? art.title.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchCategory =
        selectedCategory && selectedCategory !== 'Semua'
          ? art.category === selectedCategory
          : true;
      return matchSearch && matchCategory;
    });
  } catch {
    return FALLBACK_ARTICLES;
  }
}

/**
 * ArticlesPage — Halaman daftar artikel kesehatan.
 */
export default async function ArticlesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const searchQuery = params.q ?? '';
  const selectedCategory = params.category ?? '';

  const articles = await getFilteredArticles(searchQuery, selectedCategory);

  return (
    <div className="pt-32 pb-16 md:pt-40 md:pb-24 w-full px-6 sm:px-8 lg:px-12 bg-bg-snow min-h-screen">
      {/* Page Header */}
      <div className="max-w-3xl mb-16">
        <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-3">
          Edukasi & Informasi
        </span>
        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-text-dark tracking-tight leading-[1.1] mb-6 font-editorial-serif">
          Artikel Kesehatan
        </h1>
        <p className="text-text-muted text-lg leading-relaxed">
          Kumpulan artikel kesehatan tepercaya, tips gaya hidup sehat, dan informasi medis dari tim
          dokter Klinik Aisyiyah.
        </p>
      </div>

      {/* Premium Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-12 bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-border-fine/50">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {ARTICLE_CATEGORIES_FILTER.map((cat) => {
            const isActive = selectedCategory === cat || (cat === 'Semua' && !selectedCategory);
            const href =
              cat === 'Semua' ? '/articles' : `/articles?category=${encodeURIComponent(cat)}`;
            return (
              <Link
                key={cat}
                href={href}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'bg-transparent text-text-muted hover:bg-bg-snow hover:text-text-dark'
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {/* Search Input */}
        <form action="/articles" method="GET" className="relative w-full md:w-72">
          <input
            type="text"
            name="q"
            defaultValue={searchQuery}
            placeholder="Cari artikel..."
            className="w-full bg-bg-snow/50 border-0 rounded-xl py-2.5 pl-11 pr-4 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white text-text-dark transition-all placeholder:text-text-muted/60"
          />
          <Search className="absolute left-4 top-3 h-4 w-4 text-text-muted/70" />
        </form>
      </div>

      {/* Articles Grid atau Empty State */}
      {articles.length === 0 ? (
        <EmptyState
          title="Artikel tidak ditemukan"
          description="Coba gunakan kata kunci pencarian yang lain."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art) => (
            <ArticleCard key={art.id} article={art} />
          ))}
        </div>
      )}
    </div>
  );
}
