import { uploadFile, deleteFile } from '@/lib/upload';

export interface ProcessMediaInput {
  imageFile?: File | null;
  bannerImageFile?: File | null;
  galleryFiles?: File[] | null;
  existingGallery?: string[];
  currentRoomImage?: string | null;
  currentBannerImage?: string | null;
  currentGallery?: string | null;
  removeRoomImage?: boolean;
  removeBannerImage?: boolean;
}

export interface ProcessMediaOutput {
  roomImage: string | null;
  bannerImage: string | null;
  gallery: string | null;
}

/**
 * Memproses upload dan pembersihan berkas media untuk Layanan (Bab 3.3 Single Responsibility)
 */
export async function processServiceMedia({
  imageFile,
  bannerImageFile,
  galleryFiles,
  existingGallery = [],
  currentRoomImage = null,
  currentBannerImage = null,
  currentGallery = null,
  removeRoomImage = false,
  removeBannerImage = false,
}: ProcessMediaInput): Promise<ProcessMediaOutput> {
  // 1. Proses Foto Ruangan (Room Image)
  let roomImage = currentRoomImage;
  if (removeRoomImage && currentRoomImage) {
    await deleteFile(currentRoomImage).catch(() => null);
    roomImage = null;
  }
  if (imageFile && imageFile.size > 0) {
    if (currentRoomImage) {
      await deleteFile(currentRoomImage).catch(() => null);
    }
    const uploaded = await uploadFile(imageFile);
    if (uploaded) roomImage = uploaded;
  }

  // 2. Proses Foto Banner (Banner Image)
  let bannerImage = currentBannerImage;
  if (removeBannerImage && currentBannerImage) {
    await deleteFile(currentBannerImage).catch(() => null);
    bannerImage = null;
  }
  if (bannerImageFile && bannerImageFile.size > 0) {
    if (currentBannerImage) {
      await deleteFile(currentBannerImage).catch(() => null);
    }
    const uploaded = await uploadFile(bannerImageFile);
    if (uploaded) bannerImage = uploaded;
  }

  // 3. Proses Foto Galeri
  let oldGalleryList: string[] = [];
  if (currentGallery) {
    try {
      oldGalleryList = JSON.parse(currentGallery);
    } catch {
      oldGalleryList = [];
    }
  }

  // Hapus foto lama yang dihilangkan oleh admin dari existingGallery
  const removedPhotos = oldGalleryList.filter((url) => !existingGallery.includes(url));
  for (const url of removedPhotos) {
    await deleteFile(url).catch(() => null);
  }

  const finalGallery: string[] = [...existingGallery];
  if (galleryFiles && galleryFiles.length > 0) {
    for (const file of galleryFiles) {
      if (file && file.size > 0) {
        const uploaded = await uploadFile(file);
        if (uploaded) finalGallery.push(uploaded);
      }
    }
  }

  return {
    roomImage,
    bannerImage,
    gallery: finalGallery.length > 0 ? JSON.stringify(finalGallery) : null,
  };
}

/**
 * Hapus seluruh media file fisik terkait layanan dari disk
 */
export async function cleanupServiceMedia(service: {
  roomImage?: string | null;
  bannerImage?: string | null;
  gallery?: string | null;
}) {
  if (service.roomImage) {
    await deleteFile(service.roomImage).catch(() => null);
  }
  if (service.bannerImage) {
    await deleteFile(service.bannerImage).catch(() => null);
  }
  if (service.gallery) {
    try {
      const photos: string[] = JSON.parse(service.gallery);
      for (const p of photos) {
        await deleteFile(p).catch(() => null);
      }
    } catch {
      // Abaikan bila format JSON rusak
    }
  }
}
