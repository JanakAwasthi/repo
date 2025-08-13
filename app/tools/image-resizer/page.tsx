"use client"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { FileDropzone } from "@/components/file-dropzone"
import { Progress } from "@/components/ui/progress"
import { Crop, Download, Lock, Eye, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ResizedImage {
  id: string
  original: File
  originalUrl: string
  resized: Blob
  resizedUrl: string
  originalDimensions: { width: number; height: number }
  newDimensions: { width: number; height: number }
}

export default function ImageResizerPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [resizedImages, setResizedImages] = useState<ResizedImage[]>([])
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(600)
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [previewImage, setPreviewImage] = useState<string>("")
  const [previewResized, setPreviewResized] = useState<string>("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  const resizeImage = useCallback(
    (file: File, targetWidth: number, targetHeight: number, maintainRatio: boolean): Promise<ResizedImage> => {
      return new Promise((resolve, reject) => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        const img = new Image()

        if (!canvas || !ctx) {
          reject(new Error("Canvas not available"))
          return
        }

        img.onload = () => {
          let newWidth = targetWidth
          let newHeight = targetHeight

          if (maintainRatio) {
            const aspectRatio = img.width / img.height
            if (targetWidth / targetHeight > aspectRatio) {
              newWidth = targetHeight * aspectRatio
            } else {
              newHeight = targetWidth / aspectRatio
            }
          }

          canvas.width = newWidth
          canvas.height = newHeight
          ctx.drawImage(img, 0, 0, newWidth, newHeight)

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const resizedUrl = URL.createObjectURL(blob)
                resolve({
                  id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                  original: file,
                  originalUrl: URL.createObjectURL(file),
                  resized: blob,
                  resizedUrl,
                  originalDimensions: { width: img.width, height: img.height },
                  newDimensions: { width: Math.round(newWidth), height: Math.round(newHeight) },
                })
              } else {
                reject(new Error("Failed to resize image"))
              }
            },
            "image/jpeg",
            0.9,
          )
        }

        img.onerror = () => reject(new Error("Failed to load image"))
        img.src = URL.createObjectURL(file)
      })
    },
    [],
  )

  const generatePreview = useCallback(
    async (file: File) => {
      try {
        const resized = await resizeImage(file, width, height, maintainAspectRatio)
        setPreviewResized(resized.resizedUrl)
      } catch (error) {
        console.error("Preview generation failed:", error)
      }
    },
    [width, height, maintainAspectRatio, resizeImage],
  )

  const handleFilesSelected = useCallback(
    (files: File[]) => {
      setSelectedFiles(files)
      if (files.length > 0) {
        setPreviewImage(URL.createObjectURL(files[0]))
        generatePreview(files[0])
      }
      toast({
        title: "Files Selected",
        description: `${files.length} image(s) ready for resizing`,
      })
    },
    [generatePreview, toast],
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
      const newResizedImages: ResizedImage[] = []

      for (let i = 0; i < files.length; i++) {
        try {
          const resized = await resizeImage(files[i], width, height, maintainAspectRatio)
          newResizedImages.push(resized)
          setProgress(((i + 1) / files.length) * 100)
        } catch (error) {
          toast({
            title: "Resize Failed",
            description: `Failed to resize ${files[i].name}`,
            variant: "destructive",
          })
        }
      }

      setResizedImages((prev) => [...newResizedImages, ...prev])
      setIsProcessing(false)
      toast({
        title: "Resize Complete! 📐",
        description: `Successfully resized ${newResizedImages.length} images`,
      })
    },
    [width, height, maintainAspectRatio, resizeImage, toast],
  )

  const downloadImage = (image: ResizedImage) => {
    const link = document.createElement("a")
    link.href = image.resizedUrl
    link.download = `resized_${image.original.name.split(".")[0]}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Download Started",
      description: "Your resized image is being downloaded",
    })
  }

  const downloadAll = () => {
    resizedImages.forEach((image, index) => {
      setTimeout(() => downloadImage(image), index * 500)
    })
  }

  const clearAll = () => {
    setSelectedFiles([])
    setResizedImages([])
    setPreviewImage("")
    setPreviewResized("")
    toast({
      title: "Cleared",
      description: "All images and resized versions cleared",
    })
  }

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full">
              <Crop className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Smart Image Resizer
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Resize images while maintaining aspect ratio with live preview
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
                      <div className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-800">
                        <img
                          src={previewImage || "/placeholder.svg"}
                          alt="Original"
                          className="w-full h-48 object-contain rounded"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Resized Preview</p>
                      <div className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-800">
                        <img
                          src={previewResized || previewImage}
                          alt="Resized"
                          className="w-full h-48 object-contain rounded"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {isProcessing && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Resizing Images...</span>
                    <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </CardContent>
              </Card>
            )}

            {resizedImages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Resized Images ({resizedImages.length})</span>
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
                  <div className="space-y-4">
                    {resizedImages.map((image) => (
                      <div key={image.id} className="border rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium mb-2">Original</p>
                            <img
                              src={image.originalUrl || "/placeholder.svg"}
                              alt="Original"
                              className="w-full h-32 object-cover rounded border"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-2">Resized</p>
                            <img
                              src={image.resizedUrl || "/placeholder.svg"}
                              alt="Resized"
                              className="w-full h-32 object-cover rounded border"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{image.original.name}</h4>
                            <div className="text-sm text-muted-foreground">
                              {image.originalDimensions.width}×{image.originalDimensions.height} →{" "}
                              {image.newDimensions.width}×{image.newDimensions.height}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => downloadImage(image)}
                            className="bg-blue-600 hover:bg-blue-700"
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
                <CardTitle>Resize Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="width">Width (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={width}
                    onChange={(e) => {
                      setWidth(Number(e.target.value))
                      if (selectedFiles.length > 0) generatePreview(selectedFiles[0])
                    }}
                    min="1"
                    max="4000"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => {
                      setHeight(Number(e.target.value))
                      if (selectedFiles.length > 0) generatePreview(selectedFiles[0])
                    }}
                    min="1"
                    max="4000"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="aspect-ratio"
                    checked={maintainAspectRatio}
                    onCheckedChange={(checked) => {
                      setMaintainAspectRatio(checked)
                      if (selectedFiles.length > 0) generatePreview(selectedFiles[0])
                    }}
                  />
                  <Label htmlFor="aspect-ratio" className="flex items-center">
                    <Lock className="h-4 w-4 mr-1" />
                    Maintain aspect ratio
                  </Label>
                </div>

                <Button
                  onClick={() => handleFilesAccepted(selectedFiles)}
                  disabled={selectedFiles.length === 0 || isProcessing}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  {isProcessing ? (
                    <>
                      <Crop className="h-4 w-4 mr-2 animate-spin" />
                      Resizing...
                    </>
                  ) : (
                    <>
                      <Crop className="h-4 w-4 mr-2" />
                      Resize Images
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                    Live preview
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    Aspect ratio lock
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
                    Batch processing
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2" />
                    Quality preservation
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                    Multiple formats
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
