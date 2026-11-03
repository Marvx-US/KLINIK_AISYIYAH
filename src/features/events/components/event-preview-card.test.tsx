import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EventPreviewCard from './event-preview-card';

describe('EventPreviewCard Component UI (Bab 4.4 RTL)', () => {
  it('harus merender judul, lokasi, dan status pratinjau dengan benar', () => {
    render(
      <EventPreviewCard
        title="Pemeriksaan Gigi Massal"
        eventDate="2026-12-01T08:00:00.000Z"
        location="Gedung Dakwah Aisyiyah"
        status="PUBLISHED"
        coverImagePreview="/uploads/events/gigi.png"
        editorContent="<p>Pemeriksaan gigi gratis bersama dokter spesialis.</p>"
      />
    );

    expect(screen.getByText(/Pemeriksaan Gigi Massal/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Gedung Dakwah Aisyiyah/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/PUBLISHED/i)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /cover preview/i })).toHaveAttribute(
      'src',
      '/uploads/events/gigi.png'
    );
  });

  it('harus menampilkan fallback judul jika prop title kosong', () => {
    render(
      <EventPreviewCard
        title=""
        eventDate=""
        location=""
        status="DRAFT"
        coverImagePreview={null}
        editorContent=""
      />
    );

    expect(
      screen.getByText(/Judul Event Anda Akan Tampil di Sini/i)
    ).toBeInTheDocument();
  });
});
