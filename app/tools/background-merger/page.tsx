"use client"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileDropzone } from "@/components/file-dropzone"
import { AdBanner } from "@/components/ad-banner"
import { Layers, Download, RotateCw, Eye, Blend } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type BlendMode = "normal" | "multiply" | "screen" | "overlay" | "soft-light" | "hard-light"

interface MergedImage {
  id: string
  dataUrl: string
  name: string
  timestamp: Date
  settings: {
    opacity: number
    blendMode: BlendMode
  }
}

export default function BackgroundMergerPage() {
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null)
  const [foregroundImage, setForegroundImage] = useState<File | null>(null)
  const [backgroundPreview, setBackgroundPreview] = useState<string>("")
  const [foregroundPreview, setForegroundPreview] = useState<string>("")
  const [mergedImages, setMergedImages] = useState<MergedImage[]>([])
  const [opacity, setOpacity] = useState([80])
  const [blendMode, setBlendMode] = useState<BlendMode>("normal")
  const [isProcessing, setIsProcessing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  const handleBackgroundSelect = useCallback(
    (files: File[]) => {
      const file = files[0]
      if (file) {
        setBackgroundImage(file)
        setBackgroundPreview(URL.createObjectURL(file))
        toast({
          title: "Background Set",
          description: "Background image loaded successfully",
        })
      }
    },
    [toast],
  )

  const handleForegroundSelect = useCallback(
    (files: File[]) => {
      const file = files[0]
      if (file) {
        setForegroundImage(file)
        setForegroundPreview(URL.createObjectURL(file))
        toast({
          title: "Foreground Set",
          description: "Foreground image loaded successfully",
        })
      }
    },
    [toast],
  )

  const mergeImages = async () => {
    if (!backgroundImage || !foregroundImage) {
      toast({
        title: "Images Required",
        description: "Please select both background and foreground images",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d")
      if (!canvas || !ctx) return

      // Load background image
      const bgImg = new Image()
      bgImg.crossOrigin = "anonymous"

      bgImg.onload = () => {
        // Set canvas size to background image size
        canvas.width = bgImg.width
        canvas.height = bgImg.height

        // Draw background
        ctx.drawImage(bgImg, 0, 0)

        // Load foreground image
        const fgImg = new Image()
        fgImg.crossOrigin = "anonymous"

        fgImg.onload = () => {
          // Set blend mode and opacity
          ctx.globalCompositeOperation = blendMode
          ctx.globalAlpha = opacity[0] / 100

          // Calculate scaling to fit foreground on background
          const scale = Math.min(canvas.width / fgImg.width, canvas.height / fgImg.height)

          const scaledWidth = fgImg.width * scale
          const scaledHeight = fgImg.height * scale
          const x = (canvas.width - scaledWidth) / 2
          const y = (canvas.height - scaledHeight) / 2

          // Draw foreground
          ctx.drawImage(fgImg, x, y, scaledWidth, scaledHeight)

          // Reset context
          ctx.globalCompositeOperation = "source-over"
          ctx.globalAlpha = 1

          // Save result
          const dataUrl = canvas.toDataURL("image/png", 0.9)
          const newMerged: MergedImage = {
            id: Date.now().toString(),
            dataUrl,
            name: `merged-${Date.now()}`,
            timestamp: new Date(),
            settings: {
              opacity: opacity[0],
              blendMode,
            },
          }

          setMergedImages((prev) => [newMerged, ...prev])
          setIsProcessing(false)

          toast({
            title: "Images Merged! 🎨",
            description: "Your merged image is ready for download",
          })
        }

        fgImg.src = foregroundPreview
      }

      bgImg.src = backgroundPreview
    } catch (error) {
      setIsProcessing(false)
      toast({
        title: "Merge Failed",
        description: "An error occurred while merging images",
        variant: "destructive",
      })
    }
  }

  const downloadImage = (image: MergedImage) => {
    const link = document.createElement("a")
    link.href = image.dataUrl
    link.download = `${image.name}.png`
    link.click()

    toast({
      title: "Download Started",
      description: "Your merged image is being downloaded",
    })
  }

  const clearImages = () => {
    setBackgroundImage(null)
    setForegroundImage(null)
    setBackgroundPreview("")
    setForegroundPreview("")
    setMergedImages([])

    toast({
      title: "Images Cleared",
      description: "All images have been cleared",
    })
  }

  const getBlendModeDescription = (mode: BlendMode) => {
    const descriptions = {
      normal: "Standard overlay without blending",
      multiply: "Darkens by multiplying colors",
      screen: "Lightens by inverting and multiplying",
      overlay: "Combines multiply and screen modes",
      "soft-light": "Subtle lighting effect",
      "hard-light": "Strong lighting effect",
    }
    return descriptions[mode]
  }

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-pink-900">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full">
              <Layers className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Background Merger
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Merge images with professional blend modes and opacity controls
          </p>
        </div>

        <AdBanner slot="9131891151" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-dashed border-pink-200 dark:border-pink-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-pink-700 dark:text-pink-300">
                    <Layers className="h-5 w-5 mr-2" />
                    Background Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FileDropzone
                    onFilesAccepted={handleBackgroundSelect}
                    acceptedFileTypes={["image/jpeg", "image/png", "image/webp"]}
                    maxFileSize={50 * 1024 * 1024}
                    maxFiles={1}
                  />
                  {backgroundPreview && (
                    <div className="mt-4">
                      <img
                        src={backgroundPreview || "/placeholder.svg"}
                        alt="Background"
                        className="w-full h-32 object-cover rounded border"
                      />
                      <p className="text-sm text-muted-foreground mt-2 text-center">{backgroundImage?.name}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-2 border-dashed border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-700 dark:text-purple-300">
                    <Blend className="h-5 w-5 mr-2" />
                    Foreground Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FileDropzone
                    onFilesAccepted={handleForegroundSelect}
                    acceptedFileTypes={["image/jpeg", "image/png", "image/webp"]}
                    maxFileSize={50 * 1024 * 1024}
                    maxFiles={1}
                  />
                  {foregroundPreview && (
                    <div className="mt-4">
                      <img
                        src={foregroundPreview || "/placeholder.svg"}
                        alt="Foreground"
                        className="w-full h-32 object-cover rounded border"
                      />
                      <p className="text-sm text-muted-foreground mt-2 text-center">{foregroundImage?.name}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Merge Controls */}
            {backgroundImage && foregroundImage && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="h-5 w-5 mr-2 text-green-600" />
                    Merge Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Opacity: {opacity[0]}%</Label>
                      <Slider
                        value={opacity}
                        onValueChange={setOpacity}
                        max={100}
                        min={0}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Transparent</span>
                        <span>Opaque</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">Blend Mode</Label>
                      <Select value={blendMode} onValueChange={(value: BlendMode) => setBlendMode(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="multiply">Multiply</SelectItem>
                          <SelectItem value="screen">Screen</SelectItem>
                          <SelectItem value="overlay">Overlay</SelectItem>
                          <SelectItem value="soft-light">Soft Light</SelectItem>
                          <SelectItem value="hard-light">Hard Light</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">{getBlendModeDescription(blendMode)}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center space-x-4">
                    <Button
                      onClick={mergeImages}
                      disabled={isProcessing}
                      size="lg"
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8"
                    >
                      {isProcessing ? (
                        <>
                          <RotateCw className="h-5 w-5 mr-2 animate-spin" />
                          Merging...
                        </>
                      ) : (
                        <>
                          <Layers className="h-5 w-5 mr-2" />
                          Merge Images
                        </>
                      )}
                    </Button>
                    <Button onClick={clearImages} variant="outline" size="lg">
                      Clear All
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Merged Results */}
            {mergedImages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Download className="h-5 w-5 mr-2 text-green-600" />
                    Merged Images ({mergedImages.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mergedImages.map((image) => (
                      <div key={image.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                        <div className="mb-4">
                          <img
                            src={image.dataUrl || "/placeholder.svg"}
                            alt="Merged"
                            className="w-full h-48 object-cover rounded border"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{image.name}</p>
                              <p className="text-xs text-muted-foreground">{image.timestamp.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">
                                {image.settings.opacity}% • {image.settings.blendMode}
                              </p>
                            </div>
                          </div>

                          <Button
                            onClick={() => downloadImage(image)}
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
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

          {/* Sidebar */}
          <div className="space-y-6">
            <AdBanner slot="9131891151" format="rectangle" />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Blend className="h-5 w-5 mr-2 text-pink-600" />
                  Blend Modes Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div>
                  <strong>Normal:</strong> Standard overlay
                </div>
                <div>
                  <strong>Multiply:</strong> Darkens image
                </div>
                <div>
                  <strong>Screen:</strong> Lightens image
                </div>
                <div>
                  <strong>Overlay:</strong> Enhances contrast
                </div>
                <div>
                  <strong>Soft Light:</strong> Gentle lighting
                </div>
                <div>
                  <strong>Hard Light:</strong> Strong lighting
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                    Professional blend modes
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                    Adjustable opacity
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
                    Auto-scaling
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                    High-quality output
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3" />
                    Multiple formats
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3" />
                    Instant preview
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Use PNG files for transparency</p>
                <p>• Experiment with different blend modes</p>
                <p>• Adjust opacity for subtle effects</p>
                <p>• Higher resolution = better quality</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
        <AdBanner slot="9131891151" />
      </div>
    </div>
  )
}
