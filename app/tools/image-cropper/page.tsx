"use client"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { FileDropzone } from "@/components/file-dropzone"
import { AdBanner } from "@/components/ad-banner"
import { Crop, Download, RotateCcw, Square, Circle, Heart, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CroppedImage {
  id: string
  originalFile: File
  originalUrl: string
  croppedUrl: string
  shape: string
  timestamp: Date
}

const cropShapes = [
  { value: "square", label: "Square", icon: Square },
  { value: "circle", label: "Circle", icon: Circle },
  { value: "rectangle", label: "Rectangle", icon: Square },
  { value: "heart", label: "Heart", icon: Heart },
  { value: "star", label: "Star", icon: Star },
]

export default function ImageCropperPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [croppedImages, setCroppedImages] = useState<CroppedImage[]>([])
  const [selectedShape, setSelectedShape] = useState("square")
  const [cropSize, setCropSize] = useState([300])
  const [isProcessing, setIsProcessing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  const handleFilesSelected = useCallback(
    (files: File[]) => {
      setSelectedFiles(files)
      toast({
        title: "Files Selected",
        description: `${files.length} image(s) ready for cropping`,
      })
    },
    [toast],
  )

  const createShapePath = (
    ctx: CanvasRenderingContext2D,
    shape: string,
    size: number,
    centerX: number,
    centerY: number,
  ) => {
    ctx.beginPath()

    switch (shape) {
      case "circle":
        ctx.arc(centerX, centerY, size / 2, 0, 2 * Math.PI)
        break
      case "square":
      case "rectangle":
        const width = shape === "rectangle" ? size * 1.5 : size
        const height = size
        ctx.rect(centerX - width / 2, centerY - height / 2, width, height)
        break
      case "heart":
        const heartSize = size / 2
        ctx.moveTo(centerX, centerY + heartSize / 4)
        ctx.bezierCurveTo(
          centerX,
          centerY - heartSize / 4,
          centerX - heartSize,
          centerY - heartSize / 4,
          centerX - heartSize,
          centerY + heartSize / 8,
        )
        ctx.bezierCurveTo(
          centerX - heartSize,
          centerY + heartSize / 2,
          centerX,
          centerY + heartSize / 2,
          centerX,
          centerY + heartSize,
        )
        ctx.bezierCurveTo(
          centerX,
          centerY + heartSize / 2,
          centerX + heartSize,
          centerY + heartSize / 2,
          centerX + heartSize,
          centerY + heartSize / 8,
        )
        ctx.bezierCurveTo(
          centerX + heartSize,
          centerY - heartSize / 4,
          centerX,
          centerY - heartSize / 4,
          centerX,
          centerY + heartSize / 4,
        )
        break
      case "star":
        const starSize = size / 2
        const spikes = 5
        const outerRadius = starSize
        const innerRadius = starSize * 0.4
        let rot = (Math.PI / 2) * 3
        const step = Math.PI / spikes

        ctx.moveTo(centerX, centerY - outerRadius)
        for (let i = 0; i < spikes; i++) {
          const x = centerX + Math.cos(rot) * outerRadius
          const y = centerY + Math.sin(rot) * outerRadius
          ctx.lineTo(x, y)
          rot += step

          const x2 = centerX + Math.cos(rot) * innerRadius
          const y2 = centerY + Math.sin(rot) * innerRadius
          ctx.lineTo(x2, y2)
          rot += step
        }
        ctx.lineTo(centerX, centerY - outerRadius)
        break
    }

    ctx.closePath()
  }

  const cropImage = async (file: File, shape: string, size: number): Promise<CroppedImage> => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d")
      const img = new Image()

      if (!canvas || !ctx) {
        reject(new Error("Canvas not available"))
        return
      }

      img.onload = () => {
        const finalSize = Math.min(size, Math.min(img.width, img.height))
        canvas.width = finalSize
        canvas.height = finalSize

        // Calculate center position
        const centerX = finalSize / 2
        const centerY = finalSize / 2

        // Create clipping path
        ctx.save()
        createShapePath(ctx, shape, finalSize, centerX, centerY)
        ctx.clip()

        // Calculate image position to center it
        const scale = Math.max(finalSize / img.width, finalSize / img.height)
        const scaledWidth = img.width * scale
        const scaledHeight = img.height * scale
        const x = (finalSize - scaledWidth) / 2
        const y = (finalSize - scaledHeight) / 2

        // Draw image
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight)
        ctx.restore()

        // Add border for better visibility
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2
        createShapePath(ctx, shape, finalSize - 2, centerX, centerY)
        ctx.stroke()

        const croppedUrl = canvas.toDataURL("image/png", 0.9)
        const originalUrl = URL.createObjectURL(file)

        resolve({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          originalFile: file,
          originalUrl,
          croppedUrl,
          shape,
          timestamp: new Date(),
        })
      }

      img.onerror = () => reject(new Error(`Failed to load ${file.name}`))
      img.src = URL.createObjectURL(file)
    })
  }

  const cropImages = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select images to crop",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    const newCroppedImages: CroppedImage[] = []

    try {
      for (const file of selectedFiles) {
        const cropped = await cropImage(file, selectedShape, cropSize[0])
        newCroppedImages.push(cropped)
      }

      setCroppedImages((prev) => [...newCroppedImages, ...prev])
      toast({
        title: "Images Cropped Successfully! ✂️",
        description: `${newCroppedImages.length} image(s) cropped in ${selectedShape} shape`,
      })
    } catch (error) {
      toast({
        title: "Cropping Failed",
        description: "Failed to crop some images",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadImage = (image: CroppedImage) => {
    const link = document.createElement("a")
    link.href = image.croppedUrl
    link.download = `cropped_${selectedShape}_${image.originalFile.name.split(".")[0]}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Download Started",
      description: "Your cropped image is being downloaded",
    })
  }

  const downloadAll = () => {
    croppedImages.forEach((image, index) => {
      setTimeout(() => downloadImage(image), index * 500)
    })
  }

  const clearAll = () => {
    setSelectedFiles([])
    setCroppedImages([])
    toast({
      title: "Cleared",
      description: "All images and crops cleared",
    })
  }

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-full">
              <Crop className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Smart Image Cropper
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Crop images into various shapes including circles, squares, hearts, and stars
          </p>
        </div>

        <AdBanner slot="9131891151" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Crop className="h-6 w-6 mr-2" />
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

            {/* Cropped Results */}
            {croppedImages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Cropped Images ({croppedImages.length})</span>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {croppedImages.map((image) => (
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
                            <p className="text-sm font-medium mb-1">Cropped ({image.shape})</p>
                            <div className="flex justify-center items-center h-32 bg-gray-50 dark:bg-gray-800 rounded border">
                              <img
                                src={image.croppedUrl || "/placeholder.svg"}
                                alt="Cropped"
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">{image.originalFile.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Shape: {image.shape} • {image.timestamp.toLocaleString()}
                          </p>
                          <Button
                            onClick={() => downloadImage(image)}
                            className="w-full bg-orange-600 hover:bg-orange-700"
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
                <CardTitle>Crop Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Crop Shape</Label>
                  <Select value={selectedShape} onValueChange={setSelectedShape}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cropShapes.map((shape) => {
                        const IconComponent = shape.icon
                        return (
                          <SelectItem key={shape.value} value={shape.value}>
                            <div className="flex items-center">
                              <IconComponent className="h-4 w-4 mr-2" />
                              {shape.label}
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Crop Size: {cropSize[0]}px</Label>
                  <Slider value={cropSize} onValueChange={setCropSize} max={800} min={100} step={50} className="mt-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>100px</span>
                    <span>800px</span>
                  </div>
                </div>

                <Button
                  onClick={cropImages}
                  disabled={isProcessing || selectedFiles.length === 0}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                >
                  {isProcessing ? (
                    <>
                      <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                      Cropping...
                    </>
                  ) : (
                    <>
                      <Crop className="h-4 w-4 mr-2" />
                      Crop Images
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <AdBanner slot="9131891151" format="rectangle" />

            <Card>
              <CardHeader>
                <CardTitle>Available Shapes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {cropShapes.map((shape) => {
                  const IconComponent = shape.icon
                  return (
                    <div key={shape.value} className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">{shape.label}</span>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                    Multiple crop shapes
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3" />
                    Adjustable crop size
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3" />
                    Batch processing
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                    High-quality output
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                    PNG transparency
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
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
                <p>• Use high-resolution images for better quality</p>
                <p>• Circle crops work great for profile pictures</p>
                <p>• Heart and star shapes are perfect for creative projects</p>
                <p>• PNG format preserves transparency</p>
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
