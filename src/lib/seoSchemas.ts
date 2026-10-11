import { KLINIK_INFO } from '@/lib/constants';

/**
 * Schema.org generator untuk MedicalClinic & LocalBusiness
 */
export function getClinicSchema(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': ['MedicalClinic', 'LocalBusiness'],
    '@id': `${baseUrl}/#clinic`,
    name: KLINIK_INFO.name,
    description:
      'Klinik Pratama dan pusat pelayanan kesehatan masyarakat terpadu di Pangkajene, Kabupaten Sidenreng Rappang (Sidrap). Melayani IGD 24 Jam, Poli Umum, Poli Gigi, Poli KIA/Bersalin, dan Vaksinasi.',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    image: `${baseUrl}/logo.png`,
    telephone: KLINIK_INFO.phone,
    email: KLINIK_INFO.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. Andi Cammi No. 17',
      addressLocality: 'Pangkajene',
      addressRegion: 'Sulawesi Selatan',
      postalCode: '91611',
      addressCountry: 'ID',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -3.9248234,
      longitude: 119.7891244,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '20:00',
      },
    ],
    medicalSpecialty: [
      'GeneralPractice',
      'Dentistry',
      'Obstetric',
      'Emergency',
    ],
    priceRange: '$$',
  };
}

/**
 * Schema.org generator untuk FAQPage (Google Rich Snippet Accordion)
 */
export function getFaqSchema(faqList?: { question: string; answer: string }[]) {
  const safeList = Array.isArray(faqList) ? faqList : [];
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: safeList.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}


/**
 * Schema.org generator untuk Artikel Kesehatan (MedicalWebPage / Article)
 */
export function getArticleSchema(article: any, baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    headline: article.title,
    description: article.summary,
    url: `${baseUrl}/articles/${article.slug}`,
    image: article.coverImage ? [article.coverImage] : [`${baseUrl}/logo.png`],
    datePublished: new Date(article.createdAt).toISOString(),
    dateModified: new Date(article.updatedAt || article.createdAt).toISOString(),
    author: {
      '@type': 'Organization',
      name: 'Tim Medis Klinik Aisyiyah Pangkajene',
    },
    publisher: {
      '@type': 'Organization',
      name: KLINIK_INFO.name,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/articles/${article.slug}`,
    },
  };
}

/**
 * Schema.org generator untuk Agenda & Event
 */
export function getEventSchema(event: any, baseUrl: string) {
  const plainText = (event.content || '')
    .replace(/<[^>]*>?/gm, '')
    .trim()
    .slice(0, 200);

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: plainText || `Kegiatan ${event.title} di Klinik Aisyiyah`,
    url: `${baseUrl}/events/${event.slug}`,
    startDate: event.eventDate
      ? new Date(event.eventDate).toISOString()
      : new Date().toISOString(),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: event.location || KLINIK_INFO.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Jl. Andi Cammi No. 17',
        addressLocality: 'Pangkajene',
        addressRegion: 'Sulawesi Selatan',
        addressCountry: 'ID',
      },
    },
    image: event.coverImage ? [event.coverImage] : [`${baseUrl}/logo.png`],
    organizer: {
      '@type': 'Organization',
      name: KLINIK_INFO.name,
      url: baseUrl,
    },
  };
}

/**
 * Schema.org generator untuk Layanan Medis
 */
export function getMedicalServiceSchema(service: any, baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name: service.name || service.title,
    description: service.description || service.fullDescription || 'Layanan medis Klinik Aisyiyah',
    url: `${baseUrl}/services/${service.slug}`,
    image: service.roomImage || service.heroImage || service.bannerImage || `${baseUrl}/logo.png`,
    provider: {
      '@type': 'MedicalClinic',
      name: KLINIK_INFO.name,
      url: baseUrl,
      telephone: KLINIK_INFO.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Jl. Andi Cammi No. 17',
        addressLocality: 'Pangkajene',
        addressRegion: 'Sulawesi Selatan',
        addressCountry: 'ID',
      },
    },
  };
}
