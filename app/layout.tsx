import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title:
    "LinkToQR.me - Free Online Tools | Image Compressor, QR Generator, PDF Tools, Document Scanner, Watermark Remover",
  description:
    "Free online toolkit with 25+ tools: Image compressor, QR code generator, PDF merger, document scanner, watermark remover, URL shortener, password generator, base64 encoder, hash generator, color palette, format converter, background remover, ID photo maker, digital signature, text extractor OCR, AI content detector, humanize AI text, screen recorder, audio converter, and smart text storage tools. No registration required!",
  keywords: [
    // Image Tools Keywords
    "image compressor",
    "compress image online",
    "reduce image size",
    "image optimizer",
    "photo compressor",
    "image resizer",
    "resize image online",
    "crop image",
    "image cropper",
    "photo resizer",
    "image enhancer",
    "AI image enhancer",
    "photo enhancer",
    "image quality improver",
    "format converter",
    "image converter",
    "jpg to png",
    "png to jpg",
    "webp converter",
    "background remover",
    "remove background",
    "background eraser",
    "photo background remover",
    "background merger",
    "merge images",
    "combine photos",
    "layer images",
    "ID photo maker",
    "passport photo",
    "visa photo",
    "ID card photo",
    "professional photo",

    // Document Tools Keywords
    "PDF tools",
    "PDF merger",
    "combine PDF",
    "merge PDF files",
    "PDF combiner",
    "photo to PDF",
    "image to PDF",
    "convert images to PDF",
    "pictures to PDF",
    "document scanner",
    "scan documents",
    "mobile scanner",
    "camera scanner",
    "OCR scanner",
    "digital signature",
    "electronic signature",
    "sign PDF",
    "signature maker",
    "e-signature",
    "watermark remover",
    "remove watermark",
    "watermark eraser",
    "clean image",
    "text extractor",
    "OCR online",
    "extract text from image",
    "image to text",
    "OCR converter",
    "AI content detector",
    "detect AI text",
    "AI checker",
    "artificial intelligence detector",

    // QR Code Tools Keywords
    "QR code generator",
    "create QR code",
    "QR maker",
    "generate QR",
    "custom QR code",
    "QR scanner",
    "scan QR code",
    "QR reader",
    "decode QR",
    "QR code scanner online",
    "QR designer",
    "custom QR design",
    "branded QR code",
    "logo QR code",
    "QR decoder",
    "decode QR code",
    "QR code reader",
    "damaged QR repair",

    // Web Tools Keywords
    "URL shortener",
    "short link",
    "link shortener",
    "tiny URL",
    "compress URL",
    "password generator",
    "secure password",
    "random password",
    "strong password generator",
    "base64 encoder",
    "base64 decoder",
    "encode base64",
    "decode base64",
    "base64 converter",
    "hash generator",
    "MD5 generator",
    "SHA256 generator",
    "SHA1 generator",
    "crypto hash",
    "color palette",
    "color generator",
    "color picker",
    "hex colors",
    "RGB colors",

    // Smart Text Tools Keywords
    "text storage",
    "note storage",
    "secure notes",
    "encrypted notes",
    "private notes",
    "note finder",
    "search notes",
    "text database",
    "document storage",
    "text vault",
    "humanize AI text",
    "AI text humanizer",
    "make AI text human",
    "rewrite AI content",

    // Media Tools Keywords
    "screen recorder",
    "record screen",
    "screen capture",
    "video recorder",
    "desktop recorder",
    "audio converter",
    "convert audio",
    "MP3 converter",
    "audio format converter",
    "sound converter",

    // General Keywords
    "free online tools",
    "web tools",
    "browser tools",
    "no download required",
    "no registration",
    "privacy focused",
    "secure tools",
    "client-side processing",
    "offline tools",
    "LinkToQR",
    "digital toolkit",
    "productivity tools",
    "utility tools",
    "online converter",
    "file tools",
    "image processing",
    "document processing",
    "media tools",
    "developer tools",
    "design tools",
    "business tools",
    "professional tools",
    "student tools",
    "creative tools",
    "SEO tools",
  ].join(", "),
  authors: [{ name: "LinkToQR.me Team" }],
  creator: "LinkToQR.me - Free Online Digital Toolkit",
  publisher: "LinkToQR.me",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://linktoqr.me"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "LinkToQR.me - Free Online Tools | Image Compressor, QR Generator, PDF Tools",
    description:
      "Free online toolkit with 25+ tools: Image compressor, QR code generator, PDF merger, document scanner, watermark remover, and more. No registration required!",
    url: "https://linktoqr.me",
    siteName: "LinkToQR.me - Free Online Digital Toolkit",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LinkToQR.me - Free Online Digital Toolkit with 25+ Tools",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkToQR.me - Free Online Tools | Image Compressor, QR Generator, PDF Tools",
    description:
      "Free online toolkit with 25+ tools: Image compressor, QR code generator, PDF merger, document scanner, watermark remover, and more. No registration required!",
    images: ["/og-image.png"],
    creator: "@linktoqrme",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#5bbad5",
      },
    ],
  },
  manifest: "/manifest.json",
  other: {
    "msapplication-TileColor": "#da532c",
    "theme-color": "#ffffff",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/icon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />

        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9131891151"
          crossOrigin="anonymous"
        />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "LinkToQR.me - Free Online Digital Toolkit",
              description:
                "Free online toolkit with 25+ tools including image compressor, QR code generator, PDF tools, document scanner, watermark remover, and more. No registration required!",
              url: "https://linktoqr.me",
              applicationCategory: "UtilityApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              creator: {
                "@type": "Organization",
                name: "LinkToQR.me",
              },
              keywords:
                "image compressor, QR code generator, PDF tools, document scanner, watermark remover, URL shortener, password generator, base64 encoder, hash generator, color palette, format converter, background remover, ID photo maker, digital signature, text extractor, OCR, AI content detector, humanize AI text, screen recorder, audio converter, smart text storage, free online tools",
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Header />
          <main>{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
