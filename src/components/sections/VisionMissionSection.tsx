import React from 'react';
import { Target, Compass } from 'lucide-react';

interface VisionMissionSectionProps {
  vision?: string | null;
  mission?: string | null;
}

const DEFAULT_VISION =
  'Menjadi klinik pratama pilihan utama masyarakat Sidenreng Rappang yang memberikan pelayanan kesehatan berkualitas, terjangkau, dan berkeadilan berlandaskan nilai-nilai Islami.';

const DEFAULT_MISSION =
  '1. Memberikan pelayanan medis yang profesional, ramah, dan komprehensif kepada seluruh lapisan masyarakat.\n2. Menyediakan tenaga kesehatan yang kompeten, berdedikasi, dan terus meningkatkan kompetensi.\n3. Membangun fasilitas kesehatan yang bersih, nyaman, dan berstandar tinggi.\n4. Mengedepankan pendekatan promotif, preventif, kuratif, dan rehabilitatif secara terpadu.\n5. Berperan aktif dalam program kesehatan masyarakat dan pemberdayaan komunitas.';

export default function VisionMissionSection({
  vision,
  mission,
}: VisionMissionSectionProps) {
  const displayVision = vision || DEFAULT_VISION;
  const displayMission = mission || DEFAULT_MISSION;

  const missionPoints = displayMission
    .split('\n')
    .map((line) => line.replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean);

  return (
    <section className="py-8 md:py-14 w-full px-6 sm:px-8 lg:px-12 bg-bg-snow border-b border-border-fine relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2">
            Arah &amp; Tujuan Kami
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-text-dark tracking-tight leading-tight">
            Visi &amp; Misi <span className="text-primary italic">Klinik Aisyiyah</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">

          {/* VISI — 2 cols */}
          <div className="lg:col-span-2 flex flex-col h-full">
            <div className="relative bg-primary rounded-3xl p-8 text-white flex flex-col h-full overflow-hidden shadow-lg shadow-primary/20">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Compass className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/70">Visi</p>
                    <p className="text-sm font-bold text-white">Arah Jangka Panjang</p>
                  </div>
                </div>

                <blockquote className="flex-1">
                  <p className="text-white text-base sm:text-lg leading-relaxed font-medium">
                    &ldquo;{displayVision}&rdquo;
                  </p>
                </blockquote>

                <div className="mt-8 pt-6 border-t border-white/20">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />
                    <span className="text-[11px] font-bold text-white/60 uppercase tracking-widest">
                      Klinik Pratama Aisyiyah Pangkajene
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MISI — 3 cols */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-border-fine p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-text-muted">Misi</p>
                  <p className="text-sm font-bold text-text-dark">Langkah Nyata Kami</p>
                </div>
              </div>

              <ol className="space-y-4">
                {missionPoints.map((point, idx) => (
                  <li key={idx} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-heading font-extrabold text-sm transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                      {idx + 1}
                    </div>
                    <p className="text-text-dark text-sm leading-relaxed pt-1">{point}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

