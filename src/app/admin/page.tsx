import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { type Article, type Event } from '@prisma/client';
import { FileText, CalendarRange, Plus, ArrowRight, Activity, Users } from 'lucide-react';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  let articleCount = 0;
  let eventCount = 0;
  let latestArticles: Article[] = [];
  let latestEvents: Event[] = [];

  try {
    articleCount = await db.article.count();
    eventCount = await db.event.count();
    
    latestArticles = await db.article.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    latestEvents = await db.event.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
  } catch (error) {
    // If db is not ready, keep defaults
  }

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div>
        <h1 className="font-heading font-extrabold text-3xl text-text-dark tracking-tight">
          Selamat Datang di Dashboard Admin
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Kelola publikasi artikel kesehatan dan pengumuman event Klinik Aisyiyah di sini.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Article count Card */}
        <div className="bg-white p-8 rounded-2xl border-fine shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Total Artikel Kesehatan</p>
            <h3 className="font-heading font-extrabold text-3xl text-text-dark">{articleCount}</h3>
            <Link
              href="/admin/articles"
              prefetch={false}
              className="inline-flex items-center gap-1 text-primary text-xs font-bold hover:underline mt-4"
            >
              Kelola artikel
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-primary-light flex items-center justify-center text-primary">
            <FileText className="h-7 w-7" />
          </div>
        </div>

        {/* Event count Card */}
        <div className="bg-white p-8 rounded-2xl border-fine shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Total Event & Kegiatan</p>
            <h3 className="font-heading font-extrabold text-3xl text-text-dark">{eventCount}</h3>
            <Link
              href="/admin/events"
              prefetch={false}
              className="inline-flex items-center gap-1 text-primary text-xs font-bold hover:underline mt-4"
            >
              Kelola event
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-primary-light flex items-center justify-center text-primary">
            <CalendarRange className="h-7 w-7" />
          </div>
        </div>
      </div>

      {/* Quick Action buttons */}
      <div className="bg-white p-8 rounded-2xl border-fine shadow-sm">
        <h3 className="font-heading font-bold text-base text-text-dark mb-6">Pintasan Tindakan Cepat</h3>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/articles?action=new"
            prefetch={false}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-sans text-sm font-semibold transition-all duration-300 hover:bg-primary-dark active:scale-[0.98] shadow-sm hover:shadow-md"
          >
            <Plus className="h-4.5 w-4.5" />
            Buat Artikel Baru
          </Link>
          <Link
            href="/admin/events?action=new"
            prefetch={false}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border-fine bg-white text-text-dark font-sans text-sm font-semibold transition-all duration-300 hover:bg-bg-snow active:scale-[0.98]"
          >
            <Plus className="h-4.5 w-4.5" />
            Buat Event Baru
          </Link>
        </div>
      </div>

      {/* Tables layout for latest items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Latest Articles */}
        <div className="bg-white p-8 rounded-2xl border-fine shadow-sm">
          <h3 className="font-heading font-bold text-base text-text-dark mb-6 flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Artikel Terbaru
          </h3>
          {latestArticles.length === 0 ? (
            <p className="text-sm text-text-muted">Belum ada artikel yang dipublikasikan.</p>
          ) : (
            <div className="divide-y divide-border-fine">
              {latestArticles.map((art) => (
                <div key={art.id} className="py-4 first:pt-0 last:pb-0 flex justify-between items-center">
                  <div className="overflow-hidden pr-4">
                    <p className="font-heading font-bold text-sm text-text-dark truncate">{art.title}</p>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider mt-1 block">
                      {art.category}
                    </span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide shrink-0 ${
                    art.status === 'PUBLISHED' ? 'bg-primary-light text-primary border border-primary/10' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {art.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latest Events */}
        <div className="bg-white p-8 rounded-2xl border-fine shadow-sm">
          <h3 className="font-heading font-bold text-base text-text-dark mb-6 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Event/Kegiatan Terbaru
          </h3>
          {latestEvents.length === 0 ? (
            <p className="text-sm text-text-muted">Belum ada kegiatan yang dijadwalkan.</p>
          ) : (
            <div className="divide-y divide-border-fine">
              {latestEvents.map((evt) => (
                <div key={evt.id} className="py-4 first:pt-0 last:pb-0 flex justify-between items-center">
                  <div className="overflow-hidden pr-4">
                    <p className="font-heading font-bold text-sm text-text-dark truncate">{evt.title}</p>
                    <p className="text-xs text-text-muted mt-1 truncate">{evt.location || 'Klinik Aisyiyah'}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide shrink-0 ${
                    evt.status === 'PUBLISHED' ? 'bg-primary-light text-primary border border-primary/10' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {evt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
