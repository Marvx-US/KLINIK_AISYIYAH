'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Heart } from 'lucide-react';
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 z-50 flex justify-center w-full transition-all duration-500 ${
      isScrolled ? 'pt-4 px-4 sm:px-6' : 'pt-6 px-4 sm:px-8'
    } pb-4`}>
      <div 
        className={`w-full max-w-6xl transition-all duration-500 flex flex-col ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-2xl border border-white/50 shadow-md rounded-[2rem]'
            : 'bg-white/95 backdrop-blur-md border border-border-fine shadow-sm rounded-[2rem]'
        }`}
      >
        <div className={`flex justify-between items-center px-6 transition-all duration-500 ${
          isScrolled ? 'h-16' : 'h-20'
        }`}>
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white transition-transform group-hover:scale-105 duration-300 shadow-sm">
                <Heart className="h-5 w-5 fill-current" />
              </div>
              <div>
                <span className="font-heading font-extrabold text-xl tracking-tight text-text-dark">
                  {KLINIK_INFO.name.split(' ')[0]}{' '}
                  <span className="text-primary">{KLINIK_INFO.name.split(' ')[1]}</span>
                </span>
                <p className="text-[10px] text-text-muted font-sans tracking-widest uppercase -mt-1 hidden sm:block">
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
                      ? 'bg-primary-light/50 text-primary' 
                      : 'text-text-muted hover:text-text-dark hover:bg-bg-snow'
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
              className="text-text-muted hover:text-primary p-2 focus:outline-none bg-bg-snow rounded-full transition-colors"
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
          <div className="mx-4 border-t border-border-fine/40"></div>
          <div className="flex flex-col space-y-2 p-4 pt-4 rounded-b-3xl">
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
