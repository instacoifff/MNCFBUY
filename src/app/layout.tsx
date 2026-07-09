import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { CartProvider } from '@/context/CartContext'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'MoncefBuy - Premium E-Commerce',
  description:
    'Discover curated collections of extraordinary products designed to elevate your everyday life.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
