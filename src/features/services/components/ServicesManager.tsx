'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveServiceAction, deleteServiceAction, toggleServiceStatusAction } from '@/app/actions/services';
import { 
  Plus, Edit2, Trash2, ArrowLeft, Loader2, AlertCircle, Power, X, ImageIcon, Check, Upload,
  HeartPulse, Smile, Baby, Syringe, Activity, ShieldAlert, Stethoscope, Heart, Award, ShieldCheck, HelpCircle,
  FileText, CheckCircle2
} from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { SERVICES_DATA } from '@/data/services';

function normalizeSlug(slug: string): string {
  const s = slug.toLowerCase().trim();
  if (s.includes('igd')) return 'igd';
  if (s.includes('kia') || s.includes('bersalin')) return 'poli-kia';
  if (s.includes('vaksin') || s.includes('haji')) return 'vaksin-haji';
  if (s.includes('gigi')) return 'poli-gigi';
  if (s.includes('napza') || s.includes('rehab')) return 'rehabilitasi-napza';
  if (s.includes('umum')) return 'poli-umum';
  return s;
}

function getInitialFormValues(service: Service) {
  const normSlug = normalizeSlug(service.slug);
  const staticData = SERVICES_DATA[normSlug] || SERVICES_DATA[service.slug];

  let operationalHours = service.operationalHours || '';
  if (!operationalHours && staticData?.operationalHours) {
    operationalHours = Object.entries(staticData.operationalHours)
      .map(([day, time]) => `${day}: ${time}`)
      .join('\n');
  }

  let facilities = service.facilities || '';
  if (!facilities && staticData?.facilities) {
    facilities = staticData.facilities.join('\n');
  }

  let purpose = service.purpose || '';
  if (!purpose && staticData?.purpose) {
    purpose = staticData.purpose;
  }

  let benefits = service.benefits || '';
  if (!benefits && staticData?.benefits) {
    benefits = staticData.benefits.join('\n');
  }

  let preparation = service.preparation || '';
  if (!preparation && staticData?.preparation) {
    preparation = staticData.preparation.join('\n');
  }

  let procedures = service.procedures || '';
  if (!procedures && staticData?.procedures) {
    procedures = staticData.procedures.map((p) => `${p.title} | ${p.description}`).join('\n');
  }

  let faq = service.faq || '';
  if (!faq && staticData?.faq) {
    faq = staticData.faq.map((f) => `${f.question} | ${f.answer}`).join('\n');
  }

  return {
    operationalHours,
    facilities,
    purpose,
    benefits,
    preparation,
    procedures,
    faq,
  };
}

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
  purpose?: string | null;
  benefits?: string | null;
  facilities?: string | null;
  operationalHours?: string | null;
  preparation?: string | null;
  procedures?: string | null;
  faq?: string | null;
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
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState('Activity');
  
  // Image States
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeRoomImage, setRemoveRoomImage] = useState(false);
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
      setRemoveRoomImage(false);

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
      setRemoveRoomImage(false);
      setExistingGallery([]);
      setNewGalleryPreviews([]);
    }
  }, [editingService]);

  // Auto-adjust all textarea heights to fit exact text content without excess empty space
  useEffect(() => {
    if (editingService !== null) {
      const resizeAllToContent = () => {
        const textareas = document.querySelectorAll<HTMLTextAreaElement>('form textarea');
        textareas.forEach((ta) => {
          ta.style.height = 'auto';
          ta.style.height = `${Math.max(ta.scrollHeight + 8, 90)}px`;
        });
      };
      
      const timer1 = setTimeout(resizeAllToContent, 40);
      const timer2 = setTimeout(resizeAllToContent, 200);
      window.addEventListener('resize', resizeAllToContent);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        window.removeEventListener('resize', resizeAllToContent);
      };
    }
  }, [editingService]);

  const handleAutoResize = (e: React.FormEvent<HTMLTextAreaElement> | React.FocusEvent<HTMLTextAreaElement>) => {
    const t = e.currentTarget;
    t.style.height = 'auto';
    t.style.height = `${Math.max(t.scrollHeight + 8, 90)}px`;
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const formData = new FormData(e.currentTarget);
      const res: any = await saveServiceAction(formData);

      if (res?.error) {
        setErrorMsg(res.error);
      } else {
        if (res?.service) {
          setServices((prev) => {
            const idx = prev.findIndex((s) => s.id === res.service.id);
            if (idx >= 0) {
              const updated = [...prev];
              updated[idx] = res.service;
              return updated;
            }
            return [res.service, ...prev];
          });
        }
        setSuccessMsg('Berhasil! Foto dan seluruh data layanan telah diperbarui.');
        setTimeout(() => setSuccessMsg(null), 6000);
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
      setServices((prev) => prev.filter((s) => s.id !== id));
      setSuccessMsg('Layanan dan seluruh berkas gambar terkait berhasil dihapus.');
      setTimeout(() => setSuccessMsg(null), 6000);
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
    const initialForm = getInitialFormValues(editingService);
    
    return (
      <div className="bg-white rounded-3xl border border-border-fine shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-border-fine bg-bg-snow flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-xl text-text-dark">
              {isEdit ? 'Edit Layanan Medis' : 'Tambah Layanan Baru'}
            </h3>
            <p className="text-sm text-text-muted mt-1">
              {isEdit ? 'Ubah informasi detail, foto galeri, jadwal operasional, dan fasilitas pendukung.' : 'Tambahkan jenis layanan kesehatan baru untuk dipublikasikan.'}
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

        <form key={editingService.id} onSubmit={handleSubmit} encType="multipart/form-data" className="p-6 md:p-10 flex flex-col gap-10">
          {isEdit && <input type="hidden" name="id" value={editingService.id} />}
          {removeRoomImage && <input type="hidden" name="removeRoomImage" value="true" />}
          
          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold border border-red-200">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* BAGIAN 1: INFORMASI UTAMA */}
          <div className="border-b border-border-fine pb-8">
            <h4 className="text-base md:text-lg font-bold text-primary mb-6 flex items-center gap-2.5">
              <Activity className="w-5 h-5" /> 1. Informasi Utama Layanan
            </h4>
            
            <div className="flex flex-col gap-6">
              {/* Header Fields in 3 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {/* Name Field */}
                <div className="flex flex-col gap-2.5">
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

                {/* Icon Selector Field */}
                <div className="flex flex-col gap-2.5">
                  <label htmlFor="iconName" className="text-sm font-bold text-text-dark">
                    Pilih Ikon Layanan <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-primary-light border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      {renderIconPreview(selectedIcon, "w-5 h-5")}
                    </div>
                    <div className="flex-grow">
                      <select
                        id="iconName"
                        name="iconName"
                        value={selectedIcon}
                        onChange={(e) => setSelectedIcon(e.target.value)}
                        className="w-full px-4 py-2.5 bg-bg-snow border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-semibold text-text-dark cursor-pointer"
                      >
                        {AVAILABLE_ICONS.map((icon) => (
                          <option key={icon.name} value={icon.name}>
                            {icon.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Status Field */}
                <div className="flex flex-col gap-2.5">
                  <label className="text-sm font-bold text-text-dark">Status Visibilitas</label>
                  <label className="flex items-center gap-3 cursor-pointer p-3 border border-border-fine rounded-2xl hover:bg-bg-snow transition-colors">
                    <input
                      type="checkbox"
                      name="isActive"
                      value="true"
                      defaultChecked={editingService.isActive}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <div>
                      <p className="font-semibold text-sm text-text-dark">Aktifkan Layanan</p>
                      <p className="text-xs text-text-muted mt-0.5">Tampil di halaman publik</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Description Field - Full Width */}
              <div className="flex flex-col gap-2.5">
                <label htmlFor="description" className="text-sm font-bold text-text-dark">
                  Deskripsi Layanan <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={3}
                  defaultValue={editingService.description}
                  onFocus={handleAutoResize}
                  onInput={handleAutoResize}
                  placeholder="Deskripsikan layanan secara lengkap, fasilitas utama, dan info penting lainnya..."
                  className="w-full px-5 py-3.5 bg-bg-snow border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium leading-relaxed resize-y overflow-hidden min-h-[90px]"
                />
              </div>

              {/* Purpose Field - Full Width */}
              <div className="flex flex-col gap-2.5">
                <label htmlFor="purpose" className="text-sm font-bold text-text-dark">
                  Tujuan Utama Medis
                </label>
                <textarea
                  id="purpose"
                  name="purpose"
                  rows={3}
                  defaultValue={initialForm.purpose}
                  onFocus={handleAutoResize}
                  onInput={handleAutoResize}
                  placeholder="Tujuan utama pelayanan ini, contoh: Memberikan perawatan medis darurat segera..."
                  className="w-full px-5 py-3.5 bg-bg-snow border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium leading-relaxed resize-y overflow-hidden min-h-[90px]"
                />
              </div>
            </div>
          </div>

          {/* BAGIAN 2: FOTO UTAMA & GALERI RUANGAN */}
          <div className="border-b border-border-fine pb-8">
            <h4 className="text-base md:text-lg font-bold text-primary mb-6 flex items-center gap-2.5">
              <ImageIcon className="w-5 h-5" /> 2. Foto Utama & Galeri Ruangan
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-start">
              {/* Room Image Field */}
              <div className="flex flex-col gap-2.5">
                <label htmlFor="roomImage" className="text-sm font-bold text-text-dark flex items-center justify-between">
                  <span>Foto Utama Layanan</span>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setRemoveRoomImage(true);
                      }}
                      className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Hapus Foto Utama
                    </button>
                  )}
                </label>

                {imagePreview ? (
                  <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-border-fine shadow-sm bg-slate-900/5 flex items-center justify-center p-2 group">
                    <img 
                      src={imagePreview} 
                      alt="Preview Foto Utama" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-full h-32 rounded-2xl border-2 border-dashed border-border-fine bg-bg-snow flex flex-col items-center justify-center gap-1.5 text-text-muted">
                    <ImageIcon className="w-7 h-7 text-border-fine" />
                    <p className="text-xs font-semibold">Belum ada foto utama yang dipilih</p>
                  </div>
                )}

                <input
                  id="roomImage"
                  name="roomImage"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImagePreview(URL.createObjectURL(file));
                      setRemoveRoomImage(false);
                    }
                  }}
                  className="px-4 py-3 bg-bg-snow border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs font-medium cursor-pointer"
                />
              </div>

              {/* Gallery Photos Field */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-text-dark flex items-center justify-between">
                  <span>Galeri Foto Ruangan & Fasilitas</span>
                  <span className="text-xs font-normal text-text-muted">Multiple upload</span>
                </label>

                {/* Existing Gallery */}
                {existingGallery.length > 0 && (
                  <div className="flex flex-col gap-2.5">
                    <p className="text-xs font-bold text-text-dark">Foto Galeri Aktif ({existingGallery.length}):</p>
                    <div className="grid grid-cols-4 gap-2.5">
                      {existingGallery.map((url, idx) => (
                        <div key={idx} className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-border-fine bg-slate-900/5 flex items-center justify-center p-1">
                          <img src={url} alt={`Galeri ${idx + 1}`} className="w-full h-full object-contain" />
                          <button
                            type="button"
                            onClick={() => setExistingGallery(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 hover:scale-110 transition-all shadow-md z-10"
                            title="Hapus foto dari galeri"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <input type="hidden" name="existingGallery" value={url} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Previews */}
                {newGalleryPreviews.length > 0 && (
                  <div className="flex flex-col gap-2.5">
                    <p className="text-xs font-bold text-primary">Foto Baru yang Akan Diunggah ({newGalleryPreviews.length}):</p>
                    <div className="grid grid-cols-4 gap-2.5">
                      {newGalleryPreviews.map((url, idx) => (
                        <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-primary/50 bg-slate-900/5 flex items-center justify-center p-1">
                          <img src={url} alt={`Preview Baru ${idx + 1}`} className="w-full h-full object-contain" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <input
                  id="galleryFiles"
                  name="galleryFiles"
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      const urls = Array.from(files).map(f => URL.createObjectURL(f));
                      setNewGalleryPreviews(urls);
                    } else {
                      setNewGalleryPreviews([]);
                    }
                  }}
                  className="px-4 py-3 bg-bg-snow border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs font-medium cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* BAGIAN 3: JADWAL OPERASIONAL & FASILITAS PENDUKUNG */}
          <div className="border-b border-border-fine pb-8">
            <h4 className="text-base md:text-lg font-bold text-primary mb-6 flex items-center gap-2.5">
              <Upload className="w-5 h-5" /> 3. Jadwal Operasional & Fasilitas Pendukung
            </h4>

            <div className="flex flex-col gap-8">
              {/* Operational Hours - Full Width */}
              <div className="flex flex-col gap-2.5">
                <label htmlFor="operationalHours" className="text-sm font-bold text-text-dark">
                  Jadwal Operasional
                </label>
                <textarea
                  id="operationalHours"
                  name="operationalHours"
                  rows={3}
                  defaultValue={initialForm.operationalHours}
                  onFocus={handleAutoResize}
                  onInput={handleAutoResize}
                  placeholder="Format satu per baris (Hari: Jam):&#10;Senin: 24 Jam&#10;Selasa: 24 Jam&#10;Rabu: 24 Jam..."
                  className="w-full px-5 py-3.5 bg-bg-snow border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium font-mono leading-relaxed resize-y overflow-hidden min-h-[90px]"
                />
                <p className="text-xs text-text-muted font-medium mt-1">Masukkan jam operasional per hari (format `Hari: Jam`).</p>
              </div>

              {/* Facilities - Full Width */}
              <div className="flex flex-col gap-2.5">
                <label htmlFor="facilities" className="text-sm font-bold text-text-dark">
                  Fasilitas Pendukung
                </label>
                <textarea
                  id="facilities"
                  name="facilities"
                  rows={3}
                  defaultValue={initialForm.facilities}
                  onFocus={handleAutoResize}
                  onInput={handleAutoResize}
                  placeholder="Tulis 1 nama fasilitas per baris:&#10;Ruang Resusitasi Jantung-Paru&#10;Ruang Bedah Minor&#10;Ambulans 24 Jam"
                  className="w-full px-5 py-3.5 bg-bg-snow border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium leading-relaxed resize-y overflow-hidden min-h-[90px]"
                />
                <p className="text-xs text-text-muted font-medium mt-1">Tulis 1 fasilitas per baris. Ikon disesuaikan otomatis.</p>
              </div>
            </div>
          </div>

          {/* BAGIAN 4: DETAIL PELAYANAN & PERSIAPAN */}
          <div className="border-b border-border-fine pb-8">
            <h4 className="text-base md:text-lg font-bold text-primary mb-6 flex items-center gap-2.5">
              <FileText className="w-5 h-5" /> 4. Detail Pelayanan, Keunggulan & Persiapan
            </h4>

            <div className="flex flex-col gap-8">
              {/* Benefits - Full Width */}
              <div className="flex flex-col gap-2.5">
                <label htmlFor="benefits" className="text-sm font-bold text-text-dark">
                  Manfaat & Keunggulan Layanan
                </label>
                <textarea
                  id="benefits"
                  name="benefits"
                  rows={3}
                  defaultValue={initialForm.benefits}
                  onFocus={handleAutoResize}
                  onInput={handleAutoResize}
                  placeholder="Tulis 1 manfaat per baris:&#10;Pelayanan non-stop 24 jam&#10;Tim medis bersertifikat"
                  className="w-full px-5 py-3.5 bg-bg-snow border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium leading-relaxed resize-y overflow-hidden min-h-[90px]"
                />
                <p className="text-xs text-text-muted font-medium mt-1">Poin keunggulan layanan, 1 per baris.</p>
              </div>

              {/* Preparation - Full Width */}
              <div className="flex flex-col gap-2.5">
                <label htmlFor="preparation" className="text-sm font-bold text-text-dark">
                  Persiapan Berkunjung Pasien
                </label>
                <textarea
                  id="preparation"
                  name="preparation"
                  rows={3}
                  defaultValue={initialForm.preparation}
                  onFocus={handleAutoResize}
                  onInput={handleAutoResize}
                  placeholder="Tulis 1 instruksi per baris:&#10;Membawa KTP asli / Kartu Keluarga&#10;Membawa kartu BPJS"
                  className="w-full px-5 py-3.5 bg-bg-snow border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium leading-relaxed resize-y overflow-hidden min-h-[90px]"
                />
                <p className="text-xs text-text-muted font-medium mt-1">Petunjuk persiapan pasien sebelum berkunjung.</p>
              </div>
            </div>
          </div>

          {/* BAGIAN 5: TINDAKAN MEDIS, FAQ, DAN HARGA */}
          <div className="pb-6">
            <h4 className="text-base md:text-lg font-bold text-primary mb-6 flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5" /> 5. Pelayanan & Tindakan Medis, FAQ, & Harga
            </h4>

            <div className="flex flex-col gap-8">
              {/* Procedures - FULL WIDTH */}
              <div className="flex flex-col gap-2.5">
                <label htmlFor="procedures" className="text-sm font-bold text-text-dark">
                  Pelayanan & Tindakan Medis
                </label>
                <textarea
                  id="procedures"
                  name="procedures"
                  rows={3}
                  defaultValue={initialForm.procedures}
                  onFocus={handleAutoResize}
                  onInput={handleAutoResize}
                  placeholder="Format per baris: Judul | Deskripsi&#10;Resusitasi Jantung Paru | Penyelamatan jiwa...&#10;Bedah Minor | Penjahitan luka..."
                  className="w-full px-5 py-3.5 bg-bg-snow border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium leading-relaxed resize-y overflow-hidden min-h-[90px]"
                />
                <p className="text-xs text-text-muted font-medium mt-1">Tulis `Judul | Deskripsi` 1 tindakan per baris.</p>
              </div>

              {/* FAQ - FULL WIDTH */}
              <div className="flex flex-col gap-2.5">
                <label htmlFor="faq" className="text-sm font-bold text-text-dark">
                  Tanya Jawab Layanan (FAQ)
                </label>
                <textarea
                  id="faq"
                  name="faq"
                  rows={3}
                  defaultValue={initialForm.faq}
                  onFocus={handleAutoResize}
                  onInput={handleAutoResize}
                  placeholder="Format per baris: Pertanyaan | Jawaban&#10;Apakah IGD 24 jam? | Ya, IGD 24 jam nonstop."
                  className="w-full px-5 py-3.5 bg-bg-snow border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium leading-relaxed resize-y overflow-hidden min-h-[90px]"
                />
                <p className="text-xs text-text-muted font-medium mt-1">Tulis `Pertanyaan | Jawaban` 1 FAQ per baris.</p>
              </div>

              {/* Price List Field - FULL WIDTH */}
              <div className="flex flex-col gap-2.5">
                <label htmlFor="priceList" className="text-sm font-bold text-text-dark">
                  Daftar Harga (Khusus Vaksin / Layanan Terkait)
                </label>
                <textarea
                  id="priceList"
                  name="priceList"
                  rows={3}
                  defaultValue={editingService.priceList || ''}
                  onFocus={handleAutoResize}
                  onInput={handleAutoResize}
                  placeholder="Format: Nama: Harga&#10;Vaksin Influenza: 250000"
                  className="w-full px-5 py-3.5 bg-bg-snow border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium leading-relaxed resize-y overflow-hidden min-h-[90px]"
                />
                <p className="text-xs text-text-muted font-medium mt-1">Format: `Nama Vaksin: Harga` 1 per baris.</p>
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
                'Simpan Seluruh Data Layanan'
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
            <p className="text-text-muted mt-2">Daftar poli, IGD, dan layanan kesehatan Klinik Aisyiyah Pangkajene.</p>
          </div>
          <button
            onClick={() => setEditingService({ id: 0, name: '', slug: '', description: '', iconName: 'Activity', isActive: true, createdAt: new Date(), updatedAt: new Date() })}
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Layanan Baru
          </button>
        </div>

        {successMsg && (
          <div className="p-4 bg-green-50 text-green-700 rounded-2xl flex items-center gap-3 text-sm font-bold border border-green-200 shadow-sm">
            <Check className="w-5 h-5 shrink-0 text-green-600" />
            {successMsg}
          </div>
        )}

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
        message="Apakah Anda yakin ingin menghapus layanan ini? Tindakan ini akan menghapusnya secara permanen dari database dan seluruh file gambar fisiknya di server akan terhapus."
        confirmText="Hapus"
        cancelText="Batal"
      />
    </>
  );
}
