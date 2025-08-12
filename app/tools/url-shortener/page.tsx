"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, Copy, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function URLShortenerPage() {
  const [originalUrl, setOriginalUrl] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const [customAlias, setCustomAlias] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const shortenUrl = async () => {
    if (!originalUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a valid URL",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const alias = customAlias || Math.random().toString(36).substring(7)
    setShortUrl(`https://linktoqr.me/${alias}`)
    setIsLoading(false)

    toast({
      title: "URL Shortened",
      description: "Your short URL is ready!",
    })
  }

  const copyUrl = async () => {
    await navigator.clipboard.writeText(shortUrl)
    toast({
      title: "URL Copied",
      description: "Short URL copied to clipboard",
    })
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">URL Shortener</span>
          </h1>
          <p className="text-xl text-muted-foreground">Create short, memorable links with analytics</p>
        </div>

        <Card className="tool-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Link className="h-6 w-6 mr-2" />
              Shorten URL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="original-url">Original URL</Label>
              <Input
                id="original-url"
                placeholder="https://example.com/very-long-url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="custom-alias">Custom Alias (Optional)</Label>
              <Input
                id="custom-alias"
                placeholder="my-custom-link"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                className="mt-2"
              />
            </div>

            <Button onClick={shortenUrl} disabled={isLoading} className="w-full">
              {isLoading ? "Shortening..." : "Shorten URL"}
            </Button>

            {shortUrl && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <Label className="text-sm font-medium">Short URL</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Input value={shortUrl} readOnly />
                    <Button onClick={copyUrl} size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-sm text-muted-foreground">Clicks</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-sm text-muted-foreground">Today</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">New</div>
                    <div className="text-sm text-muted-foreground">Status</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
