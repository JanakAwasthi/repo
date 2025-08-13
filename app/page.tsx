import { HeroSection } from "@/components/hero-section"
import { FeaturedTools } from "@/components/featured-tools"
import { AllToolsSection } from "@/components/all-tools-section"
import { AdBanner } from "@/components/ad-banner"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      {/* Updated ad slots to use proper slot IDs */}
      <AdBanner slot="1234567890" />
      <FeaturedTools />
      <AdBanner slot="2345678901" />
      <AllToolsSection />
      <AdBanner slot="3456789012" />
    </div>
  )
}
