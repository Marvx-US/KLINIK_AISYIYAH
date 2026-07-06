'use client';

import React, { useRef, useEffect, useState } from 'react';
import { 
  Bold, Italic, Underline, Strikethrough, 
  List, ListOrdered, Link2, Eraser,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Image as ImageIcon, Loader2 
} from 'lucide-react';
import { uploadInlineImageAction } from '@/app/actions/upload';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = 'Tuliskan isi konten di sini...' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Sinkronisasi nilai awal hanya sekali (atau jika value berubah secara eksternal)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, val: string | undefined = undefined) => {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
    handleInput();
  };

  const handleLink = () => {
    const url = prompt('Masukkan URL tautan:', 'https://');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const handleHeading = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const level = e.target.value;
    if (level === 'p') {
      execCommand('formatBlock', 'P');
    } else {
      execCommand('formatBlock', `H${level}`);
    }
    e.target.value = ''; // Reset select
  };

  // Helper untuk menyimpan selection range saat upload asinkron
  const saveSelectionRange = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      return sel.getRangeAt(0);
    }
    return null;
  };

  // Helper untuk memulihkan selection range
  const restoreSelectionRange = (range: Range | null) => {
    if (range) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  };

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simpan posisi kursor saat ini
    const range = saveSelectionRange();
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await uploadInlineImageAction(formData);
      if (res.success && res.url) {
        // Fokuskan kembali ke editor
        editorRef.current?.focus();
        // Kembalikan posisi kursor sebelum menyisipkan gambar
        restoreSelectionRange(range);
        
        // Sisipkan gambar
        execCommand('insertImage', res.url);
      } else {
        alert(res.error || 'Gagal mengunggah gambar.');
      }
    } catch (error) {
      console.error('Error uploading inline image:', error);
      alert('Terjadi kesalahan saat mengunggah gambar.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="border border-border-fine rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
      {/* Toolbar */}
      <div className="bg-bg-snow border-b border-border-fine p-2 flex flex-wrap gap-1 items-center">
        {/* Format Judul */}
        <select 
          onChange={handleHeading} 
          className="p-1.5 text-sm bg-white border border-gray-200 rounded-md outline-none focus:border-primary text-text-dark"
          defaultValue=""
        >
          <option value="" disabled>Format Judul</option>
          <option value="p">Teks Biasa</option>
          <option value="2">Judul Besar (H2)</option>
          <option value="3">Judul Sedang (H3)</option>
          <option value="4">Judul Kecil (H4)</option>
        </select>
        
        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* Gaya Huruf */}
        <button type="button" onClick={() => execCommand('bold')} className="p-1.5 text-gray-600 hover:bg-white hover:text-primary rounded-md transition-colors" title="Tebal (Bold)"><Bold className="w-4 h-4" /></button>
        <button type="button" onClick={() => execCommand('italic')} className="p-1.5 text-gray-600 hover:bg-white hover:text-primary rounded-md transition-colors" title="Miring (Italic)"><Italic className="w-4 h-4" /></button>
        <button type="button" onClick={() => execCommand('underline')} className="p-1.5 text-gray-600 hover:bg-white hover:text-primary rounded-md transition-colors" title="Garis Bawah (Underline)"><Underline className="w-4 h-4" /></button>
        <button type="button" onClick={() => execCommand('strikeThrough')} className="p-1.5 text-gray-600 hover:bg-white hover:text-primary rounded-md transition-colors" title="Coret (Strikethrough)"><Strikethrough className="w-4 h-4" /></button>
        
        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* Perataan (Alignment) */}
        <button type="button" onClick={() => execCommand('justifyLeft')} className="p-1.5 text-gray-600 hover:bg-white hover:text-primary rounded-md transition-colors" title="Rata Kiri"><AlignLeft className="w-4 h-4" /></button>
        <button type="button" onClick={() => execCommand('justifyCenter')} className="p-1.5 text-gray-600 hover:bg-white hover:text-primary rounded-md transition-colors" title="Rata Tengah"><AlignCenter className="w-4 h-4" /></button>
        <button type="button" onClick={() => execCommand('justifyRight')} className="p-1.5 text-gray-600 hover:bg-white hover:text-primary rounded-md transition-colors" title="Rata Kanan"><AlignRight className="w-4 h-4" /></button>
        <button type="button" onClick={() => execCommand('justifyFull')} className="p-1.5 text-gray-600 hover:bg-white hover:text-primary rounded-md transition-colors" title="Rata Kanan-Kiri (Justify)"><AlignJustify className="w-4 h-4" /></button>

        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* Daftar / List */}
        <button type="button" onClick={() => execCommand('insertOrderedList')} className="p-1.5 text-gray-600 hover:bg-white hover:text-primary rounded-md transition-colors" title="Daftar Angka"><ListOrdered className="w-4 h-4" /></button>
        <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-1.5 text-gray-600 hover:bg-white hover:text-primary rounded-md transition-colors" title="Daftar Titik"><List className="w-4 h-4" /></button>
        
        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* Tautan & Media */}
        <button type="button" onClick={handleLink} className="p-1.5 text-gray-600 hover:bg-white hover:text-primary rounded-md transition-colors" title="Tambahkan Tautan"><Link2 className="w-4 h-4" /></button>
        
        {/* Tombol Upload Gambar */}
        <button 
          type="button" 
          onClick={handleTriggerFileInput} 
          disabled={isUploading}
          className="p-1.5 text-gray-600 hover:bg-white hover:text-primary rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
          title="Sisipkan Gambar"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          ) : (
            <ImageIcon className="w-4 h-4" />
          )}
        </button>

        <button type="button" onClick={() => execCommand('removeFormat')} className="p-1.5 text-gray-600 hover:bg-white hover:text-red-500 rounded-md transition-colors" title="Hapus Format"><Eraser className="w-4 h-4" /></button>

        {/* File Input Tersembunyi */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImageUpload} 
          accept="image/*" 
          className="hidden" 
        />
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        className="p-4 min-h-[300px] outline-none text-text-dark prose prose-sm sm:prose max-w-none"
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        data-placeholder={placeholder}
      />

      <style jsx global>{`
        div[contentEditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          cursor: text;
        }
      `}</style>
    </div>
  );
}
