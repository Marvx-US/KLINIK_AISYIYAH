'use client';

import React from 'react';
import { Activity, Plus, Trash2, Code2, Sparkles } from 'lucide-react';
import { type ProcedureItem } from '../types';
import { serializeProcedures, parseProceduresToItems } from '../utils/service-serializers';

interface ServiceProceduresEditorProps {
  proceduresList: ProcedureItem[];
  setProceduresList: React.Dispatch<React.SetStateAction<ProcedureItem[]>>;
  proceduresMode: 'cards' | 'raw';
  setProceduresMode: (mode: 'cards' | 'raw') => void;
  rawProcedures: string;
  setRawProcedures: (val: string) => void;
}

export default function ServiceProceduresEditor({
  proceduresList,
  setProceduresList,
  proceduresMode,
  setProceduresMode,
  rawProcedures,
  setRawProcedures,
}: ServiceProceduresEditorProps) {
  const addProcedure = () => {
    setProceduresList((prev) => [
      ...prev,
      { id: `proc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, title: '', description: '' },
    ]);
  };

  const updateProcedure = (index: number, field: 'title' | 'description', value: string) => {
    setProceduresList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeProcedure = (index: number) => {
    setProceduresList((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleProceduresMode = () => {
    if (proceduresMode === 'cards') {
      setRawProcedures(serializeProcedures(proceduresList));
      setProceduresMode('raw');
    } else {
      setProceduresList(parseProceduresToItems(rawProcedures));
      setProceduresMode('cards');
    }
  };

  return (
    <div className="flex flex-col gap-3.5 bg-bg-snow/60 p-5 md:p-6 rounded-3xl border border-border-fine">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-fine/60 pb-3">
        <div>
          <label className="text-sm font-bold text-text-dark flex items-center gap-2">
            <span>Pelayanan & Tindakan Medis</span>
            <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">
              {proceduresList.length} Tindakan
            </span>
          </label>
          <p className="text-xs text-text-muted mt-0.5">
            Daftar tindakan/prosedur yang ditangani pada layanan ini.
          </p>
        </div>
        <button
          type="button"
          onClick={toggleProceduresMode}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-border-fine hover:bg-white text-text-muted hover:text-text-dark flex items-center gap-1.5 transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
        >
          {proceduresMode === 'cards' ? (
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
        name="procedures"
        value={proceduresMode === 'cards' ? serializeProcedures(proceduresList) : rawProcedures}
      />

      {proceduresMode === 'cards' ? (
        <div className="flex flex-col gap-3">
          {proceduresList.length === 0 ? (
            <div className="py-8 text-center bg-white rounded-2xl border border-dashed border-border-fine text-text-muted text-xs flex flex-col items-center justify-center gap-2">
              <Activity className="w-6 h-6 text-border-fine" />
              <p>Belum ada tindakan medis yang ditambahkan.</p>
            </div>
          ) : (
            proceduresList.map((item, index) => (
              <div
                key={item.id}
                className="p-4 bg-white rounded-2xl border border-border-fine shadow-xs hover:border-primary/40 transition-all flex flex-col gap-3 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                    Tindakan #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeProcedure(index)}
                    className="text-text-muted hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    title="Hapus Tindakan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-1">
                    <label className="text-[11px] font-bold text-text-dark mb-1 block">Nama Tindakan / Judul</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateProcedure(index, 'title', e.target.value)}
                      placeholder="Contoh: Resusitasi Jantung Paru (RJP)"
                      className="w-full px-3.5 py-2.5 bg-bg-snow border border-border-fine rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[11px] font-bold text-text-dark mb-1 block">Deskripsi Tindakan Medis</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateProcedure(index, 'description', e.target.value)}
                      placeholder="Contoh: Tindakan penyelamatan jiwa..."
                      className="w-full px-3.5 py-2.5 bg-bg-snow border border-border-fine rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            ))
          )}

          <button
            type="button"
            onClick={addProcedure}
            className="w-full py-3.5 border-2 border-dashed border-primary/30 hover:border-primary text-primary hover:bg-primary/5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer mt-1"
          >
            <Plus className="w-4 h-4" />
            Tambah Tindakan Medis Baru
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <textarea
            rows={5}
            value={rawProcedures}
            onChange={(e) => setRawProcedures(e.target.value)}
            placeholder="Format per baris: Judul | Deskripsi&#10;Resusitasi Jantung Paru | Penyelamatan jiwa...&#10;Bedah Minor | Penjahitan luka..."
            className="w-full px-5 py-3.5 bg-white border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium leading-relaxed font-mono resize-y min-h-[120px]"
          />
          <p className="text-[11px] text-text-muted font-medium">
            Format teks cepat: <code>Judul | Deskripsi</code> (1 tindakan per baris).
          </p>
        </div>
      )}
    </div>
  );
}
