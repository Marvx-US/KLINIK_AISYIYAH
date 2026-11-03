'use client';

import React, { useState } from 'react';
import { deletePartner as deletePartnerAction } from '../actions/delete-partner';
import { togglePartner as togglePartnerStatusAction } from '../actions/toggle-partner';
import ConfirmModal from '@/components/ui/confirm-modal';
import PartnersList from './partners-list';
import PartnerFormView from './partner-form-view';
import { type Partner } from '../types';

export type { Partner };

interface PartnersManagerProps {
  initialPartners: Partner[];
}

export default function PartnersManager({ initialPartners }: PartnersManagerProps) {
  const [partners, setPartners] = useState<Partner[]>(initialPartners);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState<number | null>(null);

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setIsFormOpen(true);
    setError(null);
  };

  const handleCreateNew = () => {
    setEditingPartner(null);
    setIsFormOpen(true);
    setError(null);
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
      if (!result.success) {
        setError(result.message || result.error || 'Gagal menghapus mitra');
      } else {
        setPartners((prev) => prev.filter((p) => p.id !== partnerToDelete));
        setIsDeleteModalOpen(false);
      }
    } catch {
      setError('Gagal menghapus mitra');
    } finally {
      setIsLoading(false);
      setPartnerToDelete(null);
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const result = await togglePartnerStatusAction(id, currentStatus);
      if (!result.success) {
        setError(result.message || result.error || 'Gagal mengubah status');
      } else {
        setPartners((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isActive: !currentStatus } : p))
        );
      }
    } catch {
      setError('Gagal mengubah status');
    }
  };

  if (isFormOpen) {
    return (
      <div className="p-8">
        <PartnerFormView
          partner={editingPartner}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingPartner(null);
          }}
          onSuccess={() => {
            setIsFormOpen(false);
            setEditingPartner(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <PartnersList
          partners={partners}
          onCreateNew={handleCreateNew}
          onEdit={handleEdit}
          onToggleStatus={toggleStatus}
          onPromptDelete={confirmDelete}
        />
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
