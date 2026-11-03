import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import FacilitiesTable from './facilities-table';

describe('FacilitiesTable Component UI (Bab 4.4 RTL)', () => {
  const mockFacilities = [
    {
      id: 1,
      name: 'Ruang Rawat Inap VIP',
      description: 'Fasilitas ranjang elektrik, AC, dan smart TV.',
      imageUrl: '/uploads/facilities/vip.png',
      isActive: true,
      order: 1,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
  ];

  it('harus merender baris fasilitas dan statusnya', () => {
    render(
      <FacilitiesTable
        facilities={mockFacilities}
        onCreateNew={vi.fn()}
        onEdit={vi.fn()}
        onToggleStatus={vi.fn()}
        onPromptDelete={vi.fn()}
        togglePendingId={null}
      />
    );

    expect(screen.getByText('Ruang Rawat Inap VIP')).toBeInTheDocument();
    expect(screen.getByText('Aktif')).toBeInTheDocument();
  });

  it('harus memicu callback saat tombol aksi dan toggle status diklik', async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();
    const handleCreate = vi.fn();

    render(
      <FacilitiesTable
        facilities={mockFacilities}
        onCreateNew={handleCreate}
        onEdit={handleEdit}
        onToggleStatus={handleToggle}
        onPromptDelete={handleDelete}
        togglePendingId={null}
      />
    );

    await user.click(screen.getByRole('button', { name: /fasilitas baru/i }));
    expect(handleCreate).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /aktif/i }));
    expect(handleToggle).toHaveBeenCalledWith(mockFacilities[0].id, true);

    await user.click(screen.getByTitle('Edit Fasilitas'));
    expect(handleEdit).toHaveBeenCalledWith(mockFacilities[0]);

    await user.click(screen.getByTitle('Hapus Fasilitas'));
    expect(handleDelete).toHaveBeenCalledWith(mockFacilities[0].id);
  });

  it('harus menampilkan pesan kosong jika tidak ada fasilitas', () => {
    render(
      <FacilitiesTable
        facilities={[]}
        onCreateNew={vi.fn()}
        onEdit={vi.fn()}
        onToggleStatus={vi.fn()}
        onPromptDelete={vi.fn()}
        togglePendingId={null}
      />
    );

    expect(screen.getByText(/belum ada fasilitas/i)).toBeInTheDocument();
  });
});
