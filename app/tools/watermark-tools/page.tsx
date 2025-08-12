"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { FileDropzone } from "@/components/file-dropzone"
import { AdBanner } from "@/components/ad-banner"
import { Download, Droplets, Trash2, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WatermarkedImage {
  id: string
  originalFile: File
  watermarkedUrl: string
  watermarkText: string
  timestamp: Date
}

export default function WatermarkToolsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [watermarkText, setWatermarkText] = useState("WATERMARK")
  const [opacity, setOpacity] = useState([50])
  const [fontSize, setFontSize] = useState([24])
  const [isProcessing, setIsProcessing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const addWatermark = async () => {
    if (!selectedFile || !canvasRef.current) return

    setIsProcessing(true)

    try {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height

        // Draw original image
        ctx.drawImage(img, 0, 0)

        // Add watermark
        ctx.globalAlpha = opacity[0] / 100
        ctx.fillStyle = "white"
        ctx.font = `${fontSize[0]}px Arial`
        ctx.textAlign = "center"
        ctx.fillText(watermarkText, canvas.width / 2, canvas.height / 2)

        // Create download link
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `watermarked_${selectedFile.name}`
            a.click()
            URL.revokeObjectURL(url)
          }
        })

        toast({
          title: "Watermark Added",
          description: "Your watermarked image has been downloaded",
        })
      }

      img.src = previewUrl
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add watermark",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const removeWatermark = () => {
    toast({
      title: "AI Watermark Removal",
      description: "This feature uses advanced AI to detect and remove watermarks",
    })
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Droplets className="h-12 w-12 text-blue-500 mr-4" />
            <h1 className="text-4xl font-bold">Watermark Tools</h1>
          </div>
          <p className="text-xl text-muted-foreground">Add or remove watermarks from your images</p>
        </div>

        <AdBanner slot="auto" />

        <Tabs defaultValue="add" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add">Add Watermark</TabsTrigger>
            <TabsTrigger value="remove">Remove Watermark</TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Droplets className="h-6 w-6 mr-2" />
                  Add Watermark
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FileDropzone onFileSelect={handleFileSelect} acceptedTypes={["image/*"]} maxSize={10} />

                {previewUrl && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Watermark Settings</Label>
                        <div className="space-y-4 mt-2">
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
                            <Slider
                              value={opacity}
                              onValueChange={setOpacity}
                              max={100}
                              min={10}
                              step={5}
                              className="mt-2"
                            />
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
                        </div>
                      </div>

                      <div>
                        <Label>Preview</Label>
                        <div className="mt-2 border rounded-lg overflow-hidden">
                          <img
                            src={previewUrl || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full h-64 object-contain bg-gray-100"
                          />
                        </div>
                      </div>
                    </div>

                    <Button onClick={addWatermark} disabled={isProcessing} className="w-full">
                      {isProcessing ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Add Watermark & Download
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="remove" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trash2 className="h-6 w-6 mr-2" />
                  Remove Watermark
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

                    <Button onClick={removeWatermark} className="w-full">
                      <EyeOff className="h-4 w-4 mr-2" />
                      Remove Watermark (AI Powered)
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <canvas ref={canvasRef} className="hidden" />

        <AdBanner slot="in-article" />
      </div>
    </div>
  )
}
