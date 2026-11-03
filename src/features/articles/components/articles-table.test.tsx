import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ArticlesTable from './articles-table';
import { buildMockArticle } from '../../../../tests/factories/article.factory';

describe('ArticlesTable Component UI Test (Bab 4.4 RTL)', () => {
  it('harus merender empty state ketika data artikel kosong', () => {
    // Arrange & Act
    render(
      <ArticlesTable
        articles={[]}
        onEdit={vi.fn()}
        onRequestDelete={vi.fn()}
        deletePendingId={null}
      />
    );

    // Assert
    expect(screen.getByText(/belum ada artikel/i)).toBeInTheDocument();
    expect(screen.getByText(/klik tombol tulis artikel di atas untuk memulai/i)).toBeInTheDocument();
  });

  it('harus merender baris data artikel dengan judul, kategori, dan status yang sesuai', () => {
    // Arrange
    const mockArticles = [
      buildMockArticle({
        id: 1,
        title: 'Manfaat Senam Jantung Sehat',
        category: 'Kebugaran',
        status: 'PUBLISHED',
      }),
      buildMockArticle({
        id: 2,
        title: 'Panduan Asupan Gizi Balita',
        category: 'Gizi',
        status: 'DRAFT',
      }),
    ];

    // Act
    render(
      <ArticlesTable
        articles={mockArticles}
        onEdit={vi.fn()}
        onRequestDelete={vi.fn()}
        deletePendingId={null}
      />
    );

    // Assert
    expect(screen.getByText('Manfaat Senam Jantung Sehat')).toBeInTheDocument();
    expect(screen.getByText('Kebugaran')).toBeInTheDocument();
    expect(screen.getByText('Panduan Asupan Gizi Balita')).toBeInTheDocument();
    expect(screen.getByText('Gizi')).toBeInTheDocument();
  });

  it('harus memicu callback onEdit dan onRequestDelete saat tombol aksi diklik', async () => {
    // Arrange
    const user = userEvent.setup();
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();
    const mockArticle = buildMockArticle({ id: 10, title: 'Artikel Uji Coba Interaksi' });

    render(
      <ArticlesTable
        articles={[mockArticle]}
        onEdit={handleEdit}
        onRequestDelete={handleDelete}
        deletePendingId={null}
      />
    );

    // Act
    const editButton = screen.getByTitle(/edit artikel/i);
    await user.click(editButton);

    const deleteButton = screen.getByTitle(/hapus/i);
    await user.click(deleteButton);

    // Assert
    expect(handleEdit).toHaveBeenCalledTimes(1);
    expect(handleEdit).toHaveBeenCalledWith(mockArticle);
    expect(handleDelete).toHaveBeenCalledTimes(1);
    expect(handleDelete).toHaveBeenCalledWith(10);
  });

  it('harus menonaktifkan tombol hapus saat proses delete sedang berlangsung (deletePendingId matches)', () => {
    // Arrange
    const mockArticle = buildMockArticle({ id: 15, title: 'Artikel Sedang Dihapus' });

    // Act
    render(
      <ArticlesTable
        articles={[mockArticle]}
        onEdit={vi.fn()}
        onRequestDelete={vi.fn()}
        deletePendingId={15}
      />
    );

    // Assert
    const deleteButton = screen.getByTitle(/hapus/i);
    expect(deleteButton).toBeDisabled();
  });
});
