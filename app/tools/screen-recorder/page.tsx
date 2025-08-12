"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Monitor, Square, Download, Mic, MicOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ScreenRecorderPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [includeAudio, setIncludeAudio] = useState(true)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const { toast } = useToast()

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: includeAudio,
      })

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks: BlobPart[] = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" })
        setRecordedBlob(blob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)

      toast({
        title: "Recording Started",
        description: "Screen recording is now active",
      })
    } catch (error) {
      toast({
        title: "Recording Failed",
        description: "Unable to start screen recording",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      toast({
        title: "Recording Stopped",
        description: "Your screen recording is ready for download",
      })
    }
  }

  const downloadRecording = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = `screen-recording-${Date.now()}.webm`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Screen Recorder</span>
          </h1>
          <p className="text-xl text-muted-foreground">Record your screen with high quality video and audio</p>
        </div>

        <Card className="tool-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Monitor className="h-6 w-6 mr-2" />
              Screen Recording
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center space-x-4">
              <Button
                onClick={includeAudio ? () => setIncludeAudio(false) : () => setIncludeAudio(true)}
                variant="outline"
                size="sm"
              >
                {includeAudio ? (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    Audio On
                  </>
                ) : (
                  <>
                    <MicOff className="h-4 w-4 mr-2" />
                    Audio Off
                  </>
                )}
              </Button>
              <Badge variant={includeAudio ? "default" : "secondary"}>
                {includeAudio ? "With Audio" : "Video Only"}
              </Badge>
            </div>

            <div className="text-center space-y-4">
              {!isRecording ? (
                <Button onClick={startRecording} size="lg" className="w-full">
                  <Monitor className="h-5 w-5 mr-2" />
                  Start Recording
                </Button>
              ) : (
                <Button onClick={stopRecording} size="lg" variant="destructive" className="w-full">
                  <Square className="h-5 w-5 mr-2" />
                  Stop Recording
                </Button>
              )}

              {isRecording && (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">Recording in progress...</span>
                </div>
              )}
            </div>

            {recordedBlob && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Recording Complete</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Size: {(recordedBlob.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <Button onClick={downloadRecording} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Recording
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
