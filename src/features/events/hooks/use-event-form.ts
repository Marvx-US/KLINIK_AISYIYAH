'use client';

import { useState, useEffect, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { type Event } from '@prisma/client';
import { saveEvent } from '../actions/save-event';

interface UseEventFormProps {
  event: Event | null;
  onSuccess: () => void;
}

const formatDateForInput = (dateObj: Date | null | undefined): string => {
  if (!dateObj) return '';
  const date = new Date(dateObj);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Custom Hook: Logika State & Interaksi Form Event (Bab 4.2 HANDBOOK_CLEANCODE.md)
 */
export function useEventForm({ event, onSuccess }: UseEventFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(saveEvent, null);

  const [title, setTitle] = useState(event?.title || '');
  const [eventDate, setEventDate] = useState(formatDateForInput(event?.eventDate));
  const [location, setLocation] = useState(event?.location || '');
  const [status, setStatus] = useState(event?.status || 'DRAFT');
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    event?.coverImage || null
  );
  const [editorContent, setEditorContent] = useState(event?.content || '');
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
    eventDate,
    setEventDate,
    location,
    setLocation,
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
