'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

/**
 * SplashScreen — Animasi loading premium saat website pertama kali dibuka.
 * Muncul sekali saja per sesi browser untuk menjaga kenyamanan navigasi pengguna.
 */
export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Cek apakah user sudah melihat splash screen pada sesi ini
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash === 'true') {
      setIsVisible(false);
      return;
    }

    // Picu animasi masuk di frame berikutnya agar transition-opacity bekerja
    const animFrame = requestAnimationFrame(() => {
      setIsAnimating(true);
    });

    // Waktu tunggu animasi progress bar (2 detik)
    const loadTimer = setTimeout(() => {
      setIsAnimating(false);
      
      // Berikan jeda untuk animasi fade-out selesai sebelum menghapus elemen dari DOM
      const fadeTimer = setTimeout(() => {
        setIsVisible(false);
        sessionStorage.setItem('hasSeenSplash', 'true');
      }, 700);

      return () => clearTimeout(fadeTimer);
    }, 2000);

    return () => {
      cancelAnimationFrame(animFrame);
      clearTimeout(loadTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0c0f17] transition-opacity duration-700 ease-in-out ${
        isAnimating ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex flex-col items-center max-w-xs w-full px-6">
        {/* Container Logo dengan efek glow */}
        <div
          className={`relative w-20 h-20 mb-6 transition-all duration-1000 ease-out transform ${
            isAnimating ? 'scale-100 opacity-100 rotate-0' : 'scale-90 opacity-0 rotate-3'
          }`}
        >
          <Image
            src="/logo.png"
            alt="Logo Klinik Aisyiyah"
            width={80}
            height={80}
            className="object-contain drop-shadow-[0_0_15px_rgba(13,148,136,0.5)]"
            priority
          />
        </div>

        {/* Animasi teks Nama Klinik */}
        <div className="text-center mb-6 overflow-hidden">
          <h1
            className={`font-heading font-extrabold text-2xl tracking-widest text-[#FDFBF7] transition-all duration-1000 delay-200 ease-out transform ${
              isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
            }`}
          >
            KLINIK <span className="text-[#0D9488]">AISYIYAH</span>
          </h1>
          <p
            className={`text-[9px] tracking-[0.3em] text-[#57534E] uppercase mt-1.5 transition-all duration-1000 delay-300 ease-out transform ${
              isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
            }`}
          >
            Kesehatan Masyarakat
          </p>
        </div>

        {/* Progress Bar Loading Line */}
        <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-[#0D9488] shadow-[0_0_8px_#0D9488] transition-all duration-[1900ms] ease-out rounded-full"
            style={{
              width: isAnimating ? '100%' : '0%',
            }}
          />
        </div>
      </div>
    </div>
  );
}
