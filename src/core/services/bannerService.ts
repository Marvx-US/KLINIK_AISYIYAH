/**
 * LAYER 2 - SERVICE
 */

import { uploadFile } from '@/lib/upload';
import * as bannerRepo from '@/core/repositories/bannerRepository';

export async function createBanner(data: {
  title: string;
  imageFile: File | null;
  isActive: boolean;
}) {
  const imageUrl = await uploadFile(data.imageFile);
  if (!imageUrl) throw new Error('Gagal mengunggah gambar banner.');
  return bannerRepo.createBanner({ title: data.title, imageUrl, isActive: data.isActive });
}

export async function updateBanner(
  id: number,
  data: { title: string; imageFile: File | null; isActive: boolean }
) {
  const existing = await bannerRepo.findBannerById(id);
  if (!existing) throw new Error('Banner tidak ditemukan.');

  let imageUrl = existing.imageUrl;
  if (data.imageFile) {
    const uploaded = await uploadFile(data.imageFile);
    if (uploaded) imageUrl = uploaded;
  }

  return bannerRepo.updateBanner(id, { title: data.title, imageUrl, isActive: data.isActive });
}

export async function deleteBanner(id: number) {
  const existing = await bannerRepo.findBannerById(id);
  if (!existing) throw new Error('Banner tidak ditemukan.');
  return bannerRepo.deleteBanner(id);
}

export async function toggleBannerStatus(id: number, currentStatus: boolean) {
  const existing = await bannerRepo.findBannerById(id);
  if (!existing) throw new Error('Banner tidak ditemukan.');
  return bannerRepo.updateBanner(id, { isActive: !currentStatus });
}

export const getAllBanners = bannerRepo.findAllBanners;
export const getActiveBanners = bannerRepo.findActiveBanners;
