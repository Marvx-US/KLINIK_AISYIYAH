import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Service } from '@prisma/client';
import { getServiceBySlug, getAllServices } from '@/features/services/queries/service-queries';
import { SERVICES_DATA } from '@/features/services/constants/services-data';
import { KLINIK_INFO } from '@/lib/constants';
import JsonLd from '@/components/seo/json-ld';
import { getMedicalServiceSchema } from '@/lib/seo-schemas';
import { env } from '@/lib/env';
import {
  normalizeSlug,
  getPossibleDbSlugs,
  buildMergedServiceData,
} from '@/features/services/utils/service-resolvers';
import ServiceDetailClient from './service-detail-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function resolveDbService(candidateSlugs: string[]): Promise<Service | null> {
  for (const candidate of candidateSlugs) {
    const found = await getServiceBySlug(candidate).catch(() => null);
    if (found) return found;
  }
  const allDb = await getAllServices().catch(() => []);
  return (
    allDb.find((s: Service) =>
      candidateSlugs.some(c => s.slug.toLowerCase().includes(c) || c.includes(s.slug.toLowerCase()))
    ) || null
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const rawSlug = resolvedParams.slug;
  const slug = normalizeSlug(rawSlug);
  const candidateSlugs = getPossibleDbSlugs(rawSlug);
  const dbService = await resolveDbService(candidateSlugs);

  const staticDetails = SERVICES_DATA[slug] || null;
  const title = dbService?.name || staticDetails?.title || 'Layanan Kesehatan';
  const description = dbService?.description || staticDetails?.shortDescription || `Layanan medis ${title} terpadu di Klinik Aisyiyah Pangkajene, Kab. Sidrap.`;
  const image = dbService?.roomImage || staticDetails?.heroImage || '/logo.png';

  return {
    title: `${title} - Layanan Medis`,
    description,
    alternates: {
      canonical: `/services/${rawSlug}`,
    },
    openGraph: {
      title: `${title} | Klinik Aisyiyah Pangkajene`,
      description,
      url: `/services/${rawSlug}`,
      siteName: KLINIK_INFO.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'id_ID',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Klinik Aisyiyah`,
      description,
      images: [image],
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams.slug;
  const slug = normalizeSlug(rawSlug);

  const candidateSlugs = getPossibleDbSlugs(rawSlug);
  const dbService = await resolveDbService(candidateSlugs);
  const staticDetails = SERVICES_DATA[slug] || null;

  if (!dbService && !staticDetails) {
    notFound();
  }

  const mergedData = buildMergedServiceData(slug, dbService, staticDetails);
  const baseUrl = env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return (
    <>
      <JsonLd data={getMedicalServiceSchema(mergedData, baseUrl)} />
      <ServiceDetailClient service={mergedData} currentSlug={slug} />
    </>
  );
}
