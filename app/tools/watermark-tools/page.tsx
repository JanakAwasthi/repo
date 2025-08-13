"use client"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileDropzone } from "@/components/file-dropzone"
import { AdBanner } from "@/components/ad-banner"
import { Download, Droplets, Trash2, EyeOff, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WatermarkedImage {
  id: string
  originalFile: File
  originalUrl: string
  watermarkedUrl: string
  watermarkText: string
  timestamp: Date
  settings: {
    opacity: number
    fontSize: number
    position: string
    color: string
  }
}

const positions = [
  { value: "center", label: "Center" },
  { value: "top-left", label: "Top Left" },
  { value: "top-right", label: "Top Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "bottom-right", label: "Bottom Right" },
]

const colors = [
  { value: "#FFFFFF", label: "White" },
  { value: "#000000", label: "Black" },
  { value: "#FF0000", label: "Red" },
  { value: "#0000FF", label: "Blue" },
  { value: "#00FF00", label: "Green" },
]

export default function WatermarkToolsPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [watermarkedImages, setWatermarkedImages] = useState<WatermarkedImage[]>([])
  const [watermarkText, setWatermarkText] = useState("WATERMARK")
  const [opacity, setOpacity] = useState([50])
  const [fontSize, setFontSize] = useState([24])
  const [position, setPosition] = useState("center")
  const [color, setColor] = useState("#FFFFFF")
  const [isProcessing, setIsProcessing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  const handleFilesSelected = useCallback(
    (files: File[]) => {
      setSelectedFiles(files)
      toast({
        title: "Files Selected",
        description: `${files.length} file(s) ready for watermarking`,
      })
    },
    [toast],
  )

  const getWatermarkPosition = (canvas: HTMLCanvasElement, textWidth: number, textHeight: number) => {
    const { width, height } = canvas
    const padding = 20

    switch (position) {
      case "top-left":
        return { x: padding, y: padding + textHeight }
      case "top-right":
        return { x: width - textWidth - padding, y: padding + textHeight }
      case "bottom-left":
        return { x: padding, y: height - padding }
      case "bottom-right":
        return { x: width - textWidth - padding, y: height - padding }
      case "center":
      default:
        return { x: width / 2, y: height / 2 }
    }
  }

  const addWatermark = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select images to add watermarks",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    const newWatermarkedImages: WatermarkedImage[] = []

    try {
      for (const file of selectedFiles) {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (!canvas || !ctx) continue

        const img = new Image()
        img.crossOrigin = "anonymous"

        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            canvas.width = img.width
            canvas.height = img.height

            // Draw original image
            ctx.drawImage(img, 0, 0)

            // Configure watermark text
            ctx.font = `${fontSize[0]}px Arial`
            ctx.fillStyle = color
            ctx.globalAlpha = opacity[0] / 100

            // Measure text
            const textMetrics = ctx.measureText(watermarkText)
            const textWidth = textMetrics.width
            const textHeight = fontSize[0]

            // Get position
            const pos = getWatermarkPosition(canvas, textWidth, textHeight)

            // Add text shadow for better visibility
            ctx.shadowColor = color === "#FFFFFF" ? "#000000" : "#FFFFFF"
            ctx.shadowBlur = 2
            ctx.shadowOffsetX = 1
            ctx.shadowOffsetY = 1

            // Draw watermark
            if (position === "center") {
              ctx.textAlign = "center"
              ctx.textBaseline = "middle"
            } else {
              ctx.textAlign = "left"
              ctx.textBaseline = "top"
            }

            ctx.fillText(watermarkText, pos.x, pos.y)

            // Reset context
            ctx.globalAlpha = 1
            ctx.shadowBlur = 0
            ctx.shadowOffsetX = 0
            ctx.shadowOffsetY = 0

            const watermarkedUrl = canvas.toDataURL("image/png", 0.9)
            const originalUrl = URL.createObjectURL(file)

            const watermarkedImage: WatermarkedImage = {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              originalFile: file,
              originalUrl,
              watermarkedUrl,
              watermarkText,
              timestamp: new Date(),
              settings: {
                opacity: opacity[0],
                fontSize: fontSize[0],
                position,
                color,
              },
            }

            newWatermarkedImages.push(watermarkedImage)
            resolve()
          }

          img.onerror = () => reject(new Error(`Failed to load ${file.name}`))
          img.src = URL.createObjectURL(file)
        })
      }

      setWatermarkedImages((prev) => [...newWatermarkedImages, ...prev])
      toast({
        title: "Watermarks Added Successfully! 🎨",
        description: `${newWatermarkedImages.length} image(s) processed`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add watermarks to some images",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadImage = (image: WatermarkedImage) => {
    const link = document.createElement("a")
    link.href = image.watermarkedUrl
    link.download = `watermarked_${image.originalFile.name.split(".")[0]}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Download Started",
      description: "Your watermarked image is being downloaded",
    })
  }

  const downloadAll = () => {
    watermarkedImages.forEach((image, index) => {
      setTimeout(() => downloadImage(image), index * 500)
    })
  }

  const clearAll = () => {
    setSelectedFiles([])
    setWatermarkedImages([])
    toast({
      title: "Cleared",
      description: "All images and watermarks cleared",
    })
  }

  const removeWatermark = () => {
    toast({
      title: "AI Watermark Removal",
      description: "This feature uses advanced AI to detect and remove watermarks. Coming soon!",
    })
  }

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full">
              <Droplets className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Watermark Tools
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Add professional watermarks to your images or remove existing ones with AI
          </p>
        </div>

        <AdBanner slot="9131891151" />

        <Tabs defaultValue="add" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add">Add Watermark</TabsTrigger>
            <TabsTrigger value="remove">Remove Watermark</TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Droplets className="h-6 w-6 mr-2" />
                      Upload Images
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FileDropzone
                      onFilesAccepted={handleFilesSelected}
                      acceptedFileTypes={["image/jpeg", "image/png", "image/webp"]}
                      maxFileSize={50 * 1024 * 1024}
                      maxFiles={10}
                      multiple={true}
                    />
                  </CardContent>
                </Card>

                {/* Preview Section */}
                {selectedFiles.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Selected Images ({selectedFiles.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="border rounded-lg p-2">
                            <img
                              src={URL.createObjectURL(file) || "/placeholder.svg"}
                              alt={file.name}
                              className="w-full h-24 object-cover rounded mb-2"
                            />
                            <p className="text-xs text-muted-foreground truncate">{file.name}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Watermarked Results */}
                {watermarkedImages.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Watermarked Images ({watermarkedImages.length})</span>
                        <div className="flex gap-2">
                          <Button onClick={downloadAll} variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download All
                          </Button>
                          <Button onClick={clearAll} variant="outline">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear All
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {watermarkedImages.map((image) => (
                          <div key={image.id} className="border rounded-lg p-4">
                            <div className="grid grid-cols-2 gap-2 mb-4">
                              <div>
                                <p className="text-sm font-medium mb-1">Original</p>
                                <img
                                  src={image.originalUrl || "/placeholder.svg"}
                                  alt="Original"
                                  className="w-full h-32 object-cover rounded border"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium mb-1">Watermarked</p>
                                <img
                                  src={image.watermarkedUrl || "/placeholder.svg"}
                                  alt="Watermarked"
                                  className="w-full h-32 object-cover rounded border"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-medium">{image.originalFile.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Text: "{image.watermarkText}" • Opacity: {image.settings.opacity}% • Position:{" "}
                                {image.settings.position}
                              </p>
                              <Button
                                onClick={() => downloadImage(image)}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download PNG
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Settings Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Watermark Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="watermarkText">Watermark Text</Label>
                      <Input
                        id="watermarkText"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        placeholder="Enter watermark text"
                      />
                    </div>

                    <div>
                      <Label>Opacity: {opacity[0]}%</Label>
                      <Slider value={opacity} onValueChange={setOpacity} max={100} min={10} step={5} className="mt-2" />
                    </div>

                    <div>
                      <Label>Font Size: {fontSize[0]}px</Label>
                      <Slider
                        value={fontSize}
                        onValueChange={setFontSize}
                        max={72}
                        min={12}
                        step={2}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Position</Label>
                      <Select value={position} onValueChange={setPosition}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {positions.map((pos) => (
                            <SelectItem key={pos.value} value={pos.value}>
                              {pos.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Color</Label>
                      <Select value={color} onValueChange={setColor}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {colors.map((col) => (
                            <SelectItem key={col.value} value={col.value}>
                              <div className="flex items-center">
                                <div className="w-4 h-4 rounded mr-2 border" style={{ backgroundColor: col.value }} />
                                {col.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={addWatermark}
                      disabled={isProcessing || selectedFiles.length === 0}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                    >
                      {isProcessing ? (
                        <>
                          <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Droplets className="h-4 w-4 mr-2" />
                          Add Watermarks
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <AdBanner slot="9131891151" format="rectangle" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="remove" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <EyeOff className="h-6 w-6 mr-2" />
                  Remove Watermark (AI Powered)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FileDropzone
                  onFilesAccepted={handleFilesSelected}
                  acceptedFileTypes={["image/jpeg", "image/png", "image/webp"]}
                  maxFileSize={50 * 1024 * 1024}
                  maxFiles={5}
                  multiple={true}
                />

                {selectedFiles.length > 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="border rounded-lg p-2">
                          <img
                            src={URL.createObjectURL(file) || "/placeholder.svg"}
                            alt={file.name}
                            className="w-full h-32 object-cover rounded mb-2"
                          />
                          <p className="text-xs text-muted-foreground truncate">{file.name}</p>
                        </div>
                      ))}
                    </div>

                    <Button onClick={removeWatermark} className="w-full">
                      <EyeOff className="h-4 w-4 mr-2" />
                      Remove Watermarks (Coming Soon)
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <canvas ref={canvasRef} className="hidden" />
        <AdBanner slot="9131891151" />
      </div>
    </div>
  )
}
