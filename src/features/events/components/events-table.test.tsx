import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import EventsTable from './events-table';

describe('EventsTable Component UI (Bab 4.4 RTL)', () => {
  const mockEvents = [
    {
      id: 1,
      title: 'Donor Darah Peduli Sesama',
      slug: 'donor-darah',
      content: 'Isi lengkap kegiatan donor darah',
      coverImage: null,
      eventDate: new Date('2026-11-01T09:00:00Z'),
      location: 'Aula Utama',
      status: 'PUBLISHED',
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
  ];

  it('harus merender baris kegiatan dengan judul, lokasi, dan status', () => {
    render(
      <EventsTable
        events={mockEvents}
        onEdit={vi.fn()}
        onRequestDelete={vi.fn()}
        deletePendingId={null}
      />
    );

    expect(screen.getByText('Donor Darah Peduli Sesama')).toBeInTheDocument();
    expect(screen.getByText('Aula Utama')).toBeInTheDocument();
    expect(screen.getByText('PUBLISHED')).toBeInTheDocument();
  });

  it('harus memicu callback onEdit dan onRequestDelete saat tombol aksi diklik', async () => {
    const user = userEvent.setup();
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();

    render(
      <EventsTable
        events={mockEvents}
        onEdit={handleEdit}
        onRequestDelete={handleDelete}
        deletePendingId={null}
      />
    );

    await user.click(screen.getByTitle('Edit Event'));
    expect(handleEdit).toHaveBeenCalledWith(mockEvents[0]);

    await user.click(screen.getByTitle('Hapus'));
    expect(handleDelete).toHaveBeenCalledWith(mockEvents[0].id);
  });

  it('harus menampilkan pesan kosong jika daftar event kosong', () => {
    render(
      <EventsTable
        events={[]}
        onEdit={vi.fn()}
        onRequestDelete={vi.fn()}
        deletePendingId={null}
      />
    );

    expect(screen.getByText(/belum ada event\/kegiatan/i)).toBeInTheDocument();
  });
});
