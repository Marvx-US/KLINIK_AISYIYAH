import React from 'react';
import { Heart } from 'lucide-react';

interface EmptyStateProps {
  /** Teks judul kosong */
  title: string;
  /** Deskripsi opsional */
  description?: string;
}

/**
 * EmptyState — Tampilan ketika data kosong atau tidak ditemukan.
 */
export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="text-center py-20 bg-white border-fine rounded-2xl">
      <Heart className="h-12 w-12 text-primary/30 mx-auto mb-4" />
      <p className="text-text-muted text-lg font-medium">{title}</p>
      {description && <p className="text-text-muted text-sm mt-1">{description}</p>}
    </div>
  );
}
