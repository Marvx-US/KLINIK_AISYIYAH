import React from 'react';
import { getArticles } from '@/features/articles/queries/article-queries';
import ArticlesManager from '@/features/articles/components/articles-manager';

export const revalidate = 0;

export default async function AdminArticlesPage() {
  let articles: Awaited<ReturnType<typeof getArticles>> = [];

  try {
    articles = await getArticles();
  } catch (error) {
    console.error('Error fetching articles for admin:', error);
  }

  return <ArticlesManager initialArticles={articles} />;
}
