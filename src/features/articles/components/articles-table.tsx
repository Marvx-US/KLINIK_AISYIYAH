'use client';

import React from 'react';
import { Edit2, Trash2, Loader2, FileText } from 'lucide-react';
import { type Article } from '@prisma/client';
import { cn } from '@/lib/utils';
import { CONTENT_STATUS } from '@/lib/constants';

interface ArticlesTableProps {
  articles: Article[];
  onEdit: (article: Article) => void;
  onRequestDelete: (id: number) => void;
  deletePendingId: number | null;
}

export default function ArticlesTable({
  articles,
  onEdit,
  onRequestDelete,
  deletePendingId,
}: ArticlesTableProps) {
  if (articles.length === 0) {
    return (
      <div className="bg-white rounded-3xl border-fine overflow-hidden shadow-sm">
        <div className="text-center py-20">
          <FileText className="h-12 w-12 text-primary/30 mx-auto mb-4" />
          <p className="text-text-muted text-lg font-medium">Belum ada artikel</p>
          <p className="text-text-muted text-sm mt-1">Klik tombol Tulis Artikel di atas untuk memulai.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border-fine overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-fine-b bg-bg-snow/50 text-xs font-bold text-text-muted uppercase tracking-wider">
              <th className="py-4 px-8">Judul</th>
              <th className="py-4 px-6">Kategori</th>
              <th className="py-4 px-6">Tanggal Dibuat</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-8 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-fine">
            {articles.map((art) => (
              <tr key={art.id} className="hover:bg-bg-snow/35 transition-colors">
                <td className="py-4 px-8 font-heading font-bold text-text-dark max-w-xs truncate">
                  {art.title}
                </td>
                <td className="py-4 px-6 text-text-muted">
                  {art.category}
                </td>
                <td className="py-4 px-6 text-text-muted">
                  {new Date(art.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="py-4 px-6">
                  <span
                    className={cn(
                      'px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide border',
                      art.status === CONTENT_STATUS.PUBLISHED
                        ? 'bg-primary-light text-primary border-primary/10'
                        : 'bg-gray-100 text-gray-500 border-gray-200'
                    )}
                  >
                    {art.status}
                  </span>
                </td>
                <td className="py-4 px-8 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => onEdit(art)}
                      className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-primary-light transition-colors"
                      title="Edit Artikel"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRequestDelete(art.id)}
                      disabled={deletePendingId === art.id}
                      className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                      title="Hapus"
                    >
                      {deletePendingId === art.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
