'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteFacility as deleteFacilityAction } from '../actions/delete-facility';
import { toggleFacility as toggleFacilityStatusAction } from '../actions/toggle-facility';
import ConfirmModal from '@/components/ui/confirm-modal';
import FacilitiesTable from './facilities-table';
import FacilityFormView from './facility-form-view';
import { type Facility } from '../types';

export type { Facility };

interface FacilitiesManagerProps {
  initialFacilities: Facility[];
}

export default function FacilitiesManager({ initialFacilities }: FacilitiesManagerProps) {
  const router = useRouter();
  const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);
  const [prevFacilities, setPrevFacilities] = useState(initialFacilities);
  if (prevFacilities !== initialFacilities) {
    setPrevFacilities(initialFacilities);
    setFacilities(initialFacilities);
  }
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState<number | null>(null);
  const [togglePendingId, setTogglePendingId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    setTogglePendingId(id);
    setErrorMsg(null);
    const res = await toggleFacilityStatusAction(id, currentStatus);
    setTogglePendingId(null);
    if (!res?.success) {
      setErrorMsg(res?.message || res?.error || 'Gagal mengubah status fasilitas');
    } else {
      router.refresh();
    }
  };

  const promptDelete = (id: number) => {
    setFacilityToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!facilityToDelete) return;
    const id = facilityToDelete;

    setIsDeleteModalOpen(false);
    setFacilityToDelete(null);
    setErrorMsg(null);

    const res = await deleteFacilityAction(id);
    if (!res?.success) {
      setErrorMsg(res?.message || res?.error || 'Gagal menghapus fasilitas');
    } else {
      router.refresh();
    }
  };

  if (editingFacility !== null) {
    return (
      <FacilityFormView
        facility={editingFacility}
        onCancel={() => setEditingFacility(null)}
        onSuccess={() => {
          setEditingFacility(null);
        }}
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

      <FacilitiesTable
        facilities={facilities}
        onCreateNew={() =>
          setEditingFacility({
            id: 0,
            name: '',
            description: '',
            imageUrl: '',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        }
        onEdit={(fac) => setEditingFacility(fac)}
        onToggleStatus={handleToggleStatus}
        onPromptDelete={promptDelete}
        togglePendingId={togglePendingId}
      />

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
