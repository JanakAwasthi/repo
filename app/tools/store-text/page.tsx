"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { AdBanner, SidebarAd, InlineAd } from "@/components/ad-banner"
import {
  Save,
  Search,
  Plus,
  Edit,
  Trash2,
  Copy,
  Download,
  Tag,
  FileText,
  Star,
  Archive,
  Eye,
  EyeOff,
} from "lucide-react"

interface StoredNote {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  isFavorite: boolean
  isArchived: boolean
  userName: string
  userPassword: string
}

const categories = ["Personal", "Work", "Ideas", "Recipes", "Quotes", "Code", "Links", "Shopping", "Travel", "Other"]

export default function StoreTextPage() {
  const [notes, setNotes] = useState<StoredNote[]>([])
  const [currentNote, setCurrentNote] = useState<StoredNote | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("Personal")
  const [tags, setTags] = useState("")
  const [userName, setUserName] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("All")
  const [showArchived, setShowArchived] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()

  // Load notes from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem("storedNotes")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setNotes(
          parsed.map((note: any) => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt),
          })),
        )
      } catch (error) {
        console.error("Failed to load notes:", error)
      }
    }
  }, [])

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("storedNotes", JSON.stringify(notes))
    }
  }, [notes])

  const saveNote = () => {
    if (!title.trim() || !content.trim() || !userName.trim() || !userPassword.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (title, content, name, and password)",
        variant: "destructive",
      })
      return
    }

    const tagArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)

    if (isEditing && currentNote) {
      // Update existing note
      const updatedNote = {
        ...currentNote,
        title: title.trim(),
        content: content.trim(),
        category,
        tags: tagArray,
        userName: userName.trim(),
        userPassword: userPassword.trim(),
        updatedAt: new Date(),
      }

      setNotes((prev) => prev.map((note) => (note.id === currentNote.id ? updatedNote : note)))
      setCurrentNote(updatedNote)

      toast({
        title: "Note Updated",
        description: "Your note has been successfully updated",
      })
    } else {
      // Create new note
      const newNote: StoredNote = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        category,
        tags: tagArray,
        userName: userName.trim(),
        userPassword: userPassword.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isFavorite: false,
        isArchived: false,
      }

      setNotes((prev) => [newNote, ...prev])
      setCurrentNote(newNote)

      toast({
        title: "Note Saved",
        description: "Your note has been successfully saved with your credentials",
      })
    }

    // Save to history
    const historyItem = {
      id: Date.now().toString(),
      type: "store-text",
      timestamp: new Date().toISOString(),
      details: {
        title: title.trim(),
        category,
        tags: tagArray,
        userName: userName.trim(),
      },
    }

    const history = JSON.parse(localStorage.getItem("toolHistory") || "[]")
    history.unshift(historyItem)
    localStorage.setItem("toolHistory", JSON.stringify(history.slice(0, 100)))
  }

  const editNote = (note: StoredNote) => {
    setCurrentNote(note)
    setTitle(note.title)
    setContent(note.content)
    setCategory(note.category)
    setTags(note.tags.join(", "))
    setUserName(note.userName)
    setUserPassword(note.userPassword)
    setIsEditing(true)
  }

  const deleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId))
    if (currentNote?.id === noteId) {
      clearForm()
    }

    toast({
      title: "Note Deleted",
      description: "Note has been permanently deleted",
    })
  }

  const toggleFavorite = (noteId: string) => {
    setNotes((prev) => prev.map((note) => (note.id === noteId ? { ...note, isFavorite: !note.isFavorite } : note)))
  }

  const toggleArchive = (noteId: string) => {
    setNotes((prev) => prev.map((note) => (note.id === noteId ? { ...note, isArchived: !note.isArchived } : note)))
  }

  const clearForm = () => {
    setCurrentNote(null)
    setTitle("")
    setContent("")
    setCategory("Personal")
    setTags("")
    setUserName("")
    setUserPassword("")
    setIsEditing(false)
  }

  const copyContent = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied",
        description: "Content copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy content",
        variant: "destructive",
      })
    }
  }

  const exportNotes = () => {
    const exportData = notes.map((note) => ({
      title: note.title,
      content: note.content,
      category: note.category,
      tags: note.tags.join(", "),
      userName: note.userName,
      created: note.createdAt.toISOString(),
      updated: note.updatedAt.toISOString(),
    }))

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `notes-export-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Export Complete",
      description: "Your notes have been exported successfully",
    })
  }

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = filterCategory === "All" || note.category === filterCategory
    const matchesArchived = showArchived ? note.isArchived : !note.isArchived

    return matchesSearch && matchesCategory && matchesArchived
  })

  const favoriteNotes = filteredNotes.filter((note) => note.isFavorite)
  const regularNotes = filteredNotes.filter((note) => !note.isFavorite)

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full">
              <Save className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Store Your Notes
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Save, organize, and manage your text notes with name and password protection
          </p>
        </div>

        <AdBanner slot="9131891151" />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Notes List */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-500" />
                  My Notes ({notes.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filters */}
                <div className="space-y-2">
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="archived"
                      checked={showArchived}
                      onChange={(e) => setShowArchived(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="archived" className="text-sm">
                      Include archived
                    </label>
                  </div>
                </div>

                {/* New Note Button */}
                <Button onClick={clearForm} className="w-full bg-transparent" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  New Note
                </Button>

                {/* Export Button */}
                <Button onClick={exportNotes} className="w-full bg-transparent" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
              </CardContent>
            </Card>

            <SidebarAd />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <InlineAd />

            {/* Editor */}
            <Card className="border-2 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{isEditing ? "Edit Note" : "Create New Note"}</span>
                  {isEditing && (
                    <Button variant="outline" onClick={clearForm}>
                      Cancel Edit
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* User Credentials */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Your Name *</label>
                    <Input
                      placeholder="Enter your name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Password *</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Title and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Title *</label>
                    <Input placeholder="Enter note title..." value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Tags (comma-separated)</label>
                  <Input
                    placeholder="work, important, project..."
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Content *</label>
                  <Textarea
                    placeholder="Start typing your note here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[300px] resize-none"
                  />
                </div>

                {/* Save Button */}
                <Button
                  onClick={saveNote}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? "Update Note" : "Save Note"}
                </Button>

                {/* Stats */}
                <div className="text-sm text-muted-foreground">
                  {content.length} characters • {content.split(/\s+/).filter(Boolean).length} words
                </div>
              </CardContent>
            </Card>

            {/* Notes Display */}
            {filteredNotes.length > 0 && (
              <div className="space-y-6">
                {/* Favorite Notes */}
                {favoriteNotes.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        Favorite Notes ({favoriteNotes.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {favoriteNotes.map((note) => (
                          <div key={note.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="font-medium truncate">{note.title}</h4>
                                <p className="text-xs text-muted-foreground">by {note.userName}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button size="sm" variant="ghost" onClick={() => toggleFavorite(note.id)}>
                                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => editNote(note)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => copyContent(note.content)}>
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => toggleArchive(note.id)}>
                                  <Archive className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => deleteNote(note.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{note.content}</p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {note.category}
                                </Badge>
                                {note.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    <Tag className="h-3 w-3 mr-1" />
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="text-xs text-muted-foreground">{note.updatedAt.toLocaleDateString()}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Regular Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-green-500" />
                      All Notes ({regularNotes.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {regularNotes.map((note) => (
                        <div key={note.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-medium truncate">{note.title}</h4>
                              <p className="text-xs text-muted-foreground">by {note.userName}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="ghost" onClick={() => toggleFavorite(note.id)}>
                                <Star className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => editNote(note)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => copyContent(note.content)}>
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => toggleArchive(note.id)}>
                                <Archive className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => deleteNote(note.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{note.content}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {note.category}
                              </Badge>
                              {note.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  <Tag className="h-3 w-3 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="text-xs text-muted-foreground">{note.updatedAt.toLocaleDateString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {filteredNotes.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No notes found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? "Try adjusting your search terms" : "Create your first note to get started"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <AdBanner slot="9131891151" />
      </div>
    </div>
  )
}
