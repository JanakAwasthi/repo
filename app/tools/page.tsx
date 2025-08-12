import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdBanner } from "@/components/ad-banner"
import {
  FileArchiveIcon as Compress,
  Sparkles,
  Crop,
  RefreshCw,
  Layers,
  Camera,
  Palette,
  FileImage,
  Scan,
  FilePlus,
  PenTool,
  Droplets,
  Search,
  QrCode,
  ScanLine,
  Eye,
  Shield,
  Brain,
  Wand2,
  Link,
  Key,
  Code,
  Database,
  History,
} from "lucide-react"
import NextLink from "next/link"

const allTools = [
  {
    category: "Smart Text Tools",
    tools: [
      {
        name: "Store Your Note",
        description: "Store and manage up to 40 text documents securely",
        icon: Database,
        href: "/tools/store-text",
        color: "from-green-500 to-emerald-600",
        badge: "Secure",
      },
      {
        name: "Find Your Note",
        description: "Find and access your stored text documents",
        icon: Brain,
        href: "/tools/find-text",
        color: "from-blue-500 to-cyan-600",
        badge: "Search",
      },
    ],
  },
  {
    category: "Image Tools",
    tools: [
      {
        name: "Image Compressor",
        description: "Reduce image file size while maintaining quality",
        icon: Compress,
        href: "/tools/image-compressor",
        color: "from-orange-500 to-red-600",
        badge: "Popular",
      },
      {
        name: "Image Enhancer AI",
        description: "Enhance image quality with AI algorithms",
        icon: Wand2,
        href: "/tools/image-enhancer",
        color: "from-purple-500 to-pink-600",
        badge: "AI Powered",
      },
      {
        name: "Image Resizer",
        description: "Resize images while maintaining aspect ratio",
        icon: Crop,
        href: "/tools/image-resizer",
        color: "from-blue-500 to-indigo-600",
        badge: "Fast",
      },
      {
        name: "Format Converter",
        description: "Convert between JPG, PNG, WebP formats",
        icon: RefreshCw,
        href: "/tools/format-converter",
        color: "from-cyan-500 to-blue-600",
        badge: "Multi-Format",
      },
      {
        name: "Background Merger",
        description: "Merge foreground and background images",
        icon: Layers,
        href: "/tools/background-merger",
        color: "from-pink-500 to-rose-600",
        badge: "Creative",
      },
      {
        name: "ID Photo Maker",
        description: "Create professional ID photos with custom backgrounds",
        icon: Camera,
        href: "/tools/id-photo-maker",
        color: "from-indigo-500 to-purple-600",
        badge: "Professional",
      },
    ],
  },
  {
    category: "Document Tools",
    tools: [
      {
        name: "Photo to PDF",
        description: "Convert multiple images to a single PDF",
        icon: FileImage,
        href: "/tools/photo-to-pdf",
        color: "from-emerald-500 to-green-600",
        badge: "Batch",
      },
      {
        name: "Smart Document Scanner",
        description: "Scan documents with auto edge detection",
        icon: Scan,
        href: "/tools/document-scanner",
        color: "from-teal-500 to-cyan-600",
        badge: "Smart",
      },
      {
        name: "PDF Merger",
        description: "Combine multiple PDFs into one",
        icon: FilePlus,
        href: "/tools/pdf-merger",
        color: "from-violet-500 to-purple-600",
        badge: "Essential",
      },
      {
        name: "Digital Signature",
        description: "Add digital signatures to documents",
        icon: PenTool,
        href: "/tools/digital-signature",
        color: "from-rose-500 to-pink-600",
        badge: "Legal",
      },
      {
        name: "Watermark Tools",
        description: "Add or remove watermarks from documents",
        icon: Droplets,
        href: "/tools/watermark-tools",
        color: "from-sky-500 to-blue-600",
        badge: "Protection",
      },
      {
        name: "Text Extractor",
        description: "Extract text from images using OCR",
        icon: Search,
        href: "/tools/text-extractor",
        color: "from-amber-500 to-orange-600",
        badge: "OCR",
      },
      {
        name: "AI Content Detector",
        description: "Detect AI-generated content with accuracy percentage",
        icon: Sparkles,
        href: "/tools/ai-detector",
        color: "from-fuchsia-500 to-purple-600",
        badge: "AI Detection",
      },
    ],
  },
  {
    category: "QR Code Tools",
    tools: [
      {
        name: "QR Generator",
        description: "Create custom QR codes with styling",
        icon: QrCode,
        href: "/tools/qr-generator",
        color: "from-lime-500 to-green-600",
        badge: "Customizable",
      },
      {
        name: "QR Scanner",
        description: "Scan QR codes in real-time",
        icon: ScanLine,
        href: "/tools/qr-scanner",
        color: "from-orange-500 to-red-600",
        badge: "Real-time",
      },
      {
        name: "QR Designer",
        description: "Design QR codes with logos and colors",
        icon: Palette,
        href: "/tools/qr-designer",
        color: "from-purple-500 to-pink-600",
        badge: "Designer",
      },
      {
        name: "QR Decoder",
        description: "Decode damaged or low-quality QR codes",
        icon: Eye,
        href: "/tools/qr-decoder",
        color: "from-cyan-500 to-blue-600",
        badge: "AI Enhanced",
      },
    ],
  },
  {
    category: "Web Tools",
    tools: [
      {
        name: "URL Shortener",
        description: "Create short links with analytics",
        icon: Link,
        href: "/tools/url-shortener",
        color: "from-blue-500 to-cyan-600",
        badge: "Analytics",
      },
      {
        name: "Password Generator",
        description: "Generate secure passwords with custom options",
        icon: Key,
        href: "/tools/password-generator",
        color: "from-green-500 to-emerald-600",
        badge: "Secure",
      },
      {
        name: "Color Palette",
        description: "Generate beautiful color palettes",
        icon: Palette,
        href: "/tools/color-palette",
        color: "from-pink-500 to-rose-600",
        badge: "Design",
      },
      {
        name: "Base64 Encoder",
        description: "Encode and decode Base64 strings",
        icon: Code,
        href: "/tools/base64-encoder",
        color: "from-indigo-500 to-purple-600",
        badge: "Developer",
      },
      {
        name: "Hash Generator",
        description: "Generate MD5, SHA1, SHA256 hashes",
        icon: Shield,
        href: "/tools/hash-generator",
        color: "from-red-500 to-pink-600",
        badge: "Crypto",
      },
      {
        name: "Save History",
        description: "Save and manage your generated passwords and data",
        icon: History,
        href: "/tools/save-history",
        color: "from-teal-500 to-cyan-600",
        badge: "Storage",
      },
    ],
  },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">
            <span className="gradient-text">ALL TOOLS</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose from our comprehensive collection of 20+ powerful web tools
          </p>
        </div>

        <AdBanner slot="auto" />

        {allTools.map((category, categoryIndex) => (
          <div key={category.category} className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">{category.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {category.tools.map((tool) => {
                const Icon = tool.icon
                return (
                  <NextLink key={tool.name} href={tool.href}>
                    <Card className="tool-card group h-full">
                      <CardContent className="p-0">
                        <div className={`h-32 bg-gradient-to-r ${tool.color} relative overflow-hidden`}>
                          <div className="absolute inset-0 bg-black/20" />
                          <div className="absolute top-4 right-4">
                            <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                              {tool.badge}
                            </Badge>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Icon className="h-16 w-16 text-white" />
                          </div>
                        </div>

                        <div className="p-6">
                          <h3 className="text-lg font-bold mb-2">{tool.name}</h3>
                          <p className="text-muted-foreground text-sm">{tool.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </NextLink>
                )
              })}
            </div>

            {/* Add ads between categories */}
            {categoryIndex === 1 && <AdBanner slot="in-article" />}
            {categoryIndex === 2 && <AdBanner slot="fluid" />}
          </div>
        ))}

        <AdBanner slot="multiplex" />
      </div>
    </div>
  )
}
