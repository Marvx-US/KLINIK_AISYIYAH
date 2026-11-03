import type { Article } from '@prisma/client';

export type { Article };

export interface ArticleCardData {
  id: number;
  title: string;
  slug: string;
  summary: string;
  category: string;
  coverImage?: string | null;
  createdAt: Date | string;
}

export interface ArticleFilterParams {
  q?: string;
  category?: string;
}
