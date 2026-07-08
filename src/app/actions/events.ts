'use server';

/**
 * LAYER 3 - ACTION (Controller)
 */

import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { z, parseForm } from '@/lib/validations';
import * as eventService from '@/core/services/eventService';

export type ActionResult = { success?: boolean; error?: string };

export async function saveEventAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Sesi habis. Silakan login kembali.' };

  const validation = parseForm(() => {
    const id = formData.get('id') as string | null;
    const eventDateStr = formData.get('eventDate') as string | null;
    let eventDate: Date | null = null;
    if (eventDateStr) {
      const d = new Date(eventDateStr);
      if (!isNaN(d.getTime())) eventDate = d;
    }
    return {
      id: id ? z.number(id, 'ID Event') : null,
      title: z.maxLength(z.string(formData.get('title'), 'Judul Event'), 200, 'Judul Event'),
      content: z.maxLength(z.string(formData.get('content'), 'Konten'), 100_000, 'Konten'),
      location: formData.get('location')
        ? z.maxLength(formData.get('location') as string, 300, 'Lokasi')
        : null,
      coverImageFile: z.file(formData.get('coverImage'), 'Gambar Cover', false),
      status: z.enum(formData.get('status'), ['PUBLISHED', 'DRAFT'] as const, 'Status', 'DRAFT'),
      eventDate,
    };
  });

  if (!validation.success) return { error: validation.error };

  const { id, title, content, location, coverImageFile, status, eventDate } = validation.data;

  // Validasi file gambar cover jika ada
  if (coverImageFile) {
    if (!coverImageFile.type.startsWith('image/')) {
      return { error: 'File yang diunggah harus berupa gambar.' };
    }
    if (coverImageFile.size > 5 * 1024 * 1024) {
      return { error: 'Ukuran gambar tidak boleh melebihi 5 MB.' };
    }
  }

  try {
    if (id !== null) {
      await eventService.updateEvent(id, { title, content, location, eventDate, status, coverImageFile });
    } else {
      await eventService.createEvent({ title, content, location, eventDate, status, coverImageFile });
    }
    revalidatePath('/admin/events');
    revalidatePath('/events');
    revalidatePath('/');
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Gagal menyimpan event.';
    return { error: msg };
  }
}

export async function deleteEventAction(id: number): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Sesi habis. Silakan login kembali.' };
  if (!id || isNaN(id) || id <= 0) return { error: 'ID event tidak valid.' };

  try {
    await eventService.deleteEvent(id);
    revalidatePath('/admin/events');
    revalidatePath('/events');
    revalidatePath('/');
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Gagal menghapus event.';
    return { error: msg };
  }
}
