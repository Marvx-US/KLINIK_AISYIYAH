'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveServiceAction, deleteServiceAction, toggleServiceStatusAction } from '@/app/actions/services';
import { 
  Plus, Edit2, Trash2, ArrowLeft, Loader2, AlertCircle, Power, X, ImageIcon, Check, Upload,
  HeartPulse, Smile, Baby, Syringe, Activity, ShieldAlert, Stethoscope, Heart, Award, ShieldCheck, HelpCircle,
  FileText, CheckCircle2, Info, Code2, Sparkles
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

  let priceList = service.priceList || '';
  if (!priceList && staticData?.vaccinePrices) {
    priceList = staticData.vaccinePrices.map((v) => `${v.name}: ${v.price}`).join('\n');
  }

  return {
    operationalHours,
    facilities,
    purpose,
    benefits,
    preparation,
    procedures,
    faq,
    priceList,
  };
}

export interface ProcedureItem {
  id: string;
  title: string;
  description: string;
}

export interface FaqItemState {
  id: string;
  question: string;
  answer: string;
}

export interface PriceItemState {
  id: string;
  name: string;
  price: string;
}

function parseProceduresToItems(raw: string): ProcedureItem[] {
  if (!raw || !raw.trim()) return [];
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line, idx) => {
      const parts = line.split('|');
      return {
        id: `proc-${idx}-${Math.random().toString(36).slice(2, 7)}`,
        title: parts[0]?.trim() || '',
        description: parts.slice(1).join('|').trim() || '',
      };
    });
}

function serializeProcedures(items: ProcedureItem[]): string {
  return items
    .filter((item) => item.title.trim() || item.description.trim())
    .map((item) => `${item.title.trim()} | ${item.description.trim()}`)
    .join('\n');
}

function parseFaqToItems(raw: string): FaqItemState[] {
  if (!raw || !raw.trim()) return [];
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line, idx) => {
      const parts = line.split('|');
      return {
        id: `faq-${idx}-${Math.random().toString(36).slice(2, 7)}`,
        question: parts[0]?.trim() || '',
        answer: parts.slice(1).join('|').trim() || '',
      };
    });
}

function serializeFaq(items: FaqItemState[]): string {
  return items
    .filter((item) => item.question.trim() || item.answer.trim())
    .map((item) => `${item.question.trim()} | ${item.answer.trim()}`)
    .join('\n');
}

function parsePriceListToItems(raw: string): PriceItemState[] {
  if (!raw || !raw.trim()) return [];
  const items: PriceItemState[] = [];
  const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.toLowerCase().startsWith('format:')) continue;

    if (line.includes(':')) {
      const colonIdx = line.lastIndexOf(':');
      const name = line.substring(0, colonIdx).trim();
      const price = line.substring(colonIdx + 1).replace(/[^0-9]/g, '').trim();
      if (name) {
        items.push({ id: `price-${i}-${Math.random().toString(36).slice(2, 7)}`, name, price });
        continue;
      }
    }

    const rpMatch = line.match(/^(.+?)\s+Rp\.?\s*([\d.,]+)\s*$/i);
    if (rpMatch) {
      items.push({
        id: `price-${i}-${Math.random().toString(36).slice(2, 7)}`,
        name: rpMatch[1].trim(),
        price: rpMatch[2].replace(/[^0-9]/g, ''),
      });
      continue;
    }

    items.push({ id: `price-${i}-${Math.random().toString(36).slice(2, 7)}`, name: line, price: '' });
  }
  return items;
}

function serializePriceList(items: PriceItemState[]): string {
  return items
    .filter((item) => item.name.trim())
    .map((item) => {
      const cleanPrice = item.price.replace(/[^0-9]/g, '').trim();
      return `${item.name.trim()}: ${cleanPrice || '0'}`;
    })
    .join('\n');
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
  bannerImage?: string | null;
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
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [removeBannerImage, setRemoveBannerImage] = useState(false);
  const [existingGallery, setExistingGallery] = useState<string[]>([]);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);

  // Section 5 Interactive List States
  const [proceduresList, setProceduresList] = useState<ProcedureItem[]>([]);
  const [proceduresMode, setProceduresMode] = useState<'cards' | 'raw'>('cards');
  const [rawProcedures, setRawProcedures] = useState('');

  const [faqList, setFaqList] = useState<FaqItemState[]>([]);
  const [faqMode, setFaqMode] = useState<'cards' | 'raw'>('cards');
  const [rawFaq, setRawFaq] = useState('');

  const [priceItemsList, setPriceItemsList] = useState<PriceItemState[]>([]);
  const [priceListMode, setPriceListMode] = useState<'cards' | 'raw'>('cards');
  const [rawPriceList, setRawPriceList] = useState('');

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
      setBannerPreview(editingService.bannerImage || null);
      setRemoveBannerImage(false);

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

      // Initialize Section 5 Structured Items
      const initVals = getInitialFormValues(editingService);

      const parsedProcedures = parseProceduresToItems(initVals.procedures);
      setProceduresList(parsedProcedures);
      setRawProcedures(initVals.procedures);
      setProceduresMode('cards');

      const parsedFaq = parseFaqToItems(initVals.faq);
      setFaqList(parsedFaq);
      setRawFaq(initVals.faq);
      setFaqMode('cards');

      const parsedPrices = parsePriceListToItems(initVals.priceList);
      setPriceItemsList(parsedPrices);
      setRawPriceList(initVals.priceList);
      setPriceListMode('cards');
    } else {
      setImagePreview(null);
      setRemoveRoomImage(false);
      setBannerPreview(null);
      setRemoveBannerImage(false);
      setExistingGallery([]);
      setNewGalleryPreviews([]);
      setProceduresList([]);
      setRawProcedures('');
      setFaqList([]);
      setRawFaq('');
      setPriceItemsList([]);
      setRawPriceList('');
    }
  }, [editingService]);

  // Procedures item handlers
  const addProcedure = () => {
    setProceduresList((prev) => [
      ...prev,
      { id: `proc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, title: '', description: '' },
    ]);
  };
  const updateProcedure = (index: number, field: 'title' | 'description', value: string) => {
    setProceduresList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };
  const removeProcedure = (index: number) => {
    setProceduresList((prev) => prev.filter((_, i) => i !== index));
  };
  const toggleProceduresMode = () => {
    if (proceduresMode === 'cards') {
      setRawProcedures(serializeProcedures(proceduresList));
      setProceduresMode('raw');
    } else {
      setProceduresList(parseProceduresToItems(rawProcedures));
      setProceduresMode('cards');
    }
  };

  // FAQ item handlers
  const addFaq = () => {
    setFaqList((prev) => [
      ...prev,
      { id: `faq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, question: '', answer: '' },
    ]);
  };
  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    setFaqList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };
  const removeFaq = (index: number) => {
    setFaqList((prev) => prev.filter((_, i) => i !== index));
  };
  const toggleFaqMode = () => {
    if (faqMode === 'cards') {
      setRawFaq(serializeFaq(faqList));
      setFaqMode('raw');
    } else {
      setFaqList(parseFaqToItems(rawFaq));
      setFaqMode('cards');
    }
  };

  // Price List item handlers
  const addPriceItem = () => {
    setPriceItemsList((prev) => [
      ...prev,
      { id: `price-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, name: '', price: '' },
    ]);
  };
  const updatePriceItem = (index: number, field: 'name' | 'price', value: string) => {
    setPriceItemsList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };
  const removePriceItem = (index: number) => {
    setPriceItemsList((prev) => prev.filter((_, i) => i !== index));
  };
  const togglePriceListMode = () => {
    if (priceListMode === 'cards') {
      setRawPriceList(serializePriceList(priceItemsList));
      setPriceListMode('raw');
    } else {
      setPriceItemsList(parsePriceListToItems(rawPriceList));
      setPriceListMode('cards');
    }
  };

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

          {/* BAGIAN 2: FOTO & MEDIA LAYANAN */}
          <div className="border-b border-border-fine pb-8">
            <h4 className="text-base md:text-lg font-bold text-primary mb-4 flex items-center gap-2.5">
              <ImageIcon className="w-5 h-5" /> 2. Foto Banner, Kartu Utama & Galeri Ruangan
            </h4>

            {/* Info Panduan Penempatan Foto */}
            <div className="mb-6 p-4 bg-teal-50/80 border border-teal-200/80 rounded-2xl flex items-start gap-3.5 text-xs text-teal-900 leading-relaxed">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-sm text-teal-950">Panduan Penempatan Gambar pada Halaman Layanan:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-2">
                  <div className="p-2.5 bg-white/80 rounded-xl border border-teal-100">
                    <span className="font-bold text-primary block">1. Banner Latar Atas</span>
                    <span className="text-text-muted text-[11px]">Latar belakang gelap (Hero Banner) di paling atas halaman layanan.</span>
                  </div>
                  <div className="p-2.5 bg-white/80 rounded-xl border border-teal-100">
                    <span className="font-bold text-primary block">2. Foto Kartu Utama / Dokter</span>
                    <span className="text-text-muted text-[11px]">Tampil di kartu samping judul & deskripsi (&ldquo;Deskripsi Lengkap & Tujuan Medis&rdquo;).</span>
                  </div>
                  <div className="p-2.5 bg-white/80 rounded-xl border border-teal-100">
                    <span className="font-bold text-primary block">3. Galeri Foto Ruangan</span>
                    <span className="text-text-muted text-[11px]">Kumpulan foto di bagian &ldquo;Galeri Foto Ruangan & Fasilitas&rdquo; (bisa diklik/di-zoom).</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* SLOT 1: Banner Image (Hero Background) */}
              <div className="flex flex-col gap-2.5 bg-bg-snow/60 p-5 rounded-2xl border border-border-fine">
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="bannerImage" className="text-sm font-bold text-text-dark flex items-center gap-2">
                      <span>1. Foto Banner Latar Atas</span>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">Hero Banner</span>
                    </label>
                    <p className="text-xs text-text-muted mt-0.5">Latar belakang header atas halaman (Rasio lanskap disarankan 16:9 atau 21:9)</p>
                  </div>
                  {bannerPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setBannerPreview(null);
                        setRemoveBannerImage(true);
                      }}
                      className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Hapus
                    </button>
                  )}
                </div>

                {bannerPreview ? (
                  <div className="relative w-full h-44 rounded-xl overflow-hidden border border-border-fine shadow-sm bg-slate-950 flex items-center justify-center group">
                    <img 
                      src={bannerPreview} 
                      alt="Preview Banner Atas" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-semibold px-3 py-1 bg-black/60 rounded-full">Preview Hero Banner</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-36 rounded-xl border-2 border-dashed border-border-fine bg-white flex flex-col items-center justify-center gap-1.5 text-text-muted">
                    <ImageIcon className="w-7 h-7 text-border-fine" />
                    <p className="text-xs font-semibold">Belum ada banner latar kustom</p>
                    <p className="text-[10px] text-text-muted">(Jika kosong, sistem akan otomatis memakai foto pertama dari galeri)</p>
                  </div>
                )}

                {removeBannerImage && <input type="hidden" name="removeBannerImage" value="true" />}

                <input
                  id="bannerImage"
                  name="bannerImage"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setBannerPreview(URL.createObjectURL(file));
                      setRemoveBannerImage(false);
                    }
                  }}
                  className="px-4 py-2.5 bg-white border border-border-fine rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs font-medium cursor-pointer"
                />
              </div>

              {/* SLOT 2: Room Image (Kartu Utama / Dokter) */}
              <div className="flex flex-col gap-2.5 bg-bg-snow/60 p-5 rounded-2xl border border-border-fine">
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="roomImage" className="text-sm font-bold text-text-dark flex items-center gap-2">
                      <span>2. Foto Kartu Utama / Dokter</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">Kartu Deskripsi</span>
                    </label>
                    <p className="text-xs text-text-muted mt-0.5">Tampil di kartu samping deskripsi & tujuan medis (Rasio disarankan 4:3)</p>
                  </div>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setRemoveRoomImage(true);
                      }}
                      className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Hapus
                    </button>
                  )}
                </div>

                {imagePreview ? (
                  <div className="relative w-full h-44 rounded-xl overflow-hidden border border-border-fine shadow-sm bg-white flex items-center justify-center p-2 group">
                    <img 
                      src={imagePreview} 
                      alt="Preview Foto Utama" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-full h-36 rounded-xl border-2 border-dashed border-border-fine bg-white flex flex-col items-center justify-center gap-1.5 text-text-muted">
                    <ImageIcon className="w-7 h-7 text-border-fine" />
                    <p className="text-xs font-semibold">Belum ada foto kartu utama/dokter</p>
                    <p className="text-[10px] text-text-muted">(Jika kosong, sistem menggunakan foto bawaan layanan)</p>
                  </div>
                )}

                {removeRoomImage && <input type="hidden" name="removeRoomImage" value="true" />}

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
                  className="px-4 py-2.5 bg-white border border-border-fine rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs font-medium cursor-pointer"
                />
              </div>
            </div>

            {/* SLOT 3: Gallery Photos Field — Foto Ruangan & Fasilitas (Multiple Upload) */}
            <div className="mt-6 flex flex-col gap-3 bg-bg-snow/60 p-5 rounded-2xl border border-border-fine">
              <label className="text-sm font-bold text-text-dark flex items-center justify-between">
                <div>
                  <span className="flex items-center gap-2">
                    <span>3. Galeri Foto Ruangan & Fasilitas</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full">Grid Galeri Bawah</span>
                  </span>
                  <p className="text-xs text-text-muted font-normal mt-0.5">Unggah beberapa foto dokumentasi ruangan medis sekaligus untuk galeri di bagian bawah halaman.</p>
                </div>
                <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full shrink-0">Multiple upload</span>
              </label>

              {/* Existing Gallery */}
              {existingGallery.length > 0 && (
                <div className="flex flex-col gap-2.5 mt-2">
                  <p className="text-xs font-bold text-text-dark">Foto Galeri Aktif ({existingGallery.length}):</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {existingGallery.map((url, idx) => (
                      <div key={idx} className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-border-fine bg-slate-900/5 flex items-center justify-center p-1 shadow-xs">
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
                <div className="flex flex-col gap-2.5 mt-2">
                  <p className="text-xs font-bold text-primary">Foto Baru yang Akan Diunggah ({newGalleryPreviews.length}):</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {newGalleryPreviews.map((url, idx) => (
                      <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-primary/50 bg-slate-900/5 flex items-center justify-center p-1 shadow-xs">
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
                className="mt-1 px-4 py-3 bg-white border border-border-fine rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs font-medium cursor-pointer"
              />
            </div>
          </div>

          {/* BAGIAN 3: JADWAL OPERASIONAL & FASILITAS PENDUKUNG */}
          <div className="border-b border-border-fine pb-8">
            <h4 className="text-base md:text-lg font-bold text-primary mb-6 flex items-center gap-2.5">
              <Upload className="w-5 h-5" /> 3. Jadwal Operasional & Fasilitas Pendukung
            </h4>

            <div className="flex flex-col gap-8">
              {/* Operational Hours - Hanya untuk Poli (Poli Umum, Poli KIA, Poli Gigi) */}
              {(['poli-umum', 'poli-kia', 'poli-gigi'].includes(editingService.slug?.toLowerCase() || '') || editingService.name.toLowerCase().includes('poli')) ? (
                <div className="flex flex-col gap-2.5">
                  <label htmlFor="operationalHours" className="text-sm font-bold text-text-dark">
                    Jadwal Operasional / Jam Praktek
                  </label>
                  <textarea
                    id="operationalHours"
                    name="operationalHours"
                    rows={3}
                    defaultValue={initialForm.operationalHours}
                    onFocus={handleAutoResize}
                    onInput={handleAutoResize}
                    placeholder="Format satu per baris (Hari: Jam):&#10;Senin: 13.00 - 20.00 WITA&#10;Selasa: 13.00 - 20.00 WITA..."
                    className="w-full px-5 py-3.5 bg-bg-snow border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium font-mono leading-relaxed resize-y overflow-hidden min-h-[90px]"
                  />
                  <p className="text-xs text-text-muted font-medium mt-1">Masukkan jam praktek per hari (format `Hari: Jam`).</p>
                </div>
              ) : (
                <input type="hidden" name="operationalHours" value="" />
              )}

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

          {/* BAGIAN 5: TINDAKAN MEDIS, FAQ, DAN HARGA (INTERACTIVE CARD BUILDER) */}
          <div className="pb-6">
            <h4 className="text-base md:text-lg font-bold text-primary mb-6 flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5" /> 5. Pelayanan & Tindakan Medis, FAQ, & Daftar Harga
            </h4>

            <div className="flex flex-col gap-10">
              {/* 1. PROCEDURES BUILDER */}
              <div className="flex flex-col gap-3.5 bg-bg-snow/60 p-5 md:p-6 rounded-3xl border border-border-fine">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-fine/60 pb-3">
                  <div>
                    <label className="text-sm font-bold text-text-dark flex items-center gap-2">
                      <span>Pelayanan & Tindakan Medis</span>
                      <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">
                        {proceduresList.length} Tindakan
                      </span>
                    </label>
                    <p className="text-xs text-text-muted mt-0.5">
                      Daftar tindakan/prosedur yang ditangani pada layanan ini (muncul di kartu &ldquo;Pelayanan & Tindakan Medis&rdquo;).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleProceduresMode}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-border-fine hover:bg-white text-text-muted hover:text-text-dark flex items-center gap-1.5 transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
                  >
                    {proceduresMode === 'cards' ? (
                      <>
                        <Code2 className="w-3.5 h-3.5 text-primary" />
                        <span>Mode Teks Cepat</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        <span>Mode Kartu Mudah</span>
                      </>
                    )}
                  </button>
                </div>

                <input
                  type="hidden"
                  name="procedures"
                  value={proceduresMode === 'cards' ? serializeProcedures(proceduresList) : rawProcedures}
                />

                {proceduresMode === 'cards' ? (
                  <div className="flex flex-col gap-3">
                    {proceduresList.length === 0 ? (
                      <div className="py-8 text-center bg-white rounded-2xl border border-dashed border-border-fine text-text-muted text-xs flex flex-col items-center justify-center gap-2">
                        <Activity className="w-6 h-6 text-border-fine" />
                        <p>Belum ada tindakan medis yang ditambahkan.</p>
                      </div>
                    ) : (
                      proceduresList.map((item, index) => (
                        <div
                          key={item.id}
                          className="p-4 bg-white rounded-2xl border border-border-fine shadow-xs hover:border-primary/40 transition-all flex flex-col gap-3 group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                              Tindakan #{index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeProcedure(index)}
                              className="text-text-muted hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                              title="Hapus Tindakan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="md:col-span-1">
                              <label className="text-[11px] font-bold text-text-dark mb-1 block">Nama Tindakan / Judul</label>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateProcedure(index, 'title', e.target.value)}
                                placeholder="Contoh: Resusitasi Jantung Paru (RJP)"
                                className="w-full px-3.5 py-2.5 bg-bg-snow border border-border-fine rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="text-[11px] font-bold text-text-dark mb-1 block">Deskripsi Tindakan Medis</label>
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) => updateProcedure(index, 'description', e.target.value)}
                                placeholder="Contoh: Tindakan penyelamatan jiwa untuk mengembalikan sirkulasi darah dan fungsi napas..."
                                className="w-full px-3.5 py-2.5 bg-bg-snow border border-border-fine rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    )}

                    <button
                      type="button"
                      onClick={addProcedure}
                      className="w-full py-3.5 border-2 border-dashed border-primary/30 hover:border-primary text-primary hover:bg-primary/5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer mt-1"
                    >
                      <Plus className="w-4 h-4" />
                      Tambah Tindakan Medis Baru
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <textarea
                      rows={5}
                      value={rawProcedures}
                      onChange={(e) => setRawProcedures(e.target.value)}
                      placeholder="Format per baris: Judul | Deskripsi&#10;Resusitasi Jantung Paru | Penyelamatan jiwa...&#10;Bedah Minor | Penjahitan luka..."
                      className="w-full px-5 py-3.5 bg-white border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium leading-relaxed font-mono resize-y min-h-[120px]"
                    />
                    <p className="text-[11px] text-text-muted font-medium">Format teks cepat: <code>Judul | Deskripsi</code> (1 tindakan per baris).</p>
                  </div>
                )}
              </div>

              {/* 2. FAQ BUILDER */}
              <div className="flex flex-col gap-3.5 bg-bg-snow/60 p-5 md:p-6 rounded-3xl border border-border-fine">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-fine/60 pb-3">
                  <div>
                    <label className="text-sm font-bold text-text-dark flex items-center gap-2">
                      <span>Tanya Jawab Layanan (FAQ)</span>
                      <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">
                        {faqList.length} FAQ
                      </span>
                    </label>
                    <p className="text-xs text-text-muted mt-0.5">
                      Pertanyaan umum dan jawaban seputar layanan ini untuk mempermudah calon pasien.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleFaqMode}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-border-fine hover:bg-white text-text-muted hover:text-text-dark flex items-center gap-1.5 transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
                  >
                    {faqMode === 'cards' ? (
                      <>
                        <Code2 className="w-3.5 h-3.5 text-primary" />
                        <span>Mode Teks Cepat</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        <span>Mode Kartu Mudah</span>
                      </>
                    )}
                  </button>
                </div>

                <input
                  type="hidden"
                  name="faq"
                  value={faqMode === 'cards' ? serializeFaq(faqList) : rawFaq}
                />

                {faqMode === 'cards' ? (
                  <div className="flex flex-col gap-3">
                    {faqList.length === 0 ? (
                      <div className="py-8 text-center bg-white rounded-2xl border border-dashed border-border-fine text-text-muted text-xs flex flex-col items-center justify-center gap-2">
                        <HelpCircle className="w-6 h-6 text-border-fine" />
                        <p>Belum ada pertanyaan FAQ yang ditambahkan.</p>
                      </div>
                    ) : (
                      faqList.map((item, index) => (
                        <div
                          key={item.id}
                          className="p-4 bg-white rounded-2xl border border-border-fine shadow-xs hover:border-primary/40 transition-all flex flex-col gap-3 group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                              Pertanyaan #{index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFaq(index)}
                              className="text-text-muted hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                              title="Hapus FAQ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="flex flex-col gap-2.5">
                            <div>
                              <label className="text-[11px] font-bold text-text-dark mb-1 block">Pertanyaan (Question)</label>
                              <input
                                type="text"
                                value={item.question}
                                onChange={(e) => updateFaq(index, 'question', e.target.value)}
                                placeholder="Contoh: Apakah IGD melayani pasien non-darurat?"
                                className="w-full px-3.5 py-2.5 bg-bg-snow border border-border-fine rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-text-dark mb-1 block">Jawaban (Answer)</label>
                              <textarea
                                rows={2}
                                value={item.answer}
                                onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                                placeholder="Contoh: IGD memprioritaskan kondisi gawat darurat medis. Untuk kasus non-darurat, disarankan periksa ke poli umum..."
                                className="w-full px-3.5 py-2.5 bg-bg-snow border border-border-fine rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    )}

                    <button
                      type="button"
                      onClick={addFaq}
                      className="w-full py-3.5 border-2 border-dashed border-primary/30 hover:border-primary text-primary hover:bg-primary/5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer mt-1"
                    >
                      <Plus className="w-4 h-4" />
                      Tambah Pertanyaan FAQ Baru
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <textarea
                      rows={5}
                      value={rawFaq}
                      onChange={(e) => setRawFaq(e.target.value)}
                      placeholder="Format per baris: Pertanyaan | Jawaban&#10;Apakah IGD 24 jam? | Ya, IGD 24 jam nonstop."
                      className="w-full px-5 py-3.5 bg-white border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium leading-relaxed font-mono resize-y min-h-[120px]"
                    />
                    <p className="text-[11px] text-text-muted font-medium">Format teks cepat: <code>Pertanyaan | Jawaban</code> (1 FAQ per baris).</p>
                  </div>
                )}
              </div>

              {/* 3. PRICE LIST BUILDER */}
              <div className="flex flex-col gap-3.5 bg-bg-snow/60 p-5 md:p-6 rounded-3xl border border-border-fine">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-fine/60 pb-3">
                  <div>
                    <label className="text-sm font-bold text-text-dark flex items-center gap-2">
                      <span>Daftar Estimasi Tarif & Harga</span>
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                        {priceItemsList.length} Item Tarif
                      </span>
                    </label>
                    <p className="text-xs text-text-muted mt-0.5">
                      Daftar biaya paket tindakan, vaksinasi, atau pemeriksaan (otomatis ditampilkan tabel harga di halaman layanan).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={togglePriceListMode}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-border-fine hover:bg-white text-text-muted hover:text-text-dark flex items-center gap-1.5 transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
                  >
                    {priceListMode === 'cards' ? (
                      <>
                        <Code2 className="w-3.5 h-3.5 text-primary" />
                        <span>Mode Teks Cepat</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        <span>Mode Kartu Mudah</span>
                      </>
                    )}
                  </button>
                </div>

                <input
                  type="hidden"
                  name="priceList"
                  value={priceListMode === 'cards' ? serializePriceList(priceItemsList) : rawPriceList}
                />

                {priceListMode === 'cards' ? (
                  <div className="flex flex-col gap-2.5">
                    {priceItemsList.length === 0 ? (
                      <div className="py-8 text-center bg-white rounded-2xl border border-dashed border-border-fine text-text-muted text-xs flex flex-col items-center justify-center gap-2">
                        <Activity className="w-6 h-6 text-border-fine" />
                        <p>Belum ada item tarif / harga yang ditambahkan.</p>
                      </div>
                    ) : (
                      priceItemsList.map((item, index) => (
                        <div
                          key={item.id}
                          className="p-3.5 bg-white rounded-2xl border border-border-fine shadow-xs hover:border-primary/40 transition-all flex items-center gap-3 group"
                        >
                          <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full shrink-0">
                            #{index + 1}
                          </span>
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => updatePriceItem(index, 'name', e.target.value)}
                                placeholder="Nama Tindakan / Vaksin (Contoh: Vaksin Influenza)"
                                className="w-full px-3.5 py-2.5 bg-bg-snow border border-border-fine rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                              />
                            </div>
                            <div className="relative flex items-center">
                              <span className="absolute left-3.5 text-xs font-bold text-primary">Rp</span>
                              <input
                                type="number"
                                min="0"
                                step="1000"
                                value={item.price}
                                onChange={(e) => updatePriceItem(index, 'price', e.target.value)}
                                placeholder="Nominal Angka (Contoh: 250000)"
                                className="w-full pl-10 pr-3.5 py-2.5 bg-bg-snow border border-border-fine rounded-xl text-xs font-bold text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removePriceItem(index)}
                            className="text-text-muted hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
                            title="Hapus Tarif Ini"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}

                    <button
                      type="button"
                      onClick={addPriceItem}
                      className="w-full py-3.5 border-2 border-dashed border-primary/30 hover:border-primary text-primary hover:bg-primary/5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer mt-1"
                    >
                      <Plus className="w-4 h-4" />
                      Tambah Item Tarif / Harga Baru
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <textarea
                      rows={5}
                      value={rawPriceList}
                      onChange={(e) => setRawPriceList(e.target.value)}
                      placeholder="Format: Nama: Harga&#10;Vaksin Influenza: 250000&#10;Vaksin Meningitis: 350000"
                      className="w-full px-5 py-3.5 bg-white border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium leading-relaxed font-mono resize-y min-h-[120px]"
                    />
                    <p className="text-[11px] text-text-muted font-medium">Format teks cepat: <code>Nama Tindakan: Harga</code> (1 item per baris).</p>
                  </div>
                )}
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
