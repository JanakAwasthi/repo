"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Shield, Cpu } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <Zap className="h-4 w-4 text-yellow-400 mr-2" />
            <span className="text-white text-sm font-medium">Advanced Web Toolkit</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              LinkToQR.me
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Your ultimate destination for image processing, document handling, QR code generation, and smart text tools.
            All powered by cutting-edge technology.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link href="#tools">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
            >
              Explore Tools
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          <Link href="/how-to-use">
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm bg-transparent"
            >
              How to Use
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="inline-flex p-3 rounded-full bg-blue-500/20 mb-4">
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Secure & Private</h3>
            <p className="text-gray-400">
              All processing happens locally in your browser. Your data never leaves your device.
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="inline-flex p-3 rounded-full bg-purple-500/20 mb-4">
              <Cpu className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">AI-Powered</h3>
            <p className="text-gray-400">
              Advanced algorithms and AI technology for superior results and smart automation.
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="inline-flex p-3 rounded-full bg-pink-500/20 mb-4">
              <Zap className="h-8 w-8 text-pink-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
            <p className="text-gray-400">Optimized performance with instant results. No waiting, no delays.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
