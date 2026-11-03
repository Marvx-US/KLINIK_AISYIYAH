import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import BannersTable from './banners-table';

describe('BannersTable Component UI (Bab 4.4 RTL)', () => {
  const mockBanners = [
    {
      id: 1,
      title: 'Vaksin Polio Gratis',
      imageUrl: '/uploads/banners/polio.png',
      linkUrl: null,
      isActive: true,
      order: 1,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
  ];

  it('harus merender baris banner dengan status aktif', () => {
    render(
      <BannersTable
        banners={mockBanners}
        onCreateNew={vi.fn()}
        onEdit={vi.fn()}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        deletePendingId={null}
      />
    );

    expect(screen.getByText('Vaksin Polio Gratis')).toBeInTheDocument();
    expect(screen.getByText('Aktif')).toBeInTheDocument();
  });

  it('harus memanggil onCreateNew saat tombol Tambah Banner diklik', async () => {
    const user = userEvent.setup();
    const handleCreate = vi.fn();

    render(
      <BannersTable
        banners={mockBanners}
        onCreateNew={handleCreate}
        onEdit={vi.fn()}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        deletePendingId={null}
      />
    );

    await user.click(screen.getByRole('button', { name: /tambah banner/i }));
    expect(handleCreate).toHaveBeenCalledTimes(1);
  });

  it('harus memanggil onToggle, onEdit, dan onDelete saat tombol aksi diklik', async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();

    render(
      <BannersTable
        banners={mockBanners}
        onCreateNew={vi.fn()}
        onEdit={handleEdit}
        onToggle={handleToggle}
        onDelete={handleDelete}
        deletePendingId={null}
      />
    );

    await user.click(screen.getByTitle('Nonaktifkan'));
    expect(handleToggle).toHaveBeenCalledWith(mockBanners[0]);

    await user.click(screen.getByTitle('Edit'));
    expect(handleEdit).toHaveBeenCalledWith(mockBanners[0]);

    await user.click(screen.getByTitle('Hapus'));
    expect(handleDelete).toHaveBeenCalledWith(mockBanners[0]);
  });

  it('harus menampilkan pesan kosong jika tidak ada banner', () => {
    render(
      <BannersTable
        banners={[]}
        onCreateNew={vi.fn()}
        onEdit={vi.fn()}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        deletePendingId={null}
      />
    );

    expect(screen.getByText(/belum ada banner yang ditambahkan/i)).toBeInTheDocument();
  });
});
