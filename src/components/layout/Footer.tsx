import React from 'react';
import Link from 'next/link';
import { Heart, Clock, MapPin, Phone } from 'lucide-react';
import { KLINIK_INFO, KLINIK_HOURS } from '@/lib/constants';

/**
 * Footer — Footer publik yang menampilkan info klinik, jam operasional, dan kontak.
 * Data bersumber dari constants.ts, tidak ada data hardcoded di sini.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-snow border-t border-border-fine mt-auto py-16">
      <div className="w-full px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Kolom 1: Info Klinik */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                <Heart className="h-4 w-4 fill-current" />
              </div>
              <span className="font-heading font-extrabold text-lg text-text-dark">
                {KLINIK_INFO.name.split(' ')[0]}{' '}
                <span className="text-primary">{KLINIK_INFO.name.split(' ')[1]}</span>
              </span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed max-w-sm">
              Berkomitmen menyediakan layanan kesehatan yang profesional, ramah, dan terjangkau bagi
              seluruh lapisan masyarakat berlandaskan nilai-nilai kemanusiaan.
            </p>
          </div>

          {/* Kolom 2: Jam Operasional */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <h3 className="font-heading font-bold text-sm tracking-widest uppercase text-text-dark">
              Jam Operasional
            </h3>
            <ul className="flex flex-col gap-3 text-text-muted text-sm">
              {KLINIK_HOURS.slice(0, 2).map((item) => (
                <li key={item.day} className="flex items-start gap-2">
                  <Clock
                    className={`h-4 w-4 shrink-0 mt-0.5 ${
                      item.closed ? 'text-accent-gold' : 'text-primary'
                    }`}
                  />
                  <div>
                    <p className="font-semibold text-text-dark">{item.day}</p>
                    <p className={item.closed ? 'text-accent-gold font-medium' : ''}>{item.hours}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Lokasi & Kontak */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h3 className="font-heading font-bold text-sm tracking-widest uppercase text-text-dark">
              Lokasi & Kontak
            </h3>
            <ul className="flex flex-col gap-3 text-text-muted text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{KLINIK_INFO.address}</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{KLINIK_INFO.phone}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border-fine mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-text-muted text-xs font-sans">
            &copy; {currentYear} {KLINIK_INFO.name}. Hak Cipta Dilindungi.
          </p>
          <div className="flex gap-6">
            <Link
              href="/login"
              className="text-text-muted hover:text-primary text-xs transition-colors duration-300 font-sans"
            >
              Portal Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
