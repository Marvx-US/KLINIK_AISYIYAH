/**
 * LAYER 2 - SERVICE
 */

import { uploadFile } from '@/lib/upload';
import * as facilityRepo from '@/core/repositories/facilityRepository';

export async function createFacility(data: {
  name: string;
  description: string;
  imageFile: File | null;
  isActive: boolean;
}) {
  const imageUrl = await uploadFile(data.imageFile);
  if (!imageUrl) throw new Error('Gagal mengunggah gambar fasilitas.');

  return facilityRepo.createFacility({
    name: data.name,
    description: data.description,
    imageUrl,
    isActive: data.isActive,
  });
}

export async function updateFacility(
  id: number,
  data: {
    name: string;
    description: string;
    imageFile: File | null;
    isActive: boolean;
  }
) {
  const existing = await facilityRepo.findFacilityById(id);
  if (!existing) throw new Error('Fasilitas tidak ditemukan.');

  let imageUrl = existing.imageUrl;
  if (data.imageFile) {
    const uploaded = await uploadFile(data.imageFile);
    if (uploaded) imageUrl = uploaded;
  }

  return facilityRepo.updateFacility(id, {
    name: data.name,
    description: data.description,
    imageUrl,
    isActive: data.isActive,
  });
}

export async function deleteFacility(id: number) {
  const existing = await facilityRepo.findFacilityById(id);
  if (!existing) throw new Error('Fasilitas tidak ditemukan.');
  return facilityRepo.deleteFacility(id);
}

export async function toggleFacilityStatus(id: number, currentStatus: boolean) {
  const existing = await facilityRepo.findFacilityById(id);
  if (!existing) throw new Error('Fasilitas tidak ditemukan.');
  return facilityRepo.updateFacility(id, { isActive: !currentStatus });
}

export const getAllFacilities = facilityRepo.findAllFacilities;
export const getActiveFacilities = facilityRepo.findActiveFacilities;
