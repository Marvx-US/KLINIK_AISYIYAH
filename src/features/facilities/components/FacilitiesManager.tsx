'use client';

import React, { useState, useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveFacilityAction, deleteFacilityAction, toggleFacilityStatusAction } from '@/app/actions/facilities';
import { Plus, Edit2, Trash2, ArrowLeft, Loader2, AlertCircle, Image as ImageIcon, Power, Info } from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';

// Sementara menggunakan interface lokal sampai prisma tergenerate
export interface Facility {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface FacilitiesManagerProps {
  initialFacilities: Facility[];
}

export default function FacilitiesManager({ initialFacilities }: FacilitiesManagerProps) {
  const router = useRouter();
  const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  
  // States for ConfirmModal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState<number | null>(null);

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Action states for inline toggle status
  const [togglePendingId, setTogglePendingId] = useState<number | null>(null);

  // Update local state when props change (revalidated from server)
  useEffect(() => {
    setFacilities(initialFacilities);
  }, [initialFacilities]);

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const formData = new FormData(e.currentTarget);
      const res = await saveFacilityAction(formData);

      if (res?.error) {
        setErrorMsg(res.error);
      } else {
        setEditingFacility(null);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle status handler
  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    setTogglePendingId(id);
    const res = await toggleFacilityStatusAction(id, currentStatus);
    setTogglePendingId(null);
    if (res?.error) {
      alert(res.error);
    } else {
      router.refresh();
    }
  };

  // Delete handlers
  const promptDelete = (id: number) => {
    setFacilityToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!facilityToDelete) return;
    const id = facilityToDelete;
    
    setIsDeleteModalOpen(false);
    setFacilityToDelete(null);

    const res = await deleteFacilityAction(id);
    if (res?.error) {
      alert(res.error);
    } else {
      router.refresh();
    }
  };

  if (editingFacility !== null) {
    // FORM VIEW
    const isEdit = editingFacility.id !== 0;
    
    return (
      <div className="bg-white rounded-3xl border border-border-fine shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-border-fine bg-bg-snow flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-xl text-text-dark">
              {isEdit ? 'Edit Fasilitas' : 'Tambah Fasilitas Baru'}
            </h3>
            <p className="text-sm text-text-muted mt-1">
              {isEdit ? 'Ubah informasi fasilitas atau ganti gambarnya.' : 'Unggah foto fasilitas baru untuk ditampilkan di beranda.'}
            </p>
          </div>
          <button
            onClick={() => setEditingFacility(null)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-text-muted hover:text-text-dark hover:bg-white rounded-full transition-colors border border-transparent hover:border-border-fine"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col gap-6">
          {isEdit && <input type="hidden" name="id" value={editingFacility.id} />}
          
          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium border border-red-100">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
              {/* Name Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-bold text-text-dark">
                  Nama Fasilitas <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  defaultValue={editingFacility.name}
                  placeholder="Contoh: Poli Gigi & Mulut"
                  className="px-4 py-3 bg-bg-snow border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                />
              </div>

              {/* Description Field */}
              <div className="flex flex-col gap-2.5">
                <label htmlFor="description" className="text-sm font-bold text-text-dark">
                  Deskripsi <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={5}
                  defaultValue={editingFacility.description}
                  onFocus={(e) => {
                    e.currentTarget.style.height = 'auto';
                    e.currentTarget.style.height = `${Math.max(e.currentTarget.scrollHeight + 20, 160)}px`;
                  }}
                  onInput={(e) => {
                    e.currentTarget.style.height = 'auto';
                    e.currentTarget.style.height = `${Math.max(e.currentTarget.scrollHeight + 20, 160)}px`;
                  }}
                  placeholder="Deskripsikan fasilitas secara singkat namun menarik..."
                  className="w-full px-5 py-4 bg-bg-snow border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium leading-relaxed resize-y min-h-[160px]"
                />
              </div>

              {/* Status Field */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-text-dark">Status Visibilitas</label>
                <label className="flex items-center gap-3 cursor-pointer p-4 border border-border-fine rounded-2xl hover:bg-bg-snow transition-colors">
                  <input
                    type="checkbox"
                    name="isActive"
                    value="true"
                    defaultChecked={editingFacility.isActive}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div>
                    <p className="font-semibold text-sm text-text-dark">Tampilkan Publik</p>
                    <p className="text-xs text-text-muted">Jika dicentang, fasilitas akan muncul di halaman beranda.</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {/* Image Field */}
              <div className="flex flex-col gap-2 h-full">
                <label htmlFor="image" className="text-sm font-bold text-text-dark">
                  Gambar Foto <span className="text-red-500">{!isEdit && '*'}</span>
                </label>
                
                <div className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-border-fine rounded-3xl p-8 bg-bg-snow text-center relative overflow-hidden group">
                  {isEdit && editingFacility.imageUrl && (
                    <div className="absolute inset-0 w-full h-full opacity-30 group-hover:opacity-10 transition-opacity">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={editingFacility.imageUrl} alt="Current" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-primary">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-bold text-text-dark">Pilih atau Seret Foto Baru</p>
                    <p className="text-xs text-text-muted mt-2 max-w-[200px]">
                      Format JPG, PNG, WEBP. Maksimal 5MB. Resolusi disarankan 800x800px.
                    </p>
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      required={!isEdit}
                      className="mt-6 block w-full text-sm text-slate-500
                        file:mr-4 file:py-2.5 file:px-6
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary file:text-white
                        hover:file:bg-primary-dark transition-all cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-border-fine">
            <button
              type="button"
              onClick={() => setEditingFacility(null)}
              className="px-6 py-3 rounded-full text-sm font-semibold text-text-muted hover:bg-bg-snow transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-full text-sm font-bold text-white bg-primary hover:bg-primary-dark disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Fasilitas'
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // LIST VIEW
  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-heading font-extrabold text-3xl text-text-dark">Kelola Fasilitas</h1>
            <p className="text-text-muted mt-2">Atur foto ruangan dan fasilitas klinik untuk ditampilkan secara estetis di beranda.</p>
          </div>
          <button
            onClick={() => setEditingFacility({ id: 0, name: '', description: '', imageUrl: '', isActive: true, createdAt: new Date(), updatedAt: new Date() })}
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Fasilitas Baru
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-border-fine shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-snow border-b border-border-fine">
                  <th className="py-4 px-6 font-semibold text-xs text-text-muted uppercase tracking-wider">Foto & Info</th>
                  <th className="py-4 px-6 font-semibold text-xs text-text-muted uppercase tracking-wider">Deskripsi</th>
                  <th className="py-4 px-6 font-semibold text-xs text-text-muted uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 font-semibold text-xs text-text-muted uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-fine">
                {facilities.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-text-muted">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <ImageIcon className="w-12 h-12 text-border-fine" />
                        <p>Belum ada fasilitas. Silakan tambah baru.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  facilities.map((facility) => (
                    <tr key={facility.id} className="hover:bg-bg-snow/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm shrink-0 border border-border-fine">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={facility.imageUrl} alt={facility.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-text-dark text-sm">{facility.name}</p>
                            <p className="text-xs text-text-muted mt-1">Ditambahkan: {new Date(facility.createdAt).toLocaleDateString('id-ID')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm text-text-muted line-clamp-2 max-w-md">{facility.description}</p>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleStatus(facility.id, facility.isActive)}
                          disabled={togglePendingId === facility.id}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${
                            facility.isActive 
                              ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                              : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                          } disabled:opacity-50`}
                        >
                          {togglePendingId === facility.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Power className="w-3 h-3" />
                          )}
                          {facility.isActive ? 'Aktif' : 'Nonaktif'}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditingFacility(facility)}
                            className="p-2 text-text-muted hover:text-primary hover:bg-primary-light rounded-xl transition-colors"
                            title="Edit Fasilitas"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => promptDelete(facility.id)}
                            className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            title="Hapus Fasilitas"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setFacilityToDelete(null);
        }}
        onConfirm={executeDelete}
        title="Hapus Fasilitas"
        message="Apakah Anda yakin ingin menghapus foto dan data fasilitas ini? Tindakan ini tidak dapat dibatalkan dan file gambar akan tetap berada di server."
        confirmText="Hapus"
        cancelText="Batal"
      />
    </>
  );
}
