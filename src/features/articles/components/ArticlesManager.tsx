'use client';

import React, { useState, useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveArticleAction, deleteArticleAction } from '@/app/actions/articles';

import { ARTICLE_CATEGORIES } from '@/lib/constants';
import { 
  Plus, Edit2, Trash2, ArrowLeft, Loader2, AlertCircle, 
  FileText, Image as ImageIcon, Tag, Calendar 
} from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { sanitizeHtml } from '@/lib/sanitizeHtml';

import { type Article } from '@prisma/client';

interface ArticlesManagerProps {
  initialArticles: Article[];
}

export default function ArticlesManager({ initialArticles }: ArticlesManagerProps) {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(saveArticleAction, null);
  const [deletePendingId, setDeletePendingId] = useState<number | null>(null);
  
  // Controlled inputs states for previewing
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState('');
  
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    targetId?: number;
    isAlertOnly?: boolean;
    type?: 'danger' | 'warning' | 'info';
  }>({ isOpen: false, title: '', message: '' });

  useEffect(() => {
    if (state?.success) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsFormOpen(false);
      setEditingArticle(null);
      router.refresh();
    }
  }, [state, router]);

  // Clean up Object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (coverImagePreview && coverImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(coverImagePreview);
      }
    };
  }, [coverImagePreview]);

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setEditorContent(article.content);
    setTitle(article.title);
    setSummary(article.summary);
    setCategory(article.category);
    setStatus(article.status);
    setCoverImagePreview(article.coverImage || null);
    setActiveTab('edit');
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingArticle(null);
    setEditorContent('');
    setTitle('');
    setSummary('');
    setCategory('');
    setStatus('DRAFT');
    setCoverImagePreview(null);
    setActiveTab('edit');
    setIsFormOpen(true);
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Revoke previous blob URL if exists
      if (coverImagePreview && coverImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(coverImagePreview);
      }
      const objectUrl = URL.createObjectURL(file);
      setCoverImagePreview(objectUrl);
    }
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
      setArticles(articles.filter((art) => art.id !== id));
      router.refresh();
      setModalConfig({ ...modalConfig, isOpen: false });
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
            {isFormOpen ? (editingArticle ? 'Edit Artikel' : 'Tulis Artikel Baru') : 'Kelola Artikel Kesehatan'}
          </h1>
          <p className="text-text-muted text-sm mt-1">
            {isFormOpen ? 'Isi formulir di bawah ini dengan lengkap.' : 'Daftar semua artikel kesehatan yang ada di website.'}
          </p>
        </div>

        {!isFormOpen && (
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-sans text-sm font-semibold transition-all duration-300 hover:bg-primary-dark active:scale-[0.98] shadow-sm hover:shadow-md"
          >
            <Plus className="h-4.5 w-4.5" />
            Tulis Artikel
          </button>
        )}
      </div>

      {state?.error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex gap-3 items-start">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Form Editor View */}
      {isFormOpen ? (
        <div className="bg-white rounded-3xl border-fine p-8 shadow-sm">
          {/* Back button */}
          <button
            onClick={() => setIsFormOpen(false)}
            className="inline-flex items-center gap-1.5 text-text-muted hover:text-text-dark text-xs font-semibold mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar
          </button>

          {/* Navigation Tabs */}
          <div className="flex border-b border-border-fine mb-8">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'edit'
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-text-muted hover:text-text-dark'
              }`}
            >
              Tulis Artikel
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'preview'
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-text-muted hover:text-text-dark'
              }`}
            >
              Pratinjau (Live Preview)
            </button>
          </div>

          <form action={formAction} className="space-y-6">
            {editingArticle && (
              <input type="hidden" name="id" value={editingArticle.id} />
            )}

            {/* EDIT TAB CONTENT */}
            <div className={activeTab === 'edit' ? 'space-y-6' : 'hidden'}>
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
                  Judul Artikel
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan judul artikel..."
                  className="w-full bg-white border border-border-fine rounded-full py-3 px-5 text-sm font-sans focus:outline-none focus:border-primary text-text-dark transition-all"
                />
              </div>

              {/* Kategori & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
                    Kategori
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-border-fine rounded-2xl py-3 px-5 text-sm font-sans focus:outline-none focus:border-primary text-text-dark transition-all"
                  >
                    <option value="" disabled>Pilih Kategori</option>
                    {ARTICLE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    required
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-white border border-border-fine rounded-2xl py-3 px-5 text-sm font-sans focus:outline-none focus:border-primary text-text-dark transition-all"
                  >
                    <option value="DRAFT">Draf (Sembunyikan)</option>
                    <option value="PUBLISHED">Publikasikan</option>
                  </select>
                </div>
              </div>

              {/* Foto Sampul */}
              <div>
                <label htmlFor="coverImage" className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
                  Foto Sampul (Opsional)
                </label>
                {coverImagePreview && (
                  <div className="mb-3">
                    <span className="text-xs text-text-muted block mb-1">Foto Sampul Saat Ini / Terpilih:</span>
                    <img 
                      src={coverImagePreview} 
                      alt="Cover Preview" 
                      className="w-48 h-auto rounded-lg border border-border-fine object-cover" 
                    />
                  </div>
                )}
                <div className="flex items-center gap-3 w-full bg-white border border-border-fine rounded-2xl py-2 px-4 focus-within:border-primary transition-all">
                  <ImageIcon className="w-5 h-5 text-text-muted flex-shrink-0" />
                  <input
                    type="file"
                    id="coverImage"
                    name="coverImage"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className="w-full text-sm font-sans text-text-dark file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
                  />
                </div>
                <p className="text-xs text-text-muted mt-2">Format: JPG, PNG. Rekomendasi ukuran 1200x630px.</p>
              </div>

              {/* Summary */}
              <div>
                <label htmlFor="summary" className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
                  Ringkasan Singkat (Summary)
                </label>
                <textarea
                  id="summary"
                  name="summary"
                  required
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  onFocus={(e) => {
                    e.currentTarget.style.height = 'auto';
                    e.currentTarget.style.height = `${Math.max(e.currentTarget.scrollHeight + 8, 90)}px`;
                  }}
                  onInput={(e) => {
                    e.currentTarget.style.height = 'auto';
                    e.currentTarget.style.height = `${Math.max(e.currentTarget.scrollHeight + 8, 90)}px`;
                  }}
                  placeholder="Masukkan ringkasan singkat 2-3 kalimat untuk card depan..."
                  className="w-full bg-white border border-border-fine rounded-2xl py-3.5 px-5 text-sm font-sans focus:outline-none focus:border-primary text-text-dark transition-all resize-y overflow-hidden min-h-[90px] leading-relaxed"
                />
              </div>

              {/* Content (HTML Editor area) */}
              <div>
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
                  Isi Artikel
                </label>
                <input type="hidden" name="content" value={editorContent} />
                <RichTextEditor value={editorContent} onChange={setEditorContent} />
              </div>
            </div>

            {/* PREVIEW TAB CONTENT */}
            <div className={activeTab === 'preview' ? 'block space-y-8 bg-bg-snow/40 p-6 sm:p-8 rounded-3xl border border-border-fine' : 'hidden'}>
              {/* Alert status preview */}
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-light text-primary text-xs font-semibold border border-primary/10 mb-4">
                <AlertCircle className="w-4 h-4" />
                <span>Mode Pratinjau: Artikel ini akan ditampilkan dengan status <strong>{status}</strong>.</span>
              </div>

              {/* Mock Detail Page */}
              <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-2xl border border-border-fine shadow-sm">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-semibold tracking-wide uppercase mb-6 border border-primary/10">
                  <Tag className="h-3.5 w-3.5" />
                  {category || 'Kategori Artikel'}
                </span>
                
                <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-text-dark tracking-tight leading-[1.2] mb-6 font-editorial-serif">
                  {title || 'Judul Artikel Anda Akan Tampil di Sini'}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-text-muted text-xs mb-8 border-b border-border-fine pb-6">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    <span>{new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <span>•</span>
                  <span>Ditulis oleh: <strong>Klinik Aisyiyah (Admin)</strong></span>
                </div>

                {summary && (
                  <div className="bg-bg-snow p-5 rounded-xl border-l-4 border-primary text-text-muted text-sm italic mb-8">
                    {summary}
                  </div>
                )}

                {coverImagePreview && (
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-border-fine mb-8">
                    <img 
                      src={coverImagePreview} 
                      alt="Cover Preview" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}

                {/* HTML content render */}
                <div 
                  className="prose prose-neutral max-w-none font-sans text-text-dark/95 leading-relaxed text-base"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(editorContent || '<p className="text-text-muted italic">Isi konten masih kosong. Tulis artikel pada tab Tulis Artikel.</p>') }}
                />
              </div>
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="flex gap-4 pt-4 border-t border-border-fine">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-primary text-white font-sans text-sm font-semibold transition-all duration-300 hover:bg-primary-dark active:scale-[0.98] disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Artikel'
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-border-fine bg-white text-text-dark font-sans text-sm font-semibold transition-all hover:bg-bg-snow"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Listing View */
        <div className="bg-white rounded-3xl border-fine overflow-hidden shadow-sm">
          {articles.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="h-12 w-12 text-primary/30 mx-auto mb-4" />
              <p className="text-text-muted text-lg font-medium">Belum ada artikel</p>
              <p className="text-text-muted text-sm mt-1">Klik tombol Tulis Artikel di atas untuk memulai.</p>
            </div>
          ) : (
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
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide border ${
                          art.status === 'PUBLISHED'
                            ? 'bg-primary-light text-primary border-primary/10'
                            : 'bg-gray-100 text-gray-500 border-gray-200'
                        }`}>
                          {art.status}
                        </span>
                      </td>
                      <td className="py-4 px-8 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => handleEdit(art)}
                            className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-primary-light transition-colors"
                            title="Edit Artikel"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => requestDelete(art.id)}
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
          )}
        </div>
      )}
      {/* Custom Modal untuk konfirmasi & alert */}
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        isAlertOnly={modalConfig.isAlertOnly}
        isLoading={deletePendingId !== null}
        onConfirm={modalConfig.isAlertOnly ? () => setModalConfig({ ...modalConfig, isOpen: false }) : confirmDelete}
        onCancel={() => setModalConfig({ ...modalConfig, isOpen: false })}
        confirmText={modalConfig.isAlertOnly ? 'Tutup' : 'Ya, Hapus Artikel'}
        cancelText="Batal"
      />
    </div>
  );
}
