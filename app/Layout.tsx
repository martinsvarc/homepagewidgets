import { Montserrat } from 'next/font/google'
import '@/styles/globals.css'
import type { Metadata } from 'next'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Personal improvement dashboard',
}
