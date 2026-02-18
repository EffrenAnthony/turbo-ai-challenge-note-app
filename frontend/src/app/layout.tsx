import type { Metadata } from 'next'
import { Inter, Inria_Serif } from 'next/font/google'
import { Providers } from '@/components/providers/Providers'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const inriaSerif = Inria_Serif({
  variable: '--font-inria-serif',
  weight: ['300', '400', '700'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Notes App',
  description:
    'A full-stack notes application with JWT authentication, category management, and voice dictation. Built with Django REST Framework and Next.js.',
  icons: {
    icon: '/assets/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${inriaSerif.variable}`}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
