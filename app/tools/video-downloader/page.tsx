"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Download, Play, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function VideoDownloaderPage() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [videoInfo, setVideoInfo] = useState<any>(null)
  const { toast } = useToast()

  const handleDownload = async () => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a valid video URL",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate video processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setVideoInfo({
      title: "Sample Video Title",
      duration: "5:32",
      quality: "1080p",
      size: "45.2 MB",
    })

    setIsLoading(false)

    toast({
      title: "Video Ready",
      description: "Video has been processed and is ready for download",
    })
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Video Downloader</span>
          </h1>
          <p className="text-xl text-muted-foreground">Download videos from YouTube, Vimeo, and other platforms</p>
        </div>

        <Card className="tool-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Play className="h-6 w-6 mr-2" />
              Video URL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="video-url">Video URL</Label>
              <Input
                id="video-url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="mt-2"
              />
            </div>

            <Button onClick={handleDownload} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download Video
                </>
              )}
            </Button>

            {videoInfo && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">{videoInfo.title}</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Duration: {videoInfo.duration}</Badge>
                  <Badge variant="secondary">Quality: {videoInfo.quality}</Badge>
                  <Badge variant="secondary">Size: {videoInfo.size}</Badge>
                </div>
                <Button className="w-full mt-4">
                  <Download className="h-4 w-4 mr-2" />
                  Download Now
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
