import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from '@/components/layout/Providers'
import { TopNav } from '@/components/navigation/TopNav'
import { SectionDots } from '@/components/navigation/SectionDots'

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
  ],
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Orbitron:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-body">
        <Providers>
          <div className="noise-overlay" />
          <TopNav />
          <SectionDots />
          {children}
        </Providers>
      </body>
    </html>
  )
}
