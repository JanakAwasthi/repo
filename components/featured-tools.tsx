import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  FileArchiveIcon as Compress,
  QrCode,
  FileImage,
  Scan,
  Shield,
  Layers,
  ArrowRight,
  Crop,
  Sparkles,
} from "lucide-react"

const featuredTools = [
  {
    title: "Image Compressor",
    description: "Reduce image file sizes while maintaining quality",
    icon: Compress,
    href: "/tools/image-compressor",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "QR Code Generator",
    description: "Create custom QR codes for any content",
    icon: QrCode,
    href: "/tools/qr-generator",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Photo to PDF",
    description: "Convert images to PDF documents instantly",
    icon: FileImage,
    href: "/tools/photo-to-pdf",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    title: "Document Scanner",
    description: "Professional AI-powered document scanning",
    icon: Scan,
    href: "/tools/document-scanner",
    gradient: "from-orange-500 to-red-500",
  },
  {
    title: "Secure Text",
    description: "Store encrypted notes with cloud sync",
    icon: Shield,
    href: "/tools/secure-text",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    title: "Front & Background Merger",
    description: "Merge images with professional blend modes",
    icon: Layers,
    href: "/tools/background-merger",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    title: "Image Cropper",
    description: "Crop images into various shapes and sizes",
    icon: Crop,
    href: "/tools/image-cropper",
    gradient: "from-orange-500 to-red-500",
  },
  {
    title: "Image Enhancer AI",
    description: "Enhance images with AI-powered filters",
    icon: Sparkles,
    href: "/tools/image-enhancer",
    gradient: "from-violet-500 to-purple-500",
  },
]

export function FeaturedTools() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Featured Tools</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular and powerful tools for all your digital needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTools.map((tool, index) => {
            const Icon = tool.icon
            return (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              >
                <CardHeader className="pb-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tool.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">{tool.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{tool.description}</p>
                  <Link href={tool.href}>
                    <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      Try Now
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/tools">
            <Button size="lg" variant="outline" className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              View All Tools
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
