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
    template: "%s | Klinik Aisyiyah",
    default: "Klinik Aisyiyah | Portal Media Informasi & Kesehatan",
  },
  description: "Portal resmi Klinik Aisyiyah. Menyediakan layanan kesehatan terpercaya, artikel kesehatan terkini, jadwal dokter, dan berita kegiatan klinik.",
  keywords: ["klinik aisyiyah", "klinik kesehatan", "aisyiyah", "artikel kesehatan", "jadwal dokter", "layanan medis"],
  authors: [{ name: "Klinik Aisyiyah" }],
  openGraph: {
    title: "Klinik Aisyiyah | Portal Media Informasi & Kesehatan",
    description: "Portal resmi Klinik Aisyiyah. Menyediakan layanan kesehatan terpercaya, artikel kesehatan terkini, jadwal dokter, dan berita kegiatan klinik.",
    url: "/",
    siteName: "Klinik Aisyiyah",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Klinik Aisyiyah",
    description: "Layanan kesehatan terpercaya dan informasi medis terkini.",
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
