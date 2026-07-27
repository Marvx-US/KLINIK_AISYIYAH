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
    <header className={`fixed top-0 z-50 flex justify-center w-full transition-all duration-500 ${
      isScrolled ? 'pt-3 px-4 sm:px-6' : 'pt-5 px-4 sm:px-8'
    } pb-3`}>
      <div 
        className={`w-full max-w-6xl transition-all duration-500 flex flex-col ${
          isDark 
            ? 'bg-white/30 backdrop-blur-[28px] border border-white/40 shadow-[0_8px_32px_0_rgba(13,148,136,0.10),0_2px_8px_0_rgba(0,0,0,0.08)] rounded-[2rem]'
            : 'bg-transparent border border-transparent'
        }`}
      >
        <div className={`flex justify-between items-center px-6 transition-all duration-500 ${
          isScrolled ? 'h-16' : 'h-20'
        }`}>
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0 transition-transform group-hover:scale-105 duration-300">
                <Image
                  src="/logo.png"
                  alt="Logo Klinik Pratama Aisyiyah"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            <div>
                <span className={`font-heading font-extrabold text-xl tracking-tight drop-shadow-sm transition-colors duration-300 ${
                  isDark ? 'text-text-dark' : 'text-white'
                }`}>
                  {KLINIK_INFO.name.split(' ')[0]}{' '}
                  <span className="text-primary">{KLINIK_INFO.name.split(' ')[1]}</span>
                </span>
                <p className={`text-[10px] font-sans tracking-widest uppercase -mt-1 hidden sm:block transition-colors duration-300 ${
                  isDark ? 'text-text-muted' : 'text-white/70'
                }`}>
                  {KLINIK_INFO.tagline}
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 items-center">
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-sans text-sm font-bold tracking-wide transition-all duration-300 px-4 py-2 rounded-full ${
                    isActive 
                      ? isDark ? 'bg-primary-light/50 text-primary' : 'bg-white/20 text-white'
                      : isDark ? 'text-text-muted hover:text-text-dark hover:bg-black/5' : 'text-white/80 hover:text-white hover:bg-white/15'
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
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white font-sans text-sm font-bold transition-all duration-300 hover:bg-primary-dark active:scale-[0.98] shadow-md hover:shadow-lg"
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
                isDark ? 'text-text-muted hover:text-primary bg-bg-snow' : 'text-white hover:text-white/70 bg-white/15'
              }`}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${
            isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="mx-4 border-t border-white/30"></div>
          <div className="flex flex-col space-y-1.5 p-4 pt-4 rounded-b-3xl">
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`font-sans text-sm font-bold tracking-wide px-4 py-3 rounded-2xl transition-colors ${
                    isActive ? 'bg-primary-light/50 text-primary' : 'text-text-muted hover:bg-bg-snow hover:text-text-dark'
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
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-primary text-white font-sans text-sm font-bold transition-all shadow-md"
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
