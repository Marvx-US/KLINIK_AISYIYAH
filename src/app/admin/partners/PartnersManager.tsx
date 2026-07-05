'use client';

import React, { useState, useRef } from 'react';
import { savePartnerAction, deletePartnerAction, togglePartnerStatusAction } from '@/app/actions/partners';
import { Plus, Edit2, Trash2, ArrowLeft, Loader2, AlertCircle, Image as ImageIcon, Power, Info } from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';

// Sementara menggunakan interface lokal sampai prisma tergenerate di sisi server user
export interface Partner {
  id: number;
  name: string;
  logoUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface PartnersManagerProps {
  initialPartners: Partner[];
}

export default function PartnersManager({ initialPartners }: PartnersManagerProps) {
  const [partners, setPartners] = useState<Partner[]>(initialPartners);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState<number | null>(null);

  const resetForm = () => {
    setCurrentId(null);
    setName('');
    setImageFile(null);
    setImagePreview('');
    setIsEditing(false);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEdit = (partner: Partner) => {
    setCurrentId(partner.id);
    setName(partner.name);
    setImagePreview(partner.logoUrl);
    setImageFile(null);
    setIsEditing(true);
    setError(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Ukuran gambar maksimal 2MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('File harus berupa gambar');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      if (currentId) formData.append('id', currentId.toString());
      formData.append('name', name);
      if (imageFile) formData.append('image', imageFile);

      const result = await savePartnerAction(formData);

      if (result.error) {
        setError(result.error);
      } else {
        // Refresh page to get updated data
        window.location.reload();
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (id: number) => {
    setPartnerToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!partnerToDelete) return;
    setIsLoading(true);
    try {
      const result = await deletePartnerAction(partnerToDelete);
      if (result.error) {
        setError(result.error);
      } else {
        setPartners(partners.filter(p => p.id !== partnerToDelete));
        setIsDeleteModalOpen(false);
      }
    } catch (err: any) {
      setError('Gagal menghapus mitra');
    } finally {
      setIsLoading(false);
      setPartnerToDelete(null);
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const result = await togglePartnerStatusAction(id, currentStatus);
      if (result.error) {
        setError(result.error);
      } else {
        setPartners(partners.map(p => 
          p.id === id ? { ...p, isActive: !currentStatus } : p
        ));
      }
    } catch (err) {
      setError('Gagal mengubah status');
    }
  };

  if (isEditing) {
    return (
      <div className="p-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button
          onClick={resetForm}
          className="group flex items-center gap-2 text-text-muted hover:text-primary mb-6 transition-colors"
        >
          <div className="p-2 rounded-lg group-hover:bg-primary-light transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-semibold tracking-wide">Kembali ke Daftar</span>
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-border-fine overflow-hidden">
          <div className="p-8 border-b border-border-fine bg-bg-snow">
            <h1 className="font-heading font-extrabold text-2xl text-text-dark tracking-tight">
              {currentId ? 'Edit Mitra' : 'Tambah Mitra Baru'}
            </h1>
            <p className="text-text-muted mt-2">Masukan nama dan unggah logo (format transparan / PNG disarankan).</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-start gap-3 border border-red-100">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="font-medium text-sm">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Kolom Kiri: Upload Image */}
              <div className="md:col-span-1 space-y-4">
                <label className="block text-sm font-bold text-text-dark">
                  Logo Mitra <span className="text-red-500">*</span>
                </label>
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    relative group cursor-pointer aspect-video rounded-2xl border-2 border-dashed 
                    flex flex-col items-center justify-center overflow-hidden transition-all
                    ${imagePreview ? 'border-transparent bg-white shadow-md' : 'border-border-fine hover:border-primary hover:bg-primary-light'}
                  `}
                >
                  {imagePreview ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-4 bg-white" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <p className="text-white font-semibold text-sm flex items-center gap-2">
                          <Edit2 className="w-4 h-4" /> Ganti Logo
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6">
                      <div className="w-12 h-12 bg-bg-snow rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <ImageIcon className="w-6 h-6 text-text-muted group-hover:text-primary" />
                      </div>
                      <p className="text-sm font-semibold text-text-dark">Klik untuk unggah</p>
                      <p className="text-xs text-text-muted mt-1">PNG, JPG (Max. 2MB)</p>
                      <p className="text-xs text-primary mt-1 font-medium">Sangat disarankan: PNG Transparan</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                />
              </div>

              {/* Kolom Kanan: Detail Input */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-text-dark mb-2">
                    Nama Mitra Kerjasama <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: BPJS Kesehatan, Asuransi Prudential"
                    className="w-full px-4 py-3 bg-bg-snow border-border-fine border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-border-fine">
              <button
                type="button"
                onClick={resetForm}
                disabled={isLoading}
                className="px-6 py-3 rounded-xl font-bold text-text-muted hover:bg-bg-snow transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 rounded-xl font-bold bg-primary text-white hover:bg-primary-dark transition-all disabled:opacity-70 flex items-center gap-2 shadow-lg shadow-primary/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Mitra'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-extrabold text-3xl text-text-dark tracking-tight">Mitra Kerjasama</h1>
            <p className="text-text-muted mt-2">Kelola logo-logo mitra yang tampil berjajar di halaman beranda Anda.</p>
          </div>
          
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah Mitra</span>
          </button>
        </div>

        {partners.length === 0 ? (
          <div className="bg-white rounded-3xl border border-border-fine p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-xl text-text-dark mb-2">Belum ada Mitra</h3>
            <p className="text-text-muted mb-8 max-w-md mx-auto">Tambahkan logo mitra kerjasama untuk meningkatkan kepercayaan pengunjung website.</p>
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Mitra Pertama</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {partners.map((partner) => (
              <div 
                key={partner.id} 
                className={`group relative bg-white rounded-3xl border border-border-fine overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col ${!partner.isActive ? 'opacity-60 grayscale' : ''}`}
              >
                {/* Logo Area */}
                <div className="relative aspect-video bg-bg-snow flex items-center justify-center p-6 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={partner.logoUrl} 
                    alt={partner.name} 
                    className="max-w-full max-h-full object-contain filter drop-shadow-sm group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${
                      partner.isActive 
                        ? 'bg-green-100/90 text-green-700 border border-green-200' 
                        : 'bg-gray-100/90 text-gray-600 border border-gray-200'
                    }`}>
                      {partner.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-heading font-bold text-lg text-text-dark truncate" title={partner.name}>
                    {partner.name}
                  </h3>
                  
                  {/* Actions */}
                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-border-fine">
                    <button
                      onClick={() => toggleStatus(partner.id, partner.isActive)}
                      className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold ${
                        partner.isActive 
                          ? 'text-amber-600 hover:bg-amber-50' 
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={partner.isActive ? "Nonaktifkan" : "Aktifkan"}
                    >
                      <Power className="w-4 h-4" />
                      {partner.isActive ? 'Matikan' : 'Nyalakan'}
                    </button>
                    
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(partner)}
                        className="p-2 text-text-muted hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
                        title="Edit Mitra"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDelete(partner.id)}
                        className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Mitra"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setPartnerToDelete(null);
        }}
        onConfirm={executeDelete}
        title="Hapus Logo Mitra"
        message="Apakah Anda yakin ingin menghapus logo mitra ini secara permanen? Data yang sudah dihapus tidak dapat dikembalikan."
        confirmText="Ya, Hapus"
        type="danger"
        isLoading={isLoading}
      />
    </div>
  );
}
