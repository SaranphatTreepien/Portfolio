import { Inter, Bebas_Neue } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next' // ✅ เพิ่มตรงนี้

const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ['latin'],
  variable: '--font-inter',
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ['latin'],
  variable: '--font-bebas',
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased ${inter.variable} ${bebasNeue.variable}`}
        suppressHydrationWarning={true}
      >
        {children}
        <Analytics />
        <SpeedInsights /> {/* ✅ เพิ่มตรงนี้ */}
      </body>
    </html>
  )
}