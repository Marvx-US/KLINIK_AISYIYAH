import React from 'react';

interface JsonLdProps {
  data: Record<string, any> | Record<string, any>[];
}

/**
 * Komponen pembungkus aman untuk menyuntikkan Schema.org JSON-LD structured data
 * ke dalam halaman guna meningkatkan Google Rich Snippets & SEO Rank.
 */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
