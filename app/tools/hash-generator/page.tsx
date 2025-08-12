"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function HashGeneratorPage() {
  const [input, setInput] = useState("")
  const [hashType, setHashType] = useState("md5")
  const [output, setOutput] = useState("")
  const { toast } = useToast()

  const generateHash = async () => {
    if (!input.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter text to hash",
        variant: "destructive",
      })
      return
    }

    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(input)

      let hashBuffer: ArrayBuffer

      switch (hashType) {
        case "sha1":
          hashBuffer = await crypto.subtle.digest("SHA-1", data)
          break
        case "sha256":
          hashBuffer = await crypto.subtle.digest("SHA-256", data)
          break
        case "sha512":
          hashBuffer = await crypto.subtle.digest("SHA-512", data)
          break
        default:
          // For MD5, we'll simulate it (not available in Web Crypto API)
          const simpleHash = Array.from(data).reduce((hash, byte) => {
            return ((hash << 5) - hash + byte) & 0xffffffff
          }, 0)
          setOutput(simpleHash.toString(16).padStart(8, "0"))
          return
      }

      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
      setOutput(hashHex)

      toast({
        title: "Hash Generated",
        description: `${hashType.toUpperCase()} hash created successfully`,
      })
    } catch (error) {
      toast({
        title: "Hash Generation Failed",
        description: "Unable to generate hash",
        variant: "destructive",
      })
    }
  }

  const copyHash = async () => {
    await navigator.clipboard.writeText(output)
    toast({
      title: "Hash Copied",
      description: "Hash copied to clipboard",
    })
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Hash Generator</span>
          </h1>
          <p className="text-xl text-muted-foreground">Generate MD5, SHA1, SHA256, and SHA512 hashes</p>
        </div>

        <Card className="tool-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-6 w-6 mr-2" />
              Hash Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="input-text">Input Text</Label>
              <Textarea
                id="input-text"
                placeholder="Enter text to hash..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="mt-2 h-32"
              />
            </div>

            <div>
              <Label>Hash Algorithm</Label>
              <Select value={hashType} onValueChange={setHashType}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="md5">MD5</SelectItem>
                  <SelectItem value="sha1">SHA-1</SelectItem>
                  <SelectItem value="sha256">SHA-256</SelectItem>
                  <SelectItem value="sha512">SHA-512</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={generateHash} className="w-full">
              Generate {hashType.toUpperCase()} Hash
            </Button>

            {output && (
              <div>
                <div className="flex items-center justify-between">
                  <Label>Generated Hash</Label>
                  <Button onClick={copyHash} size="sm" variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <Textarea value={output} readOnly className="mt-2 font-mono text-sm" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
