import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube, Heart } from 'lucide-react';
import { KLINIK_INFO, KLINIK_HOURS } from '@/lib/constants';

/**
 * Footer — Redesain Footer premium yang lebih profesional, kaya informasi,
 * dan menggunakan kontras tinggi dengan warna utama website.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-[#0E7490] via-[#0F766E] to-[#115E59] text-[#FDFBF7] border-t border-[#14b8a6]/20 relative overflow-hidden mt-auto">
      {/* Visual Ambient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.15),transparent_45%)] pointer-events-none" />

      <div className="w-full px-6 sm:px-8 lg:px-12 py-10 md:py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-8">

          {/* Kolom 1: Profil Klinik & Logo */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-full overflow-hidden shrink-0 border border-white/20 bg-white p-1">
                <Image
                  src="/logo.png"
                  alt={`Logo ${KLINIK_INFO.name}`}
                  width={32}
                  height={32}
                  className="object-contain w-full h-full"
                  suppressHydrationWarning
                />
              </div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-white" suppressHydrationWarning>
                {KLINIK_INFO.name.split(' ')[0]}{' '}
                <span className="text-[#38BDF8]">{KLINIK_INFO.name.split(' ')[1]}</span>
              </span>
            </Link>
            <p className="text-white/80 text-sm leading-relaxed max-w-sm font-sans">
              Berkomitmen menyediakan pelayanan kesehatan prima yang profesional, ramah, dan terjangkau bagi seluruh lapisan masyarakat berlandaskan nilai-nilai kemanusiaan terpadu.
            </p>
            {/* Social Media Icons */}
            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Klinik Aisyiyah"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#1877F2] text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
              >
                <Facebook className="w-4.5 h-4.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Klinik Aisyiyah"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#E1306C] text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
              >
                <Instagram className="w-4.5 h-4.5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X Klinik Aisyiyah"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#000000] text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
              >
                <Twitter className="w-4.5 h-4.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Youtube Klinik Aisyiyah"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#FF0000] text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
              >
                <Youtube className="w-4.5 h-4.5" />
              </a>
              <a
                href={`https://wa.me/${KLINIK_INFO.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Klinik Aisyiyah"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#25D366] text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
              >
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.638 1.986 14.168 1.065 11.54 1.06c-5.436 0-9.861 4.37-9.865 9.801a9.736 9.736 0 0 0 1.492 5.093l-.987 3.6 3.692-.969zm13.111-6.112c-.299-.15-1.771-.873-2.046-.973-.275-.101-.476-.15-.675.15-.199.299-.773.973-.948 1.172-.175.199-.349.224-.648.075-.3-.15-1.266-.467-2.41-1.485-.89-.794-1.49-1.775-1.665-2.074-.175-.3-.019-.461.13-.611.135-.135.3-.349.449-.523.15-.175.199-.299.299-.498.1-.2.05-.374-.025-.523-.075-.15-.675-1.625-.925-2.224-.244-.589-.493-.51-.675-.518-.173-.007-.373-.007-.573-.007-.2 0-.523.075-.798.374-.275.3-1.047 1.022-1.047 2.492 0 1.47 1.072 2.89 1.221 3.09.15.199 2.107 3.216 5.106 4.512.714.309 1.272.494 1.707.633.717.227 1.37.195 1.887.118.577-.087 1.771-.723 2.021-1.42.25-.698.25-1.296.175-1.42-.075-.124-.275-.199-.575-.349z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Kolom 2: Quick Links */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="font-heading font-extrabold text-sm tracking-wider uppercase text-[#38BDF8]">
              Navigasi Pintas
            </h3>
            <ul className="flex flex-col gap-3 text-white/80 text-sm font-sans font-semibold">
              <li>
                <Link href="/" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">
                  Tentang Klinik
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">
                  Layanan Medis
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">
                  Artikel Kesehatan
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">
                  Agenda & Kegiatan
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">
                  Kontak Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Layanan Unggulan */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h3 className="font-heading font-extrabold text-sm tracking-wider uppercase text-[#38BDF8]">
              Layanan Medis
            </h3>
            <ul className="flex flex-col gap-3 text-white/80 text-sm font-sans font-semibold">
              <li>
                <Link href="/services" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">
                  Poli Umum
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">
                  Poli Gigi & Mulut
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">
                  Poli KIA / Bersalin
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">
                  Vaksin Haji & Umrah
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">
                  Instalasi Gawat Darurat (IGD)
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Detail Kontak & Jam Kerja */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h3 className="font-heading font-extrabold text-sm tracking-wider uppercase text-[#38BDF8]">
              Hubungi Kami
            </h3>
            <ul className="flex flex-col gap-4 text-white/80 text-sm font-sans">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-5 w-5 text-[#38BDF8] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{KLINIK_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4.5 w-4.5 text-[#38BDF8] shrink-0" />
                <span>{KLINIK_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4.5 w-4.5 text-[#38BDF8] shrink-0" />
                <span>{KLINIK_INFO.email}</span>
              </li>
              <li className="flex items-start gap-2.5 border-t border-white/10 pt-4 mt-2">
                <Clock className="h-5 w-5 text-[#38BDF8] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white text-xs uppercase tracking-wider">Jam Operasional:</p>
                  {KLINIK_HOURS.map((item, idx) => (
                    <p key={idx} className="mt-1 text-xs">
                      {item.day}: {item.hours}
                    </p>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Separator & Footer Copyright */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-white/60 text-xs font-sans">
          <p>
            &copy; {currentYear} {KLINIK_INFO.name}. Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hover:text-white transition-colors duration-200"
            >
              Portal Admin
            </Link>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-red-400 fill-current" /> for healthy communities.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
