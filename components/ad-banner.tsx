"use client"

import { useEffect } from "react"

interface AdBannerProps {
  slot?: string
  format?: "auto" | "rectangle" | "vertical" | "horizontal"
  responsive?: boolean
  className?: string
}

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

export function AdBanner({ slot = "auto", format = "auto", responsive = true, className = "" }: AdBannerProps) {
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.adsbygoogle) {
        window.adsbygoogle.push({})
      }
    } catch (error) {
      console.error("AdSense error:", error)
    }
  }, [])

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-1234567890123456"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  )
}

export function SidebarAd() {
  return <AdBanner slot="9131891151" format="rectangle" className="my-4" />
}

export function InlineAd() {
  return <AdBanner slot="9131891151" format="auto" className="my-6" />
}

export function FooterAd() {
  return <AdBanner slot="9131891151" format="horizontal" className="mt-8" />
}
