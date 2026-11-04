'use client';

import React from 'react';
import type { MonthlySurveyStat } from '../types';

interface SurveyShareCardProps {
  stat: MonthlySurveyStat;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

function getGradeColors(grade: string) {
  switch (grade) {
    case 'A':
      return { accent: '#059669', light: '#ecfdf5', badge: '#d1fae5', text: '#065f46' };
    case 'B':
      return { accent: '#0EA5A4', light: '#f0fdfa', badge: '#ccfbf1', text: '#134e4a' };
    case 'C':
      return { accent: '#d97706', light: '#fffbeb', badge: '#fef3c7', text: '#78350f' };
    default:
      return { accent: '#dc2626', light: '#fff1f2', badge: '#ffe4e6', text: '#881337' };
  }
}

export default function SurveyShareCard({ stat, cardRef }: SurveyShareCardProps) {
  const colors = getGradeColors(stat.ikmGrade);
  const scorePercent = ((stat.ikmScore - 25) / 75) * 100;

  return (
    <div
      ref={cardRef}
      style={{
        width: '480px',
        minHeight: '580px',
        fontFamily: '"Inter", "Segoe UI", sans-serif',
        background: '#ffffff',
        borderRadius: '24px',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
      }}
    >
      {/* Header Gradient */}
      <div
        style={{
          background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accent}cc 100%)`,
          padding: '28px 32px 24px',
          position: 'relative',
        }}
      >
        {/* Dekoratif lingkaran */}
        <div
          style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-30px',
            right: '40px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255,255,255,0.18)',
              borderRadius: '100px',
              padding: '4px 12px',
              marginBottom: '12px',
            }}
          >
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#fff', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Survei Kepuasan Masyarakat
            </span>
          </div>

          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', marginBottom: '4px', fontWeight: 500 }}>
            Klinik Pratama Aisyiyah Pangkajene
          </p>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.2 }}>
            {stat.monthLabel}
          </h2>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '24px 32px' }}>

        {/* Skor IKM Utama */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: colors.light,
            borderRadius: '16px',
            padding: '20px 24px',
            marginBottom: '20px',
            border: `1.5px solid ${colors.badge}`,
          }}
        >
          <div>
            <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', fontWeight: 600 }}>
              Indeks Kepuasan Masyarakat (IKM)
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '48px', fontWeight: 900, color: colors.accent, lineHeight: 1, letterSpacing: '-2px' }}>
                {stat.ikmScore.toFixed(2)}
              </span>
              <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: 600 }}>/100</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: colors.accent,
                borderRadius: '12px',
                padding: '8px 16px',
                gap: '2px',
              }}
            >
              <span style={{ fontSize: '24px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>
                {stat.ikmGrade}
              </span>
              <span style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {stat.ikmCategory}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar IKM */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: 600 }}>Skala IKM Konversi</span>
            <span style={{ fontSize: '10px', color: '#6b7280' }}>25 ——————————— 100</span>
          </div>
          <div style={{ background: '#f3f4f6', borderRadius: '100px', height: '8px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${Math.min(100, Math.max(0, scorePercent))}%`,
                background: `linear-gradient(90deg, ${colors.accent}99, ${colors.accent})`,
                borderRadius: '100px',
              }}
            />
          </div>
        </div>

        {/* Statistik Ringkas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '12px 14px', border: '1px solid #e5e7eb' }}>
            <p style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 600, marginBottom: '2px' }}>Jumlah Responden</p>
            <p style={{ fontSize: '18px', fontWeight: 800, color: '#111827', margin: 0 }}>
              {stat.totalRespondents} <span style={{ fontSize: '11px', fontWeight: 500, color: '#6b7280' }}>Pasien</span>
            </p>
          </div>
          <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '12px 14px', border: '1px solid #e5e7eb' }}>
            <p style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 600, marginBottom: '2px' }}>NRR Tertimbang</p>
            <p style={{ fontSize: '18px', fontWeight: 800, color: '#111827', margin: 0 }}>
              {stat.nrrTertimbang.toFixed(2)} <span style={{ fontSize: '11px', fontWeight: 500, color: '#6b7280' }}>/ 4.00</span>
            </p>
          </div>
        </div>

        {/* 9 Unsur Mini Bar */}
        {stat.questionAverages.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
              Penilaian 9 Unsur Pelayanan
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {stat.questionAverages.slice(0, 9).map((q) => (
                <div key={q.questionId} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 800,
                      color: colors.accent,
                      minWidth: '24px',
                      background: colors.light,
                      borderRadius: '4px',
                      padding: '1px 4px',
                      textAlign: 'center',
                    }}
                  >
                    {q.unsurCode}
                  </span>
                  <span style={{ fontSize: '9px', color: '#374151', flex: 1, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {q.shortLabel}
                  </span>
                  <div style={{ width: '80px', background: '#e5e7eb', borderRadius: '100px', height: '5px', flexShrink: 0 }}>
                    <div
                      style={{
                        width: `${q.percentage}%`,
                        height: '100%',
                        background: colors.accent,
                        borderRadius: '100px',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: '#374151', minWidth: '24px', textAlign: 'right' }}>
                    {q.averageScore.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            borderTop: '1px solid #f3f4f6',
            paddingTop: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '9px', color: '#9ca3af', fontWeight: 500 }}>
            Berdasarkan PermenPAN-RB No. 14 Tahun 2017
          </span>
          <span style={{ fontSize: '9px', color: '#9ca3af', fontWeight: 600 }}>
            klinikaisyiyahpangkajene.com
          </span>
        </div>
      </div>
    </div>
  );
}

