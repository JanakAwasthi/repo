"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Key, Copy, RefreshCw, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState([12])
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(false)
  const { toast } = useToast()

  const generatePassword = () => {
    let charset = ""
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
    if (includeNumbers) charset += "0123456789"
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    if (!charset) {
      toast({
        title: "No Character Set",
        description: "Please select at least one character type",
        variant: "destructive",
      })
      return
    }

    let result = ""
    for (let i = 0; i < length[0]; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    setPassword(result)
  }

  const copyPassword = async () => {
    if (!password) return

    await navigator.clipboard.writeText(password)
    toast({
      title: "Password Copied",
      description: "Password has been copied to clipboard",
    })
  }

  const getStrengthLevel = () => {
    if (length[0] < 8) return { level: "Weak", color: "destructive" }
    if (length[0] < 12) return { level: "Medium", color: "secondary" }
    return { level: "Strong", color: "default" }
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Password Generator</span>
          </h1>
          <p className="text-xl text-muted-foreground">Generate secure passwords with customizable options</p>
        </div>

        <Card className="tool-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="h-6 w-6 mr-2" />
              Password Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Password Length: {length[0]}</Label>
              <Slider value={length} onValueChange={setLength} max={50} min={4} step={1} className="mt-2" />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>4</span>
                <span>50</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="uppercase" checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
                <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="lowercase" checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
                <Label htmlFor="lowercase">Lowercase (a-z)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="numbers" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
                <Label htmlFor="numbers">Numbers (0-9)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="symbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
                <Label htmlFor="symbols">Symbols (!@#$)</Label>
              </div>
            </div>

            <Button onClick={generatePassword} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate Password
            </Button>

            {password && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Generated Password</Label>
                    <Badge variant={getStrengthLevel().color as any}>
                      <Shield className="h-3 w-3 mr-1" />
                      {getStrengthLevel().level}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input value={password} readOnly className="font-mono" />
                    <Button onClick={copyPassword} size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
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
