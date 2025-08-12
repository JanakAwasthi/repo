"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QrCode, Download, Palette, ImageIcon, Settings, Eye, Copy, RefreshCw, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QRStyle {
  foregroundColor: string
  backgroundColor: string
  cornerStyle: "square" | "rounded" | "circle"
  dotStyle: "square" | "rounded" | "circle"
  size: number
  margin: number
  errorCorrection: "L" | "M" | "Q" | "H"
  logo?: string
  logoSize: number
  gradient: boolean
  gradientColor: string
}

export default function QRDesignerPage() {
  const [text, setText] = useState("")
  const [qrStyle, setQRStyle] = useState<QRStyle>({
    foregroundColor: "#000000",
    backgroundColor: "#ffffff",
    cornerStyle: "square",
    dotStyle: "square",
    size: 300,
    margin: 20,
    errorCorrection: "M",
    logoSize: 60,
    gradient: false,
    gradientColor: "#6366f1",
  })
  const [qrDataURL, setQRDataURL] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const generateQR = async () => {
    if (!text.trim()) {
      toast({
        title: "No Content",
        description: "Please enter text or URL to generate QR code",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    // Simulate QR generation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = qrStyle.size
    canvas.height = qrStyle.size

    // Clear canvas
    ctx.fillStyle = qrStyle.backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Generate QR pattern (simplified simulation)
    const moduleSize = (qrStyle.size - qrStyle.margin * 2) / 25
    const startX = qrStyle.margin
    const startY = qrStyle.margin

    // Create gradient if enabled
    let fillStyle
    if (qrStyle.gradient) {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, qrStyle.foregroundColor)
      gradient.addColorStop(1, qrStyle.gradientColor)
      fillStyle = gradient
    } else {
      fillStyle = qrStyle.foregroundColor
    }

    ctx.fillStyle = fillStyle

    // Draw QR pattern (simplified)
    for (let row = 0; row < 25; row++) {
      for (let col = 0; col < 25; col++) {
        // Simple pattern based on text hash
        const hash = text.split("").reduce((a, b) => {
          a = (a << 5) - a + b.charCodeAt(0)
          return a & a
        }, 0)

        if ((hash + row * col) % 3 === 0) {
          const x = startX + col * moduleSize
          const y = startY + row * moduleSize

          if (qrStyle.dotStyle === "circle") {
            ctx.beginPath()
            ctx.arc(x + moduleSize / 2, y + moduleSize / 2, moduleSize / 2, 0, 2 * Math.PI)
            ctx.fill()
          } else if (qrStyle.dotStyle === "rounded") {
            const radius = moduleSize * 0.2
            ctx.beginPath()
            ctx.roundRect(x, y, moduleSize, moduleSize, radius)
            ctx.fill()
          } else {
            ctx.fillRect(x, y, moduleSize, moduleSize)
          }
        }
      }
    }

    // Draw corner squares (finder patterns)
    const cornerSize = moduleSize * 7
    const corners = [
      { x: startX, y: startY },
      { x: startX + 18 * moduleSize, y: startY },
      { x: startX, y: startY + 18 * moduleSize },
    ]

    corners.forEach((corner) => {
      ctx.fillStyle = qrStyle.foregroundColor
      if (qrStyle.cornerStyle === "circle") {
        ctx.beginPath()
        ctx.arc(corner.x + cornerSize / 2, corner.y + cornerSize / 2, cornerSize / 2, 0, 2 * Math.PI)
        ctx.fill()

        ctx.fillStyle = qrStyle.backgroundColor
        ctx.beginPath()
        ctx.arc(corner.x + cornerSize / 2, corner.y + cornerSize / 2, cornerSize / 3, 0, 2 * Math.PI)
        ctx.fill()

        ctx.fillStyle = qrStyle.foregroundColor
        ctx.beginPath()
        ctx.arc(corner.x + cornerSize / 2, corner.y + cornerSize / 2, cornerSize / 6, 0, 2 * Math.PI)
        ctx.fill()
      } else if (qrStyle.cornerStyle === "rounded") {
        const radius = cornerSize * 0.2
        ctx.beginPath()
        ctx.roundRect(corner.x, corner.y, cornerSize, cornerSize, radius)
        ctx.fill()

        ctx.fillStyle = qrStyle.backgroundColor
        ctx.beginPath()
        ctx.roundRect(
          corner.x + moduleSize,
          corner.y + moduleSize,
          cornerSize - 2 * moduleSize,
          cornerSize - 2 * moduleSize,
          radius / 2,
        )
        ctx.fill()

        ctx.fillStyle = qrStyle.foregroundColor
        ctx.beginPath()
        ctx.roundRect(
          corner.x + 2 * moduleSize,
          corner.y + 2 * moduleSize,
          cornerSize - 4 * moduleSize,
          cornerSize - 4 * moduleSize,
          radius / 3,
        )
        ctx.fill()
      } else {
        ctx.fillRect(corner.x, corner.y, cornerSize, cornerSize)

        ctx.fillStyle = qrStyle.backgroundColor
        ctx.fillRect(
          corner.x + moduleSize,
          corner.y + moduleSize,
          cornerSize - 2 * moduleSize,
          cornerSize - 2 * moduleSize,
        )

        ctx.fillStyle = qrStyle.foregroundColor
        ctx.fillRect(
          corner.x + 2 * moduleSize,
          corner.y + 2 * moduleSize,
          cornerSize - 4 * moduleSize,
          cornerSize - 4 * moduleSize,
        )
      }
    })

    // Add logo if present
    if (qrStyle.logo) {
      const img = new Image()
      img.onload = () => {
        const logoSize = qrStyle.logoSize
        const logoX = (canvas.width - logoSize) / 2
        const logoY = (canvas.height - logoSize) / 2

        // Draw white background for logo
        ctx.fillStyle = qrStyle.backgroundColor
        ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10)

        ctx.drawImage(img, logoX, logoY, logoSize, logoSize)
        setQRDataURL(canvas.toDataURL())
      }
      img.src = qrStyle.logo
    } else {
      setQRDataURL(canvas.toDataURL())
    }

    setIsGenerating(false)
    toast({
      title: "QR Code Generated",
      description: "Your custom QR code is ready!",
    })
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 2MB",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setQRStyle((prev) => ({ ...prev, logo: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const downloadQR = () => {
    if (!qrDataURL) {
      toast({
        title: "No QR Code",
        description: "Please generate a QR code first",
        variant: "destructive",
      })
      return
    }

    const link = document.createElement("a")
    link.download = `qr-code-${Date.now()}.png`
    link.href = qrDataURL
    link.click()

    toast({
      title: "Downloaded",
      description: "QR code saved to your device",
    })
  }

  const copyToClipboard = async () => {
    if (!qrDataURL) return

    try {
      const response = await fetch(qrDataURL)
      const blob = await response.blob()
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
      toast({
        title: "Copied",
        description: "QR code copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const presetStyles = [
    { name: "Classic", fg: "#000000", bg: "#ffffff", corner: "square", dot: "square" },
    { name: "Modern", fg: "#1f2937", bg: "#f9fafb", corner: "rounded", dot: "rounded" },
    { name: "Elegant", fg: "#374151", bg: "#ffffff", corner: "circle", dot: "circle" },
    { name: "Vibrant", fg: "#7c3aed", bg: "#faf5ff", corner: "rounded", dot: "circle" },
    { name: "Ocean", fg: "#0ea5e9", bg: "#f0f9ff", corner: "circle", dot: "rounded" },
  ]

  const applyPreset = (preset: (typeof presetStyles)[0]) => {
    setQRStyle((prev) => ({
      ...prev,
      foregroundColor: preset.fg,
      backgroundColor: preset.bg,
      cornerStyle: preset.corner as any,
      dotStyle: preset.dot as any,
    }))
  }

  useEffect(() => {
    if (text.trim()) {
      generateQR()
    }
  }, [qrStyle])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-800 mb-4">
            <Palette className="h-5 w-5 mr-2" />
            <span className="font-medium">QR Code Designer</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">
            <span className="gradient-text">Custom QR Designer</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Create beautiful, customized QR codes with colors, styles, and logos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <QrCode className="h-6 w-6 mr-2 text-purple-600" />
                Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="qr-text">Text or URL</Label>
                <Textarea
                  id="qr-text"
                  placeholder="Enter text, URL, or any content for your QR code..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <Button onClick={generateQR} disabled={isGenerating || !text.trim()} className="w-full">
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate QR Code
                  </>
                )}
              </Button>

              {/* Preset Styles */}
              <div>
                <Label>Quick Styles</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {presetStyles.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      size="sm"
                      onClick={() => applyPreset(preset)}
                      className="text-xs"
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-6 w-6 mr-2 text-blue-600" />
                Customization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="colors" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="colors">Colors</TabsTrigger>
                  <TabsTrigger value="style">Style</TabsTrigger>
                  <TabsTrigger value="logo">Logo</TabsTrigger>
                </TabsList>

                <TabsContent value="colors" className="space-y-4">
                  <div>
                    <Label htmlFor="fg-color">Foreground Color</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="fg-color"
                        type="color"
                        value={qrStyle.foregroundColor}
                        onChange={(e) => setQRStyle((prev) => ({ ...prev, foregroundColor: e.target.value }))}
                        className="w-16 h-10"
                      />
                      <Input
                        value={qrStyle.foregroundColor}
                        onChange={(e) => setQRStyle((prev) => ({ ...prev, foregroundColor: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bg-color">Background Color</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="bg-color"
                        type="color"
                        value={qrStyle.backgroundColor}
                        onChange={(e) => setQRStyle((prev) => ({ ...prev, backgroundColor: e.target.value }))}
                        className="w-16 h-10"
                      />
                      <Input
                        value={qrStyle.backgroundColor}
                        onChange={(e) => setQRStyle((prev) => ({ ...prev, backgroundColor: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={qrStyle.gradient}
                      onCheckedChange={(checked) => setQRStyle((prev) => ({ ...prev, gradient: checked }))}
                    />
                    <Label>Enable Gradient</Label>
                  </div>

                  {qrStyle.gradient && (
                    <div>
                      <Label htmlFor="gradient-color">Gradient Color</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="gradient-color"
                          type="color"
                          value={qrStyle.gradientColor}
                          onChange={(e) => setQRStyle((prev) => ({ ...prev, gradientColor: e.target.value }))}
                          className="w-16 h-10"
                        />
                        <Input
                          value={qrStyle.gradientColor}
                          onChange={(e) => setQRStyle((prev) => ({ ...prev, gradientColor: e.target.value }))}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="style" className="space-y-4">
                  <div>
                    <Label>Corner Style</Label>
                    <Select
                      value={qrStyle.cornerStyle}
                      onValueChange={(value: any) => setQRStyle((prev) => ({ ...prev, cornerStyle: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="square">Square</SelectItem>
                        <SelectItem value="rounded">Rounded</SelectItem>
                        <SelectItem value="circle">Circle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Dot Style</Label>
                    <Select
                      value={qrStyle.dotStyle}
                      onValueChange={(value: any) => setQRStyle((prev) => ({ ...prev, dotStyle: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="square">Square</SelectItem>
                        <SelectItem value="rounded">Rounded</SelectItem>
                        <SelectItem value="circle">Circle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Size: {qrStyle.size}px</Label>
                    <Slider
                      value={[qrStyle.size]}
                      onValueChange={([value]) => setQRStyle((prev) => ({ ...prev, size: value }))}
                      min={200}
                      max={800}
                      step={50}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Margin: {qrStyle.margin}px</Label>
                    <Slider
                      value={[qrStyle.margin]}
                      onValueChange={([value]) => setQRStyle((prev) => ({ ...prev, margin: value }))}
                      min={0}
                      max={50}
                      step={5}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Error Correction</Label>
                    <Select
                      value={qrStyle.errorCorrection}
                      onValueChange={(value: any) => setQRStyle((prev) => ({ ...prev, errorCorrection: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L">Low (7%)</SelectItem>
                        <SelectItem value="M">Medium (15%)</SelectItem>
                        <SelectItem value="Q">Quartile (25%)</SelectItem>
                        <SelectItem value="H">High (30%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="logo" className="space-y-4">
                  <div>
                    <Label>Upload Logo</Label>
                    <div className="mt-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Choose Logo Image
                      </Button>
                    </div>
                  </div>

                  {qrStyle.logo && (
                    <>
                      <div>
                        <Label>Logo Preview</Label>
                        <div className="mt-2 p-4 border rounded-lg bg-gray-50">
                          <img
                            src={qrStyle.logo || "/placeholder.svg"}
                            alt="Logo preview"
                            className="w-16 h-16 object-contain mx-auto"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Logo Size: {qrStyle.logoSize}px</Label>
                        <Slider
                          value={[qrStyle.logoSize]}
                          onValueChange={([value]) => setQRStyle((prev) => ({ ...prev, logoSize: value }))}
                          min={30}
                          max={120}
                          step={10}
                          className="mt-2"
                        />
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => setQRStyle((prev) => ({ ...prev, logo: undefined }))}
                        className="w-full"
                      >
                        Remove Logo
                      </Button>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Preview & Download */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-6 w-6 mr-2 text-green-600" />
                Preview & Download
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                {qrDataURL ? (
                  <img
                    src={qrDataURL || "/placeholder.svg"}
                    alt="Generated QR Code"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">QR code will appear here</p>
                  </div>
                )}
              </div>

              <canvas ref={canvasRef} className="hidden" width={qrStyle.size} height={qrStyle.size} />

              {qrDataURL && (
                <div className="space-y-2">
                  <Button onClick={downloadQR} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download PNG
                  </Button>

                  <Button variant="outline" onClick={copyToClipboard} className="w-full bg-transparent">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy to Clipboard
                  </Button>
                </div>
              )}

              <div className="text-xs text-muted-foreground space-y-1">
                <p>• High resolution PNG format</p>
                <p>• Transparent background support</p>
                <p>• Print-ready quality</p>
                <p>• Compatible with all QR scanners</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
