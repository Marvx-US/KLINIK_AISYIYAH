'use client';

import React from 'react';
import { HelpCircle, Plus, Trash2, Code2, Sparkles } from 'lucide-react';
import { type FaqItemState } from '../types';
import { serializeFaq, parseFaqToItems } from '../utils/service-serializers';

interface ServiceFaqEditorProps {
  faqList: FaqItemState[];
  setFaqList: React.Dispatch<React.SetStateAction<FaqItemState[]>>;
  faqMode: 'cards' | 'raw';
  setFaqMode: (mode: 'cards' | 'raw') => void;
  rawFaq: string;
  setRawFaq: (val: string) => void;
}

export default function ServiceFaqEditor({
  faqList,
  setFaqList,
  faqMode,
  setFaqMode,
  rawFaq,
  setRawFaq,
}: ServiceFaqEditorProps) {
  const addFaq = () => {
    setFaqList((prev) => [
      ...prev,
      { id: `faq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, question: '', answer: '' },
    ]);
  };

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    setFaqList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeFaq = (index: number) => {
    setFaqList((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleFaqMode = () => {
    if (faqMode === 'cards') {
      setRawFaq(serializeFaq(faqList));
      setFaqMode('raw');
    } else {
      setFaqList(parseFaqToItems(rawFaq));
      setFaqMode('cards');
    }
  };

  return (
    <div className="flex flex-col gap-3.5 bg-bg-snow/60 p-5 md:p-6 rounded-3xl border border-border-fine">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-fine/60 pb-3">
        <div>
          <label className="text-sm font-bold text-text-dark flex items-center gap-2">
            <span>Tanya Jawab Layanan (FAQ)</span>
            <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">
              {faqList.length} FAQ
            </span>
          </label>
          <p className="text-xs text-text-muted mt-0.5">
            Pertanyaan umum dan jawaban seputar layanan ini.
          </p>
        </div>
        <button
          type="button"
          onClick={toggleFaqMode}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-border-fine hover:bg-white text-text-muted hover:text-text-dark flex items-center gap-1.5 transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
        >
          {faqMode === 'cards' ? (
            <>
              <Code2 className="w-3.5 h-3.5 text-primary" />
              <span>Mode Teks Cepat</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Mode Kartu Mudah</span>
            </>
          )}
        </button>
      </div>

      <input
        type="hidden"
        name="faq"
        value={faqMode === 'cards' ? serializeFaq(faqList) : rawFaq}
      />

      {faqMode === 'cards' ? (
        <div className="flex flex-col gap-3">
          {faqList.length === 0 ? (
            <div className="py-8 text-center bg-white rounded-2xl border border-dashed border-border-fine text-text-muted text-xs flex flex-col items-center justify-center gap-2">
              <HelpCircle className="w-6 h-6 text-border-fine" />
              <p>Belum ada pertanyaan FAQ yang ditambahkan.</p>
            </div>
          ) : (
            faqList.map((item, index) => (
              <div
                key={item.id}
                className="p-4 bg-white rounded-2xl border border-border-fine shadow-xs hover:border-primary/40 transition-all flex flex-col gap-3 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                    Pertanyaan #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="text-text-muted hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    title="Hapus FAQ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex flex-col gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-text-dark mb-1 block">Pertanyaan (Question)</label>
                    <input
                      type="text"
                      value={item.question}
                      onChange={(e) => updateFaq(index, 'question', e.target.value)}
                      placeholder="Contoh: Apakah IGD melayani pasien non-darurat?"
                      className="w-full px-3.5 py-2.5 bg-bg-snow border border-border-fine rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-text-dark mb-1 block">Jawaban (Answer)</label>
                    <textarea
                      rows={2}
                      value={item.answer}
                      onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                      placeholder="Contoh: IGD memprioritaskan kondisi gawat darurat medis..."
                      className="w-full px-3.5 py-2.5 bg-bg-snow border border-border-fine rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                    />
                  </div>
                </div>
              </div>
            ))
          )}

          <button
            type="button"
            onClick={addFaq}
            className="w-full py-3.5 border-2 border-dashed border-primary/30 hover:border-primary text-primary hover:bg-primary/5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer mt-1"
          >
            <Plus className="w-4 h-4" />
            Tambah Pertanyaan FAQ Baru
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <textarea
            rows={5}
            value={rawFaq}
            onChange={(e) => setRawFaq(e.target.value)}
            placeholder="Format per baris: Pertanyaan | Jawaban&#10;Apakah IGD 24 jam? | Ya, IGD 24 jam nonstop."
            className="w-full px-5 py-3.5 bg-white border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium leading-relaxed font-mono resize-y min-h-[120px]"
          />
          <p className="text-[11px] text-text-muted font-medium">
            Format teks cepat: <code>Pertanyaan | Jawaban</code> (1 FAQ per baris).
          </p>
        </div>
      )}
    </div>
  );
}
