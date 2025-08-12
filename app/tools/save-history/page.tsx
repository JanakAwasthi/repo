"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { History, Search, Download, Trash2, Copy, Key, Globe, QrCode, FileText, RefreshCw, Archive } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface HistoryItem {
  id: string
  type: "password" | "url" | "qr" | "text" | "hash" | "base64"
  content: string
  metadata?: any
  timestamp: Date
  title?: string
}

export default function SaveHistoryPage() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    setIsLoading(true)

    // Load from localStorage
    const savedHistory = localStorage.getItem("toolHistory")
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory)
      const items = parsed.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp),
      }))
      setHistoryItems(items.sort((a: HistoryItem, b: HistoryItem) => b.timestamp.getTime() - a.timestamp.getTime()))
    }

    setIsLoading(false)
  }

  const filteredItems = historyItems.filter((item) => {
    const matchesSearch =
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || item.type === selectedType
    return matchesSearch && matchesType
  })

  const deleteItem = (id: string) => {
    const updatedItems = historyItems.filter((item) => item.id !== id)
    setHistoryItems(updatedItems)
    localStorage.setItem("toolHistory", JSON.stringify(updatedItems))

    toast({
      title: "Item Deleted",
      description: "History item has been removed",
    })
  }

  const clearAllHistory = () => {
    setHistoryItems([])
    localStorage.removeItem("toolHistory")

    toast({
      title: "History Cleared",
      description: "All history items have been removed",
    })
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    })
  }

  const exportHistory = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalItems: historyItems.length,
      items: historyItems,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `tool-history-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "History Exported",
      description: "History data saved to your device",
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "password":
        return Key
      case "url":
        return Globe
      case "qr":
        return QrCode
      case "text":
        return FileText
      case "hash":
        return Archive
      case "base64":
        return Archive
      default:
        return History
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "password":
        return "bg-red-100 text-red-800"
      case "url":
        return "bg-blue-100 text-blue-800"
      case "qr":
        return "bg-purple-100 text-purple-800"
      case "text":
        return "bg-green-100 text-green-800"
      case "hash":
        return "bg-orange-100 text-orange-800"
      case "base64":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const typeStats = historyItems.reduce(
    (acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-muted-foreground">Loading history...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 mb-4">
            <History className="h-5 w-5 mr-2" />
            <span className="font-medium">Tool History</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">
            <span className="gradient-text">Save History</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            View and manage your generated content history from all tools
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{historyItems.length}</div>
              <div className="text-sm text-muted-foreground">Total Items</div>
            </CardContent>
          </Card>

          {Object.entries(typeStats).map(([type, count]) => {
            const Icon = getTypeIcon(type)
            return (
              <Card key={type}>
                <CardContent className="p-4 text-center">
                  <Icon className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                  <div className="text-lg font-semibold">{count}</div>
                  <div className="text-xs text-muted-foreground capitalize">{type}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Controls */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-1 gap-4 w-full md:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search history..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">All Types</option>
                  <option value="password">Passwords</option>
                  <option value="url">URLs</option>
                  <option value="qr">QR Codes</option>
                  <option value="text">Text</option>
                  <option value="hash">Hashes</option>
                  <option value="base64">Base64</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={loadHistory}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" onClick={exportHistory}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="destructive" onClick={clearAllHistory}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* History Items */}
        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <History className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No History Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedType !== "all"
                  ? "No items match your search criteria"
                  : "Start using tools to build your history"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => {
              const Icon = getTypeIcon(item.type)
              return (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="p-2 rounded-lg bg-muted">
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getTypeColor(item.type)}>{item.type.toUpperCase()}</Badge>
                            <span className="text-sm text-muted-foreground">{item.timestamp.toLocaleString()}</span>
                          </div>

                          {item.title && <h4 className="font-medium mb-1">{item.title}</h4>}

                          <div className="bg-muted/50 rounded-md p-3 font-mono text-sm break-all">
                            {item.content.length > 100 ? `${item.content.substring(0, 100)}...` : item.content}
                          </div>

                          {item.metadata && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              {Object.entries(item.metadata).map(([key, value]) => (
                                <span key={key} className="mr-4">
                                  {key}: {String(value)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(item.content)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
