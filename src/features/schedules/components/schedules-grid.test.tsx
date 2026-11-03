import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import SchedulesGrid from './schedules-grid';

describe('SchedulesGrid Component UI (Bab 4.4 RTL)', () => {
  const mockSchedules = [
    {
      id: 1,
      poli: 'Poli Anak',
      doctorName: 'dr. Ahmad Sp.A',
      scheduleInfo: 'Senin & Rabu: 10:00 - 14:00',
      isActive: true,
      serviceId: null,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
  ];

  it('harus merender kartu jadwal dokter dengan info poli, dokter, dan waktu', () => {
    render(
      <SchedulesGrid
        schedules={mockSchedules}
        onCreateNew={vi.fn()}
        onEdit={vi.fn()}
        onToggle={vi.fn()}
        onConfirmDelete={vi.fn()}
        isToggling={null}
        isDeleting={null}
      />
    );

    expect(screen.getByText('Poli Anak')).toBeInTheDocument();
    expect(screen.getByText('dr. Ahmad Sp.A')).toBeInTheDocument();
    expect(screen.getByText('Senin & Rabu: 10:00 - 14:00')).toBeInTheDocument();
    expect(screen.getByText('Aktif')).toBeInTheDocument();
  });

  it('harus memicu callback aksi saat tombol tambah, sembunyikan, edit, dan hapus diklik', async () => {
    const user = userEvent.setup();
    const handleCreate = vi.fn();
    const handleToggle = vi.fn();
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();

    render(
      <SchedulesGrid
        schedules={mockSchedules}
        onCreateNew={handleCreate}
        onEdit={handleEdit}
        onToggle={handleToggle}
        onConfirmDelete={handleDelete}
        isToggling={null}
        isDeleting={null}
      />
    );

    await user.click(screen.getByRole('button', { name: /tambah jadwal/i }));
    expect(handleCreate).toHaveBeenCalledTimes(1);

    await user.click(screen.getByTitle('Sembunyikan'));
    expect(handleToggle).toHaveBeenCalledWith(mockSchedules[0].id, true);

    await user.click(screen.getByTitle('Edit'));
    expect(handleEdit).toHaveBeenCalledWith(mockSchedules[0]);

    await user.click(screen.getByTitle('Hapus'));
    expect(handleDelete).toHaveBeenCalledWith(mockSchedules[0].id, 'Poli Anak');
  });

  it('harus menampilkan pesan kosong jika daftar jadwal dokter kosong', () => {
    render(
      <SchedulesGrid
        schedules={[]}
        onCreateNew={vi.fn()}
        onEdit={vi.fn()}
        onToggle={vi.fn()}
        onConfirmDelete={vi.fn()}
        isToggling={null}
        isDeleting={null}
      />
    );

    expect(screen.getByText(/belum ada jadwal/i)).toBeInTheDocument();
  });
});
