import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    // Format modern WebP/AVIF untuk kompresi gambar lebih baik
    formats: ['image/avif', 'image/webp'],
    // Cache gambar yang di-optimasi Next.js selama 30 hari
    minimumCacheTTL: 2592000,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // HTTP Cache Headers untuk asset statis
  async headers() {
    return [
      {
        // JS & CSS build artifacts (selalu punya hash unik — aman di-cache permanen)
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Gambar yang di-upload admin (path /uploads/...)
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // Favicon dan file statis publik lainnya
        source: '/:path*.{ico,svg,png,jpg,jpeg,webp,avif,woff,woff2}',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=3600',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
