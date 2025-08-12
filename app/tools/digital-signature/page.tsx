"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { AdBanner } from "@/components/ad-banner"
import { PenTool, Download, RotateCcw, Type, Palette, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SignatureData {
  id: string
  dataUrl: string
  name: string
  timestamp: Date
}

export default function DigitalSignaturePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [signatures, setSignatures] = useState<SignatureData[]>([])
  const [signatureName, setSignatureName] = useState("")
  const [strokeWidth, setStrokeWidth] = useState([3])
  const [strokeColor, setStrokeColor] = useState("#000000")
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set up canvas for smooth drawing
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.imageSmoothingEnabled = true

    // Set canvas size
    canvas.width = 600
    canvas.height = 300

    // Fill with white background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    if ("touches" in e) {
      // Touch event
      const touch = e.touches[0] || e.changedTouches[0]
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      }
    } else {
      // Mouse event
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      }
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    setIsDrawing(true)
    const coords = getCoordinates(e)
    setLastPoint(coords)

    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(coords.x, coords.y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDrawing || !lastPoint) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx) return

    const coords = getCoordinates(e)

    // Create smooth curves using quadratic curves
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = strokeWidth[0]
    ctx.globalCompositeOperation = "source-over"

    // Calculate control point for smooth curve
    const controlX = (lastPoint.x + coords.x) / 2
    const controlY = (lastPoint.y + coords.y) / 2

    ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, controlX, controlY)
    ctx.stroke()

    setLastPoint(coords)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    setLastPoint(null)

    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx) return

    ctx.closePath()
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    toast({
      title: "Canvas Cleared",
      description: "Ready for a new signature",
    })
  }

  const saveSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (!signatureName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your signature",
        variant: "destructive",
      })
      return
    }

    const dataUrl = canvas.toDataURL("image/png")
    const newSignature: SignatureData = {
      id: Date.now().toString(),
      dataUrl,
      name: signatureName,
      timestamp: new Date(),
    }

    setSignatures((prev) => [newSignature, ...prev])
    setSignatureName("")

    toast({
      title: "Signature Saved! ✍️",
      description: `"${newSignature.name}" has been saved to your collection`,
    })
  }

  const downloadSignature = (signature?: SignatureData) => {
    const canvas = canvasRef.current
    if (!canvas && !signature) return

    const dataUrl = signature ? signature.dataUrl : canvas?.toDataURL("image/png")
    const name = signature ? signature.name : signatureName || "signature"

    if (!dataUrl) return

    const link = document.createElement("a")
    link.href = dataUrl
    link.download = `${name}-signature.png`
    link.click()

    toast({
      title: "Download Started",
      description: "Your signature is being downloaded",
    })
  }

  const loadSignature = (signature: SignatureData) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx || !canvas) return

    const img = new Image()
    img.onload = () => {
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
    }
    img.src = signature.dataUrl

    setSignatureName(signature.name)

    toast({
      title: "Signature Loaded",
      description: `"${signature.name}" loaded to canvas`,
    })
  }

  const deleteSignature = (id: string) => {
    setSignatures((prev) => prev.filter((sig) => sig.id !== id))
    toast({
      title: "Signature Deleted",
      description: "Signature removed from collection",
    })
  }

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full">
              <PenTool className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Digital Signature Creator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create professional digital signatures with smooth, natural pen strokes
          </p>
        </div>

        <AdBanner slot="9131891151" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Canvas */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-indigo-200 dark:border-indigo-800">
              <CardHeader>
                <CardTitle className="flex items-center text-indigo-700 dark:text-indigo-300">
                  <PenTool className="h-6 w-6 mr-2" />
                  Signature Canvas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800">
                    <canvas
                      ref={canvasRef}
                      className="w-full h-auto border rounded cursor-crosshair touch-none"
                      style={{ maxWidth: "100%", height: "300px" }}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                    />
                    <p className="text-center text-sm text-muted-foreground mt-2">
                      Sign above with your mouse or touch screen
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="signature-name">Signature Name</Label>
                      <Input
                        id="signature-name"
                        placeholder="Enter signature name"
                        value={signatureName}
                        onChange={(e) => setSignatureName(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div className="flex items-end space-x-2">
                      <Button onClick={clearCanvas} variant="outline" className="flex-1 bg-transparent">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Clear
                      </Button>
                      <Button onClick={saveSignature} className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={() => downloadSignature()} variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Saved Signatures */}
            {signatures.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Type className="h-5 w-5 mr-2 text-purple-600" />
                    Saved Signatures ({signatures.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {signatures.map((signature) => (
                      <div key={signature.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                        <div className="bg-white dark:bg-gray-800 border rounded p-2 mb-3">
                          <img
                            src={signature.dataUrl || "/placeholder.svg"}
                            alt={signature.name}
                            className="w-full h-20 object-contain"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{signature.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {signature.timestamp.toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => loadSignature(signature)}
                              className="flex-1"
                            >
                              Load
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => downloadSignature(signature)}>
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteSignature(signature.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar Controls */}
          <div className="space-y-6">
            <AdBanner slot="9131891151" format="rectangle" />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2 text-indigo-600" />
                  Drawing Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Pen Width: {strokeWidth[0]}px</Label>
                  <Slider
                    value={strokeWidth}
                    onValueChange={setStrokeWidth}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Fine</span>
                    <span>Thick</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Pen Color</Label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={strokeColor}
                      onChange={(e) => setStrokeColor(e.target.value)}
                      className="w-12 h-12 rounded border cursor-pointer"
                    />
                    <div className="flex-1">
                      <Input
                        value={strokeColor}
                        onChange={(e) => setStrokeColor(e.target.value)}
                        placeholder="#000000"
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {["#000000", "#1e40af", "#dc2626", "#059669"].map((color) => (
                    <button
                      key={color}
                      onClick={() => setStrokeColor(color)}
                      className={`w-full h-8 rounded border-2 ${
                        strokeColor === color ? "border-primary" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
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
                    Smooth pen strokes
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                    Touch screen support
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
                    Multiple signatures
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                    High-quality PNG export
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3" />
                    Customizable pen settings
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3" />
                    Professional quality
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Sign slowly for smoother lines</p>
                <p>• Use a stylus for better precision</p>
                <p>• Practice your signature first</p>
                <p>• Save multiple versions</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <AdBanner slot="9131891151" />
      </div>
    </div>
  )
}
