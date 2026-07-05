'use server';

import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { uploadFile } from '@/lib/upload';
import { revalidatePath } from 'next/cache';
import { z, parseForm } from '@/lib/validations';

export type ActionResult = { success?: boolean; error?: string };

// Helper: generate slug unik dari judul
function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  const suffix = Math.floor(Math.random() * 10000);
  return `${base}-${suffix}`;
}

export async function saveEventAction(prevState: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Sesi habis. Silakan login kembali.' };

  const validation = parseForm(() => {
    const id = formData.get('id') as string | null;
    const eventDateStr = formData.get('eventDate') as string | null;
    
    // Parse Date manually as z doesn't have a date helper yet
    let parsedDate: Date | null = null;
    if (eventDateStr) {
      const date = new Date(eventDateStr);
      if (!isNaN(date.getTime())) {
        parsedDate = date;
      }
    }

    return {
      id: id ? z.number(id, 'ID Event') : null,
      title: z.maxLength(z.string(formData.get('title'), 'Judul Event'), 200, 'Judul Event'),
      content: z.maxLength(z.string(formData.get('content'), 'Konten'), 100_000, 'Konten'),
      location: formData.get('location') ? z.maxLength(formData.get('location') as string, 300, 'Lokasi') : null,
      coverImageFile: z.file(formData.get('coverImage'), 'Gambar Cover', false),
      status: z.enum(formData.get('status'), ['PUBLISHED', 'DRAFT'] as const, 'Status', 'DRAFT'),
      eventDate: parsedDate,
    };
  });

  if (!validation.success) {
    return { error: validation.error };
  }

  const { id, title, content, location, coverImageFile, status, eventDate } = validation.data;

  try {
    if (id !== null) {
      // UPDATE
      const existing = await db.event.findUnique({ where: { id } });
      if (!existing) return { error: 'Event tidak ditemukan.' };

      let coverImageUrl = existing.coverImage;
      if (coverImageFile) {
        const uploaded = await uploadFile(coverImageFile);
        if (uploaded) coverImageUrl = uploaded;
      }

      await db.event.update({
        where: { id },
        data: {
          title,
          content,
          location: location || null,
          eventDate,
          status,
          coverImage: coverImageUrl,
        },
      });
    } else {
      // CREATE
      const slug = generateSlug(title);
      const coverImageUrl = await uploadFile(coverImageFile);

      await db.event.create({
        data: {
          title,
          slug,
          content,
          location: location || null,
          eventDate,
          status,
          coverImage: coverImageUrl,
        },
      });
    }

    revalidatePath('/admin/events');
    revalidatePath('/events');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Save event error:', error);
    return { error: 'Gagal menyimpan event. Pastikan koneksi database aktif.' };
  }
}

export async function deleteEventAction(id: number): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Sesi habis. Silakan login kembali.' };

  try {
    if (!id || isNaN(id) || id <= 0) return { error: 'ID event tidak valid.' };

    const existing = await db.event.findUnique({ where: { id } });
    if (!existing) return { error: 'Event tidak ditemukan.' };

    await db.event.delete({ where: { id } });

    revalidatePath('/admin/events');
    revalidatePath('/events');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Delete event error:', error);
    return { error: 'Gagal menghapus event.' };
  }
}
