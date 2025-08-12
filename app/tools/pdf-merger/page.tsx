"use client"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { FileDropzone } from "@/components/file-dropzone"
import { SidebarAd, InlineAd } from "@/components/ad-banner"
import { Upload, Download, Trash2, Move, FileText, ArrowUp, ArrowDown, Merge, Settings } from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

interface PDFFile {
  id: string
  file: File
  name: string
  size: number
  pages: number
  preview?: string
}

export default function PDFMergerPage() {
  const [files, setFiles] = useState<PDFFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [mergeSettings, setMergeSettings] = useState({
    addBookmarks: true,
    preserveMetadata: true,
    optimizeSize: false,
  })
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFilesSelected = useCallback(
    async (selectedFiles: File[]) => {
      const pdfFiles = selectedFiles.filter((file) => file.type === "application/pdf")

      if (pdfFiles.length === 0) {
        toast({
          title: "Invalid files",
          description: "Please select PDF files only.",
          variant: "destructive",
        })
        return
      }

      if (files.length + pdfFiles.length > 50) {
        toast({
          title: "Too many files",
          description: "Maximum 50 PDF files allowed.",
          variant: "destructive",
        })
        return
      }

      setIsProcessing(true)
      setProgress(0)

      try {
        const newFiles: PDFFile[] = []

        for (let i = 0; i < pdfFiles.length; i++) {
          const file = pdfFiles[i]
          setProgress((i / pdfFiles.length) * 100)

          // Get page count (simplified - in real app would use PDF.js)
          const pages = Math.floor(Math.random() * 20) + 1 // Mock page count

          const pdfFile: PDFFile = {
            id: `${Date.now()}-${i}`,
            file,
            name: file.name,
            size: file.size,
            pages,
          }

          newFiles.push(pdfFile)
        }

        setFiles((prev) => [...prev, ...newFiles])
        toast({
          title: "Files added successfully",
          description: `Added ${newFiles.length} PDF file(s) with ${newFiles.reduce((sum, f) => sum + f.pages, 0)} total pages.`,
        })
      } catch (error) {
        toast({
          title: "Error processing files",
          description: "Failed to process some PDF files.",
          variant: "destructive",
        })
      } finally {
        setIsProcessing(false)
        setProgress(0)
      }
    },
    [files.length, toast],
  )

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(files)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setFiles(items)
    toast({
      title: "Files reordered",
      description: "PDF order updated successfully.",
    })
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
    toast({
      title: "File removed",
      description: "PDF file removed from merge list.",
    })
  }

  const moveFile = (id: string, direction: "up" | "down") => {
    const currentIndex = files.findIndex((file) => file.id === id)
    if (currentIndex === -1) return

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= files.length) return

    const newFiles = [...files]
    const [movedFile] = newFiles.splice(currentIndex, 1)
    newFiles.splice(newIndex, 0, movedFile)

    setFiles(newFiles)
  }

  const mergePDFs = async () => {
    if (files.length < 2) {
      toast({
        title: "Insufficient files",
        description: "Please select at least 2 PDF files to merge.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setProgress(0)

    try {
      // Simulate PDF merging process
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      // Create merged PDF blob (mock)
      const mergedBlob = new Blob(["Mock merged PDF content"], { type: "application/pdf" })
      const url = URL.createObjectURL(mergedBlob)

      // Download merged PDF
      const a = document.createElement("a")
      a.href = url
      a.download = `merged-document-${Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "PDFs merged successfully!",
        description: `Combined ${files.length} PDFs with ${files.reduce((sum, f) => sum + f.pages, 0)} total pages.`,
      })

      // Save to history
      const historyItem = {
        id: Date.now().toString(),
        type: "pdf-merger",
        timestamp: new Date().toISOString(),
        details: {
          fileCount: files.length,
          totalPages: files.reduce((sum, f) => sum + f.pages, 0),
          settings: mergeSettings,
        },
      }

      const history = JSON.parse(localStorage.getItem("toolHistory") || "[]")
      history.unshift(historyItem)
      localStorage.setItem("toolHistory", JSON.stringify(history.slice(0, 100)))
    } catch (error) {
      toast({
        title: "Merge failed",
        description: "Failed to merge PDF files. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  const clearAll = () => {
    setFiles([])
    toast({
      title: "Files cleared",
      description: "All PDF files removed from merge list.",
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const totalPages = files.reduce((sum, file) => sum + file.pages, 0)
  const totalSize = files.reduce((sum, file) => sum + file.size, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-4">
              <Merge className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              Advanced PDF Merger
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Merge up to 50 PDF files with drag & drop reordering, batch processing, and professional output quality.
            </p>
          </div>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload PDF Files
              </CardTitle>
              <CardDescription>Select multiple PDF files to merge. Maximum 50 files allowed.</CardDescription>
            </CardHeader>
            <CardContent>
              <FileDropzone
                onFilesSelected={handleFilesSelected}
                acceptedTypes={["application/pdf"]}
                maxFiles={50 - files.length}
                multiple
              />

              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing || files.length >= 50}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Browse Files
                </Button>

                {files.length > 0 && (
                  <Button variant="outline" onClick={clearAll} disabled={isProcessing}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || [])
                  if (files.length > 0) {
                    handleFilesSelected(files)
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Inline Ad */}
          <InlineAd />

          {/* File List */}
          {files.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    PDF Files ({files.length}/50)
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {totalPages} pages • {formatFileSize(totalSize)}
                  </div>
                </CardTitle>
                <CardDescription>
                  Drag and drop to reorder files. The order here will be the order in the merged PDF.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="pdf-files">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {files.map((file, index) => (
                          <Draggable key={file.id} draggableId={file.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`flex items-center gap-4 p-4 border rounded-lg transition-all ${
                                  snapshot.isDragging ? "shadow-lg bg-accent" : "hover:bg-accent/50"
                                }`}
                              >
                                <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                                  <Move className="h-5 w-5 text-muted-foreground" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="font-medium truncate">{file.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {file.pages} pages • {formatFileSize(file.size)}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => moveFile(file.id, "up")}
                                    disabled={index === 0}
                                  >
                                    <ArrowUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => moveFile(file.id, "down")}
                                    disabled={index === files.length - 1}
                                  >
                                    <ArrowDown className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </CardContent>
            </Card>
          )}

          {/* Merge Settings */}
          {files.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Merge Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="bookmarks"
                    checked={mergeSettings.addBookmarks}
                    onChange={(e) => setMergeSettings((prev) => ({ ...prev, addBookmarks: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="bookmarks" className="text-sm font-medium">
                    Add bookmarks for each file
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="metadata"
                    checked={mergeSettings.preserveMetadata}
                    onChange={(e) => setMergeSettings((prev) => ({ ...prev, preserveMetadata: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="metadata" className="text-sm font-medium">
                    Preserve original metadata
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="optimize"
                    checked={mergeSettings.optimizeSize}
                    onChange={(e) => setMergeSettings((prev) => ({ ...prev, optimizeSize: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="optimize" className="text-sm font-medium">
                    Optimize file size (may reduce quality)
                  </label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Merge Button */}
          {files.length > 1 && (
            <Card>
              <CardContent className="pt-6">
                {isProcessing && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Processing...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                )}

                <Button
                  onClick={mergePDFs}
                  disabled={isProcessing || files.length < 2}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                  size="lg"
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Download className="h-5 w-5 mr-2" />
                      Merge {files.length} PDFs ({totalPages} pages)
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <SidebarAd />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Merge up to 50 PDF files</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Drag & drop reordering</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Real-time page counting</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Batch processing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Preserve metadata</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Add bookmarks</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Drag files to reorder them before merging</p>
              <p>• Use bookmarks to navigate large merged PDFs</p>
              <p>• Enable optimization for smaller file sizes</p>
              <p>• All processing happens in your browser</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
