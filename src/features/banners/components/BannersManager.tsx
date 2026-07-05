'use client';

import React, { useState, useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveBannerAction, deleteBannerAction, toggleBannerStatusAction } from '@/app/actions/banners';
import { Plus, Edit2, Trash2, ArrowLeft, Loader2, AlertCircle, Image as ImageIcon, Power } from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';

import { type Banner } from '@prisma/client';

interface BannersManagerProps {
  initialBanners: Banner[];
}

export default function BannersManager({ initialBanners }: BannersManagerProps) {
  const router = useRouter();
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(saveBannerAction, null);
  const [deletePendingId, setDeletePendingId] = useState<number | null>(null);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    targetId?: number;
    actionType?: 'delete' | 'toggle';
    targetStatus?: boolean;
    isAlertOnly?: boolean;
    type?: 'danger' | 'warning' | 'info';
  }>({ isOpen: false, title: '', message: '' });

  useEffect(() => {
    if (state?.success) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsFormOpen(false);
      setEditingBanner(null);
      router.refresh();
    }
  }, [state, router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBanners(initialBanners);
  }, [initialBanners]);

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingBanner(null);
    setIsFormOpen(true);
  };

  const confirmDelete = (banner: Banner) => {
    setModalConfig({
      isOpen: true,
      title: 'Hapus Banner',
      message: `Apakah Anda yakin ingin menghapus banner "${banner.title}"?`,
      targetId: banner.id,
      actionType: 'delete',
      type: 'danger'
    });
  };

  const confirmToggle = (banner: Banner) => {
    setModalConfig({
      isOpen: true,
      title: banner.isActive ? 'Nonaktifkan Banner' : 'Aktifkan Banner',
      message: banner.isActive 
        ? `Banner "${banner.title}" tidak akan ditampilkan lagi di halaman depan. Lanjutkan?`
        : `Banner "${banner.title}" akan kembali ditampilkan di halaman depan. Lanjutkan?`,
      targetId: banner.id,
      actionType: 'toggle',
      targetStatus: banner.isActive,
      type: 'warning'
    });
  };

  const handleModalConfirm = async () => {
    if (!modalConfig.targetId) return;

    if (modalConfig.actionType === 'delete') {
      setDeletePendingId(modalConfig.targetId);
      const res = await deleteBannerAction(modalConfig.targetId);
      if (res?.error) {
        setModalConfig({
          isOpen: true,
          title: 'Gagal',
          message: res.error,
          isAlertOnly: true,
          type: 'danger'
        });
      } else {
        setModalConfig({ isOpen: false, title: '', message: '' });
      }
      setDeletePendingId(null);
    } 
    else if (modalConfig.actionType === 'toggle') {
      const res = await toggleBannerStatusAction(modalConfig.targetId, modalConfig.targetStatus!);
      if (res?.error) {
        setModalConfig({
          isOpen: true,
          title: 'Gagal',
          message: res.error,
          isAlertOnly: true,
          type: 'danger'
        });
      } else {
        setModalConfig({ isOpen: false, title: '', message: '' });
      }
    }
  };

  if (isFormOpen) {
    return (
      <div className="bg-white rounded-3xl border-fine shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="border-b border-border-fine px-8 py-6 bg-bg-snow flex items-center gap-4">
          <button
            onClick={() => setIsFormOpen(false)}
            className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-border-fine text-text-muted hover:text-text-dark"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-heading font-bold text-xl text-text-dark">
              {editingBanner ? 'Edit Banner' : 'Tambah Banner Baru'}
            </h2>
            <p className="text-xs text-text-muted mt-1">Formulir {editingBanner ? 'perubahan' : 'pembuatan'} gambar latar.</p>
          </div>
        </div>

        <div className="p-8">
          <form action={formAction} className="space-y-8">
            {editingBanner && <input type="hidden" name="id" value={editingBanner.id} />}

            {state?.error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{state.error}</span>
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
                Judul / Deskripsi (Internal)
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                defaultValue={editingBanner?.title}
                placeholder="Contoh: Promo Ramadhan 2026"
                className="w-full bg-white border border-border-fine rounded-2xl py-3 px-5 text-sm font-sans focus:outline-none focus:border-primary text-text-dark transition-all"
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
                Gambar Banner {editingBanner ? '(Opsional)' : ''}
              </label>
              {editingBanner?.imageUrl && (
                <div className="mb-3">
                  <span className="text-xs text-text-muted block mb-2">Gambar saat ini:</span>
                  <img src={editingBanner.imageUrl} alt="Cover" className="w-full max-w-lg h-auto rounded-xl border border-border-fine object-cover aspect-video" />
                </div>
              )}
              <div className="flex items-center gap-3 w-full bg-white border border-border-fine rounded-2xl py-2 px-4 focus-within:border-primary transition-all">
                <ImageIcon className="w-5 h-5 text-text-muted flex-shrink-0" />
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  required={!editingBanner}
                  className="w-full text-sm font-sans text-text-dark file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
                />
              </div>
              <p className="text-xs text-text-muted mt-2">Format: JPG, PNG, WEBP. Rekomendasi resolusi lebar 1920px (Desktop Full Width).</p>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="isActive" 
                  defaultChecked={editingBanner ? editingBanner.isActive : true}
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" 
                />
                <span className="text-sm font-bold text-text-dark">Tampilkan banner ini di halaman utama (Aktif)</span>
              </label>
            </div>

            <div className="flex gap-4 pt-4 border-t border-border-fine">
              <button
                type="submit"
                disabled={isPending}
                className="px-8 py-3 bg-primary text-white text-sm font-bold rounded-full hover:bg-primary-dark transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
              >
                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Simpan Banner'}
              </button>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                disabled={isPending}
                className="px-8 py-3 bg-bg-snow text-text-dark border border-border-fine text-sm font-bold rounded-full hover:bg-white hover:border-gray-300 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-3xl border-fine shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="p-6 border-b border-border-fine bg-bg-snow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-heading font-bold text-lg text-text-dark">Daftar Banner</h2>
          </div>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-full hover:bg-primary-dark transition-all active:scale-[0.98] shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            Tambah Banner
          </button>
        </div>

        <div className="overflow-x-auto">
          {banners.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <ImageIcon className="w-12 h-12 text-gray-200 mb-4" />
              <p className="text-text-muted text-sm">Belum ada banner yang ditambahkan.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="py-4 px-6 text-xs font-bold text-text-dark uppercase tracking-wider border-b border-border-fine">Gambar</th>
                  <th className="py-4 px-6 text-xs font-bold text-text-dark uppercase tracking-wider border-b border-border-fine">Info</th>
                  <th className="py-4 px-6 text-xs font-bold text-text-dark uppercase tracking-wider border-b border-border-fine w-32 text-center">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-text-dark uppercase tracking-wider border-b border-border-fine w-48 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-fine">
                {banners.map((banner) => (
                  <tr key={banner.id} className="hover:bg-bg-snow/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="w-32 h-20 rounded-lg overflow-hidden border border-border-fine">
                        <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-sm text-text-dark mb-1">{banner.title}</p>
                      <p className="text-xs text-text-muted">
                        Dibuat: {new Date(banner.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        banner.isActive 
                          ? 'bg-green-100 text-green-700 border border-green-200' 
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${banner.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        {banner.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => confirmToggle(banner)}
                          className="p-2 text-gray-500 hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
                          title={banner.isActive ? "Nonaktifkan" : "Aktifkan"}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(banner)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(banner)}
                          disabled={deletePendingId === banner.id}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Hapus"
                        >
                          {deletePendingId === banner.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        isAlertOnly={modalConfig.isAlertOnly}
        onConfirm={handleModalConfirm}
        onCancel={() => setModalConfig({ isOpen: false, title: '', message: '' })}
      />
    </>
  );
}
