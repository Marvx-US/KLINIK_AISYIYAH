import React from 'react';
import { db } from '@/lib/db';
import { type Article } from '@prisma/client';
import ArticlesManager from './ArticlesManager';

export const revalidate = 0;

export default async function AdminArticlesPage() {
  let articles: Article[] = [];

  try {
    articles = await db.article.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching articles for admin:', error);
  }

  return <ArticlesManager initialArticles={articles} />;
}
