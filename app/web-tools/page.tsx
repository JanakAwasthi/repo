"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Globe, Key, Palette, Shield, Zap, History } from "lucide-react"
import Link from "next/link"

const webTools = [
  {
    name: "Password Generator",
    description: "Generate secure passwords with customizable options",
    icon: Key,
    href: "/tools/password-generator",
    color: "from-red-500 to-pink-600",
  },
  {
    name: "URL Shortener",
    description: "Create short, shareable links from long URLs",
    icon: Globe,
    href: "/tools/url-shortener",
    color: "from-blue-500 to-cyan-600",
  },
  {
    name: "Color Palette",
    description: "Generate and explore beautiful color combinations",
    icon: Palette,
    href: "/tools/color-palette",
    color: "from-purple-500 to-pink-600",
  },
  {
    name: "Base64 Encoder",
    description: "Encode and decode text using Base64 encoding",
    icon: Shield,
    href: "/tools/base64-encoder",
    color: "from-green-500 to-emerald-600",
  },
  {
    name: "Hash Generator",
    description: "Generate MD5, SHA-1, SHA-256 hashes for text",
    icon: Zap,
    href: "/tools/hash-generator",
    color: "from-orange-500 to-red-600",
  },
  {
    name: "Save History",
    description: "View and manage your generated content history",
    icon: History,
    href: "/tools/save-history",
    color: "from-indigo-500 to-purple-600",
  },
]

export default function WebToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 mb-4">
            <Globe className="h-5 w-5 mr-2" />
            <span className="font-medium">Web Development Tools</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">
            <span className="gradient-text">Web Tools</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Essential web development and utility tools for developers and content creators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {webTools.map((tool) => {
            const ToolIcon = tool.icon
            return (
              <Link key={tool.name} href={tool.href}>
                <Card className="tool-card group h-full">
                  <CardContent className="p-8 text-center">
                    <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${tool.color} mb-6`}>
                      <ToolIcon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{tool.name}</h3>
                    <p className="text-muted-foreground leading-relaxed">{tool.description}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
