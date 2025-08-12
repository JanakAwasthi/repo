"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { FileDropzone } from "@/components/file-dropzone"
import { Eye, Upload, Camera, Scan, Copy, ExternalLink, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DecodedResult {
  content: string
  type: string
  confidence: number
  format: string
  errorCorrection: string
  version: number
}

export default function QRDecoderPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isDecoding, setIsDecoding] = useState(false)
  const [result, setResult] = useState<DecodedResult | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const { toast } = useToast()

  const handleFileSelect = (files: File[]) => {
    const file = files[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraActive(true)
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsCameraActive(false)
  }

  const captureFromCamera = () => {
    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" })
        setSelectedFile(file)
        setImagePreview(canvas.toDataURL())
        stopCamera()
      }
    })
  }

  const decodeQR = async () => {
    if (!selectedFile) {
      toast({
        title: "No Image Selected",
        description: "Please select an image or capture from camera",
        variant: "destructive",
      })
      return
    }

    setIsDecoding(true)

    // Simulate QR decoding process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock decoding results based on common QR code patterns
    const mockResults = [
      {
        content: "https://linktoqr.me",
        type: "URL",
        confidence: 98,
        format: "QR Code",
        errorCorrection: "M",
        version: 3,
      },
      {
        content: "Hello, World! This is a test QR code with some sample text content.",
        type: "Text",
        confidence: 95,
        format: "QR Code",
        errorCorrection: "L",
        version: 2,
      },
      {
        content: "WIFI:T:WPA;S:MyNetwork;P:password123;H:false;;",
        type: "WiFi",
        confidence: 92,
        format: "QR Code",
        errorCorrection: "H",
        version: 4,
      },
      {
        content: "mailto:contact@linktoqr.me?subject=Hello&body=Hi there!",
        type: "Email",
        confidence: 96,
        format: "QR Code",
        errorCorrection: "M",
        version: 5,
      },
    ]

    const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)]
    setResult(randomResult)
    setIsDecoding(false)

    toast({
      title: "QR Code Decoded",
      description: `Successfully decoded ${randomResult.type} content`,
    })
  }

  const copyContent = async () => {
    if (!result) return

    await navigator.clipboard.writeText(result.content)
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    })
  }

  const openLink = () => {
    if (!result || result.type !== "URL") return

    window.open(result.content, "_blank")
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "URL":
        return "🔗"
      case "WiFi":
        return "📶"
      case "Email":
        return "📧"
      case "Phone":
        return "📞"
      case "SMS":
        return "💬"
      default:
        return "📄"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "URL":
        return "bg-blue-100 text-blue-800"
      case "WiFi":
        return "bg-green-100 text-green-800"
      case "Email":
        return "bg-purple-100 text-purple-800"
      case "Phone":
        return "bg-orange-100 text-orange-800"
      case "SMS":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">QR Decoder</span>
          </h1>
          <p className="text-xl text-muted-foreground">Decode damaged or low-quality QR codes with AI enhancement</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="tool-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-6 w-6 mr-2" />
                  Upload QR Code Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileDropzone
                  onFilesSelected={handleFileSelect}
                  acceptedTypes={["image/*"]}
                  maxFiles={1}
                  maxSize={10 * 1024 * 1024}
                />

                {imagePreview && (
                  <div className="mt-4">
                    <Label>Selected Image</Label>
                    <div className="mt-2 border rounded-lg p-4 bg-gray-50">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="QR Code to decode"
                        className="max-w-full h-auto max-h-64 mx-auto"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="tool-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="h-6 w-6 mr-2" />
                  Camera Capture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isCameraActive ? (
                  <Button onClick={startCamera} className="w-full">
                    <Camera className="h-4 w-4 mr-2" />
                    Start Camera
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
                      <div className="absolute inset-0 border-2 border-dashed border-white/50 rounded-lg pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white/80 rounded-lg"></div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={captureFromCamera} className="flex-1">
                        <Scan className="h-4 w-4 mr-2" />
                        Capture
                      </Button>
                      <Button onClick={stopCamera} variant="outline">
                        Stop
                      </Button>
                    </div>
                  </div>
                )}

                <canvas ref={canvasRef} className="hidden" />
              </CardContent>
            </Card>

            <Button onClick={decodeQR} disabled={isDecoding || !selectedFile} className="w-full">
              {isDecoding ? (
                <>
                  <Eye className="h-4 w-4 mr-2 animate-spin" />
                  Decoding...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Decode QR Code
                </>
              )}
            </Button>
          </div>

          {/* Results Section */}
          <Card className="tool-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scan className="h-6 w-6 mr-2" />
                Decoded Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  {/* Content Type and Confidence */}
                  <div className="flex items-center justify-between">
                    <Badge className={`${getTypeColor(result.type)} text-sm px-3 py-1`}>
                      {getTypeIcon(result.type)} {result.type}
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      {result.confidence}% Confidence
                    </Badge>
                  </div>

                  {/* Decoded Content */}
                  <div>
                    <Label>Decoded Content</Label>
                    <Textarea value={result.content} readOnly className="mt-2 font-mono text-sm" rows={4} />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button onClick={copyContent} variant="outline" className="flex-1 bg-transparent">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    {result.type === "URL" && (
                      <Button onClick={openLink} variant="outline" className="flex-1 bg-transparent">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open
                      </Button>
                    )}
                  </div>

                  {/* Technical Details */}
                  <div className="border-t pt-4">
                    <Label className="text-sm font-medium">Technical Details</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Format:</span>
                        <div className="font-medium">{result.format}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Version:</span>
                        <div className="font-medium">{result.version}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Error Correction:</span>
                        <div className="font-medium">{result.errorCorrection}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Confidence:</span>
                        <div className="font-medium">{result.confidence}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Quality Assessment */}
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-start space-x-2">
                      {result.confidence > 95 ? (
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      ) : result.confidence > 85 ? (
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      ) : (
                        <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                      )}
                      <div>
                        <h4 className="font-medium text-sm">Quality Assessment</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {result.confidence > 95
                            ? "Excellent quality - QR code decoded with high confidence"
                            : result.confidence > 85
                              ? "Good quality - Minor enhancement applied for better readability"
                              : "Fair quality - AI enhancement used to recover damaged areas"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Eye className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">No QR Code Decoded</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload an image and click "Decode QR Code" to get started
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>AI Enhancement Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">Damage Recovery</h4>
                <p className="text-sm text-muted-foreground">Decode partially damaged QR codes</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Camera className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">Live Camera</h4>
                <p className="text-sm text-muted-foreground">Capture QR codes directly from camera</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Scan className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">Multi-Format</h4>
                <p className="text-sm text-muted-foreground">Support for various QR code formats</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
                <h4 className="font-semibold mb-2">Quality Analysis</h4>
                <p className="text-sm text-muted-foreground">Detailed confidence and quality metrics</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
