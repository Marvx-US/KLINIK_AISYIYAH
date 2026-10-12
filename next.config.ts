import type { NextConfig } from "next";

// ============================================================
// HTTP Security Headers
// Diterapkan ke semua route di aplikasi.
// ============================================================
const securityHeaders = [
  // Cegah Clickjacking: halaman tidak boleh di-embed dalam iframe dari origin lain
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  // Cegah MIME sniffing: browser harus menghormati Content-Type yang dikirim server
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // Kontrol informasi referrer yang dikirim saat navigasi lintas origin
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // Batasi akses ke API browser sensitif (kamera, mikrofon, geolokasi, dll.)
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  },
  // HSTS: Paksa HTTPS di production (diabaikan oleh browser untuk HTTP/localhost)
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // Content Security Policy
  // 'unsafe-inline' diperlukan untuk Tailwind CSS & rich-text editor.
  // Sesuaikan jika menggunakan CDN atau library pihak ketiga tambahan.
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval diperlukan oleh Next.js dev mode
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://images.unsplash.com https://*.google.com https://*.gstatic.com https://*.googleapis.com",
      "connect-src 'self' https://*.google.com https://*.googleapis.com",
      "frame-src 'self' https://www.google.com https://maps.google.com",
      "frame-ancestors 'self'", // Sama seperti X-Frame-Options SAMEORIGIN
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];

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
    // Pipeline /_next/image DIAKTIFKAN kembali.
    // Sebelumnya dimatikan karena gambar /uploads/ perlu disajikan langsung Nginx.
    // Sekarang semua gambar yang diupload admin SUDAH dikompresi ke WebP via sharp
    // di src/lib/upload.ts, sehingga unoptimized tidak lagi diperlukan.
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  async headers() {
    return [
      // --------------------------------------------------------
      // Security Headers — berlaku untuk semua route
      // --------------------------------------------------------
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      // --------------------------------------------------------
      // HTTP Cache Headers untuk asset statis
      // --------------------------------------------------------
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

