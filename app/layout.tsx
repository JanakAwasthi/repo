import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LinkToQR.me - All-in-One Toolkit for Image Processing, QR Codes & More",
  description:
    "Free online tools for image compression, QR code generation, PDF conversion, document scanning, and more. Professional-grade tools for all your digital needs.",
  keywords: "QR code generator, image compressor, PDF converter, document scanner, online tools, free tools",
  authors: [{ name: "LinkToQR.me" }],
  creator: "LinkToQR.me",
  publisher: "LinkToQR.me",
  robots: "index, follow",
  openGraph: {
    title: "LinkToQR.me - All-in-One Digital Toolkit",
    description: "Free online tools for image processing, QR codes, PDF conversion, and more",
    url: "https://linktoqr.me",
    siteName: "LinkToQR.me",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkToQR.me - All-in-One Digital Toolkit",
    description: "Free online tools for image processing, QR codes, PDF conversion, and more",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>

        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
