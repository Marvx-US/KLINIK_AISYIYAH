'use client';

import React from 'react';
import { Activity, Plus, Trash2, Code2, Sparkles } from 'lucide-react';
import { type PriceItemState } from '../types';
import { serializePriceList, parsePriceListToItems } from '../utils/service-serializers';

interface ServicePricesEditorProps {
  priceItemsList: PriceItemState[];
  setPriceItemsList: React.Dispatch<React.SetStateAction<PriceItemState[]>>;
  priceListMode: 'cards' | 'raw';
  setPriceListMode: (mode: 'cards' | 'raw') => void;
  rawPriceList: string;
  setRawPriceList: (val: string) => void;
}

export default function ServicePricesEditor({
  priceItemsList,
  setPriceItemsList,
  priceListMode,
  setPriceListMode,
  rawPriceList,
  setRawPriceList,
}: ServicePricesEditorProps) {
  const addPriceItem = () => {
    setPriceItemsList((prev) => [
      ...prev,
      { id: `price-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, name: '', price: '' },
    ]);
  };

  const updatePriceItem = (index: number, field: 'name' | 'price', value: string) => {
    setPriceItemsList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removePriceItem = (index: number) => {
    setPriceItemsList((prev) => prev.filter((_, i) => i !== index));
  };

  const togglePriceListMode = () => {
    if (priceListMode === 'cards') {
      setRawPriceList(serializePriceList(priceItemsList));
      setPriceListMode('raw');
    } else {
      setPriceItemsList(parsePriceListToItems(rawPriceList));
      setPriceListMode('cards');
    }
  };

  return (
    <div className="flex flex-col gap-3.5 bg-bg-snow/60 p-5 md:p-6 rounded-3xl border border-border-fine">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-fine/60 pb-3">
        <div>
          <label className="text-sm font-bold text-text-dark flex items-center gap-2">
            <span>Daftar Estimasi Tarif & Harga</span>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
              {priceItemsList.length} Item Tarif
            </span>
          </label>
          <p className="text-xs text-text-muted mt-0.5">
            Daftar biaya paket tindakan, vaksinasi, atau pemeriksaan.
          </p>
        </div>
        <button
          type="button"
          onClick={togglePriceListMode}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-border-fine hover:bg-white text-text-muted hover:text-text-dark flex items-center gap-1.5 transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
        >
          {priceListMode === 'cards' ? (
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
        name="priceList"
        value={priceListMode === 'cards' ? serializePriceList(priceItemsList) : rawPriceList}
      />

      {priceListMode === 'cards' ? (
        <div className="flex flex-col gap-2.5">
          {priceItemsList.length === 0 ? (
            <div className="py-8 text-center bg-white rounded-2xl border border-dashed border-border-fine text-text-muted text-xs flex flex-col items-center justify-center gap-2">
              <Activity className="w-6 h-6 text-border-fine" />
              <p>Belum ada item tarif / harga yang ditambahkan.</p>
            </div>
          ) : (
            priceItemsList.map((item, index) => (
              <div
                key={item.id}
                className="p-3.5 bg-white rounded-2xl border border-border-fine shadow-xs hover:border-primary/40 transition-all flex items-center gap-3 group"
              >
                <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full shrink-0">
                  #{index + 1}
                </span>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updatePriceItem(index, 'name', e.target.value)}
                      placeholder="Nama Tindakan / Vaksin (Contoh: Vaksin Influenza)"
                      className="w-full px-3.5 py-2.5 bg-bg-snow border border-border-fine rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs font-bold text-primary">Rp</span>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={item.price}
                      onChange={(e) => updatePriceItem(index, 'price', e.target.value)}
                      placeholder="Nominal Angka (Contoh: 250000)"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-bg-snow border border-border-fine rounded-xl text-xs font-bold text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removePriceItem(index)}
                  className="text-text-muted hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
                  title="Hapus Tarif Ini"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}

          <button
            type="button"
            onClick={addPriceItem}
            className="w-full py-3.5 border-2 border-dashed border-primary/30 hover:border-primary text-primary hover:bg-primary/5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer mt-1"
          >
            <Plus className="w-4 h-4" />
            Tambah Item Tarif / Harga Baru
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <textarea
            rows={5}
            value={rawPriceList}
            onChange={(e) => setRawPriceList(e.target.value)}
            placeholder="Format: Nama: Harga&#10;Vaksin Influenza: 250000&#10;Vaksin Meningitis: 350000"
            className="w-full px-5 py-3.5 bg-white border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium leading-relaxed font-mono resize-y min-h-[120px]"
          />
          <p className="text-[11px] text-text-muted font-medium">
            Format teks cepat: <code>Nama Tindakan: Harga</code> (1 item per baris).
          </p>
        </div>
      )}
    </div>
  );
}
