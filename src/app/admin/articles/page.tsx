import React from 'react';
import { getAllArticles } from '@/core/services/articleService';
import ArticlesManager from '@/features/articles/components/ArticlesManager';

export const revalidate = 0;

export default async function AdminArticlesPage() {
  let articles: Awaited<ReturnType<typeof getAllArticles>> = [];

  try {
    articles = await getAllArticles();
  } catch (error) {
    console.error('Error fetching articles for admin:', error);
  }

  return <ArticlesManager initialArticles={articles} />;
}
