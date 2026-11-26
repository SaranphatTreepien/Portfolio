import { Geist, Geist_Mono, Bebas_Neue, IBM_Plex_Sans_Thai, Instrument_Serif } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/components/LanguageProvider'
import { ACCENT_SCRIPT } from '@/components/site/accent'
import { THEME_SCRIPT } from '@/components/site/theme'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next' // ✅ เพิ่มตรงนี้

// UI and headings
const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
});

// Dates, years and the name in the sidebar
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

// One italic accent word per heading (Latin only; Thai falls back to IBM Plex Sans Thai)
const serif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-serif',
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ['latin'],
  variable: '--font-bebas',
});

// Thai glyphs for the language switch; Geist and Bebas Neue have none
const thai = IBM_Plex_Sans_Thai({
  weight: ['400', '500', '600', '700'],
  subsets: ['thai'],
  variable: '--font-thai',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saranphattree-me.vercel.app'

export const metadata = {
  title: 'Saranphat',
  description: 'This is my personal portfolio website showcasing projects and skills.',
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Saranphat',
    description: 'This is my personal portfolio website showcasing projects and skills.',
    url: siteUrl,
    siteName: 'Saranphat',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/assets/hero/dev4.png',
        width: 1200,
        height: 630,
        alt: 'Saranphat Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saranphat',
    description: 'This is my personal portfolio website showcasing projects and skills.',
    images: ['/assets/hero/dev4.png'],
  },
}

const HEAD_SCRIPT = THEME_SCRIPT + ACCENT_SCRIPT

export default function RootLayout({ children }) {
  return (
    // Dark is the server default. Before the first paint the head script picks day or night from the time in Thailand
    // (or today's manual choice) and today's accent colour, so the page never flashes
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: HEAD_SCRIPT }} />
      </head>
      <body
        className={`antialiased ${geist.variable} ${geistMono.variable} ${serif.variable} ${bebasNeue.variable} ${thai.variable}`}
        suppressHydrationWarning={true}
      >
        <LanguageProvider>{children}</LanguageProvider>
        <Analytics />
        <SpeedInsights /> {/* ✅ เพิ่มตรงนี้ */}
      </body>
    </html>
  )
}