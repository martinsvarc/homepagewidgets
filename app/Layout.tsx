// app/layout.tsx
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import '@/styles/globals.css'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Performance tracking dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>{children}</body>
    </html>
  )
}
