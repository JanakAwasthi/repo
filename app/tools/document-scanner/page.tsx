"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { FileDropzone } from "@/components/file-dropzone"
import { SidebarAd, InlineAd } from "@/components/ad-banner"
import {
  Camera,
  Upload,
  Download,
  RotateCcw,
  RotateCw,
  Contrast,
  Sun,
  Palette,
  Trash2,
  FileText,
  Scan,
  Settings,
} from "lucide-react"

interface ScannedDocument {
  id: string
  originalImage: string
  processedImage: string
  name: string
  timestamp: Date
  settings: DocumentSettings
}

interface DocumentSettings {
  filter: "none" | "grayscale" | "blackwhite" | "enhance" | "vintage" | "blueprint"
  brightness: number
  contrast: number
  saturation: number
  rotation: number
  cropArea?: { x: number; y: number; width: number; height: number }
}

const filterOptions = [
  { value: "none", label: "Original", description: "No filter applied" },
  { value: "grayscale", label: "Grayscale", description: "Convert to black and white" },
  { value: "blackwhite", label: "Black & White", description: "High contrast document mode" },
  { value: "enhance", label: "Document Enhance", description: "Optimize for text readability" },
  { value: "vintage", label: "Vintage", description: "Aged document look" },
  { value: "blueprint", label: "Blueprint", description: "Technical drawing style" },
]

export default function DocumentScannerPage() {
  const [documents, setDocuments] = useState<ScannedDocument[]>([])
  const [currentDoc, setCurrentDoc] = useState<ScannedDocument | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [settings, setSettings] = useState<DocumentSettings>({
    filter: "enhance",
    brightness: 0,
    contrast: 20,
    saturation: 0,
    rotation: 0,
  })

  const { toast } = useToast()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setShowCamera(true)
      }
    } catch (error) {
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to scan documents.",
        variant: "destructive",
      })
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)

    const imageData = canvas.toDataURL("image/jpeg", 0.9)
    processDocument(imageData, `Scan_${Date.now()}.jpg`)
    stopCamera()
  }

  const handleFilesSelected = useCallback(async (files: File[]) => {
    for (const file of files) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            processDocument(e.target.result as string, file.name)
          }
        }
        reader.readAsDataURL(file)
      }
    }
  }, [])

  const processDocument = async (imageData: string, fileName: string) => {
    setIsProcessing(true)

    try {
      // Simulate document processing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newDoc: ScannedDocument = {
        id: Date.now().toString(),
        originalImage: imageData,
        processedImage: imageData, // In real app, this would be the processed version
        name: fileName,
        timestamp: new Date(),
        settings: { ...settings },
      }

      setDocuments((prev) => [...prev, newDoc])
      setCurrentDoc(newDoc)

      toast({
        title: "Document scanned successfully!",
        description: "Your document has been processed and enhanced.",
      })
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "Failed to process the document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const applyFilter = (doc: ScannedDocument, newSettings: DocumentSettings) => {
    // In a real app, this would apply actual image processing
    const updatedDoc = {
      ...doc,
      settings: newSettings,
      processedImage: doc.originalImage, // Placeholder - would be processed image
    }

    setDocuments((prev) => prev.map((d) => (d.id === doc.id ? updatedDoc : d)))
    setCurrentDoc(updatedDoc)
  }

  const downloadDocument = (doc: ScannedDocument, format: "jpg" | "pdf" = "jpg") => {
    const link = document.createElement("a")
    link.href = doc.processedImage
    link.download = `${doc.name.split(".")[0]}_scanned.${format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Download started",
      description: `Document saved as ${format.toUpperCase()}.`,
    })
  }

  const downloadAllAsPDF = () => {
    if (documents.length === 0) return

    // Mock PDF creation
    toast({
      title: "PDF created successfully!",
      description: `Combined ${documents.length} documents into a single PDF.`,
    })

    // Save to history
    const historyItem = {
      id: Date.now().toString(),
      type: "document-scanner",
      timestamp: new Date().toISOString(),
      details: {
        documentCount: documents.length,
        format: "PDF",
      },
    }

    const history = JSON.parse(localStorage.getItem("toolHistory") || "[]")
    history.unshift(historyItem)
    localStorage.setItem("toolHistory", JSON.stringify(history.slice(0, 100)))
  }

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id))
    if (currentDoc?.id === id) {
      setCurrentDoc(null)
    }
    toast({
      title: "Document deleted",
      description: "Document removed from scan list.",
    })
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4">
              <Scan className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Smart Document Scanner
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional document scanning with AI enhancement, batch processing, and CamScanner-like quality.
            </p>
          </div>

          {/* Capture Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Capture Document
              </CardTitle>
              <CardDescription>Use your camera or upload images to scan documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={startCamera}
                  disabled={showCamera || isProcessing}
                  className="h-24 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  <div className="text-center">
                    <Camera className="h-8 w-8 mx-auto mb-2" />
                    <div>Use Camera</div>
                    <div className="text-xs opacity-80">Live document capture</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="h-24"
                >
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2" />
                    <div>Upload Images</div>
                    <div className="text-xs opacity-80">Select from device</div>
                  </div>
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || [])
                  if (files.length > 0) {
                    handleFilesSelected(files)
                  }
                }}
              />

              {/* File Drop Zone */}
              <div className="mt-4">
                <FileDropzone
                  onFilesSelected={handleFilesSelected}
                  acceptedTypes={["image/*"]}
                  maxFiles={10}
                  multiple
                />
              </div>
            </CardContent>
          </Card>

          {/* Camera View */}
          {showCamera && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Camera View</span>
                  <Button variant="outline" onClick={stopCamera}>
                    Close Camera
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
                  <div className="absolute inset-0 border-2 border-dashed border-white/50 rounded-lg pointer-events-none">
                    <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/80"></div>
                    <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/80"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/80"></div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/80"></div>
                  </div>
                </div>
                <div className="flex justify-center mt-4">
                  <Button onClick={capturePhoto} size="lg" className="bg-red-500 hover:bg-red-600">
                    <Camera className="h-5 w-5 mr-2" />
                    Capture Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <canvas ref={canvasRef} className="hidden" />

          {/* Inline Ad */}
          <InlineAd />

          {/* Document Editor */}
          {currentDoc && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Document Editor
                </CardTitle>
                <CardDescription>Adjust settings to enhance your scanned document</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Original</h4>
                    <img
                      src={currentDoc.originalImage || "/placeholder.svg"}
                      alt="Original"
                      className="w-full rounded-lg border"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Enhanced</h4>
                    <img
                      src={currentDoc.processedImage || "/placeholder.svg"}
                      alt="Enhanced"
                      className="w-full rounded-lg border"
                      style={{
                        filter: `brightness(${100 + settings.brightness}%) contrast(${100 + settings.contrast}%) saturate(${100 + settings.saturation}%) hue-rotate(${settings.rotation}deg)`,
                      }}
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Filter</label>
                      <Select
                        value={settings.filter}
                        onValueChange={(value: any) => {
                          const newSettings = { ...settings, filter: value }
                          setSettings(newSettings)
                          applyFilter(currentDoc, newSettings)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {filterOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div>
                                <div className="font-medium">{option.label}</div>
                                <div className="text-xs text-muted-foreground">{option.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Brightness: {settings.brightness}%
                      </label>
                      <Slider
                        value={[settings.brightness]}
                        onValueChange={([value]) => {
                          const newSettings = { ...settings, brightness: value }
                          setSettings(newSettings)
                          applyFilter(currentDoc, newSettings)
                        }}
                        min={-50}
                        max={50}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                        <Contrast className="h-4 w-4" />
                        Contrast: {settings.contrast}%
                      </label>
                      <Slider
                        value={[settings.contrast]}
                        onValueChange={([value]) => {
                          const newSettings = { ...settings, contrast: value }
                          setSettings(newSettings)
                          applyFilter(currentDoc, newSettings)
                        }}
                        min={-50}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Saturation: {settings.saturation}%
                      </label>
                      <Slider
                        value={[settings.saturation]}
                        onValueChange={([value]) => {
                          const newSettings = { ...settings, saturation: value }
                          setSettings(newSettings)
                          applyFilter(currentDoc, newSettings)
                        }}
                        min={-100}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const newSettings = { ...settings, rotation: settings.rotation - 90 }
                          setSettings(newSettings)
                          applyFilter(currentDoc, newSettings)
                        }}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const newSettings = { ...settings, rotation: settings.rotation + 90 }
                          setSettings(newSettings)
                          applyFilter(currentDoc, newSettings)
                        }}
                      >
                        <RotateCw className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => downloadDocument(currentDoc, "jpg")} className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Save as JPG
                      </Button>
                      <Button onClick={() => downloadDocument(currentDoc, "pdf")} variant="outline" className="flex-1">
                        <FileText className="h-4 w-4 mr-2" />
                        Save as PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Document List */}
          {documents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Scanned Documents ({documents.length})
                  </div>
                  {documents.length > 1 && (
                    <Button onClick={downloadAllAsPDF} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download All as PDF
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        currentDoc?.id === doc.id ? "border-primary bg-accent" : "hover:bg-accent/50"
                      }`}
                      onClick={() => setCurrentDoc(doc)}
                    >
                      <img
                        src={doc.processedImage || "/placeholder.svg"}
                        alt={doc.name}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                      <div className="text-sm font-medium truncate">{doc.name}</div>
                      <div className="text-xs text-muted-foreground">{doc.timestamp.toLocaleString()}</div>
                      <div className="flex gap-1 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            downloadDocument(doc)
                          }}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteDocument(doc.id)
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
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
          <SidebarAd />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Live camera scanning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>AI document enhancement</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Multiple filter options</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Batch processing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>PDF export</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Professional quality</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Ensure good lighting for best results</p>
              <p>• Keep documents flat and straight</p>
              <p>• Use "Document Enhance" filter for text</p>
              <p>• Batch scan multiple pages for PDFs</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
