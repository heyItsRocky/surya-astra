import type { Metadata, Viewport } from 'next'
import './globals.css'
import { inter, orbitron } from './fonts'
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
    <html lang="en" className={`${inter.variable} ${orbitron.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body className="antialiased font-body">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-solar-orange focus:text-space-900 focus:rounded focus:font-display focus:text-sm"
        >
          Skip to main content
        </a>
        <Providers>
          <div className="noise-overlay" aria-hidden="true" />
          <TopNav />
          <SectionDots />
          <MobileNav />
          {children}
        </Providers>
      </body>
    </html>
  )
}
