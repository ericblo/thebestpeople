import type { Metadata } from 'next'
import { Geist, Geist_Mono, Newsreader } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});

export const metadata: Metadata = {
  title: 'The Best People',
  description: 'What a few employees think of their boss. A scrolling timeline of the people who ran the Trump White House from 2017 to 2021, in their own words.',
  generator: 'v0.app',
  // The icon and Apple touch icon are app/icon.png and app/apple-icon.png
  // (the globe from ericblo.com).
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${newsreader.variable}`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
