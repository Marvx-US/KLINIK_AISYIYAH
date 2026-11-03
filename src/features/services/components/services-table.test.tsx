import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ServicesTable from './services-table';
import { type Service } from '../types';

describe('ServicesTable Component UI (Bab 4.4 RTL)', () => {
  const mockServices: Service[] = [
    {
      id: 1,
      name: 'Poli Gigi & Mulut',
      slug: 'poli-gigi-dan-mulut',
      description: 'Layanan penambalan, pembersihan karang gigi, dan pencabutan.',
      iconName: 'Activity',
      roomImage: null,
      bannerImage: null,
      gallery: null,
      priceList: null,
      purpose: null,
      benefits: null,
      facilities: null,
      operationalHours: null,
      preparation: null,
      procedures: null,
      faq: null,
      isActive: true,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
  ];

  it('harus merender baris layanan dan statusnya', () => {
    render(
      <ServicesTable
        services={mockServices}
        onCreateNew={vi.fn()}
        onEdit={vi.fn()}
        onToggleStatus={vi.fn()}
        onPromptDelete={vi.fn()}
        togglePendingId={null}
      />
    );

    expect(screen.getByText('Poli Gigi & Mulut')).toBeInTheDocument();
    expect(screen.getByText('Aktif')).toBeInTheDocument();
  });

  it('harus memicu callback saat tombol aksi dan toggle status diklik', async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();
    const handleCreate = vi.fn();

    render(
      <ServicesTable
        services={mockServices}
        onCreateNew={handleCreate}
        onEdit={handleEdit}
        onToggleStatus={handleToggle}
        onPromptDelete={handleDelete}
        togglePendingId={null}
      />
    );

    await user.click(screen.getByRole('button', { name: /layanan baru/i }));
    expect(handleCreate).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /aktif/i }));
    expect(handleToggle).toHaveBeenCalledWith(mockServices[0].id, true);

    await user.click(screen.getByTitle('Edit Layanan'));
    expect(handleEdit).toHaveBeenCalledWith(mockServices[0]);

    await user.click(screen.getByTitle('Hapus Layanan'));
    expect(handleDelete).toHaveBeenCalledWith(mockServices[0].id);
  });

  it('harus menampilkan pesan kosong jika tidak ada layanan', () => {
    render(
      <ServicesTable
        services={[]}
        onCreateNew={vi.fn()}
        onEdit={vi.fn()}
        onToggleStatus={vi.fn()}
        onPromptDelete={vi.fn()}
        togglePendingId={null}
      />
    );

    expect(screen.getByText(/belum ada data layanan medis/i)).toBeInTheDocument();
  });
});
