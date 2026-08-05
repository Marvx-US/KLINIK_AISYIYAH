/**
 * LAYER 2 - SERVICE
 * Logika bisnis untuk Layanan Klinik.
 * Mengelola upload file, penghapusan file fisik dari disk, dan sinkronisasi data.
 */

import * as serviceRepo from '@/core/repositories/serviceRepository';
import { uploadFile, deleteFile } from '@/lib/upload';

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
  console.log(`[SERVICE LOG] Membuat layanan baru: "${data.name}"`);
  const slug = generateSlug(data.name);

  // Cek apakah slug sudah ada
  const existing = await serviceRepo.findServiceBySlug(slug);
  let finalSlug = slug;
  if (existing) {
    finalSlug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  // Upload foto utama
  let roomImage = null;
  if (data.imageFile && data.imageFile.size > 0) {
    const uploaded = await uploadFile(data.imageFile);
    if (uploaded) roomImage = uploaded;
  }

  // Upload foto-foto galeri
  const galleryList: string[] = [];
  if (data.galleryFiles && data.galleryFiles.length > 0) {
    for (const file of data.galleryFiles) {
      if (file && file.size > 0) {
        const uploaded = await uploadFile(file);
        if (uploaded) galleryList.push(uploaded);
      }
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
    removeRoomImage?: boolean;
    galleryFiles?: File[] | null;
    existingGallery?: string[] | null;
    priceList?: string | null;
  }
) {
  console.log(`[SERVICE LOG] Perbarui layanan ID: ${id}`);
  const existing = await serviceRepo.findServiceById(id);
  if (!existing) throw new Error('Layanan tidak ditemukan.');

  let slug = existing.slug;
  if (existing.name !== data.name) {
    const newSlug = generateSlug(data.name);
    const otherWithSlug = await serviceRepo.findServiceBySlug(newSlug);
    slug = otherWithSlug ? `${newSlug}-${Date.now().toString().slice(-4)}` : newSlug;
  }

  // --- 1. Penanganan Foto Utama (roomImage) ---
  let roomImage = existing.roomImage;

  if (data.removeRoomImage) {
    // Admin secara eksplisit menghapus foto utama
    if (existing.roomImage) {
      console.log(`[SERVICE LOG] Hapus foto utama lama dari disk: ${existing.roomImage}`);
      await deleteFile(existing.roomImage);
    }
    roomImage = null;
  } else if (data.imageFile && data.imageFile.size > 0) {
    // Admin meng-upload foto utama baru
    const uploaded = await uploadFile(data.imageFile);
    if (uploaded) {
      // Hapus foto utama lama jika ada
      if (existing.roomImage && existing.roomImage !== uploaded) {
        console.log(`[SERVICE LOG] Ganti foto utama: Hapus file lama ${existing.roomImage}`);
        await deleteFile(existing.roomImage);
      }
      roomImage = uploaded;
    }
  }

  // --- 2. Penanganan Galeri Foto (gallery) ---
  // Dapatkan daftar galeri foto yang tersimpan sebelumnya
  let oldGalleryList: string[] = [];
  if (existing.gallery) {
    try {
      const parsed = JSON.parse(existing.gallery);
      if (Array.isArray(parsed)) oldGalleryList = parsed;
    } catch {
      oldGalleryList = [];
    }
  }

  // Cari foto galeri lama yang telah DIBUANG/DIHAPUS oleh admin dari form
  const retainedGallery = data.existingGallery || [];
  const removedPhotos = oldGalleryList.filter((oldUrl) => !retainedGallery.includes(oldUrl));

  // Hapus file fisik foto galeri yang dibuang dari disk
  for (const removedUrl of removedPhotos) {
    console.log(`[SERVICE LOG] Hapus foto galeri dari disk: ${removedUrl}`);
    await deleteFile(removedUrl);
  }

  // Upload foto galeri baru jika ada
  const finalGalleryList: string[] = [...retainedGallery];
  if (data.galleryFiles && data.galleryFiles.length > 0) {
    for (const file of data.galleryFiles) {
      if (file && file.size > 0) {
        const uploaded = await uploadFile(file);
        if (uploaded) finalGalleryList.push(uploaded);
      }
    }
  }

  return serviceRepo.updateService(id, {
    name: data.name,
    slug,
    description: data.description,
    iconName: data.iconName,
    isActive: data.isActive,
    roomImage,
    gallery: JSON.stringify(finalGalleryList),
    priceList: data.priceList,
  });
}

export async function deleteService(id: number) {
  console.log(`[SERVICE LOG] Hapus layanan ID: ${id}`);
  const existing = await serviceRepo.findServiceById(id);
  if (!existing) throw new Error('Layanan tidak ditemukan.');

  // Hapus file foto utama dari disk jika ada
  if (existing.roomImage) {
    console.log(`[SERVICE LOG] Hapus foto utama saat hapus layanan: ${existing.roomImage}`);
    await deleteFile(existing.roomImage);
  }

  // Hapus seluruh foto galeri dari disk jika ada
  if (existing.gallery) {
    try {
      const parsed = JSON.parse(existing.gallery);
      if (Array.isArray(parsed)) {
        for (const imgUrl of parsed) {
          console.log(`[SERVICE LOG] Hapus foto galeri saat hapus layanan: ${imgUrl}`);
          await deleteFile(imgUrl);
        }
      }
    } catch (e) {
      console.error('[SERVICE LOG ERROR] Gagal parse JSON galeri saat hapus layanan:', e);
    }
  }

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
