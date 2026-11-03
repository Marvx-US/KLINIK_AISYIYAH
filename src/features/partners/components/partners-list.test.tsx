import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import PartnersList from './partners-list';

describe('PartnersList Component UI (Bab 4.4 RTL)', () => {
  const mockPartners = [
    {
      id: 1,
      name: 'BPJS Kesehatan',
      logoUrl: '/uploads/partners/bpjs.png',
      websiteUrl: 'https://bpjs-kesehatan.go.id',
      isActive: true,
      order: 1,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
  ];

  it('harus merender kartu mitra dengan nama dan logo', () => {
    render(
      <PartnersList
        partners={mockPartners}
        onCreateNew={vi.fn()}
        onEdit={vi.fn()}
        onToggleStatus={vi.fn()}
        onPromptDelete={vi.fn()}
      />
    );

    expect(screen.getByText('BPJS Kesehatan')).toBeInTheDocument();
    expect(screen.getByText('Aktif')).toBeInTheDocument();
  });

  it('harus memicu callback aksi saat tombol tambah, edit, matikan, dan hapus diklik', async () => {
    const user = userEvent.setup();
    const handleCreate = vi.fn();
    const handleToggle = vi.fn();
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();

    render(
      <PartnersList
        partners={mockPartners}
        onCreateNew={handleCreate}
        onEdit={handleEdit}
        onToggleStatus={handleToggle}
        onPromptDelete={handleDelete}
      />
    );

    await user.click(screen.getByRole('button', { name: /tambah mitra/i }));
    expect(handleCreate).toHaveBeenCalledTimes(1);

    await user.click(screen.getByTitle('Nonaktifkan'));
    expect(handleToggle).toHaveBeenCalledWith(mockPartners[0].id, true);

    await user.click(screen.getByTitle('Edit Mitra'));
    expect(handleEdit).toHaveBeenCalledWith(mockPartners[0]);

    await user.click(screen.getByTitle('Hapus Mitra'));
    expect(handleDelete).toHaveBeenCalledWith(mockPartners[0].id);
  });

  it('harus menampilkan pesan kosong jika daftar mitra belum ada', () => {
    render(
      <PartnersList
        partners={[]}
        onCreateNew={vi.fn()}
        onEdit={vi.fn()}
        onToggleStatus={vi.fn()}
        onPromptDelete={vi.fn()}
      />
    );

    expect(screen.getByText(/belum ada mitra/i)).toBeInTheDocument();
  });
});
