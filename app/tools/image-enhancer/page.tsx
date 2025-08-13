"use client"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileDropzone } from "@/components/file-dropzone"
import { Progress } from "@/components/ui/progress"
import { Wand2, Download, RotateCcw, Eye, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EnhancedImage {
  id: string
  original: File
  originalUrl: string
  enhanced: string
  settings: {
    brightness: number
    contrast: number
    saturation: number
    sharpness: number
    filter: string
  }
}

const filters = [
  { value: "none", label: "None" },
  { value: "vintage", label: "Vintage" },
  { value: "dramatic", label: "Dramatic" },
  { value: "warm", label: "Warm" },
  { value: "cool", label: "Cool" },
  { value: "black-white", label: "Black & White" },
]

export default function ImageEnhancerPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [enhancedImages, setEnhancedImages] = useState<EnhancedImage[]>([])
  const [brightness, setBrightness] = useState([0])
  const [contrast, setContrast] = useState([0])
  const [saturation, setSaturation] = useState([0])
  const [sharpness, setSharpness] = useState([0])
  const [selectedFilter, setSelectedFilter] = useState("none")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [previewImage, setPreviewImage] = useState<string>("")
  const [enhancedPreview, setEnhancedPreview] = useState<string>("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  const applyFilters = (ctx: CanvasRenderingContext2D, settings: any) => {
    const filters = []

    if (settings.brightness !== 0) filters.push(`brightness(${100 + settings.brightness}%)`)
    if (settings.contrast !== 0) filters.push(`contrast(${100 + settings.contrast}%)`)
    if (settings.saturation !== 0) filters.push(`saturate(${100 + settings.saturation}%)`)

    // Apply filter effects
    switch (settings.filter) {
      case "vintage":
        filters.push("sepia(30%)", "contrast(120%)", "brightness(110%)")
        break
      case "dramatic":
        filters.push("contrast(150%)", "saturate(120%)", "brightness(90%)")
        break
      case "warm":
        filters.push("sepia(20%)", "saturate(110%)", "hue-rotate(10deg)")
        break
      case "cool":
        filters.push("hue-rotate(-10deg)", "saturate(110%)", "brightness(105%)")
        break
      case "black-white":
        filters.push("grayscale(100%)", "contrast(110%)")
        break
    }

    ctx.filter = filters.join(" ")
  }

  const enhanceImage = useCallback((file: File, settings: any): Promise<EnhancedImage> => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d")
      const img = new Image()

      if (!canvas || !ctx) {
        reject(new Error("Canvas not available"))
        return
      }

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height

        // Apply filters
        applyFilters(ctx, settings)
        ctx.drawImage(img, 0, 0)

        // Apply sharpness (simplified)
        if (settings.sharpness > 0) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data
          const factor = settings.sharpness / 100

          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * (1 + factor * 0.1))
            data[i + 1] = Math.min(255, data[i + 1] * (1 + factor * 0.1))
            data[i + 2] = Math.min(255, data[i + 2] * (1 + factor * 0.1))
          }

          ctx.putImageData(imageData, 0, 0)
        }

        resolve({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          original: file,
          originalUrl: URL.createObjectURL(file),
          enhanced: canvas.toDataURL("image/jpeg", 0.9),
          settings,
        })
      }

      img.onerror = () => reject(new Error("Failed to enhance image"))
      img.src = URL.createObjectURL(file)
    })
  }, [])

  const handleFilesSelected = useCallback((files: File[]) => {
    setSelectedFiles(files)
    if (files.length > 0) {
      setPreviewImage(URL.createObjectURL(files[0]))
      generatePreview(files[0])
    }
    toast({
      title: "Files Selected",
      description: `${files.length} image(s) ready for enhancement`,
    })
  }, [])

  const generatePreview = useCallback(
    async (file: File) => {
      const settings = {
        brightness: brightness[0],
        contrast: contrast[0],
        saturation: saturation[0],
        sharpness: sharpness[0],
        filter: selectedFilter,
      }

      try {
        const enhanced = await enhanceImage(file, settings)
        setEnhancedPreview(enhanced.enhanced)
      } catch (error) {
        console.error("Preview generation failed:", error)
      }
    },
    [brightness, contrast, saturation, sharpness, selectedFilter, enhanceImage],
  )

  // Update preview when settings change
  useState(() => {
    if (selectedFiles.length > 0) {
      generatePreview(selectedFiles[0])
    }
  })

  const handleFilesAccepted = useCallback(
    async (files: File[]) => {
      setIsProcessing(true)
      setProgress(0)
      const newEnhancedImages: EnhancedImage[] = []

      const settings = {
        brightness: brightness[0],
        contrast: contrast[0],
        saturation: saturation[0],
        sharpness: sharpness[0],
        filter: selectedFilter,
      }

      for (let i = 0; i < files.length; i++) {
        try {
          const enhanced = await enhanceImage(files[i], settings)
          newEnhancedImages.push(enhanced)
          setProgress(((i + 1) / files.length) * 100)
        } catch (error) {
          toast({
            title: "Enhancement Failed",
            description: `Failed to enhance ${files[i].name}`,
            variant: "destructive",
          })
        }
      }

      setEnhancedImages((prev) => [...newEnhancedImages, ...prev])
      setIsProcessing(false)
      toast({
        title: "Enhancement Complete! ✨",
        description: `Successfully enhanced ${newEnhancedImages.length} images`,
      })
    },
    [brightness, contrast, saturation, sharpness, selectedFilter, enhanceImage, toast],
  )

  const downloadImage = (image: EnhancedImage) => {
    const link = document.createElement("a")
    link.href = image.enhanced
    link.download = `enhanced_${image.original.name.split(".")[0]}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Download Started",
      description: "Your enhanced image is being downloaded",
    })
  }

  const downloadAll = () => {
    enhancedImages.forEach((image, index) => {
      setTimeout(() => downloadImage(image), index * 500)
    })
  }

  const resetSettings = () => {
    setBrightness([0])
    setContrast([0])
    setSaturation([0])
    setSharpness([0])
    setSelectedFilter("none")
  }

  const clearAll = () => {
    setSelectedFiles([])
    setEnhancedImages([])
    setPreviewImage("")
    setEnhancedPreview("")
    toast({
      title: "Cleared",
      description: "All images and enhancements cleared",
    })
  }

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full">
              <Wand2 className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI Image Enhancer
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enhance your images with professional-grade AI filters and adjustments
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Images</CardTitle>
              </CardHeader>
              <CardContent>
                <FileDropzone
                  onFilesAccepted={handleFilesSelected}
                  acceptedFileTypes={["image/jpeg", "image/png", "image/webp"]}
                  maxFileSize={50 * 1024 * 1024}
                  maxFiles={10}
                />
              </CardContent>
            </Card>

            {/* Live Preview */}
            {previewImage && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Original</p>
                      <img
                        src={previewImage || "/placeholder.svg"}
                        alt="Original"
                        className="w-full h-64 object-cover rounded border"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Enhanced Preview</p>
                      <img
                        src={enhancedPreview || previewImage}
                        alt="Enhanced"
                        className="w-full h-64 object-cover rounded border"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {isProcessing && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Enhancing Images...</span>
                    <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </CardContent>
              </Card>
            )}

            {enhancedImages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Enhanced Images ({enhancedImages.length})</span>
                    <div className="flex gap-2">
                      <Button onClick={downloadAll} variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download All
                      </Button>
                      <Button onClick={clearAll} variant="outline">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Clear All
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {enhancedImages.map((image) => (
                      <div key={image.id} className="border rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium mb-2">Original</p>
                            <img
                              src={image.originalUrl || "/placeholder.svg"}
                              alt="Original"
                              className="w-full h-48 object-cover rounded"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-2">Enhanced</p>
                            <img
                              src={image.enhanced || "/placeholder.svg"}
                              alt="Enhanced"
                              className="w-full h-48 object-cover rounded"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{image.original.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              B:{image.settings.brightness} C:{image.settings.contrast} S:{image.settings.saturation} •{" "}
                              {image.settings.filter}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => downloadImage(image)}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Enhancement Settings
                  </CardTitle>
                  <Button size="sm" variant="outline" onClick={resetSettings}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Filter</label>
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {filters.map((filter) => (
                        <SelectItem key={filter.value} value={filter.value}>
                          {filter.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Brightness: {brightness[0]}</label>
                  <Slider
                    value={brightness}
                    onValueChange={(value) => {
                      setBrightness(value)
                      if (selectedFiles.length > 0) generatePreview(selectedFiles[0])
                    }}
                    max={100}
                    min={-100}
                    step={5}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Contrast: {contrast[0]}</label>
                  <Slider
                    value={contrast}
                    onValueChange={(value) => {
                      setContrast(value)
                      if (selectedFiles.length > 0) generatePreview(selectedFiles[0])
                    }}
                    max={100}
                    min={-100}
                    step={5}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Saturation: {saturation[0]}</label>
                  <Slider
                    value={saturation}
                    onValueChange={(value) => {
                      setSaturation(value)
                      if (selectedFiles.length > 0) generatePreview(selectedFiles[0])
                    }}
                    max={100}
                    min={-100}
                    step={5}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Sharpness: {sharpness[0]}</label>
                  <Slider
                    value={sharpness}
                    onValueChange={(value) => {
                      setSharpness(value)
                      if (selectedFiles.length > 0) generatePreview(selectedFiles[0])
                    }}
                    max={100}
                    min={0}
                    step={5}
                  />
                </div>

                <Button
                  onClick={() => handleFilesAccepted(selectedFiles)}
                  disabled={selectedFiles.length === 0 || isProcessing}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                >
                  {isProcessing ? (
                    <>
                      <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Enhance Images
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
                    Real-time preview
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                    Professional filters
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    Batch processing
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2" />
                    Quality preservation
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                    Advanced adjustments
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2" />
                    Instant download
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}
