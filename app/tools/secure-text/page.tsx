"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { SidebarAd, InlineAd } from "@/components/ad-banner"
import { Lock, Unlock, Save, Search, Plus, Trash2, Eye, EyeOff, FileText, Shield, Key } from "lucide-react"

interface SecureNote {
  id: string
  title: string
  content: string
  password: string
  createdAt: Date
  updatedAt: Date
  isLocked: boolean
}

export default function SecureTextPage() {
  const [notes, setNotes] = useState<SecureNote[]>([])
  const [currentNote, setCurrentNote] = useState<SecureNote | null>(null)
  const [newNoteTitle, setNewNoteTitle] = useState("")
  const [newNotePassword, setNewNotePassword] = useState("")
  const [unlockPassword, setUnlockPassword] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("secure-notes")
    if (savedNotes) {
      try {
        const parsed = JSON.parse(savedNotes)
        setNotes(
          parsed.map((note: any) => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt),
            isLocked: true,
          })),
        )
      } catch (error) {
        console.error("Error loading notes:", error)
      }
    }
  }, [])

  // Auto-save functionality
  useEffect(() => {
    if (!currentNote || !autoSaveEnabled) return

    const autoSaveTimer = setTimeout(() => {
      saveNote()
    }, 2000)

    return () => clearTimeout(autoSaveTimer)
  }, [currentNote, autoSaveEnabled])

  // Simple encryption (for demo purposes - in production use proper encryption)
  const encrypt = (text: string, password: string): string => {
    return btoa(text + ":" + password)
  }

  const decrypt = (encryptedText: string, password: string): string => {
    try {
      const decoded = atob(encryptedText)
      const [text, storedPassword] = decoded.split(":")
      if (storedPassword !== password) {
        throw new Error("Invalid password")
      }
      return text
    } catch {
      throw new Error("Invalid password or corrupted data")
    }
  }

  const createNewNote = () => {
    if (!newNoteTitle.trim() || !newNotePassword.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and password",
        variant: "destructive",
      })
      return
    }

    const newNote: SecureNote = {
      id: Date.now().toString(),
      title: newNoteTitle.trim(),
      content: "",
      password: newNotePassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      isLocked: false,
    }

    const updatedNotes = [...notes, newNote]
    setNotes(updatedNotes)
    setCurrentNote(newNote)
    setNewNoteTitle("")
    setNewNotePassword("")
    setIsCreating(false)

    // Save to localStorage
    localStorage.setItem("secure-notes", JSON.stringify(updatedNotes))

    toast({
      title: "Note Created",
      description: "Your secure note has been created successfully",
    })
  }

  const unlockNote = (note: SecureNote) => {
    try {
      const decryptedContent = decrypt(note.content, unlockPassword)
      const unlockedNote = { ...note, content: decryptedContent, isLocked: false }
      setCurrentNote(unlockedNote)
      setUnlockPassword("")

      toast({
        title: "Note Unlocked",
        description: "You can now view and edit your note",
      })
    } catch (error) {
      toast({
        title: "Unlock Failed",
        description: "Invalid password. Please try again.",
        variant: "destructive",
      })
    }
  }

  const lockNote = () => {
    if (!currentNote) return

    const encryptedContent = encrypt(currentNote.content, currentNote.password)
    const lockedNote = { ...currentNote, content: encryptedContent, isLocked: true }

    const updatedNotes = notes.map((note) => (note.id === currentNote.id ? lockedNote : note))

    setNotes(updatedNotes)
    setCurrentNote(null)
    localStorage.setItem("secure-notes", JSON.stringify(updatedNotes))

    toast({
      title: "Note Locked",
      description: "Your note has been encrypted and locked",
    })
  }

  const saveNote = () => {
    if (!currentNote) return

    const updatedNote = {
      ...currentNote,
      updatedAt: new Date(),
    }

    const updatedNotes = notes.map((note) => (note.id === currentNote.id ? updatedNote : note))

    setNotes(updatedNotes)
    setCurrentNote(updatedNote)

    // Encrypt before saving to localStorage
    const encryptedNote = {
      ...updatedNote,
      content: encrypt(updatedNote.content, updatedNote.password),
    }

    const notesToSave = updatedNotes.map((note) => (note.id === updatedNote.id ? encryptedNote : note))

    localStorage.setItem("secure-notes", JSON.stringify(notesToSave))

    toast({
      title: "Note Saved",
      description: "Your changes have been saved securely",
    })
  }

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((note) => note.id !== noteId)
    setNotes(updatedNotes)
    localStorage.setItem("secure-notes", JSON.stringify(updatedNotes))

    if (currentNote?.id === noteId) {
      setCurrentNote(null)
    }

    toast({
      title: "Note Deleted",
      description: "The note has been permanently deleted",
    })
  }

  const filteredNotes = notes.filter((note) => note.title.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <SidebarAd />

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Secure Notes
              </CardTitle>
              <CardDescription>Encrypted note storage with password protection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Button onClick={() => setIsCreating(true)} className="w-full" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      currentNote?.id === note.id ? "bg-primary/10 border-primary" : "hover:bg-muted"
                    }`}
                    onClick={() => {
                      if (note.isLocked) {
                        // Show unlock dialog
                      } else {
                        setCurrentNote(note)
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {note.isLocked ? (
                          <Lock className="h-4 w-4 text-red-500" />
                        ) : (
                          <Unlock className="h-4 w-4 text-green-500" />
                        )}
                        <span className="font-medium text-sm truncate">{note.title}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNote(note.id)
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{note.updatedAt.toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="editor" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="space-y-6">
              {isCreating && (
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Secure Note</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Note title..."
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                    />
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Set password..."
                        value={newNotePassword}
                        onChange={(e) => setNewNotePassword(e.target.value)}
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
                    <div className="flex gap-2">
                      <Button onClick={createNewNote}>Create Note</Button>
                      <Button variant="outline" onClick={() => setIsCreating(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentNote && !currentNote.isLocked ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          {currentNote.title}
                        </CardTitle>
                        <CardDescription>Last updated: {currentNote.updatedAt.toLocaleString()}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={saveNote} size="sm">
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button onClick={lockNote} size="sm" variant="outline">
                          <Lock className="h-4 w-4 mr-2" />
                          Lock
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      ref={textareaRef}
                      value={currentNote.content}
                      onChange={(e) =>
                        setCurrentNote({
                          ...currentNote,
                          content: e.target.value,
                        })
                      }
                      placeholder="Start typing your secure note..."
                      className="min-h-[400px] resize-none font-mono"
                    />
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{currentNote.content.length} characters</span>
                        <span>{currentNote.content.split("\n").length} lines</span>
                      </div>
                      <Badge variant={autoSaveEnabled ? "default" : "secondary"}>
                        {autoSaveEnabled ? "Auto-save ON" : "Auto-save OFF"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ) : currentNote && currentNote.isLocked ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-red-500" />
                      Locked Note: {currentNote.title}
                    </CardTitle>
                    <CardDescription>Enter your password to unlock this note</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="Enter password..."
                        value={unlockPassword}
                        onChange={(e) => setUnlockPassword(e.target.value)}
                        className="pl-10"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            unlockNote(currentNote)
                          }
                        }}
                      />
                    </div>
                    <Button onClick={() => unlockNote(currentNote)}>
                      <Unlock className="h-4 w-4 mr-2" />
                      Unlock Note
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Shield className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Note Selected</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Select a note from the sidebar or create a new one to get started.
                    </p>
                    <Button onClick={() => setIsCreating(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Note
                    </Button>
                  </CardContent>
                </Card>
              )}

              <InlineAd />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Configure your secure text preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Auto-save</h4>
                      <p className="text-sm text-muted-foreground">Automatically save changes every 2 seconds</p>
                    </div>
                    <Button
                      variant={autoSaveEnabled ? "default" : "outline"}
                      onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
                    >
                      {autoSaveEnabled ? "ON" : "OFF"}
                    </Button>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Statistics</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total Notes:</span>
                        <span className="ml-2 font-medium">{notes.length}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Locked Notes:</span>
                        <span className="ml-2 font-medium">{notes.filter((n) => n.isLocked).length}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
