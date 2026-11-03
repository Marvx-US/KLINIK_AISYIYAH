'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { saveService as saveServiceAction } from '../actions/save-service';
import { type Service, type ProcedureItem, type FaqItemState, type PriceItemState } from '../types';
import {
  getInitialFormValues,
  parseProceduresToItems,
  parseFaqToItems,
  parsePriceListToItems,
} from '../utils/service-serializers';
import ServiceGeneralSection from './service-general-section';
import ServiceMediaSection from './service-media-section';
import ServiceClinicalSection from './service-clinical-section';
import ServiceProceduresEditor from './service-procedures-editor';
import ServiceFaqEditor from './service-faq-editor';
import ServicePricesEditor from './service-prices-editor';

interface ServiceFormViewProps {
  service: Service;
  onCancel: () => void;
  onSuccess: (savedService?: Service) => void;
}

export default function ServiceFormView({
  service,
  onCancel,
  onSuccess,
}: ServiceFormViewProps) {
  const router = useRouter();
  const isEdit = service.id !== 0;
  const initialForm = getInitialFormValues(service);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState(service.iconName || 'Activity');

  // Media states
  const [bannerPreview, setBannerPreview] = useState<string | null>(service.bannerImage || null);
  const [removeBannerImage, setRemoveBannerImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(service.roomImage || null);
  const [removeRoomImage, setRemoveRoomImage] = useState(false);
  const [existingGallery, setExistingGallery] = useState<string[]>(() => {
    if (!service.gallery) return [];
    try {
      const parsed = JSON.parse(service.gallery);
      return Array.isArray(parsed) ? parsed.filter((url) => typeof url === 'string' && url.trim() !== '') : [];
    } catch {
      return [];
    }
  });
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);

  // Interactive items states
  const [proceduresList, setProceduresList] = useState<ProcedureItem[]>(() =>
    parseProceduresToItems(initialForm.procedures)
  );
  const [proceduresMode, setProceduresMode] = useState<'cards' | 'raw'>('cards');
  const [rawProcedures, setRawProcedures] = useState(initialForm.procedures);

  const [faqList, setFaqList] = useState<FaqItemState[]>(() => parseFaqToItems(initialForm.faq));
  const [faqMode, setFaqMode] = useState<'cards' | 'raw'>('cards');
  const [rawFaq, setRawFaq] = useState(initialForm.faq);

  const [priceItemsList, setPriceItemsList] = useState<PriceItemState[]>(() =>
    parsePriceListToItems(initialForm.priceList)
  );
  const [priceListMode, setPriceListMode] = useState<'cards' | 'raw'>('cards');
  const [rawPriceList, setRawPriceList] = useState(initialForm.priceList);

  const handleAutoResize = (
    e: React.FormEvent<HTMLTextAreaElement> | React.FocusEvent<HTMLTextAreaElement>
  ) => {
    const t = e.currentTarget;
    t.style.height = 'auto';
    t.style.height = `${Math.max(t.scrollHeight + 8, 90)}px`;
  };

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
        onSuccess(res?.service);
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-border-fine shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 border-b border-border-fine bg-bg-snow flex items-center justify-between">
        <div>
          <h3 className="font-heading font-bold text-xl text-text-dark">
            {isEdit ? 'Edit Layanan Medis' : 'Tambah Layanan Baru'}
          </h3>
          <p className="text-sm text-text-muted mt-1">
            {isEdit
              ? 'Ubah informasi detail, foto galeri, jadwal operasional, dan fasilitas pendukung.'
              : 'Tambahkan jenis layanan kesehatan baru untuk dipublikasikan.'}
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-text-muted hover:text-text-dark hover:bg-white rounded-full transition-colors border border-transparent hover:border-border-fine"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>
      </div>

      <form key={service.id} onSubmit={handleSubmit} encType="multipart/form-data" className="p-6 md:p-10 flex flex-col gap-10">
        {isEdit && <input type="hidden" name="id" value={service.id} />}
        {removeRoomImage && <input type="hidden" name="removeRoomImage" value="true" />}

        {errorMsg && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold border border-red-200">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {errorMsg}
          </div>
        )}

        {/* 1. INFORMASI UTAMA */}
        <ServiceGeneralSection
          service={service}
          selectedIcon={selectedIcon}
          setSelectedIcon={setSelectedIcon}
          purpose={initialForm.purpose}
          onAutoResize={handleAutoResize}
        />

        {/* 2. MEDIA SECTION */}
        <ServiceMediaSection
          bannerPreview={bannerPreview}
          setBannerPreview={setBannerPreview}
          removeBannerImage={removeBannerImage}
          setRemoveBannerImage={setRemoveBannerImage}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          removeRoomImage={removeRoomImage}
          setRemoveRoomImage={setRemoveRoomImage}
          existingGallery={existingGallery}
          setExistingGallery={setExistingGallery}
          newGalleryPreviews={newGalleryPreviews}
          setNewGalleryPreviews={setNewGalleryPreviews}
        />

        {/* 3 & 4. JADWAL, FASILITAS, MANFAAT & PERSIAPAN */}
        <ServiceClinicalSection
          service={service}
          operationalHours={initialForm.operationalHours}
          facilities={initialForm.facilities}
          benefits={initialForm.benefits}
          preparation={initialForm.preparation}
          onAutoResize={handleAutoResize}
        />

        {/* 5. TINDAKAN MEDIS, FAQ, & HARGA */}
        <div className="pb-6">
          <h4 className="text-base md:text-lg font-bold text-primary mb-6 flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5" /> 5. Pelayanan & Tindakan Medis, FAQ, & Daftar Harga
          </h4>

          <div className="flex flex-col gap-10">
            <ServiceProceduresEditor
              proceduresList={proceduresList}
              setProceduresList={setProceduresList}
              proceduresMode={proceduresMode}
              setProceduresMode={setProceduresMode}
              rawProcedures={rawProcedures}
              setRawProcedures={setRawProcedures}
            />

            <ServiceFaqEditor
              faqList={faqList}
              setFaqList={setFaqList}
              faqMode={faqMode}
              setFaqMode={setFaqMode}
              rawFaq={rawFaq}
              setRawFaq={setRawFaq}
            />

            <ServicePricesEditor
              priceItemsList={priceItemsList}
              setPriceItemsList={setPriceItemsList}
              priceListMode={priceListMode}
              setPriceListMode={setPriceListMode}
              rawPriceList={rawPriceList}
              setRawPriceList={setRawPriceList}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-border-fine">
          <button
            type="button"
            onClick={onCancel}
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
