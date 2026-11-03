import {
  HeartPulse,
  Smile,
  Baby,
  Syringe,
  Activity,
  ShieldAlert,
  Stethoscope,
  Heart,
  Award,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { type IconOption } from '../types';

export const ICON_MAP: Record<string, LucideIcon> = {
  HeartPulse,
  Smile,
  Baby,
  Syringe,
  Activity,
  ShieldAlert,
  Stethoscope,
  Heart,
  Award,
  ShieldCheck,
};

export const AVAILABLE_ICONS: IconOption[] = [
  { name: 'HeartPulse', label: 'Detak Jantung (Poli Umum)' },
  { name: 'Smile', label: 'Senyum (Poli Gigi)' },
  { name: 'Baby', label: 'Bayi (Poli KIA / Bersalin)' },
  { name: 'Syringe', label: 'Suntikan (Vaksin Haji & Umrah)' },
  { name: 'Activity', label: 'Aktivitas / Grafik (Rehabilitasi Napza)' },
  { name: 'ShieldAlert', label: 'Perisai Darurat (IGD)' },
  { name: 'Stethoscope', label: 'Stetoskop (Umum / Medis)' },
  { name: 'Heart', label: 'Jantung / Kasih Sayang' },
  { name: 'Award', label: 'Lencana Penghargaan' },
  { name: 'ShieldCheck', label: 'Perisai Centang (Proteksi)' },
];
