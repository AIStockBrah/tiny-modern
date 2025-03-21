import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import './globals.css'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

const inter = Inter({ subsets: ['latin'] })

const empireFont = localFont({
  src: '../public/fonts/EmpireStraight.ttf',
  variable: '--font-empire'
})

export const metadata = {
  title: "TINY MODERN - AI-Powered Architectural Visualization",
  description: "Transform your architectural ideas into stunning visualizations with our AI-powered platform.",
  generator: 'v0.dev',
  metadataBase: new URL('https://tiny-modern.vercel.app'),
  openGraph: {
    title: 'TINY MODERN - AI Architecture Generator',
    description: 'Transform your architectural ideas into stunning visualizations with our AI-powered platform.',
    url: 'https://tiny-modern.vercel.app',
    siteName: 'TINY MODERN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TINY MODERN - AI Architecture Generator',
    description: 'Transform your architectural ideas into stunning visualizations with our AI-powered platform.',
    creator: '@tinymodern',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-icon.png',
    },
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