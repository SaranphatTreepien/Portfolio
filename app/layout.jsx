 
import {Inter, Bebas_Neue} from 'next/font/google'
import './globals.css'
 
const inter = Inter( { 
   weight: ["100","200","300","400","500","600","700","800","900"],
   subsets: ['latin'] ,
   variable: '--font-inter',
  });
const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ['latin'],
  variable: '--font-bebas',
});
export const metadata = {
  title: 'MYSITE',
  description: 'This is my personal portfolio website showcasing projects and skills.',
  // icons: {
  //   icon: '/assets/icon/favicon-16x16.png', // วางไฟล์ favicon.ico ในโฟลเดอร์ public/
  // },
}
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased ${inter.variable} ${bebasNeue.variable}`}>{children}</body>
    </html>
  )
}
