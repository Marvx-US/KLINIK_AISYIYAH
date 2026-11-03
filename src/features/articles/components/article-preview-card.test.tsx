import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ArticlePreviewCard from './article-preview-card';

describe('ArticlePreviewCard Component UI Test (Bab 4.4 RTL)', () => {
  it('harus merender judul default dan kategori default jika prop bernilai string kosong', () => {
    // Arrange & Act
    render(
      <ArticlePreviewCard
        title=""
        summary=""
        category=""
        status="DRAFT"
        coverImagePreview={null}
        editorContent=""
      />
    );

    // Assert
    expect(screen.getByText(/judul artikel anda akan tampil di sini/i)).toBeInTheDocument();
    expect(screen.getByText(/kategori artikel/i)).toBeInTheDocument();
    expect(screen.getByText(/isi konten masih kosong/i)).toBeInTheDocument();
  });

  it('harus merender judul spesifik, ringkasan, dan konten HTML yang tersanitasi dengan aman', () => {
    // Arrange & Act
    render(
      <ArticlePreviewCard
        title="Tips Mencegah Hipertensi"
        summary="Ringkasan penting tentang pola makan rendah garam."
        category="Kesehatan"
        status="PUBLISHED"
        coverImagePreview="/uploads/hipertensi.webp"
        editorContent="<p>Kurangi konsumsi natrium harian.</p><script>alert('xss')</script>"
      />
    );

    // Assert
    expect(screen.getByText('Tips Mencegah Hipertensi')).toBeInTheDocument();
    expect(screen.getByText('Ringkasan penting tentang pola makan rendah garam.')).toBeInTheDocument();
    expect(screen.getByText('Kurangi konsumsi natrium harian.')).toBeInTheDocument();
    // Skrip berbahaya harus dibersihkan oleh sanitizeHtml
    expect(document.querySelector('script')).toBeNull();
  });
});
