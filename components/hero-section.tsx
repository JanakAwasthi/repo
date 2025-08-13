import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap, Shield, Clock, Star } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-20 pb-16">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <Zap className="mr-1 h-3 w-3" />
            25+ Free Online Tools
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
            <span className="block">All-in-One</span>
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Digital Toolkit
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Transform, enhance, and manage your digital content with our comprehensive suite of AI-powered tools. Image
            processing, document handling, QR codes, and more - all in your browser, completely free!
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/tools">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
              >
                Explore All Tools
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/tools/qr-generator">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg bg-transparent">
                Quick QR Generator
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Card className="text-center border-0 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur">
            <CardContent className="p-6">
              <Shield className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">100% Secure & Private</h3>
              <p className="text-sm text-muted-foreground">
                All processing happens in your browser. Your files never leave your device.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur">
            <CardContent className="p-6">
              <Clock className="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">
                Instant processing with no waiting time. Get results in seconds.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur">
            <CardContent className="p-6">
              <Star className="mx-auto h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Always Free</h3>
              <p className="text-sm text-muted-foreground">
                No registration, no subscriptions. All tools are completely free to use.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Popular tools preview */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Most Popular Tools</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {[
              { name: "Image Compressor", href: "/tools/image-compressor", color: "from-orange-500 to-red-600" },
              { name: "QR Generator", href: "/tools/qr-generator", color: "from-green-500 to-emerald-600" },
              { name: "PDF Merger", href: "/tools/pdf-merger", color: "from-blue-500 to-cyan-600" },
              { name: "Password Generator", href: "/tools/password-generator", color: "from-purple-500 to-pink-600" },
              { name: "URL Shortener", href: "/tools/url-shortener", color: "from-indigo-500 to-purple-600" },
              { name: "Document Scanner", href: "/tools/document-scanner", color: "from-teal-500 to-cyan-600" },
            ].map((tool) => (
              <Link key={tool.name} href={tool.href}>
                <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-0">
                  <CardContent className="p-4">
                    <div
                      className={`h-16 w-16 mx-auto mb-3 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-xs font-medium text-center">{tool.name}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
