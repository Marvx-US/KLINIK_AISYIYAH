/**
 * LAYER 2 - SERVICE
 */

import { uploadFile } from '@/lib/upload';
import * as partnerRepo from '@/core/repositories/partnerRepository';

export async function createPartner(data: { name: string; imageFile: File | null }) {
  const logoUrl = await uploadFile(data.imageFile);
  if (!logoUrl) throw new Error('Gagal mengunggah logo mitra.');
  return partnerRepo.createPartner({ name: data.name, logoUrl, isActive: true });
}

export async function updatePartner(
  id: number,
  data: { name: string; imageFile: File | null }
) {
  const existing = await partnerRepo.findPartnerById(id);
  if (!existing) throw new Error('Mitra tidak ditemukan.');

  let logoUrl = existing.logoUrl;
  if (data.imageFile) {
    const uploaded = await uploadFile(data.imageFile);
    if (uploaded) logoUrl = uploaded;
  }

  return partnerRepo.updatePartner(id, { name: data.name, logoUrl });
}

export async function deletePartner(id: number) {
  const existing = await partnerRepo.findPartnerById(id);
  if (!existing) throw new Error('Mitra tidak ditemukan.');
  return partnerRepo.deletePartner(id);
}

export async function togglePartnerStatus(id: number, currentStatus: boolean) {
  const existing = await partnerRepo.findPartnerById(id);
  if (!existing) throw new Error('Mitra tidak ditemukan.');
  return partnerRepo.updatePartner(id, { isActive: !currentStatus });
}

export const getAllPartners = partnerRepo.findAllPartners;
export const getActivePartners = partnerRepo.findActivePartners;
