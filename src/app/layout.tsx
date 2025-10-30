import type { Metadata } from "next";
import NextTopLoader from 'nextjs-toploader'
import "./globals.css";
import dynamic from "next/dynamic";
import { useAuth } from "@/lib/auth";

const SessionProvider = dynamic(() => import('./_components/ClientSessionProvider'))

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tamsis-kreasi-hub.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Tamsis Kreasi Hub - Galeri Portfolio Siswa SMK Taman Siswa 2 Jakarta",
    template: "%s | Tamsis Kreasi Hub",
  },
  description: "Tamsis Kreasi Hub adalah galeri digital resmi untuk portofolio dan karya terbaik siswa SMK Taman Siswa 2 Jakarta. Jelajahi kreativitas dan bakat siswa kami dalam berbagai bidang seperti desain, programming, multimedia, dan lainnya.",
  keywords: [
    'portfolio siswa',
    'SMK Taman Siswa 2 Jakarta',
    'karya kreatif siswa',
    'galeri portfolio',
    'student portfolio',
    'creative works',
    'siswa SMK',
    'tamsis',
    'desain grafis',
    'programming',
    'multimedia',
    'karya terbaik siswa',
  ],
  authors: [{ name: 'SMK Taman Siswa 2 Jakarta' }],
  creator: 'SMK Taman Siswa 2 Jakarta',
  publisher: 'Tamsis Kreasi Hub',
  applicationName: 'Tamsis Kreasi Hub',
  category: 'education',
  classification: 'Student Portfolio Gallery',
  
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: baseUrl,
    siteName: 'Tamsis Kreasi Hub',
    title: 'Tamsis Kreasi Hub - Galeri Portfolio Siswa SMK Taman Siswa 2 Jakarta',
    description: 'Jelajahi kreativitas dan bakat terbaik siswa SMK Taman Siswa 2 Jakarta. Lihat portfolio, karya desain, project programming, dan karya kreatif siswa kami.',
    images: [
      {
        url: '/assets/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Tamsis Kreasi Hub - Portfolio Siswa SMK Taman Siswa 2 Jakarta',
      }
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    site: '@TamsisKreasiHub',
    creator: '@TamsisKreasiHub',
    title: 'Tamsis Kreasi Hub - Galeri Portfolio Siswa SMK Taman Siswa 2 Jakarta',
    description: 'Jelajahi kreativitas dan bakat terbaik siswa SMK Taman Siswa 2 Jakarta.',
    images: ['/assets/images/twitter-image.png'],
  },
  
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  
  manifest: '/manifest.json',
  
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
  
  alternates: {
    canonical: baseUrl,
  },
  
  other: {
    'theme-color': '#047857',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Tamsis Kreasi Hub',
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await useAuth()
  return (
    <html lang="id" data-theme="lofi" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <SessionProvider session={session}>
          <NextTopLoader color="#047857" />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
