import { HeroSection } from "@/components/hero-section"
import { FeaturedTools } from "@/components/featured-tools"
import { AllToolsSection } from "@/components/all-tools-section"
import { AdBanner } from "@/components/ad-banner"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LinkToQR.me - Free Online Tools | QR Code Generator, Image Compressor, PDF Tools & More",
  description:
    "Free online toolkit with 50+ tools including QR code generator, image compressor, PDF merger, video downloader, text tools, and more. No registration required.",
  keywords: [
    "free online tools",
    "QR code generator",
    "image compressor",
    "PDF tools",
    "video downloader",
    "text tools",
    "image tools",
    "document tools",
    "web tools",
    "online converter",
    "free toolkit",
    "no registration",
    "browser tools",
    "productivity tools",
    "utility tools",
    "LinkToQR",
    "QR scanner",
    "image resizer",
    "background remover",
    "watermark tools",
    "password generator",
    "hash generator",
    "base64 encoder",
    "URL shortener",
    "color palette",
    "image enhancer",
    "photo editor",
    "digital signature",
    "screen recorder",
    "audio converter",
    "AI tools",
    "text extractor",
    "OCR tools",
    "image cropper",
    "format converter",
    "file tools",
    "media tools",
    "design tools",
    "developer tools",
    "SEO tools",
    "marketing tools",
    "business tools",
    "student tools",
    "professional tools",
    "creative tools",
    "editing tools",
    "conversion tools",
    "analysis tools",
    "optimization tools",
    "security tools",
  ].join(", "),
  authors: [{ name: "LinkToQR.me Team" }],
  creator: "LinkToQR.me",
  publisher: "LinkToQR.me",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://linktoqr.me",
    siteName: "LinkToQR.me",
    title: "LinkToQR.me - Free Online Tools & Utilities",
    description:
      "Access 50+ free online tools including QR code generator, image compressor, PDF tools, video downloader, and more. No registration required.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LinkToQR.me - Free Online Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkToQR.me - Free Online Tools",
    description: "50+ free online tools for QR codes, images, PDFs, videos, and more",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://linktoqr.me",
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Top Ad Banner */}
      <div className="w-full py-4 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <AdBanner slot="9131891151" />
        </div>
      </div>

      {/* Hero Section */}
      <HeroSection />

      {/* Middle Ad Banner */}
      <div className="w-full py-6">
        <div className="container mx-auto px-4">
          <AdBanner slot="9131891151" format="rectangle" />
        </div>
      </div>

      {/* Featured Tools */}
      <FeaturedTools />

      {/* Ad Banner */}
      <div className="w-full py-6 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <AdBanner slot="9131891151" />
        </div>
      </div>

      {/* All Tools Section */}
      <AllToolsSection />

      {/* Bottom Ad Banner */}
      <div className="w-full py-6">
        <div className="container mx-auto px-4">
          <AdBanner slot="9131891151" format="rectangle" />
        </div>
      </div>
    </div>
  )
}
