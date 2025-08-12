"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Database, Search, FileText, Lock, Brain, Zap, Shield, Key, ArrowRight, Cpu, HardDrive } from "lucide-react"
import Link from "next/link"

export default function SmartTextPage() {
  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <Brain className="h-20 w-20 text-cyan-400 mr-6 animate-pulse" />
            <div>
              <h1 className="text-5xl font-bold text-white mb-2">SMART TEXT TOOLS</h1>
              <p className="text-cyan-300 text-lg">Neural-Powered Text Management System</p>
            </div>
          </div>

          <div className="flex justify-center space-x-4 mb-8">
            <Badge variant="outline" className="border-cyan-400/50 text-cyan-300 px-4 py-2">
              🧠 AI-Powered
            </Badge>
            <Badge variant="outline" className="border-purple-400/50 text-purple-300 px-4 py-2">
              🔒 Quantum Encrypted
            </Badge>
            <Badge variant="outline" className="border-blue-400/50 text-blue-300 px-4 py-2">
              ⚡ Zero Latency
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Store Your Note */}
          <Card className="bg-white/10 backdrop-blur-md border-cyan-400/30 hover:border-cyan-400/50 transition-all duration-300 group">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Database className="h-16 w-16 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                    <Lock className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-cyan-300 mb-2">STORE YOUR NOTE</CardTitle>
              <p className="text-cyan-400 text-sm">Secure Text Storage • Advanced Editor</p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center text-white">
                  <FileText className="h-5 w-5 text-cyan-400 mr-3" />
                  <span>MS Word-like interface with 40 document slots</span>
                </div>
                <div className="flex items-center text-white">
                  <HardDrive className="h-5 w-5 text-cyan-400 mr-3" />
                  <span>Quantum-encrypted local database storage</span>
                </div>
                <div className="flex items-center text-white">
                  <Zap className="h-5 w-5 text-cyan-400 mr-3" />
                  <span>Real-time auto-save with neural backup</span>
                </div>
                <div className="flex items-center text-white">
                  <Key className="h-5 w-5 text-cyan-400 mr-3" />
                  <span>Password-protected user authentication</span>
                </div>
              </div>

              <div className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-400/20">
                <h4 className="font-semibold text-cyan-300 mb-2">Features:</h4>
                <ul className="text-sm text-cyan-200 space-y-1">
                  <li>• Tabbed interface like VS Code</li>
                  <li>• Word & character counting</li>
                  <li>• Search & filter documents</li>
                  <li>• Export backup functionality</li>
                  <li>• Password change capability</li>
                </ul>
              </div>

              <Link href="/tools/store-text">
                <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white py-3">
                  <Database className="h-5 w-5 mr-2" />
                  ACCESS NOTE STORAGE
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Find Your Note */}
          <Card className="bg-white/10 backdrop-blur-md border-purple-400/30 hover:border-purple-400/50 transition-all duration-300 group">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Search className="h-16 w-16 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                    <Brain className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-purple-300 mb-2">FIND YOUR NOTE</CardTitle>
              <p className="text-purple-400 text-sm">Note Search • Data Retrieval</p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center text-white">
                  <Shield className="h-5 w-5 text-purple-400 mr-3" />
                  <span>Secure username & password authentication</span>
                </div>
                <div className="flex items-center text-white">
                  <Cpu className="h-5 w-5 text-purple-400 mr-3" />
                  <span>Quantum database scanning technology</span>
                </div>
                <div className="flex items-center text-white">
                  <FileText className="h-5 w-5 text-purple-400 mr-3" />
                  <span>Document preview before vault access</span>
                </div>
                <div className="flex items-center text-white">
                  <Key className="h-5 w-5 text-purple-400 mr-3" />
                  <span>Direct vault access with password change</span>
                </div>
              </div>

              <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-400/20">
                <h4 className="font-semibold text-purple-300 mb-2">Capabilities:</h4>
                <ul className="text-sm text-purple-200 space-y-1">
                  <li>• Deep neural network scanning</li>
                  <li>• Instant data location & retrieval</li>
                  <li>• Document statistics & metadata</li>
                  <li>• Seamless vault integration</li>
                  <li>• Security protocol verification</li>
                </ul>
              </div>

              <Link href="/tools/find-text">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3">
                  <Search className="h-5 w-5 mr-2" />
                  FIND YOUR NOTES
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/5 backdrop-blur-md border-green-400/30">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
                <span className="text-green-300 font-semibold">SYSTEM ONLINE</span>
              </div>
              <p className="text-green-200 text-sm">Neural networks operational</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border-blue-400/30">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Shield className="h-5 w-5 text-blue-400 mr-2" />
                <span className="text-blue-300 font-semibold">SECURE</span>
              </div>
              <p className="text-blue-200 text-sm">Quantum encryption active</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border-purple-400/30">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Zap className="h-5 w-5 text-purple-400 mr-2" />
                <span className="text-purple-300 font-semibold">OPTIMIZED</span>
              </div>
              <p className="text-purple-200 text-sm">Zero-latency processing</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
