"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { FileDropzone } from "@/components/file-dropzone"
import { AdBanner } from "@/components/ad-banner"
import { Camera, Download, User, Palette } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const photoSizes = {
  passport: { width: 413, height: 531, name: "Passport (35x45mm)" },
  visa: { width: 354, height: 472, name: "Visa (30x40mm)" },
  id: { width: 295, height: 413, name: "ID Card (25x35mm)" },
  license: { width: 236, height: 295, name: "License (20x25mm)" },
}

const backgrounds = [
  { name: "White", color: "#FFFFFF" },
  { name: "Light Blue", color: "#E3F2FD" },
  { name: "Light Gray", color: "#F5F5F5" },
  { name: "Red", color: "#FFEBEE" },
  { name: "Blue", color: "#E8F4FD" },
]

export default function IDPhotoMakerPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState("passport")
  const [selectedBackground, setSelectedBackground] = useState("#FFFFFF")
  const [isProcessing, setIsProcessing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const generateIDPhoto = async () => {
    if (!selectedFile || !canvasRef.current) return

    setIsProcessing(true)

    try {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const size = photoSizes[selectedSize as keyof typeof photoSizes]
      canvas.width = size.width
      canvas.height = size.height

      // Fill background
      ctx.fillStyle = selectedBackground
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        // Calculate scaling to fit the photo properly
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height)
        const scaledWidth = img.width * scale
        const scaledHeight = img.height * scale
        const x = (canvas.width - scaledWidth) / 2
        const y = (canvas.height - scaledHeight) / 2

        // Draw the image
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight)

        // Create download link
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              const a = document.createElement("a")
              a.href = url
              a.download = `id_photo_${selectedSize}.jpg`
              a.click()
              URL.revokeObjectURL(url)
            }
          },
          "image/jpeg",
          0.9,
        )

        toast({
          title: "ID Photo Created",
          description: "Your professional ID photo has been downloaded",
        })
      }

      img.src = previewUrl
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create ID photo",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Camera className="h-12 w-12 text-blue-500 mr-4" />
            <h1 className="text-4xl font-bold">ID Photo Maker</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Create professional ID photos with custom backgrounds and sizes
          </p>
        </div>

        <AdBanner slot="auto" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-6 w-6 mr-2" />
                Upload Photo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FileDropzone onFileSelect={handleFileSelect} acceptedTypes={["image/*"]} maxSize={10} />

              {previewUrl && (
                <div className="space-y-4">
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={previewUrl || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-64 object-contain bg-gray-100"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Photo Size</Label>
                      <Select value={selectedSize} onValueChange={setSelectedSize}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(photoSizes).map(([key, size]) => (
                            <SelectItem key={key} value={key}>
                              {size.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Background Color</Label>
                      <Select value={selectedBackground} onValueChange={setSelectedBackground}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {backgrounds.map((bg) => (
                            <SelectItem key={bg.color} value={bg.color}>
                              <div className="flex items-center">
                                <div className="w-4 h-4 rounded mr-2 border" style={{ backgroundColor: bg.color }} />
                                {bg.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button onClick={generateIDPhoto} disabled={isProcessing} className="w-full">
                    {isProcessing ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Create ID Photo
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-6 w-6 mr-2" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {previewUrl ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div
                      className="inline-block border-2 border-gray-300 rounded-lg overflow-hidden"
                      style={{
                        backgroundColor: selectedBackground,
                        width: "200px",
                        height: "260px",
                      }}
                    >
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="ID Photo Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    <p>Size: {photoSizes[selectedSize as keyof typeof photoSizes].name}</p>
                    <p>Background: {backgrounds.find((bg) => bg.color === selectedBackground)?.name}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center">
                    <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Upload a photo to see the preview</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <AdBanner slot="in-article" />
      </div>
    </div>
  )
}
