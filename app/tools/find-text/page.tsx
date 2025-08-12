"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdBanner } from "@/components/ad-banner"
import {
  Search,
  User,
  Lock,
  FileText,
  Edit,
  Trash2,
  Heart,
  Archive,
  Copy,
  Download,
  Eye,
  EyeOff,
  LogOut,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StoredNote {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  userName: string
  userPassword: string
  isFavorite: boolean
  isArchived: boolean
  createdAt: Date
  updatedAt: Date
}

export default function FindTextPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginName, setLoginName] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [userNotes, setUserNotes] = useState<StoredNote[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("updated")
  const [editingNote, setEditingNote] = useState<StoredNote | null>(null)
  const [currentUser, setCurrentUser] = useState("")
  const { toast } = useToast()

  const handleLogin = () => {
    if (!loginName.trim() || !loginPassword.trim()) {
      toast({
        title: "Login Required",
        description: "Please enter both name and password",
        variant: "destructive",
      })
      return
    }

    // Get all stored notes from localStorage
    const allNotes = JSON.parse(localStorage.getItem("storedNotes") || "[]")

    // Filter notes that match the exact credentials
    const matchingNotes = allNotes.filter(
      (note: StoredNote) => note.userName === loginName && note.userPassword === loginPassword,
    )

    if (matchingNotes.length === 0) {
      toast({
        title: "Access Denied",
        description: "No notes found with these credentials",
        variant: "destructive",
      })
      return
    }

    setUserNotes(matchingNotes)
    setCurrentUser(loginName)
    setIsLoggedIn(true)

    toast({
      title: "Login Successful! 🎉",
      description: `Found ${matchingNotes.length} note(s) for ${loginName}`,
    })
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setLoginName("")
    setLoginPassword("")
    setUserNotes([])
    setCurrentUser("")
    setEditingNote(null)
    setSearchQuery("")

    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    })
  }

  const filteredNotes = userNotes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || note.category === selectedCategory

    return matchesSearch && matchesCategory && !note.isArchived
  })

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title)
      case "created":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "updated":
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      case "category":
        return a.category.localeCompare(b.category)
      default:
        return 0
    }
  })

  const categories = [...new Set(userNotes.map((note) => note.category))]
  const favoriteNotes = userNotes.filter((note) => note.isFavorite && !note.isArchived)
  const archivedNotes = userNotes.filter((note) => note.isArchived)

  const updateNote = (updatedNote: StoredNote) => {
    const allNotes = JSON.parse(localStorage.getItem("storedNotes") || "[]")
    const updatedAllNotes = allNotes.map((note: StoredNote) => (note.id === updatedNote.id ? updatedNote : note))
    localStorage.setItem("storedNotes", JSON.stringify(updatedAllNotes))

    setUserNotes((prev) => prev.map((note) => (note.id === updatedNote.id ? updatedNote : note)))
  }

  const deleteNote = (noteId: string) => {
    const allNotes = JSON.parse(localStorage.getItem("storedNotes") || "[]")
    const filteredAllNotes = allNotes.filter((note: StoredNote) => note.id !== noteId)
    localStorage.setItem("storedNotes", JSON.stringify(filteredAllNotes))

    setUserNotes((prev) => prev.filter((note) => note.id !== noteId))

    toast({
      title: "Note Deleted",
      description: "Note has been permanently deleted",
    })
  }

  const toggleFavorite = (note: StoredNote) => {
    const updatedNote = { ...note, isFavorite: !note.isFavorite, updatedAt: new Date() }
    updateNote(updatedNote)

    toast({
      title: updatedNote.isFavorite ? "Added to Favorites" : "Removed from Favorites",
      description: `"${note.title}" ${updatedNote.isFavorite ? "added to" : "removed from"} favorites`,
    })
  }

  const toggleArchive = (note: StoredNote) => {
    const updatedNote = { ...note, isArchived: !note.isArchived, updatedAt: new Date() }
    updateNote(updatedNote)

    toast({
      title: updatedNote.isArchived ? "Note Archived" : "Note Restored",
      description: `"${note.title}" ${updatedNote.isArchived ? "moved to archive" : "restored from archive"}`,
    })
  }

  const copyNote = (note: StoredNote) => {
    navigator.clipboard.writeText(note.content)
    toast({
      title: "Content Copied",
      description: "Note content copied to clipboard",
    })
  }

  const downloadNote = (note: StoredNote) => {
    const content = `Title: ${note.title}\nCategory: ${note.category}\nTags: ${note.tags.join(", ")}\nCreated: ${new Date(note.createdAt).toLocaleString()}\n\n${note.content}`
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${note.title}.txt`
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Note Downloaded",
      description: "Note saved to your device",
    })
  }

  const saveEditedNote = () => {
    if (!editingNote) return

    const updatedNote = { ...editingNote, updatedAt: new Date() }
    updateNote(updatedNote)
    setEditingNote(null)

    toast({
      title: "Note Updated",
      description: "Your changes have been saved",
    })
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
        <div className="container mx-auto max-w-md">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full">
                <Search className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Find Your Notes
            </h1>
            <p className="text-xl text-muted-foreground">Enter your credentials to access your stored notes</p>
          </div>

          <AdBanner slot="9131891151" />

          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
                <User className="h-6 w-6 mr-2" />
                Login to Your Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="loginName">Your Name</Label>
                <Input
                  id="loginName"
                  type="text"
                  placeholder="Enter your name"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="loginPassword">Password</Label>
                <div className="relative mt-2">
                  <Input
                    id="loginPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                disabled={!loginName.trim() || !loginPassword.trim()}
              >
                <Lock className="h-4 w-4 mr-2" />
                Access My Notes
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                <p>
                  Don't have any notes?{" "}
                  <a href="/tools/store-text" className="text-blue-600 hover:underline">
                    Create your first note
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          <AdBanner slot="9131891151" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome back, {currentUser}!
            </h1>
            <p className="text-muted-foreground">
              You have {userNotes.length} note(s) • {favoriteNotes.length} favorite(s) • {archivedNotes.length} archived
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <AdBanner slot="9131891151" />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Search and Filters */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2 text-blue-600" />
                  Search & Filter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Search Notes</Label>
                  <Input
                    placeholder="Search title, content, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="updated">Last Updated</SelectItem>
                      <SelectItem value="created">Date Created</SelectItem>
                      <SelectItem value="title">Title A-Z</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <AdBanner slot="9131891151" format="rectangle" />

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Total Notes:</span>
                  <Badge variant="secondary">{userNotes.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Favorites:</span>
                  <Badge variant="secondary">{favoriteNotes.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Archived:</span>
                  <Badge variant="secondary">{archivedNotes.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Categories:</span>
                  <Badge variant="secondary">{categories.length}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes List */}
          <div className="lg:col-span-3">
            {editingNote ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Edit Note</span>
                    <div className="space-x-2">
                      <Button onClick={saveEditedNote} size="sm">
                        Save Changes
                      </Button>
                      <Button onClick={() => setEditingNote(null)} variant="outline" size="sm">
                        Cancel
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={editingNote.title}
                      onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Content</Label>
                    <Textarea
                      value={editingNote.content}
                      onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                      className="mt-2 min-h-[300px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Category</Label>
                      <Input
                        value={editingNote.category}
                        onChange={(e) => setEditingNote({ ...editingNote, category: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Tags (comma separated)</Label>
                      <Input
                        value={editingNote.tags.join(", ")}
                        onChange={(e) =>
                          setEditingNote({
                            ...editingNote,
                            tags: e.target.value
                              .split(",")
                              .map((tag) => tag.trim())
                              .filter(Boolean),
                          })
                        }
                        className="mt-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {sortedNotes.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Notes Found</h3>
                      <p className="text-muted-foreground">
                        {searchQuery ? "Try adjusting your search criteria" : "You haven't created any notes yet"}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sortedNotes.map((note) => (
                      <Card key={note.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg mb-2">{note.title}</CardTitle>
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge variant="outline">{note.category}</Badge>
                                {note.isFavorite && <Heart className="h-4 w-4 text-red-500 fill-current" />}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {note.tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{note.content}</p>
                          <div className="text-xs text-muted-foreground mb-4">
                            Created: {new Date(note.createdAt).toLocaleDateString()}
                            <br />
                            Updated: {new Date(note.updatedAt).toLocaleDateString()}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" onClick={() => setEditingNote(note)}>
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => copyNote(note)}>
                              <Copy className="h-3 w-3 mr-1" />
                              Copy
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => downloadNote(note)}>
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleFavorite(note)}
                              className={note.isFavorite ? "text-red-600" : ""}
                            >
                              <Heart className={`h-3 w-3 mr-1 ${note.isFavorite ? "fill-current" : ""}`} />
                              {note.isFavorite ? "Unfavorite" : "Favorite"}
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => toggleArchive(note)}>
                              <Archive className="h-3 w-3 mr-1" />
                              Archive
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteNote(note.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <AdBanner slot="9131891151" />
      </div>
    </div>
  )
}
