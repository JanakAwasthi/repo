"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Code, Copy, ArrowUpDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Base64EncoderPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const { toast } = useToast()

  const encode = () => {
    try {
      const encoded = btoa(input)
      setOutput(encoded)
      toast({
        title: "Text Encoded",
        description: "Successfully encoded to Base64",
      })
    } catch (error) {
      toast({
        title: "Encoding Failed",
        description: "Unable to encode the text",
        variant: "destructive",
      })
    }
  }

  const decode = () => {
    try {
      const decoded = atob(input)
      setOutput(decoded)
      toast({
        title: "Text Decoded",
        description: "Successfully decoded from Base64",
      })
    } catch (error) {
      toast({
        title: "Decoding Failed",
        description: "Invalid Base64 string",
        variant: "destructive",
      })
    }
  }

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output)
    toast({
      title: "Copied",
      description: "Output copied to clipboard",
    })
  }

  const swap = () => {
    setInput(output)
    setOutput(input)
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Base64 Encoder/Decoder</span>
          </h1>
          <p className="text-xl text-muted-foreground">Encode and decode Base64 strings easily</p>
        </div>

        <Card className="tool-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="h-6 w-6 mr-2" />
              Base64 Converter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="input">Input</Label>
                <Textarea
                  id="input"
                  placeholder="Enter text to encode/decode..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="mt-2 h-32"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="output">Output</Label>
                  <Button onClick={copyOutput} size="sm" variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <Textarea
                  id="output"
                  placeholder="Result will appear here..."
                  value={output}
                  readOnly
                  className="mt-2 h-32"
                />
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button onClick={encode}>Encode to Base64</Button>
              <Button onClick={swap} variant="outline">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
              <Button onClick={decode}>Decode from Base64</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
