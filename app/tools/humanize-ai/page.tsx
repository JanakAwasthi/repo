"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AdBanner } from "@/components/ad-banner"
import { User, Bot, Wand2, Copy, Download, RefreshCw, Zap, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type HumanizeStyle = "natural" | "professional" | "casual" | "academic" | "creative"

interface HumanizedResult {
  id: string
  originalText: string
  humanizedText: string
  style: HumanizeStyle
  timestamp: Date
  improvements: string[]
}

export default function HumanizeAIPage() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [style, setStyle] = useState<HumanizeStyle>("natural")
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<HumanizedResult[]>([])
  const { toast } = useToast()

  const humanizeText = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter text to humanize",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Apply humanization based on style
    let humanized = inputText
    const improvements: string[] = []

    // Natural style transformations
    if (style === "natural") {
      humanized = humanized
        .replace(/\b(utilize|utilizes|utilizing)\b/gi, "use")
        .replace(/\b(commence|commences|commencing)\b/gi, "start")
        .replace(/\b(terminate|terminates|terminating)\b/gi, "end")
        .replace(/\b(facilitate|facilitates|facilitating)\b/gi, "help")
        .replace(/\b(demonstrate|demonstrates|demonstrating)\b/gi, "show")
        .replace(/\b(implement|implements|implementing)\b/gi, "put in place")
        .replace(/\b(subsequently)\b/gi, "then")
        .replace(/\b(therefore)\b/gi, "so")
        .replace(/\b(however)\b/gi, "but")
        .replace(/\b(furthermore)\b/gi, "also")
      improvements.push("Simplified complex vocabulary", "Added natural flow", "Improved readability")
    }

    // Professional style
    if (style === "professional") {
      humanized = humanized
        .replace(/\b(really good)\b/gi, "excellent")
        .replace(/\b(pretty much)\b/gi, "essentially")
        .replace(/\b(a lot of)\b/gi, "numerous")
        .replace(/\b(kind of)\b/gi, "somewhat")
      improvements.push("Enhanced professional tone", "Refined language", "Improved clarity")
    }

    // Casual style
    if (style === "casual") {
      humanized = humanized
        .replace(/\b(therefore)\b/gi, "so")
        .replace(/\b(however)\b/gi, "but")
        .replace(/\b(furthermore)\b/gi, "plus")
        .replace(/\b(in addition)\b/gi, "also")
      improvements.push("Made more conversational", "Added casual tone", "Improved accessibility")
    }

    // Academic style
    if (style === "academic") {
      humanized = humanized
        .replace(/\b(show)\b/gi, "demonstrate")
        .replace(/\b(use)\b/gi, "utilize")
        .replace(/\b(help)\b/gi, "facilitate")
      improvements.push("Enhanced academic vocabulary", "Improved scholarly tone", "Added precision")
    }

    // Creative style
    if (style === "creative") {
      humanized = humanized
        .replace(/\b(said)\b/gi, "expressed")
        .replace(/\b(looked)\b/gi, "gazed")
        .replace(/\b(walked)\b/gi, "strolled")
      improvements.push("Added creative flair", "Enhanced descriptive language", "Improved engagement")
    }

    // Add some randomness and human-like variations
    const sentences = humanized.split(". ")
    const humanizedSentences = sentences.map((sentence) => {
      // Add occasional contractions
      sentence = sentence
        .replace(/\b(do not)\b/gi, "don't")
        .replace(/\b(will not)\b/gi, "won't")
        .replace(/\b(cannot)\b/gi, "can't")
        .replace(/\b(it is)\b/gi, "it's")
        .replace(/\b(that is)\b/gi, "that's")
        .replace(/\b(we are)\b/gi, "we're")
        .replace(/\b(they are)\b/gi, "they're")

      return sentence
    })

    humanized = humanizedSentences.join(". ")

    // Add natural variations and remove AI-like patterns
    humanized = humanized
      .replace(/\b(In conclusion,)\b/gi, "To wrap up,")
      .replace(/\b(In summary,)\b/gi, "Overall,")
      .replace(/\b(It is important to note that)\b/gi, "Worth mentioning:")
      .replace(/\b(Additionally,)\b/gi, "Also,")
      .replace(/\b(Moreover,)\b/gi, "What's more,")

    setOutputText(humanized)

    const result: HumanizedResult = {
      id: Date.now().toString(),
      originalText: inputText,
      humanizedText: humanized,
      style,
      timestamp: new Date(),
      improvements,
    }

    setResults((prev) => [result, ...prev.slice(0, 9)]) // Keep last 10 results
    setIsProcessing(false)

    toast({
      title: "Text Humanized! ✨",
      description: `Applied ${style} style with ${improvements.length} improvements`,
    })
  }

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied to Clipboard",
        description: "Text has been copied successfully",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy text to clipboard",
        variant: "destructive",
      })
    }
  }

  const downloadText = (text: string, filename: string) => {
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  const clearAll = () => {
    setInputText("")
    setOutputText("")
    setResults([])
    toast({
      title: "Cleared",
      description: "All content has been cleared",
    })
  }

  const getStyleDescription = (style: HumanizeStyle) => {
    const descriptions = {
      natural: "Makes text sound more conversational and human-like",
      professional: "Enhances formal business and professional tone",
      casual: "Creates a relaxed, friendly conversational style",
      academic: "Improves scholarly and research-oriented language",
      creative: "Perfect for storytelling, marketing, and engaging content",
    }
    return descriptions[style]
  }

  const getStyleIcon = (style: HumanizeStyle) => {
    const icons = {
      natural: "🌿",
      professional: "💼",
      casual: "😊",
      academic: "🎓",
      creative: "🎨",
    }
    return icons[style]
  }

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full">
              <User className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Humanize AI Text
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform AI-generated content into natural, human-like text with advanced style customization
          </p>
        </div>

        <AdBanner slot="9131891151" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
                  <Bot className="h-6 w-6 mr-2" />
                  AI Text Input
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="input-text">Paste your AI-generated text here</Label>
                    <Textarea
                      id="input-text"
                      placeholder="Enter the AI-generated text you want to humanize..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="mt-2 min-h-[200px] resize-none"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-muted-foreground">{inputText.length} characters</span>
                      <Badge variant="outline" className="text-xs">
                        {inputText.split(" ").filter((word) => word.length > 0).length} words
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Humanization Style</Label>
                      <Select value={style} onValueChange={(value: HumanizeStyle) => setStyle(value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="natural">
                            <div className="flex items-center">
                              <span className="mr-2">🌿</span>
                              Natural & Conversational
                            </div>
                          </SelectItem>
                          <SelectItem value="professional">
                            <div className="flex items-center">
                              <span className="mr-2">💼</span>
                              Professional & Formal
                            </div>
                          </SelectItem>
                          <SelectItem value="casual">
                            <div className="flex items-center">
                              <span className="mr-2">😊</span>
                              Casual & Friendly
                            </div>
                          </SelectItem>
                          <SelectItem value="academic">
                            <div className="flex items-center">
                              <span className="mr-2">🎓</span>
                              Academic & Scholarly
                            </div>
                          </SelectItem>
                          <SelectItem value="creative">
                            <div className="flex items-center">
                              <span className="mr-2">🎨</span>
                              Creative & Engaging
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">{getStyleDescription(style)}</p>
                    </div>

                    <div className="flex items-end">
                      <Button
                        onClick={humanizeText}
                        disabled={!inputText.trim() || isProcessing}
                        size="lg"
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                      >
                        {isProcessing ? (
                          <>
                            <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                            Humanizing...
                          </>
                        ) : (
                          <>
                            <Wand2 className="h-5 w-5 mr-2" />
                            Humanize Text
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Output */}
            {outputText && (
              <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-green-700 dark:text-green-300">
                      <User className="h-6 w-6 mr-2" />
                      Humanized Text
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-600 text-white">
                        {getStyleIcon(style)} {style.charAt(0).toUpperCase() + style.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      value={outputText}
                      readOnly
                      className="min-h-[200px] bg-white dark:bg-gray-800 border-green-200 dark:border-green-700"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {outputText.length} characters •{" "}
                        {outputText.split(" ").filter((word) => word.length > 0).length} words
                      </span>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => copyText(outputText)}>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadText(outputText, `humanized-text-${Date.now()}.txt`)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* History */}
            {results.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-purple-600" />
                      Recent Humanizations ({results.length})
                    </CardTitle>
                    <Button size="sm" variant="outline" onClick={clearAll}>
                      Clear All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {results.map((result) => (
                      <div key={result.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {getStyleIcon(result.style)} {result.style}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{result.timestamp.toLocaleString()}</span>
                          </div>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="ghost" onClick={() => copyText(result.humanizedText)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => downloadText(result.humanizedText, `humanized-${result.id}.txt`)}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="text-sm space-y-2">
                          <div>
                            <p className="font-medium text-muted-foreground">Improvements:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {result.improvements.map((improvement, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {improvement}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="font-medium text-muted-foreground">Preview:</p>
                            <p className="text-sm bg-muted p-2 rounded mt-1 line-clamp-2">
                              {result.humanizedText.substring(0, 150)}...
                            </p>
                          </div>
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
            <AdBanner slot="9131891151" format="rectangle" />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                  Humanization Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                    Remove AI-like patterns
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                    Add natural contractions
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
                    Improve sentence flow
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                    Style customization
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3" />
                    Vocabulary enhancement
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3" />
                    Tone adjustment
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Style Guide</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div>
                  <div className="flex items-center mb-1">
                    <span className="mr-2">🌿</span>
                    <strong>Natural</strong>
                  </div>
                  <p className="text-muted-foreground">Best for blogs, social media, and everyday communication</p>
                </div>

                <div>
                  <div className="flex items-center mb-1">
                    <span className="mr-2">💼</span>
                    <strong>Professional</strong>
                  </div>
                  <p className="text-muted-foreground">Perfect for business emails, reports, and formal documents</p>
                </div>

                <div>
                  <div className="flex items-center mb-1">
                    <span className="mr-2">😊</span>
                    <strong>Casual</strong>
                  </div>
                  <p className="text-muted-foreground">Great for friendly conversations and informal content</p>
                </div>

                <div>
                  <div className="flex items-center mb-1">
                    <span className="mr-2">🎓</span>
                    <strong>Academic</strong>
                  </div>
                  <p className="text-muted-foreground">Ideal for research papers, essays, and scholarly work</p>
                </div>

                <div>
                  <div className="flex items-center mb-1">
                    <span className="mr-2">🎨</span>
                    <strong>Creative</strong>
                  </div>
                  <p className="text-muted-foreground">Perfect for storytelling, marketing, and engaging content</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tips for Best Results</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Choose the right style for your audience</p>
                <p>• Review and edit the output as needed</p>
                <p>• Combine with other editing tools</p>
                <p>• Save frequently used styles</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <AdBanner slot="9131891151" />
      </div>
    </div>
  )
}
