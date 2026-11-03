import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ClinicPhotoPreviewCard from './clinic-photo-preview-card';

describe('ClinicPhotoPreviewCard Component UI (Bab 4.4 RTL)', () => {
  it('harus merender gambar aktif saat displaySrc ada', () => {
    render(
      <ClinicPhotoPreviewCard
        displaySrc="/uploads/clinic/about.jpg"
        preview={null}
        onClick={vi.fn()}
      />
    );

    expect(screen.getByRole('img', { name: /foto tentang klinik/i })).toBeInTheDocument();
    expect(screen.getByText(/foto aktif saat ini/i)).toBeInTheDocument();
  });

  it('harus menampilkan badge belum disimpan jika preview ada', () => {
    render(
      <ClinicPhotoPreviewCard
        displaySrc="blob:http://localhost/temp-img"
        preview="blob:http://localhost/temp-img"
        onClick={vi.fn()}
      />
    );

    expect(screen.getByText(/pratinjau — belum disimpan/i)).toBeInTheDocument();
  });

  it('harus memicu onClick saat area gambar diklik', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <ClinicPhotoPreviewCard
        displaySrc={null}
        preview={null}
        onClick={handleClick}
      />
    );

    await user.click(screen.getByRole('button', { name: /klik untuk pilih gambar baru/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
