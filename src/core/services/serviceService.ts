/**
 * LAYER 2 - SERVICE
 * Logika bisnis untuk Layanan Klinik.
 */

import * as serviceRepo from '@/core/repositories/serviceRepository';
import { uploadFile } from '@/lib/upload';

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Hapus karakter non-alphanumeric selain spasi dan dash
    .replace(/[\s_]+/g, '-')     // Ubah spasi atau underscore menjadi dash
    .replace(/-+/g, '-')         // Hapus dash ganda
    .replace(/^-+|-+$/g, '');     // Trim dash di awal/akhir
}

export async function createService(data: {
  name: string;
  description: string;
  iconName: string;
  isActive: boolean;
  imageFile?: File | null;
  galleryFiles?: File[] | null;
  priceList?: string | null;
}) {
  const slug = generateSlug(data.name);

  // Cek apakah slug sudah ada
  const existing = await serviceRepo.findServiceBySlug(slug);
  let finalSlug = slug;
  if (existing) {
    // Tambahkan suffix timestamp acak agar unik jika nama sama persis
    finalSlug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  let roomImage = null;
  if (data.imageFile) {
    const uploaded = await uploadFile(data.imageFile);
    if (uploaded) roomImage = uploaded;
  }

  const galleryList: string[] = [];
  if (data.galleryFiles && data.galleryFiles.length > 0) {
    for (const file of data.galleryFiles) {
      const uploaded = await uploadFile(file);
      if (uploaded) galleryList.push(uploaded);
    }
  }

  return serviceRepo.createService({
    name: data.name,
    slug: finalSlug,
    description: data.description,
    iconName: data.iconName,
    isActive: data.isActive,
    roomImage,
    gallery: galleryList.length > 0 ? JSON.stringify(galleryList) : null,
    priceList: data.priceList,
  });
}

export async function updateService(
  id: number,
  data: {
    name: string;
    description: string;
    iconName: string;
    isActive: boolean;
    imageFile?: File | null;
    galleryFiles?: File[] | null;
    existingGallery?: string[] | null;
    priceList?: string | null;
  }
) {
  const existing = await serviceRepo.findServiceById(id);
  if (!existing) throw new Error('Layanan tidak ditemukan.');

  let slug = existing.slug;
  // Jika nama diubah, perbarui slug
  if (existing.name !== data.name) {
    const newSlug = generateSlug(data.name);
    const otherWithSlug = await serviceRepo.findServiceBySlug(newSlug);
    slug = otherWithSlug ? `${newSlug}-${Date.now().toString().slice(-4)}` : newSlug;
  }

  let roomImage = existing.roomImage;
  if (data.imageFile) {
    const uploaded = await uploadFile(data.imageFile);
    if (uploaded) roomImage = uploaded;
  }

  const galleryList: string[] = data.existingGallery ? [...data.existingGallery] : [];
  if (data.galleryFiles && data.galleryFiles.length > 0) {
    for (const file of data.galleryFiles) {
      const uploaded = await uploadFile(file);
      if (uploaded) galleryList.push(uploaded);
    }
  }

  return serviceRepo.updateService(id, {
    name: data.name,
    slug,
    description: data.description,
    iconName: data.iconName,
    isActive: data.isActive,
    roomImage,
    gallery: JSON.stringify(galleryList),
    priceList: data.priceList,
  });
}

export async function deleteService(id: number) {
  const existing = await serviceRepo.findServiceById(id);
  if (!existing) throw new Error('Layanan tidak ditemukan.');
  return serviceRepo.deleteService(id);
}

export async function toggleServiceStatus(id: number, currentStatus: boolean) {
  const existing = await serviceRepo.findServiceById(id);
  if (!existing) throw new Error('Layanan tidak ditemukan.');
  return serviceRepo.updateService(id, { isActive: !currentStatus });
}

export const getAllServices = serviceRepo.findAllServices;
export const getActiveServices = serviceRepo.findActiveServices;
export const getServiceById = serviceRepo.findServiceById;
export const getServiceBySlug = serviceRepo.findServiceBySlug;
