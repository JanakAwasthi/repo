import Link from "next/link"
import { Zap, Github, Twitter, Mail } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const toolCategories = [
    {
      title: "Image Tools",
      links: [
        { name: "Image Compressor", href: "/tools/image-compressor" },
        { name: "Image Enhancer", href: "/tools/image-enhancer" },
        { name: "Image Resizer", href: "/tools/image-resizer" },
        { name: "Format Converter", href: "/tools/format-converter" },
        { name: "Background Merger", href: "/tools/background-merger" },
        { name: "ID Photo Maker", href: "/tools/id-photo-maker" },
      ],
    },
    {
      title: "Document Tools",
      links: [
        { name: "Photo to PDF", href: "/tools/photo-to-pdf" },
        { name: "Document Scanner", href: "/tools/document-scanner" },
        { name: "PDF Merger", href: "/tools/pdf-merger" },
        { name: "Digital Signature", href: "/tools/digital-signature" },
        { name: "Watermark Tools", href: "/tools/watermark-tools" },
        { name: "Text Extractor OCR", href: "/tools/text-extractor" },
      ],
    },
    {
      title: "QR & Web Tools",
      links: [
        { name: "QR Generator", href: "/tools/qr-generator" },
        { name: "QR Scanner", href: "/tools/qr-scanner" },
        { name: "URL Shortener", href: "/tools/url-shortener" },
        { name: "Password Generator", href: "/tools/password-generator" },
        { name: "Base64 Encoder", href: "/tools/base64-encoder" },
        { name: "Hash Generator", href: "/tools/hash-generator" },
      ],
    },
    {
      title: "AI & Smart Tools",
      links: [
        { name: "AI Content Detector", href: "/tools/ai-detector" },
        { name: "Humanize AI Text", href: "/tools/humanize-ai" },
        { name: "Store Your Notes", href: "/tools/store-text" },
        { name: "Find Your Notes", href: "/tools/find-text" },
        { name: "Screen Recorder", href: "/tools/screen-recorder" },
        { name: "Audio Converter", href: "/tools/audio-converter" },
      ],
    },
  ]

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand Section */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LinkToQR.me
              </span>
            </Link>
            <p className="text-sm leading-6 text-muted-foreground">
              Your ultimate free online digital toolkit. Transform, enhance, and manage your digital content with 25+
              powerful tools. Image compression, QR code generation, PDF tools, document scanning, and much more - all
              completely free!
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">GitHub</span>
                <Github className="h-6 w-6" />
              </a>
              <a href="mailto:contact@linktoqr.me" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Email</span>
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Tool Categories */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {toolCategories.slice(0, 2).map((category) => (
                <div key={category.title}>
                  <h3 className="text-sm font-semibold leading-6 text-foreground">{category.title}</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {category.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-sm leading-6 text-muted-foreground hover:text-foreground"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {toolCategories.slice(2, 4).map((category) => (
                <div key={category.title}>
                  <h3 className="text-sm font-semibold leading-6 text-foreground">{category.title}</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {category.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-sm leading-6 text-muted-foreground hover:text-foreground"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SEO Keywords Section */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Popular Search Terms</h3>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
              <span>free image compressor online</span> •<span>QR code generator free</span> •
              <span>PDF merger online</span> •<span>document scanner app</span> •<span>watermark remover free</span> •
              <span>background remover online</span> •<span>digital signature maker</span> •
              <span>text extractor OCR</span> •<span>password generator secure</span> •<span>URL shortener free</span> •
              <span>base64 encoder decoder</span> •<span>hash generator MD5 SHA256</span> •
              <span>color palette generator</span> •<span>AI content detector</span> •<span>humanize AI text</span> •
              <span>screen recorder online</span> •<span>audio converter MP3</span> •<span>smart text storage</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-8 sm:mt-20 lg:mt-24">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <Link href="/privacy" className="text-sm leading-6 text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm leading-6 text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="/how-to-use" className="text-sm leading-6 text-muted-foreground hover:text-foreground">
                How to Use
              </Link>
            </div>
            <p className="mt-8 text-xs leading-5 text-muted-foreground md:order-1 md:mt-0">
              &copy; {currentYear} LinkToQR.me - Free Online Digital Toolkit. All rights reserved. 25+ free tools for
              image processing, document handling, QR codes, and more.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
