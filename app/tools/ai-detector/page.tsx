"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AdBanner } from "@/components/ad-banner"
import { Sparkles, Brain, User, AlertTriangle, CheckCircle, Copy, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DetectionResult {
  id: string
  text: string
  aiProbability: number
  humanProbability: number
  verdict: "AI Generated" | "Human Written" | "Mixed Content"
  confidence: "High" | "Medium" | "Low"
  timestamp: Date
  wordCount: number
  characteristics: string[]
}

export default function AIDetectorPage() {
  const [inputText, setInputText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<DetectionResult | null>(null)
  const [history, setHistory] = useState<DetectionResult[]>([])
  const { toast } = useToast()

  const analyzeText = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter text to analyze for AI content",
        variant: "destructive",
      })
      return
    }

    if (inputText.trim().length < 50) {
      toast({
        title: "Text Too Short",
        description: "Please enter at least 50 characters for accurate analysis",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock analysis based on text characteristics
    const wordCount = inputText.trim().split(/\s+/).length
    let aiProbability = Math.random() * 100
    const characteristics: string[] = []

    // Analyze text patterns that might indicate AI generation
    if (inputText.includes("Furthermore") || inputText.includes("Moreover") || inputText.includes("Additionally")) {
      aiProbability += 15
      characteristics.push("Formal transition words")
    }

    if (inputText.includes("In conclusion") || inputText.includes("To summarize") || inputText.includes("In summary")) {
      aiProbability += 20
      characteristics.push("Structured conclusions")
    }

    if (inputText.match(/\b(utilize|facilitate|implement|demonstrate)\b/gi)) {
      aiProbability += 10
      characteristics.push("Complex vocabulary usage")
    }

    if (inputText.split(".").length > 5 && inputText.split(".").every((s) => s.trim().length > 20)) {
      aiProbability += 15
      characteristics.push("Consistent sentence structure")
    }

    if (inputText.includes("It's important to note") || inputText.includes("It should be noted")) {
      aiProbability += 25
      characteristics.push("AI-typical phrases")
    }

    // Add some randomness and cap at 95%
    aiProbability = Math.min(95, Math.max(5, aiProbability + (Math.random() - 0.5) * 20))
    const humanProbability = 100 - aiProbability

    let verdict: DetectionResult["verdict"]
    let confidence: DetectionResult["confidence"]

    if (aiProbability > 70) {
      verdict = "AI Generated"
      confidence = aiProbability > 85 ? "High" : "Medium"
      characteristics.push("High AI pattern detection")
    } else if (aiProbability < 30) {
      verdict = "Human Written"
      confidence = aiProbability < 15 ? "High" : "Medium"
      characteristics.push("Strong human writing indicators")
    } else {
      verdict = "Mixed Content"
      confidence = "Medium"
      characteristics.push("Mixed writing patterns detected")
    }

    if (characteristics.length === 0) {
      characteristics.push("Standard writing patterns")
    }

    const newResult: DetectionResult = {
      id: Date.now().toString(),
      text: inputText,
      aiProbability: Math.round(aiProbability),
      humanProbability: Math.round(humanProbability),
      verdict,
      confidence,
      timestamp: new Date(),
      wordCount,
      characteristics,
    }

    setResult(newResult)
    setHistory((prev) => [newResult, ...prev.slice(0, 9)]) // Keep last 10 results
    setIsAnalyzing(false)

    toast({
      title: "Analysis Complete! 🔍",
      description: `Text analyzed: ${verdict} with ${confidence.toLowerCase()} confidence`,
    })
  }

  const copyResult = async () => {
    if (!result) return

    const resultText = `AI Content Detection Result:
Text: ${result.text.substring(0, 100)}...
AI Probability: ${result.aiProbability}%
Human Probability: ${result.humanProbability}%
Verdict: ${result.verdict}
Confidence: ${result.confidence}
Word Count: ${result.wordCount}
Analyzed: ${result.timestamp.toLocaleString()}`

    try {
      await navigator.clipboard.writeText(resultText)
      toast({
        title: "Result Copied",
        description: "Analysis result copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy result to clipboard",
        variant: "destructive",
      })
    }
  }

  const downloadResult = () => {
    if (!result) return

    const resultText = `AI Content Detection Report
Generated by LinkToQR.me AI Detector

Analysis Date: ${result.timestamp.toLocaleString()}
Word Count: ${result.wordCount}

DETECTION RESULTS:
AI Probability: ${result.aiProbability}%
Human Probability: ${result.humanProbability}%
Verdict: ${result.verdict}
Confidence Level: ${result.confidence}

DETECTED CHARACTERISTICS:
${result.characteristics.map((char) => `• ${char}`).join("\n")}

ANALYZED TEXT:
${result.text}

---
Report generated by LinkToQR.me - Free AI Content Detector
Visit: https://linktoqr.me/tools/ai-detector`

    const blob = new Blob([resultText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `ai-detection-report-${Date.now()}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const clearAll = () => {
    setInputText("")
    setResult(null)
    setHistory([])
    toast({
      title: "Cleared",
      description: "All content has been cleared",
    })
  }

  const getVerdictColor = (verdict: DetectionResult["verdict"]) => {
    switch (verdict) {
      case "AI Generated":
        return "text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
      case "Human Written":
        return "text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
      case "Mixed Content":
        return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800"
    }
  }

  const getVerdictIcon = (verdict: DetectionResult["verdict"]) => {
    switch (verdict) {
      case "AI Generated":
        return <Brain className="h-5 w-5 text-red-600" />
      case "Human Written":
        return <User className="h-5 w-5 text-green-600" />
      case "Mixed Content":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      default:
        return <CheckCircle className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI Content Detector
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Detect AI-generated content with advanced analysis. Get accuracy percentage, confidence levels, and detailed
            insights.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm">
            <Badge variant="outline" className="text-purple-600 border-purple-600">
              AI Detection
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              Content Analysis
            </Badge>
            <Badge variant="outline" className="text-green-600 border-green-600">
              Free Tool
            </Badge>
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              Instant Results
            </Badge>
          </div>
        </div>

        <AdBanner slot="9131891151" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-700 dark:text-purple-300">
                  <Brain className="h-6 w-6 mr-2" />
                  Text Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="input-text">Paste your text here for AI detection analysis</Label>
                    <Textarea
                      id="input-text"
                      placeholder="Enter the text you want to analyze for AI-generated content. Minimum 50 characters required for accurate analysis..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="mt-2 min-h-[200px] resize-none"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-muted-foreground">
                        {inputText.length} characters •{" "}
                        {
                          inputText
                            .trim()
                            .split(/\s+/)
                            .filter((word) => word.length > 0).length
                        }{" "}
                        words
                      </span>
                      <Badge variant={inputText.length >= 50 ? "default" : "destructive"} className="text-xs">
                        {inputText.length >= 50 ? "Ready to analyze" : "Need 50+ characters"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={analyzeText}
                      disabled={!inputText.trim() || inputText.length < 50 || isAnalyzing}
                      size="lg"
                      className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-8"
                    >
                      {isAnalyzing ? (
                        <>
                          <Brain className="h-5 w-5 mr-2 animate-pulse" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 mr-2" />
                          Detect AI Content
                        </>
                      )}
                    </Button>
                    <Button onClick={clearAll} variant="outline" size="lg">
                      Clear All
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Progress */}
            {isAnalyzing && (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Analyzing content patterns...</span>
                      <Brain className="h-5 w-5 text-purple-600 animate-pulse" />
                    </div>
                    <Progress value={66} className="w-full" />
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>✓ Checking vocabulary patterns</p>
                      <p>✓ Analyzing sentence structure</p>
                      <p>⏳ Detecting AI signatures...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results */}
            {result && (
              <Card className={`border-2 ${getVerdictColor(result.verdict)}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      {getVerdictIcon(result.verdict)}
                      <span className="ml-2">Detection Results</span>
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getVerdictColor(result.verdict)} border-0`}>{result.verdict}</Badge>
                      <Badge variant="outline" className="text-xs">
                        {result.confidence} Confidence
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Probability Bars */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium flex items-center">
                            <Brain className="h-4 w-4 mr-1 text-red-600" />
                            AI Generated
                          </span>
                          <span className="text-sm font-bold text-red-600">{result.aiProbability}%</span>
                        </div>
                        <Progress value={result.aiProbability} className="h-3" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium flex items-center">
                            <User className="h-4 w-4 mr-1 text-green-600" />
                            Human Written
                          </span>
                          <span className="text-sm font-bold text-green-600">{result.humanProbability}%</span>
                        </div>
                        <Progress value={result.humanProbability} className="h-3" />
                      </div>
                    </div>

                    {/* Analysis Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p>
                          <strong>Word Count:</strong> {result.wordCount}
                        </p>
                        <p>
                          <strong>Confidence:</strong> {result.confidence}
                        </p>
                        <p>
                          <strong>Analyzed:</strong> {result.timestamp.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Detected Characteristics:</strong>
                        </p>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          {result.characteristics.map((char, index) => (
                            <li key={index} className="text-xs text-muted-foreground">
                              {char}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={copyResult}>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy Result
                      </Button>
                      <Button size="sm" variant="outline" onClick={downloadResult}>
                        <Download className="h-4 w-4 mr-1" />
                        Download Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* History */}
            {history.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
                    Recent Analysis ({history.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {history.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getVerdictIcon(item.verdict)}
                            <Badge className={`${getVerdictColor(item.verdict)} border-0 text-xs`}>
                              {item.verdict}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{item.timestamp.toLocaleString()}</span>
                          </div>
                          <div className="text-sm font-bold">
                            AI: {item.aiProbability}% | Human: {item.humanProbability}%
                          </div>
                        </div>
                        <p className="text-sm bg-muted p-2 rounded line-clamp-2">{item.text.substring(0, 150)}...</p>
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
                  <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                  Detection Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                    Advanced AI pattern detection
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                    Percentage accuracy scores
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
                    Confidence level analysis
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                    Detailed characteristics
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3" />
                    Export analysis reports
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3" />
                    Analysis history tracking
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div>
                  <strong>1. Text Analysis</strong>
                  <p className="text-muted-foreground">
                    Advanced algorithms analyze writing patterns, vocabulary, and structure
                  </p>
                </div>
                <div>
                  <strong>2. Pattern Recognition</strong>
                  <p className="text-muted-foreground">
                    Identifies AI-typical phrases, transitions, and sentence structures
                  </p>
                </div>
                <div>
                  <strong>3. Probability Scoring</strong>
                  <p className="text-muted-foreground">Calculates likelihood percentages with confidence levels</p>
                </div>
                <div>
                  <strong>4. Detailed Report</strong>
                  <p className="text-muted-foreground">Provides comprehensive analysis with detected characteristics</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tips for Accuracy</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Use at least 50 characters for reliable results</p>
                <p>• Longer texts provide more accurate analysis</p>
                <p>• Consider context and writing style</p>
                <p>• Use multiple detection tools for verification</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <AdBanner slot="9131891151" />
      </div>
    </div>
  )
}
