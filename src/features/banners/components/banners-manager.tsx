'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteBanner as deleteBannerAction } from '../actions/delete-banner';
import { toggleBanner as toggleBannerStatusAction } from '../actions/toggle-banner';
import ConfirmModal from '@/components/ui/confirm-modal';
import BannersTable from './banners-table';
import BannerFormView from './banner-form-view';
import { type Banner } from '../types';

export type { Banner };

interface BannersManagerProps {
  initialBanners: Banner[];
}

export default function BannersManager({ initialBanners }: BannersManagerProps) {
  const router = useRouter();
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [prevBanners, setPrevBanners] = useState(initialBanners);
  if (prevBanners !== initialBanners) {
    setPrevBanners(initialBanners);
    setBanners(initialBanners);
  }
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
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
      type: 'danger',
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
      type: 'warning',
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
          type: 'danger',
        });
      } else {
        setModalConfig({ isOpen: false, title: '', message: '' });
        router.refresh();
      }
      setDeletePendingId(null);
    } else if (modalConfig.actionType === 'toggle') {
      const res = await toggleBannerStatusAction(modalConfig.targetId, modalConfig.targetStatus!);
      if (res?.error) {
        setModalConfig({
          isOpen: true,
          title: 'Gagal',
          message: res.error,
          isAlertOnly: true,
          type: 'danger',
        });
      } else {
        setModalConfig({ isOpen: false, title: '', message: '' });
        router.refresh();
      }
    }
  };

  if (isFormOpen) {
    return (
      <BannerFormView
        banner={editingBanner}
        onCancel={() => setIsFormOpen(false)}
        onSuccess={() => {
          setIsFormOpen(false);
          setEditingBanner(null);
        }}
      />
    );
  }

  return (
    <>
      <BannersTable
        banners={banners}
        onCreateNew={handleCreateNew}
        onEdit={handleEdit}
        onToggle={confirmToggle}
        onDelete={confirmDelete}
        deletePendingId={deletePendingId}
      />

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
