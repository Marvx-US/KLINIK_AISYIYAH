'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, X, Phone } from 'lucide-react';
import { KLINIK_INFO, NAVIGATION_ITEMS } from '@/lib/constants';

/**
 * Navbar — Header navigasi utama untuk halaman publik.
 * Mendukung mobile hamburger menu dan highlight aktif halaman.
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const whatsappUrl = `https://wa.me/${KLINIK_INFO.whatsapp}`;

  // Hanya homepage yang punya hero gelap di belakang navbar
  const isHeroPage = pathname === '/';
  // isDark: true = pakai teks gelap; false = teks putih (di atas hero)
  const isDark = isScrolled || !isHeroPage;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full pt-4 px-4 sm:px-6">
      <div 
        className={`w-full max-w-6xl transition-all duration-300 ease-in-out border flex flex-col overflow-hidden ${
          isDark 
            ? 'bg-white/95 backdrop-blur-md border-white/40 shadow-[0_10px_30px_rgba(13,148,136,0.06),0_2px_8px_rgba(0,0,0,0.04)] rounded-[2rem]'
            : 'bg-white/10 backdrop-blur-md border-white/20 shadow-none rounded-[2rem]'
        }`}
      >
        {/* Main Nav Bar */}
        <div className="flex justify-between items-center w-full px-6 h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-9 w-9 rounded-full overflow-hidden flex-shrink-0 transition-transform group-hover:scale-105 duration-300">
                <Image
                  src="/logo.png"
                  alt="Logo Klinik Pratama Aisyiyah"
                  width={36}
                  height={36}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
              <div>
                <span className={`font-heading font-extrabold text-lg tracking-tight transition-colors duration-300 ${
                  isDark ? 'text-text-dark' : 'text-white'
                }`}>
                  {KLINIK_INFO.name.split(' ')[0]}{' '}
                  <span className="text-primary">{KLINIK_INFO.name.split(' ')[1]}</span>
                </span>
                <p className={`text-[9px] font-sans tracking-widest uppercase -mt-1 hidden sm:block transition-colors duration-300 ${
                  isDark ? 'text-text-muted' : 'text-white/70'
                }`}>
                  {KLINIK_INFO.tagline}
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1.5 items-center">
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-sans text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 px-4 py-2 rounded-full ${
                    isActive 
                      ? isDark 
                        ? 'bg-primary text-white shadow-sm shadow-primary/20' 
                        : 'bg-white text-primary shadow-sm'
                      : isDark 
                        ? 'text-text-muted hover:text-primary hover:bg-primary/5' 
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* CTA Button Desktop */}
          <div className="hidden md:flex items-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full font-sans text-xs sm:text-sm font-bold transition-all duration-300 active:scale-[0.98] shadow-sm hover:shadow-md ${
                isDark 
                  ? 'bg-primary text-white hover:bg-primary-dark hover:shadow-primary/20'
                  : 'bg-white text-primary hover:bg-bg-snow'
              }`}
            >
              <Phone className="h-4 w-4" />
              Hubungi Kami
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
              className={`p-2 focus:outline-none rounded-full transition-colors ${
                isDark ? 'text-text-muted hover:text-primary bg-bg-snow' : 'text-white/20 hover:text-white hover:bg-white/10'
              }`}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-[500px] opacity-100 pb-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="mx-6 border-t border-white/25"></div>
          <div className="flex flex-col space-y-1.5 p-4 pt-4">
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`font-sans text-sm font-bold tracking-wide px-4 py-3 rounded-2xl transition-colors ${
                    isActive 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-text-muted hover:bg-bg-snow hover:text-text-dark'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-primary text-white font-sans text-sm font-bold transition-all shadow-md hover:bg-primary-dark"
              >
                <Phone className="h-4 w-4" />
                Hubungi Kami Sekarang
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
