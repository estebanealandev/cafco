'use client'

import { AnnouncementBar } from '@/components/home/announcement-bar'
import { AudienceSection } from '@/components/home/audience-section'
import { BrewSection } from '@/components/home/brew-section'
import { CatalogSection } from '@/components/home/catalog-section'
import { FeaturedStrip } from '@/components/home/featured-strip'
import { HeroSection } from '@/components/home/hero-section'
import { ManifestoSection } from '@/components/home/manifesto-section'
import { MaterialsSection } from '@/components/home/materials-section'
import { NewsletterSection } from '@/components/home/newsletter-section'
import { SiteFooter } from '@/components/home/site-footer'
import { SiteHeader } from '@/components/home/site-header'
import { StorySection } from '@/components/home/story-section'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { WaFloat } from '@/components/home/wa-float'
import { useReveal } from '@/hooks/use-reveal'
import { useSmoothScroll } from '@/lib/gsap-setup'

export default function Home() {
  useSmoothScroll()
  useReveal([])

  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <HeroSection />
      <FeaturedStrip />
      <ManifestoSection />
      <CatalogSection />
      <MaterialsSection />
      <BrewSection />
      <AudienceSection />
      <TestimonialsSection />
      <StorySection />
      <NewsletterSection />
      <SiteFooter />
      <WaFloat />
    </>
  )
}
