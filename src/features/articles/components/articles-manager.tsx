'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { deleteArticle as deleteArticleAction } from '../actions/delete-article';
import ConfirmModal from '@/components/ui/confirm-modal';
import ArticlesTable from './articles-table';
import ArticleFormView from './article-form-view';
import { type Article } from '@prisma/client';

interface ArticlesManagerProps {
  initialArticles: Article[];
}

export default function ArticlesManager({ initialArticles }: ArticlesManagerProps) {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletePendingId, setDeletePendingId] = useState<number | null>(null);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    targetId?: number;
    isAlertOnly?: boolean;
    type?: 'danger' | 'warning' | 'info';
  }>({ isOpen: false, title: '', message: '' });

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingArticle(null);
    setIsFormOpen(true);
  };

  const requestDelete = (id: number) => {
    setModalConfig({
      isOpen: true,
      title: 'Hapus Artikel',
      message: 'Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.',
      targetId: id,
      type: 'danger',
      isAlertOnly: false,
    });
  };

  const confirmDelete = async () => {
    if (!modalConfig.targetId) return;
    const id = modalConfig.targetId;

    setDeletePendingId(id);
    const res = await deleteArticleAction(id);

    if (res.success) {
      setArticles((prev) => prev.filter((art) => art.id !== id));
      router.refresh();
      setModalConfig((prev) => ({ ...prev, isOpen: false }));
    } else {
      setModalConfig({
        isOpen: true,
        title: 'Gagal Menghapus',
        message: res.error || 'Gagal menghapus artikel. Silakan coba lagi.',
        isAlertOnly: true,
        type: 'danger',
      });
    }
    setDeletePendingId(null);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-text-dark">
            {isFormOpen
              ? editingArticle
                ? 'Edit Artikel'
                : 'Tulis Artikel Baru'
              : 'Kelola Artikel Kesehatan'}
          </h1>
          <p className="text-text-muted text-sm mt-1">
            {isFormOpen
              ? 'Isi formulir di bawah ini dengan lengkap.'
              : 'Daftar semua artikel kesehatan yang ada di website.'}
          </p>
        </div>

        {!isFormOpen && (
          <button
            type="button"
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-sans text-sm font-semibold transition-all duration-300 hover:bg-primary-dark active:scale-[0.98] shadow-sm hover:shadow-md"
          >
            <Plus className="h-4.5 w-4.5" />
            Tulis Artikel
          </button>
        )}
      </div>

      {isFormOpen ? (
        <ArticleFormView
          article={editingArticle}
          onCancel={() => setIsFormOpen(false)}
          onSuccess={() => {
            setIsFormOpen(false);
            setEditingArticle(null);
          }}
        />
      ) : (
        <ArticlesTable
          articles={articles}
          onEdit={handleEdit}
          onRequestDelete={requestDelete}
          deletePendingId={deletePendingId}
        />
      )}

      {/* Confirmation & Alert Modal */}
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        isAlertOnly={modalConfig.isAlertOnly}
        isLoading={deletePendingId !== null}
        onConfirm={
          modalConfig.isAlertOnly
            ? () => setModalConfig((prev) => ({ ...prev, isOpen: false }))
            : confirmDelete
        }
        onCancel={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
        confirmText={modalConfig.isAlertOnly ? 'Tutup' : 'Ya, Hapus Artikel'}
        cancelText="Batal"
      />
    </div>
  );
}
