import { Inter, Bebas_Neue } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react' // 1. เพิ่มบรรทัดนี้เข้าไปครับ

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

export const metadata = {
  title: 'Saranphat',
  description: 'This is my personal portfolio website showcasing projects and skills.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased ${inter.variable} ${bebasNeue.variable}`}
        suppressHydrationWarning={true}
      >
        {children}
        <Analytics /> {/* 2. เพิ่มบรรทัดนี้เข้าไปตรงนี้ครับ */}
      </body>
    </html>
  )
}