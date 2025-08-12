import { HeroSection } from "@/components/hero-section"
import { FeaturedTools } from "@/components/featured-tools"
import { AllToolsSection } from "@/components/all-tools-section"
import { AdBanner } from "@/components/ad-banner"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <AdBanner slot="9131891151" />
      <FeaturedTools />
      <AdBanner slot="9131891151" />
      <AllToolsSection />
      <AdBanner slot="9131891151" />
    </div>
  )
}
