"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Palette, Copy, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ColorPalettePage() {
  const [baseColor, setBaseColor] = useState("#3B82F6")
  const [palette, setPalette] = useState<string[]>([])
  const { toast } = useToast()

  const generatePalette = () => {
    const colors = []
    const baseHsl = hexToHsl(baseColor)

    // Generate complementary colors
    for (let i = 0; i < 5; i++) {
      const hue = (baseHsl.h + i * 72) % 360
      const color = hslToHex(hue, baseHsl.s, baseHsl.l)
      colors.push(color)
    }

    setPalette(colors)
  }

  const hexToHsl = (hex: string) => {
    const r = Number.parseInt(hex.slice(1, 3), 16) / 255
    const g = Number.parseInt(hex.slice(3, 5), 16) / 255
    const b = Number.parseInt(hex.slice(5, 7), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0,
      s = 0,
      l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    return { h: h * 360, s: s * 100, l: l * 100 }
  }

  const hslToHex = (h: number, s: number, l: number) => {
    h /= 360
    s /= 100
    l /= 100

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    const r = hue2rgb(p, q, h + 1 / 3)
    const g = hue2rgb(p, q, h)
    const b = hue2rgb(p, q, h - 1 / 3)

    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16)
      return hex.length === 1 ? "0" + hex : hex
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }

  const copyColor = async (color: string) => {
    await navigator.clipboard.writeText(color)
    toast({
      title: "Color Copied",
      description: `${color} copied to clipboard`,
    })
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Color Palette Generator</span>
          </h1>
          <p className="text-xl text-muted-foreground">Generate beautiful color palettes for your designs</p>
        </div>

        <Card className="tool-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="h-6 w-6 mr-2" />
              Color Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <div>
                <label className="text-sm font-medium">Base Color</label>
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="color"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="w-12 h-12 rounded border"
                  />
                  <Input value={baseColor} onChange={(e) => setBaseColor(e.target.value)} className="w-32" />
                </div>
              </div>
              <Button onClick={generatePalette} className="mt-6">
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate Palette
              </Button>
            </div>

            {palette.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Generated Palette</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {palette.map((color, index) => (
                    <div key={index} className="space-y-2">
                      <div
                        className="w-full h-24 rounded-lg border cursor-pointer hover:scale-105 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() => copyColor(color)}
                      />
                      <div className="text-center">
                        <Badge variant="outline" className="text-xs">
                          {color}
                        </Badge>
                        <Button size="sm" variant="ghost" onClick={() => copyColor(color)} className="w-full mt-1">
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
