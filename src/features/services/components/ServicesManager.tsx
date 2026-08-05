'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveServiceAction, deleteServiceAction, toggleServiceStatusAction } from '@/app/actions/services';
import { 
  Plus, Edit2, Trash2, ArrowLeft, Loader2, AlertCircle, Power, X, ImageIcon,
  HeartPulse, Smile, Baby, Syringe, Activity, ShieldAlert, Stethoscope, Heart, Award, ShieldCheck, HelpCircle
} from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';

// Ikon yang tersedia untuk dipilih admin
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  HeartPulse,
  Smile,
  Baby,
  Syringe,
  Activity,
  ShieldAlert,
  Stethoscope,
  Heart,
  Award,
  ShieldCheck,
};

const AVAILABLE_ICONS = [
  { name: 'HeartPulse', label: 'Detak Jantung (Poli Umum)' },
  { name: 'Smile', label: 'Senyum (Poli Gigi)' },
  { name: 'Baby', label: 'Bayi (Poli KIA / Bersalin)' },
  { name: 'Syringe', label: 'Suntikan (Vaksin Haji & Umrah)' },
  { name: 'Activity', label: 'Aktivitas / Grafik (Rehabilitasi Napza)' },
  { name: 'ShieldAlert', label: 'Perisai Darurat (IGD)' },
  { name: 'Stethoscope', label: 'Stetoskop (Umum / Medis)' },
  { name: 'Heart', label: 'Jantung / Kasih Sayang' },
  { name: 'Award', label: 'Lencana Penghargaan' },
  { name: 'ShieldCheck', label: 'Perisai Centang (Proteksi)' },
];

export interface Service {
  id: number;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  isActive: boolean;
  roomImage?: string | null;
  gallery?: string | null;
  priceList?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ServicesManagerProps {
  initialServices: Service[];
}

export default function ServicesManager({ initialServices }: ServicesManagerProps) {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>(initialServices);
  const [editingService, setEditingService] = useState<Service | null>(null);
  
  // States for ConfirmModal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState('Activity');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingGallery, setExistingGallery] = useState<string[]>([]);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);

  // Action states for inline toggle status
  const [togglePendingId, setTogglePendingId] = useState<number | null>(null);

  // Update local state when props change (revalidated from server)
  useEffect(() => {
    setServices(initialServices);
  }, [initialServices]);

  // Sync selected icon, room image & gallery state when entering editing mode
  useEffect(() => {
    if (editingService) {
      setSelectedIcon(editingService.iconName || 'Activity');
      setImagePreview(editingService.roomImage || null);
      if (editingService.gallery) {
        try {
          const parsed = JSON.parse(editingService.gallery);
          if (Array.isArray(parsed)) {
            setExistingGallery(parsed.filter(url => typeof url === 'string' && url.trim() !== ''));
          } else {
            setExistingGallery([]);
          }
        } catch {
          setExistingGallery([]);
        }
      } else {
        setExistingGallery([]);
      }
      setNewGalleryPreviews([]);
    } else {
      setImagePreview(null);
      setExistingGallery([]);
      setNewGalleryPreviews([]);
    }
  }, [editingService]);

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const formData = new FormData(e.currentTarget);
      const res = await saveServiceAction(formData);

      if (res?.error) {
        setErrorMsg(res.error);
      } else {
        setEditingService(null);
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
    const res = await toggleServiceStatusAction(id, currentStatus);
    setTogglePendingId(null);
    if (res?.error) {
      alert(res.error);
    } else {
      router.refresh();
    }
  };

  // Delete handlers
  const promptDelete = (id: number) => {
    setServiceToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!serviceToDelete) return;
    const id = serviceToDelete;
    
    setIsDeleteModalOpen(false);
    setServiceToDelete(null);

    const res = await deleteServiceAction(id);
    if (res?.error) {
      alert(res.error);
    } else {
      router.refresh();
    }
  };

  const renderIconPreview = (iconName: string, className = "w-6 h-6") => {
    const IconComp = ICON_MAP[iconName] || HelpCircle;
    return <IconComp className={className} />;
  };

  if (editingService !== null) {
    // FORM VIEW
    const isEdit = editingService.id !== 0;
    
    return (
      <div className="bg-white rounded-3xl border border-border-fine shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-border-fine bg-bg-snow flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-xl text-text-dark">
              {isEdit ? 'Edit Layanan' : 'Tambah Layanan Baru'}
            </h3>
            <p className="text-sm text-text-muted mt-1">
              {isEdit ? 'Ubah informasi detail mengenai layanan medis klinik.' : 'Tambahkan jenis layanan kesehatan baru untuk dipublikasikan.'}
            </p>
          </div>
          <button
            onClick={() => setEditingService(null)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-text-muted hover:text-text-dark hover:bg-white rounded-full transition-colors border border-transparent hover:border-border-fine"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
        </div>

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="p-6 md:p-8 flex flex-col gap-6">
          {isEdit && <input type="hidden" name="id" value={editingService.id} />}
          
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
                  Nama Layanan / Poli <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  defaultValue={editingService.name}
                  placeholder="Contoh: Poli Gigi"
                  className="px-4 py-3 bg-bg-snow border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                />
              </div>

              {/* Description Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="description" className="text-sm font-bold text-text-dark">
                  Deskripsi Layanan <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  defaultValue={editingService.description}
                  placeholder="Deskripsikan layanan secara lengkap, jam operasional, dan info penting lainnya..."
                  className="px-4 py-3 bg-bg-snow border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium resize-none"
                />
              </div>

              {/* Room Image Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="roomImage" className="text-sm font-bold text-text-dark">
                  Foto Utama & Ruangan Layanan
                </label>
                {imagePreview && (
                  <div className="relative w-48 h-28 rounded-xl overflow-hidden border border-border-fine mb-2 shadow-sm bg-bg-snow">
                    <img 
                      src={imagePreview} 
                      alt="Preview Foto Layanan" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  id="roomImage"
                  name="roomImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  className="px-4 py-3 bg-bg-snow border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium cursor-pointer"
                />
                <p className="text-xs text-text-muted">Upload foto baru untuk mengganti gambar utama pada halaman detail layanan (Maksimal 5MB. JPG, PNG, WebP).</p>
              </div>

              {/* Gallery Photos Field */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-text-dark flex items-center justify-between">
                  <span>Galeri Foto Ruangan & Fasilitas</span>
                  <span className="text-xs font-normal text-text-muted">Dapat upload beberapa foto sekaligus</span>
                </label>

                {/* Render Existing Gallery Photos */}
                {existingGallery.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold text-text-muted">Foto Galeri Saat Ini:</p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {existingGallery.map((url, idx) => (
                        <div key={idx} className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-border-fine bg-bg-snow">
                          <img src={url} alt={`Galeri ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setExistingGallery(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 hover:scale-110 transition-all shadow-md"
                            title="Hapus foto dari galeri"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <input type="hidden" name="existingGallery" value={url} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Render New Upload Previews */}
                {newGalleryPreviews.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold text-primary">Foto Baru yang Dipilih:</p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {newGalleryPreviews.map((url, idx) => (
                        <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-primary/40 bg-bg-snow">
                          <img src={url} alt={`Preview Baru ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* File input for adding new gallery photos */}
                <input
                  id="galleryFiles"
                  name="galleryFiles"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      const urls = Array.from(files).map(f => URL.createObjectURL(f));
                      setNewGalleryPreviews(urls);
                    } else {
                      setNewGalleryPreviews([]);
                    }
                  }}
                  className="px-4 py-3 bg-bg-snow border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium cursor-pointer"
                />
                <p className="text-xs text-text-muted">Pilih satu atau beberapa foto ruangan/fasilitas untuk menambahkan koleksi galeri foto layanan.</p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {/* Icon Selector Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="iconName" className="text-sm font-bold text-text-dark">
                  Pilih Ikon Layanan <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary-light border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    {renderIconPreview(selectedIcon, "w-8 h-8")}
                  </div>
                  <div className="flex-grow">
                    <select
                      id="iconName"
                      name="iconName"
                      value={selectedIcon}
                      onChange={(e) => setSelectedIcon(e.target.value)}
                      className="w-full px-4 py-3 bg-bg-snow border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-semibold text-text-dark cursor-pointer"
                    >
                      {AVAILABLE_ICONS.map((icon) => (
                        <option key={icon.name} value={icon.name}>
                          {icon.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <p className="text-xs text-text-muted mt-1">Ikon ini akan muncul di kartu layanan beranda dan halaman utama layanan.</p>
              </div>

              {/* Status Field */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-text-dark">Status Visibilitas</label>
                <label className="flex items-center gap-3 cursor-pointer p-4 border border-border-fine rounded-2xl hover:bg-bg-snow transition-colors">
                  <input
                    type="checkbox"
                    name="isActive"
                    value="true"
                    defaultChecked={editingService.isActive}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div>
                    <p className="font-semibold text-sm text-text-dark">Aktifkan Layanan</p>
                    <p className="text-xs text-text-muted">Jika dicentang, layanan ini akan muncul di halaman publik.</p>
                  </div>
                </label>
              </div>

              {/* Price List Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="priceList" className="text-sm font-bold text-text-dark">
                  Daftar Harga (Khusus Vaksin/Layanan Terkait)
                </label>
                <textarea
                  id="priceList"
                  name="priceList"
                  rows={4}
                  defaultValue={editingService.priceList || ''}
                  placeholder="Format: Nama Vaksin: Harga (contoh: Vaksin Influenza: 250000)&#10;Tulis satu jenis vaksin per baris..."
                  className="px-4 py-3 bg-bg-snow border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium resize-none"
                />
                <p className="text-xs text-text-muted">Masukkan daftar harga satu per baris dengan format `Nama: Harga`. Harga akan diurutkan otomatis dari yang termurah.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-border-fine">
            <button
              type="button"
              onClick={() => setEditingService(null)}
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
                'Simpan Layanan'
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
            <h1 className="font-heading font-extrabold text-3xl text-text-dark">Kelola Layanan Medis</h1>
            <p className="text-text-muted mt-2">Daftar poli, IGD, dan layanan kesehatan Klinik Pratama Aisyiyah.</p>
          </div>
          <button
            onClick={() => setEditingService({ id: 0, name: '', slug: '', description: '', iconName: 'Activity', isActive: true, createdAt: new Date(), updatedAt: new Date() })}
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Layanan Baru
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-border-fine shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-snow border-b border-border-fine">
                  <th className="py-4 px-6 font-semibold text-xs text-text-muted uppercase tracking-wider w-1/4">Layanan & Ikon</th>
                  <th className="py-4 px-6 font-semibold text-xs text-text-muted uppercase tracking-wider w-1/2">Deskripsi</th>
                  <th className="py-4 px-6 font-semibold text-xs text-text-muted uppercase tracking-wider w-1/8">Status</th>
                  <th className="py-4 px-6 font-semibold text-xs text-text-muted uppercase tracking-wider text-right w-1/8">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-fine">
                {services.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-text-muted">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Activity className="w-12 h-12 text-border-fine" />
                        <p>Belum ada data layanan medis. Silakan tambah baru.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  services.map((service) => (
                    <tr key={service.id} className="hover:bg-bg-snow/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary-light border border-primary/10 flex items-center justify-center text-primary shrink-0">
                            {renderIconPreview(service.iconName, "w-6 h-6")}
                          </div>
                          <div>
                            <p className="font-bold text-text-dark text-sm">{service.name}</p>
                            <p className="text-xs text-text-muted mt-0.5">slug: /{service.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm text-text-muted line-clamp-2 max-w-lg">{service.description}</p>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleStatus(service.id, service.isActive)}
                          disabled={togglePendingId === service.id}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${
                            service.isActive 
                              ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                              : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                          } disabled:opacity-50`}
                        >
                          {togglePendingId === service.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Power className="w-3 h-3" />
                          )}
                          {service.isActive ? 'Aktif' : 'Nonaktif'}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditingService(service)}
                            className="p-2 text-text-muted hover:text-primary hover:bg-primary-light rounded-xl transition-colors"
                            title="Edit Layanan"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => promptDelete(service.id)}
                            className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            title="Hapus Layanan"
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
          setServiceToDelete(null);
        }}
        onConfirm={executeDelete}
        title="Hapus Layanan Medis"
        message="Apakah Anda yakin ingin menghapus layanan ini? Tindakan ini akan menghapusnya secara permanen dari database dan tidak dapat dibatalkan."
        confirmText="Hapus"
        cancelText="Batal"
      />
    </>
  );
}
