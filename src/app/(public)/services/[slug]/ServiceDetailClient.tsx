"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tv, Wind, Wifi, ShieldAlert, CheckCircle2, ChevronRight, 
  ArrowLeft, Clock, Stethoscope, Heart, Scissors, Activity, 
  Smile, ShieldCheck, Baby, Award, Phone, Mail, Plus, X, 
  MapPin, Users, ClipboardList, Briefcase, Check, Eye, HelpCircle,
  FileText, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

// Icon Map for available procedures/actions
const PROCEDURES_ICON_MAP: Record<string, React.ComponentType<any>> = {
  HeartPulse: Heart,
  Scissors: Scissors,
  Activity: Activity,
  Wind: Wind,
  Stethoscope: Stethoscope,
  Smile: Smile,
  ShieldCheck: ShieldCheck,
  Baby: Baby,
  Award: Award,
  Heart: Heart,
  FileText: FileText
};

// Facility Icon Resolver
function getFacilityIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes('tunggu')) return Users;
  if (n.includes('ac')) return Wind;
  if (n.includes('wi-fi') || n.includes('wifi')) return Wifi;
  if (n.includes('ambulans') || n.includes('ambulance')) return ShieldAlert;
  if (n.includes('doppler') || n.includes('ekg') || n.includes('observasi') || n.includes('defibrillator')) return Activity;
  if (n.includes('apotek') || n.includes('laboratorium') || n.includes('resusitasi')) return Stethoscope;
  return Check;
}

export interface Doctor {
  name: string;
  specialty: string;
  experience: string;
  schedule: string;
  image: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Procedure {
  title: string;
  description: string;
  iconName: string;
}

interface ServiceData {
  id: number;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  purpose: string;
  benefits: string[];
  targetAudience: string;
  heroImage: string;
  gallery: string[];
  facilities: string[];
  doctors: Doctor[];
  operationalHours: Record<string, string>;
  workflow: string[];
  preparation: string[];
  procedures: Procedure[];
  faq: FAQItem[];
  relatedServices: string[];
  contactInformation: {
    phone: string;
    whatsapp: string;
    email: string;
  };
  vaccinePrices?: { name: string; price: number }[] | null;
}

interface Props {
  service: ServiceData;
  currentSlug: string;
}

export default function ServiceDetailClient({ service: rawService, currentSlug }: Props) {
  const service = {
    title: rawService?.title || 'Layanan',
    shortDescription: rawService?.shortDescription || '',
    fullDescription: rawService?.fullDescription || '',
    purpose: rawService?.purpose || '',
    benefits: rawService?.benefits || [],
    targetAudience: rawService?.targetAudience || '',
    heroImage: rawService?.heroImage || '',
    gallery: rawService?.gallery || [],
    facilities: rawService?.facilities || [],
    doctors: rawService?.doctors || [],
    operationalHours: rawService?.operationalHours || {},
    workflow: rawService?.workflow || [],
    preparation: rawService?.preparation || [],
    procedures: rawService?.procedures || [],
    faq: rawService?.faq || [],
    relatedServices: rawService?.relatedServices || [],
    contactInformation: rawService?.contactInformation || { phone: '', whatsapp: '', email: '' },
    vaccinePrices: rawService?.vaccinePrices || null
  };

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isOpenToday, setIsOpenToday] = useState(true);
  const [currentDayName, setCurrentDayName] = useState('');

  // Check if clinic is open today
  useEffect(() => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const todayName = days[new Date().getDay()];
    setCurrentDayName(todayName);
    
    const scheduleStr = service.operationalHours[todayName] || service.operationalHours['Senin - Sabtu'];
    if (!scheduleStr || scheduleStr.toLowerCase().includes('tutup')) {
      setIsOpenToday(false);
    } else {
      setIsOpenToday(true);
    }
  }, [rawService]);

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-bg-snow min-h-screen text-text-dark font-sans selection:bg-[#0EA5A4]/20 selection:text-[#0EA5A4]">
      
      {/* 1. HERO BANNER */}
      <section className="relative w-full bg-slate-950 overflow-hidden pt-36 pb-16 md:pt-44 md:pb-20">
        {/* Parallax Background */}
        <motion.div 
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img 
            src={service.heroImage} 
            alt={service.title}
            className="w-full h-full object-cover select-none pointer-events-none"
          />
        </motion.div>
        
        {/* Soft Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-snow via-slate-950/50 to-transparent z-10" />

        <div className="relative z-20 max-w-7xl mx-auto w-full px-6 sm:px-12 lg:px-24">
          <div className="max-w-3xl">
            {/* Breadcrumb Navigation */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 text-white/70 text-xs font-semibold uppercase tracking-wider mb-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full w-fit border border-white/15"
            >
              <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/services" className="hover:text-white transition-colors">Layanan</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white font-extrabold">{service.title}</span>
            </motion.div>

            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-editorial-serif tracking-tight leading-[1.1] mb-6"
            >
              {service.title}
            </motion.h1>
            
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white/80 text-base sm:text-lg mb-8 leading-relaxed max-w-2xl font-medium"
            >
              {service.shortDescription}
            </motion.p>
            
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <button 
                onClick={() => scrollToSection('cta-section')}
                className="px-8 py-4 bg-[#0EA5A4] hover:bg-[#0c8c8b] text-white font-bold rounded-full transition-all shadow-lg shadow-[#0EA5A4]/25 hover:shadow-xl hover:shadow-[#0EA5A4]/35 hover:-translate-y-0.5"
              >
                Daftar Sekarang
              </button>
              <Link 
                href={service.contactInformation.whatsapp}
                target="_blank"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full border border-white/20 hover:border-white/40 transition-all backdrop-blur-md flex items-center gap-2"
              >
                Hubungi Kami
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT COLUMN: Main Info */}
        <div className="lg:col-span-2 space-y-20">
          
          {/* 2. TENTANG LAYANAN */}
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-8 h-[2px] bg-[#0EA5A4]" />
                <span className="text-[#0EA5A4] font-bold text-xs uppercase tracking-widest">Detail Layanan</span>
              </div>
              <h2 className="text-3xl font-extrabold text-text-dark font-heading leading-tight">
                Deskripsi Lengkap & Tujuan Medis
              </h2>
              <p className="text-text-muted text-sm leading-relaxed font-medium">
                {service.fullDescription}
              </p>
              
              <div className="bg-[#0EA5A4]/5 p-6 rounded-[1.25rem] border border-[#0EA5A4]/10">
                <h4 className="font-extrabold text-sm text-[#0EA5A4] uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Tujuan Utama
                </h4>
                <p className="text-text-muted text-xs leading-relaxed font-semibold">
                  {service.purpose}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden border border-border-fine/60 shadow-sm bg-slate-900/5 group flex items-center justify-center p-2">
                <img 
                  src={service.gallery[0] || service.heroImage} 
                  alt="Ilustrasi Ruangan"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 pointer-events-none">
                  <span className="text-white text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">Fasilitas Ruangan Utama</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-extrabold text-sm text-text-dark">Manfaat & Keunggulan Layanan:</h4>
                <ul className="grid grid-cols-1 gap-2.5">
                  {service.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-text-muted font-medium">
                      <Check className="w-4 h-4 text-[#0EA5A4] shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.section>

          {/* 3. LAYANAN YANG TERSEDIA (TINDAKAN MEDIS) */}
          {service.procedures.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-text-dark font-heading">
                  Pelayanan & Tindakan Medis
                </h2>
                <p className="text-text-muted text-xs">
                  Seluruh cakupan tindakan medis terstandar yang siap diberikan oleh dokter dan perawat.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {service.procedures.map((proc, index) => {
                  const ProcIcon = PROCEDURES_ICON_MAP[proc.iconName] || Stethoscope;
                  return (
                    <div 
                      key={index} 
                      className="group bg-white p-6 rounded-[1.25rem] border border-border-fine/60 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:border-[#0EA5A4]/60 hover:shadow-[0_12px_24px_rgba(14,165,164,0.06)] hover:-translate-y-1 transition-all duration-300 flex items-start gap-4 cursor-default"
                    >
                      <div className="h-12 w-12 rounded-xl bg-bg-snow border border-border-fine flex items-center justify-center text-[#0EA5A4] group-hover:bg-[#0EA5A4] group-hover:text-white transition-all shrink-0">
                        <ProcIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-text-dark group-hover:text-[#0EA5A4] transition-colors text-base mb-1.5">{proc.title}</h4>
                        <p className="text-text-muted text-xs leading-relaxed font-medium">{proc.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          )}

          {/* 3.1 DAFTAR HARGA VAKSIN (KONDISIONAL) */}
          {service.vaccinePrices && service.vaccinePrices.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-text-dark font-heading">
                  Daftar Harga Vaksinasi Resmi
                </h2>
                <p className="text-text-muted text-xs">
                  Harga vaksin transparan diurutkan dari yang terendah ke tertinggi.
                </p>
              </div>

              <div className="bg-white rounded-[1.5rem] border border-border-fine/60 shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-bg-snow border-b border-border-fine/60">
                        <th className="py-4 px-6 font-bold text-xs text-text-dark uppercase tracking-wider">Nama Vaksin</th>
                        <th className="py-4 px-6 font-bold text-xs text-text-dark uppercase tracking-wider text-right">Harga Estimasi (Nett)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-fine/30">
                      {service.vaccinePrices.map((item, idx) => (
                        <tr key={idx} className="hover:bg-bg-snow/30 transition-colors">
                          <td className="py-4 px-6 text-sm font-semibold text-text-muted flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5A4] shrink-0" />
                            {item.name}
                          </td>
                          <td className="py-4 px-6 text-sm font-extrabold text-[#0EA5A4] text-right">
                            Rp {item.price.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.section>
          )}



          {/* 6. GALERI FOTO */}
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-text-dark font-heading">
                Galeri Foto Ruangan & Fasilitas
              </h2>
              <p className="text-text-muted text-xs">
                Dokumentasi asli kebersihan dan kerapian ruang tindakan medis kami.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {service.gallery.map((imgUrl, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedImage(imgUrl)}
                  className="group relative aspect-[4/3] rounded-[1.25rem] overflow-hidden border border-border-fine bg-slate-900/5 flex items-center justify-center p-2 cursor-pointer shadow-sm"
                >
                  <img 
                    src={imgUrl} 
                    alt={`Galeri ${service.title} ${idx + 1}`} 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* 7. FAQ ACCORDION */}
          {service.faq.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-text-dark font-heading">
                  Tanya Jawab Layanan (FAQ)
                </h2>
                <p className="text-text-muted text-xs">
                  Jawaban atas keraguan atau pertanyaan umum sebelum berkunjung.
                </p>
              </div>

              <div className="space-y-4">
                {service.faq.map((faq, idx) => {
                  const isOpen = activeFaq === idx;
                  return (
                    <div 
                      key={idx} 
                      className="bg-white rounded-2xl border border-border-fine/60 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.005)] transition-all"
                    >
                      <button 
                        onClick={() => setActiveFaq(isOpen ? null : idx)}
                        className="w-full p-6 text-left font-bold text-text-dark flex items-center justify-between gap-4 hover:bg-bg-snow/30 transition-colors"
                      >
                        <span className="text-base">{faq.question}</span>
                        <span className={`w-8 h-8 rounded-full border border-border-fine flex items-center justify-center text-text-muted shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45 bg-[#0EA5A4]/10 border-[#0EA5A4]/20 text-[#0EA5A4]' : ''}`}>
                          <Plus className="w-4 h-4" />
                        </span>
                      </button>
                      
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="px-6 pb-6 pt-1 text-sm text-text-muted leading-relaxed font-medium border-t border-border-fine/30">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          )}

        </div>

        {/* RIGHT COLUMN: Sidebar (Hours, Facilities, Preparation, CTAs) */}
        <div className="space-y-8">
          
          {/* 8. JADWAL PELAYANAN CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 rounded-[1.5rem] border border-border-fine/60 shadow-[0_8px_30px_rgba(0,0,0,0.03)]"
          >
            <h3 className="font-extrabold text-lg text-text-dark mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#0EA5A4]" />
              Jadwal Operasional
            </h3>
            
            {/* Status Badge */}
            <div className={`p-4 rounded-2xl mb-6 flex items-center gap-3 border ${
              isOpenToday 
                ? 'bg-green-50/50 text-green-700 border-green-200/50' 
                : 'bg-red-50/50 text-red-700 border-red-200/50'
            }`}>
              <div className={`w-2.5 h-2.5 rounded-full animate-ping ${isOpenToday ? 'bg-green-600' : 'bg-red-600'}`} />
              <span className="text-xs font-bold">
                Hari Ini {currentDayName} — {isOpenToday ? 'Klinik Sedang Buka' : 'Klinik Sedang Tutup'}
              </span>
            </div>

            <div className="space-y-3.5">
              {Object.entries(service.operationalHours).map(([day, time]) => (
                <div key={day} className="flex justify-between items-center text-xs font-semibold py-2 border-b border-border-fine/30 last:border-0">
                  <span className={day === currentDayName ? "text-[#0EA5A4] font-extrabold" : "text-text-muted"}>
                    {day}
                  </span>
                  <span className={day === currentDayName ? "text-[#0EA5A4] font-extrabold" : "text-text-dark"}>
                    {time}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 9. FASILITAS PENDUKUNG */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 rounded-[1.5rem] border border-border-fine/60 shadow-[0_8px_30px_rgba(0,0,0,0.03)]"
          >
            <h3 className="font-extrabold text-lg text-text-dark mb-6 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-[#0EA5A4]" />
              Fasilitas Pendukung
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {service.facilities.map((fac, i) => {
                const FacIcon = getFacilityIcon(fac);
                return (
                  <div key={i} className="flex items-center gap-3 p-3 bg-bg-snow rounded-xl border border-border-fine/40">
                    <div className="w-8 h-8 rounded-lg bg-white border border-border-fine flex items-center justify-center text-[#0EA5A4]">
                      <FacIcon className="w-4 h-4" />
                    </div>
                    <span className="text-text-muted text-[11px] font-bold leading-tight truncate">{fac}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* 10. PERSIAPAN SEBELUM BERKUNJUNG */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 rounded-[1.5rem] border border-border-fine/60 shadow-[0_8px_30px_rgba(0,0,0,0.03)]"
          >
            <h3 className="font-extrabold text-lg text-text-dark mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#0EA5A4]" />
              Persiapan Berkunjung
            </h3>

            <ul className="space-y-4">
              {service.preparation.map((prep, i) => (
                <li key={i} className="flex items-start gap-3 text-xs text-text-muted font-semibold leading-relaxed">
                  <div className="w-5 h-5 rounded-full bg-[#0EA5A4]/10 flex items-center justify-center text-[#0EA5A4] shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{prep}</span>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>

      </div>



      {/* 12. CALL TO ACTION (CTA) */}
      <section id="cta-section" className="bg-[#0EA5A4] py-16 text-white text-center relative overflow-hidden">
        {/* Subtle Decorative Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_60%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-editorial-serif leading-tight">
            Ingin Berkonsultasi atau Mendaftar Layanan Ini?
          </h2>
          <p className="text-white/80 max-w-xl mx-auto text-sm sm:text-base font-medium leading-relaxed">
            Dapatkan respon cepat dan penjadwalan janji temu dokter yang mudah langsung melalui WhatsApp kami tanpa perlu antre di klinik.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link 
              href={service.contactInformation.whatsapp}
              target="_blank"
              className="px-8 py-4 bg-white text-[#0EA5A4] font-bold rounded-full transition-all shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Hubungi via WhatsApp
            </Link>
            <button 
              onClick={() => alert('Fitur pendaftaran online sedang disiapkan. Silakan hubungi via WhatsApp untuk saat ini.')}
              className="px-8 py-4 bg-slate-900/40 hover:bg-slate-900/60 text-white border border-white/20 hover:border-white/55 font-bold rounded-full transition-all"
            >
              Daftar Online (E-Patient)
            </button>
          </div>
        </div>
      </section>

      {/* 13. ZOOM GALLERY MODAL */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 text-white hover:text-[#0EA5A4] transition-colors bg-white/10 p-2 rounded-full border border-white/10"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[80vh] aspect-[4/3] rounded-[1.5rem] overflow-hidden border border-white/10 shadow-2xl"
            >
              <img 
                src={selectedImage} 
                alt="Zoomed Ruangan" 
                className="w-full h-full object-contain bg-black/50 p-2"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
