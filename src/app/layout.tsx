import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from '@/components/layout/Providers'
import { TopNav } from '@/components/navigation/TopNav'
import { SectionDots } from '@/components/navigation/SectionDots'
import { MobileNav } from '@/components/navigation/MobileNav'

const SITE_URL = 'https://surya-astra.vercel.app'

export const metadata: Metadata = {
  title: 'Surya-Astra — Solar Flare Intelligence Dashboard',
  description:
    'Real-time solar flare prediction and space weather monitoring powered by Aditya-L1 data. Built for ISRO Bharatiya Antriksh Hackathon 2026.',
  keywords: [
    'solar flare',
    'space weather',
    'ISRO',
    'Aditya-L1',
    'hackathon',
    'prediction',
    'space science',
    'solar monitoring',
  ],
  authors: [{ name: 'Surya-Astra Team' }],
  creator: 'Surya-Astra Team',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    title: 'Surya-Astra — Solar Flare Intelligence Dashboard',
    description:
      'Real-time solar flare prediction and space weather monitoring powered by Aditya-L1 data.',
    siteName: 'Surya-Astra',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Surya-Astra — Solar Flare Intelligence Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Surya-Astra — Solar Flare Intelligence Dashboard',
    description:
      'Real-time solar flare prediction and space weather monitoring powered by Aditya-L1 data.',
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050510',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Orbitron:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-body">
        <Providers>
          <div className="noise-overlay" />
          <TopNav />
          <SectionDots />
          <MobileNav />
          {children}
        </Providers>
      </body>
    </html>
  )
}
