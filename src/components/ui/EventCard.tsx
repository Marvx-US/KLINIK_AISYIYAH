import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

export interface EventCardData {
  id: number;
  title: string;
  slug: string;
  summary?: string | null;
  content?: string;
  eventDate?: Date | string | null;
  location?: string | null;
  coverImage?: string | null;
}

interface EventCardProps {
  event: EventCardData;
}

function stripHtml(html: string, maxLength = 120): string {
  const text = html.replace(/<[^>]*>/g, '');
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

export default function EventCard({ event }: EventCardProps) {
  const preview =
    event.summary ||
    (event.content ? stripHtml(event.content) : '');

  const dateObj = event.eventDate ? new Date(event.eventDate) : null;
  const monthStr = dateObj ? dateObj.toLocaleDateString('id-ID', { month: 'short' }) : 'INFO';
  const dayStr = dateObj ? dateObj.toLocaleDateString('id-ID', { day: '2-digit' }) : '-';

  return (
    <div className="group flex flex-col bg-white rounded-[1.25rem] border border-border-fine/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-primary/80 hover:shadow-[0_16px_32px_rgba(13,148,136,0.08)] hover:-translate-y-1.5 transition-all duration-300 ease-out h-full overflow-hidden">
      {event.coverImage && (
        <div className="relative h-56 w-full overflow-hidden shrink-0">
          <Image 
            src={event.coverImage} 
            alt={event.title} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {/* Floating Date Badge over Image */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl flex flex-col items-center justify-center shadow-sm border border-white/20 z-10">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{monthStr}</span>
            <span className="text-2xl font-black text-text-dark leading-none mt-0.5">{dayStr}</span>
          </div>
        </div>
      )}
      
      <div className="p-8 flex-grow flex flex-col relative z-10">
        {!event.coverImage && (
          <div className="mb-6 flex items-center gap-4">
            <div className="flex flex-col items-center justify-center bg-bg-snow border border-border-fine/50 rounded-2xl px-4 py-2.5 min-w-[4rem] shadow-sm">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{monthStr}</span>
              <span className="text-xl font-black text-text-dark leading-none mt-0.5">{dayStr}</span>
            </div>
            {event.location && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-snow text-text-muted text-[10px] font-bold uppercase tracking-wider border border-border-fine/50 shadow-sm">
                <MapPin className="h-3 w-3 text-primary" />
                <span className="truncate max-w-[140px]">{event.location}</span>
              </span>
            )}
          </div>
        )}

        {event.coverImage && event.location && (
          <div className="mb-4">
             <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-snow text-text-muted text-[10px] font-bold uppercase tracking-wider border border-border-fine/50 shadow-sm">
                <MapPin className="h-3 w-3 text-primary" />
                <span className="truncate max-w-[180px]">{event.location}</span>
             </span>
          </div>
        )}

        <h3 className="font-heading font-extrabold text-xl text-text-dark group-hover:text-primary transition-colors mb-4 leading-snug">
          <Link href={`/events/${event.slug}`} className="before:absolute before:inset-0">
            {event.title}
          </Link>
        </h3>
        
        {preview && (
          <p className="text-text-muted text-sm leading-relaxed mb-8 line-clamp-2 flex-grow">{preview}</p>
        )}
        
        <div className="mt-auto pt-6 border-t border-border-fine/50 flex items-center justify-between">
          <span className="text-xs font-bold text-text-dark uppercase tracking-wider group-hover:text-primary transition-colors">
            Baca Selengkapnya
          </span>
          <div className="h-10 w-10 rounded-full bg-bg-snow border border-border-fine/50 flex items-center justify-center text-text-muted group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 shadow-sm">
             <ArrowRight className="h-4 w-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
