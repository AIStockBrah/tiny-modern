import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import './globals.css'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

const empireFont = localFont({
  src: '../public/fonts/EmpireStraight.ttf',
  variable: '--font-empire'
})

export const metadata: Metadata = {
  title: 'TINY MODERN - AI-Powered Architectural Visualization',
  description: 'Transform your architectural ideas into stunning visualizations with AI. Create modern, minimalist architectural designs instantly.',
  generator: 'Next.js',
  metadataBase: new URL('https://tiny-modern.vercel.app'),
  openGraph: {
    title: 'TINY MODERN - AI-Powered Architectural Visualization',
    description: 'Transform your architectural ideas into stunning visualizations with AI',
    url: 'https://tiny-modern.vercel.app',
    siteName: 'TINY MODERN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TINY MODERN - AI Architecture Generator',
    description: 'Transform your architectural ideas into stunning visualizations with AI',
    creator: '@tinymodern',
  },
  icons: {
    icon: '/icon',
    apple: '/icon',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${empireFont.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'