"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, QrCode, ImageIcon, FileText, Video, Wrench, Brain } from "lucide-react"
import { cn } from "@/lib/utils"

const toolCategories = [
  {
    title: "QR & Utilities",
    icon: QrCode,
    href: "/qr-utilities",
    tools: [
      { name: "QR Code Generator", href: "/tools/qr-generator" },
      { name: "QR Code Scanner", href: "/tools/qr-scanner" },
      { name: "QR Code Designer", href: "/tools/qr-designer" },
      { name: "QR Code Decoder", href: "/tools/qr-decoder" },
      { name: "Password Generator", href: "/tools/password-generator" },
      { name: "Hash Generator", href: "/tools/hash-generator" },
      { name: "Base64 Encoder", href: "/tools/base64-encoder" },
      { name: "URL Shortener", href: "/tools/url-shortener" },
    ],
  },
  {
    title: "Image Tools",
    icon: ImageIcon,
    href: "/image-tools",
    tools: [
      { name: "Image Compressor", href: "/tools/image-compressor" },
      { name: "Image Enhancer", href: "/tools/image-enhancer" },
      { name: "Image Resizer", href: "/tools/image-resizer" },
      { name: "Image Cropper", href: "/tools/image-cropper" },
      { name: "Format Converter", href: "/tools/format-converter" },
      { name: "ID Photo Maker", href: "/tools/id-photo-maker" },
      { name: "Background Merger", href: "/tools/background-merger" },
      { name: "Color Palette", href: "/tools/color-palette" },
    ],
  },
  {
    title: "Document Tools",
    icon: FileText,
    href: "/document-tools",
    tools: [
      { name: "Photo to PDF", href: "/tools/photo-to-pdf" },
      { name: "PDF Merger", href: "/tools/pdf-merger" },
      { name: "Document Scanner", href: "/tools/document-scanner" },
      { name: "Digital Signature", href: "/tools/digital-signature" },
      { name: "Watermark Tools", href: "/tools/watermark-tools" },
      { name: "Text Extractor", href: "/tools/text-extractor" },
    ],
  },
  {
    title: "Media Tools",
    icon: Video,
    href: "/media-tools",
    tools: [
      { name: "Video Downloader", href: "/tools/video-downloader" },
      { name: "Screen Recorder", href: "/tools/screen-recorder" },
      { name: "Audio Converter", href: "/tools/audio-converter" },
    ],
  },
  {
    title: "Smart Text",
    icon: Brain,
    href: "/smart-text",
    tools: [
      { name: "AI Summarizer", href: "/tools/ai-summarizer" },
      { name: "AI Detector", href: "/tools/ai-detector" },
      { name: "Humanize AI", href: "/tools/humanize-ai" },
      { name: "Find Text", href: "/tools/find-text" },
      { name: "Store Text", href: "/tools/store-text" },
      { name: "Secure Text", href: "/tools/secure-text" },
      { name: "Save History", href: "/tools/save-history" },
    ],
  },
  {
    title: "Web Tools",
    icon: Wrench,
    href: "/web-tools",
    tools: [{ name: "All Tools", href: "/tools" }],
  },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
              <QrCode className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LinkToQR.me
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavigationMenu>
              <NavigationMenuList>
                {toolCategories.map((category) => (
                  <NavigationMenuItem key={category.title}>
                    <NavigationMenuTrigger className="flex items-center space-x-1">
                      <category.icon className="h-4 w-4" />
                      <span>{category.title}</span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {category.tools.map((tool) => (
                          <NavigationMenuLink key={tool.name} asChild>
                            <Link
                              href={tool.href}
                              className={cn(
                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              )}
                            >
                              <div className="text-sm font-medium leading-none">{tool.name}</div>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Tools & Categories</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {toolCategories.map((category) => (
                    <div key={category.title} className="space-y-3">
                      <div className="flex items-center space-x-2 font-semibold">
                        <category.icon className="h-5 w-5" />
                        <span>{category.title}</span>
                      </div>
                      <div className="ml-7 space-y-2">
                        {category.tools.map((tool) => (
                          <Link
                            key={tool.name}
                            href={tool.href}
                            className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {tool.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
