import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    template: "%s | Klinik Aisyiyah Pangkajene",
    default: "Klinik Aisyiyah Pangkajene | Layanan Kesehatan Terpadu & Terpercaya",
  },
  description: "Portal resmi Klinik Aisyiyah Pangkajene, Kab. Sidrap. Menyediakan layanan IGD 24 Jam, Poli Umum, Poli Gigi, Poli KIA/Bersalin, Vaksinasi Haji & Umrah, artikel edukasi medis, dan jadwal dokter.",
  keywords: [
    "klinik aisyiyah",
    "klinik aisyiyah pangkajene",
    "klinik sidrap",
    "layanan kesehatan sidrap",
    "dokter pangkajene",
    "igd 24 jam sidrap",
    "poli umum pangkajene",
    "poli gigi sidrap",
    "poli kia bersalin",
    "vaksin haji umrah sidrap",
    "jadwal praktek dokter",
    "artikel kesehatan",
  ],
  authors: [{ name: "Klinik Aisyiyah Pangkajene" }],
  creator: "Klinik Aisyiyah Pangkajene",
  publisher: "Klinik Aisyiyah Pangkajene",
  alternates: {
    canonical: "./",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Klinik Aisyiyah Pangkajene | Layanan Kesehatan Terpadu & Terpercaya",
    description: "Layanan kesehatan profesional, ramah, dan terjangkau di Pangkajene, Kab. Sidrap. Dilengkapi IGD 24 Jam, Poliklinik Spesialis, dan konsultasi kesehatan.",
    url: "/",
    siteName: "Klinik Aisyiyah Pangkajene",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Klinik Aisyiyah Pangkajene",
    description: "Layanan kesehatan terpercaya dan informasi medis terkini di Pangkajene, Sidrap.",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="font-sans min-h-full flex flex-col bg-bg-snow text-text-dark" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
