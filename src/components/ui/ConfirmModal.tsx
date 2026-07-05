import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
  isAlertOnly?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  type = 'warning',
  isLoading = false,
  isAlertOnly = false,
}: ConfirmModalProps) {
  // Cegah scroll pada body saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={!isLoading ? onCancel : undefined}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
              ${type === 'danger' ? 'bg-red-100 text-red-600' : 
                type === 'info' ? 'bg-blue-100 text-blue-600' : 
                'bg-amber-100 text-amber-600'}`}
            >
              {type === 'info' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            </div>
            
            <div className="flex-1 pt-1">
              <h3 className="font-heading font-bold text-lg text-text-dark mb-2">
                {title}
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                {message}
              </p>
            </div>
            
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="text-text-muted hover:text-text-dark transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-bg-snow px-6 py-4 flex gap-3 justify-end border-t border-border-fine">
          {!isAlertOnly && (
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-semibold text-text-muted hover:text-text-dark transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-6 py-2 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-70 flex items-center justify-center min-w-[100px]
              ${type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 
                type === 'info' ? 'bg-primary hover:bg-primary-dark' : 
                'bg-amber-600 hover:bg-amber-700'}`}
          >
            {isLoading ? (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
