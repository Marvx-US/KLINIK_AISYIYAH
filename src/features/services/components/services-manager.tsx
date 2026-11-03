'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { deleteService as deleteServiceAction } from '../actions/delete-service';
import { toggleService as toggleServiceStatusAction } from '../actions/toggle-service';
import ConfirmModal from '@/components/ui/confirm-modal';
import ServicesTable from './services-table';
import ServiceFormView from './service-form-view';
import { type Service } from '../types';

export type { Service };

interface ServicesManagerProps {
  initialServices: Service[];
}

export default function ServicesManager({ initialServices }: ServicesManagerProps) {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>(initialServices);
  const [prevServices, setPrevServices] = useState(initialServices);
  if (prevServices !== initialServices) {
    setPrevServices(initialServices);
    setServices(initialServices);
  }
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);
  const [togglePendingId, setTogglePendingId] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    setTogglePendingId(id);
    setErrorMsg(null);
    const res = await toggleServiceStatusAction(id, currentStatus);
    setTogglePendingId(null);
    if (!res?.success) {
      setErrorMsg(res?.message || res?.error || 'Gagal mengubah status layanan');
    } else {
      router.refresh();
    }
  };

  const promptDelete = (id: number) => {
    setServiceToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!serviceToDelete) return;
    const id = serviceToDelete;

    setIsDeleteModalOpen(false);
    setServiceToDelete(null);
    setErrorMsg(null);

    const res = await deleteServiceAction(id);
    if (!res?.success) {
      setErrorMsg(res?.message || res?.error || 'Gagal menghapus layanan');
    } else {
      setServices((prev) => prev.filter((s) => s.id !== id));
      setSuccessMsg('Layanan dan seluruh berkas gambar terkait berhasil dihapus.');
      setTimeout(() => setSuccessMsg(null), 6000);
      router.refresh();
    }
  };

  const handleFormSuccess = (saved?: Service) => {
    if (saved) {
      setServices((prev) => {
        const idx = prev.findIndex((s) => s.id === saved.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = saved;
          return updated;
        }
        return [saved, ...prev];
      });
    }
    setSuccessMsg('Berhasil! Foto dan seluruh data layanan telah diperbarui.');
    setTimeout(() => setSuccessMsg(null), 6000);
    setEditingService(null);
  };

  if (editingService !== null) {
    return (
      <ServiceFormView
        service={editingService}
        onCancel={() => setEditingService(null)}
        onSuccess={handleFormSuccess}
      />
    );
  }

  return (
    <>
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center justify-between text-sm font-medium border border-red-100 shadow-sm">
          <span>{errorMsg}</span>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="text-red-400 hover:text-red-600 text-xs font-bold ml-4"
          >
            Tutup
          </button>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-2xl flex items-center gap-3 text-sm font-bold border border-green-200 shadow-sm">
          <Check className="w-5 h-5 shrink-0 text-green-600" />
          {successMsg}
        </div>
      )}

      <ServicesTable
        services={services}
        onCreateNew={() =>
          setEditingService({
            id: 0,
            name: '',
            slug: '',
            description: '',
            iconName: 'Activity',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        }
        onEdit={(srv) => setEditingService(srv)}
        onToggleStatus={handleToggleStatus}
        onPromptDelete={promptDelete}
        togglePendingId={togglePendingId}
      />

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
