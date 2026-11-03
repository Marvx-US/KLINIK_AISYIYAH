'use client';

import { useState, useEffect, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { type Article } from '@prisma/client';
import { saveArticle } from '../actions/save-article';

interface UseArticleFormProps {
  article: Article | null;
  onSuccess: () => void;
}

/**
 * Custom Hook: Logika State & Interaksi Form Artikel (Bab 4.2 HANDBOOK_CLEANCODE.md)
 */
export function useArticleForm({ article, onSuccess }: UseArticleFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(saveArticle, null);

  const [title, setTitle] = useState(article?.title || '');
  const [summary, setSummary] = useState(article?.summary || '');
  const [category, setCategory] = useState(article?.category || '');
  const [status, setStatus] = useState(article?.status || 'DRAFT');
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    article?.coverImage || null
  );
  const [editorContent, setEditorContent] = useState(article?.content || '');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    if (state?.success) {
      onSuccess();
      router.refresh();
    }
  }, [state, router, onSuccess]);

  useEffect(() => {
    return () => {
      if (coverImagePreview && coverImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(coverImagePreview);
      }
    };
  }, [coverImagePreview]);

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (coverImagePreview && coverImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(coverImagePreview);
      }
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  return {
    state,
    formAction,
    isPending,
    title,
    setTitle,
    summary,
    setSummary,
    category,
    setCategory,
    status,
    setStatus,
    coverImagePreview,
    handleCoverImageChange,
    editorContent,
    setEditorContent,
    activeTab,
    setActiveTab,
  };
}
