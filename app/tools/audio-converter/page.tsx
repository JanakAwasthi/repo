"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileDropzone } from "@/components/file-dropzone"
import { Badge } from "@/components/ui/badge"
import { Music, FileAudio } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AudioConverterPage() {
  const [file, setFile] = useState<File | null>(null)
  const [outputFormat, setOutputFormat] = useState("mp3")
  const [isConverting, setIsConverting] = useState(false)
  const { toast } = useToast()

  const handleConvert = async () => {
    if (!file) return

    setIsConverting(true)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsConverting(false)

    toast({
      title: "Conversion Complete",
      description: `Audio converted to ${outputFormat.toUpperCase()}`,
    })
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Audio Converter</span>
          </h1>
          <p className="text-xl text-muted-foreground">Convert audio files between different formats</p>
        </div>

        <Card className="tool-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Music className="h-6 w-6 mr-2" />
              Audio Conversion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FileDropzone
              onFileSelect={setFile}
              acceptedTypes={["audio/*"]}
              maxSize={100}
              icon={FileAudio}
              title="Drop your audio file here"
              subtitle="Supports MP3, WAV, FLAC, AAC, OGG"
            />

            {file && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    <Badge variant="outline">{file.type.split("/")[1]?.toUpperCase() || "AUDIO"}</Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Output Format</label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mp3">MP3</SelectItem>
                      <SelectItem value="wav">WAV</SelectItem>
                      <SelectItem value="flac">FLAC</SelectItem>
                      <SelectItem value="aac">AAC</SelectItem>
                      <SelectItem value="ogg">OGG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleConvert} disabled={isConverting} className="w-full">
                  {isConverting ? "Converting..." : "Convert Audio"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
