'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // delay in milliseconds
}

/**
 * ScrollReveal — Komponen animasi masuk saat di-scroll menggunakan Intersection Observer.
 * Ringan, cepat, dan tidak membebani performa rendering website.
 */
export default function ScrollReveal({ children, className = '', delay = 0 }: ScrollRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Gunakan Intersection Observer bawaan browser
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          // Hentikan pemantauan setelah elemen muncul agar menghemat memori
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        threshold: 0.05, // Picu ketika 5% elemen terlihat di viewport
        rootMargin: '0px 0px -40px 0px', // Picu sedikit sebelum elemen masuk sepenuhnya
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-[800ms] cubic-bezier(0.16, 1, 0.3, 1) ${
        isRevealed 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-12 pointer-events-none'
      } ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
