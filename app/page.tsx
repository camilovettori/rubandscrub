import { BookingCTASection } from "@/components/landing/booking-cta-section";
import { BeforeAfterSection } from "@/components/landing/before-after-section";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { PromotionalSection } from "@/components/landing/promotional-section";
import { ReviewsSection } from "@/components/landing/reviews-section";
import { ServicesSection } from "@/components/landing/services-section";
import { SiteFooter } from "@/components/landing/site-footer";
import { WhyChooseSection } from "@/components/landing/why-choose-section";
import { getSiteSettings } from "@/lib/site-settings";

export default async function HomePage() {
  const siteSettings = await getSiteSettings();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-4 sm:px-6 sm:pt-8 lg:px-8">
      <div className="space-y-24 sm:space-y-28">
        <HeroSection whatsappNumber={siteSettings.whatsapp_number} />
        <ServicesSection />
        <BeforeAfterSection />
        <HowItWorksSection />
        <WhyChooseSection />
        <ReviewsSection reviewPath={siteSettings.review_path} />
        <PromotionalSection whatsappNumber={siteSettings.whatsapp_number} />
        <BookingCTASection whatsappNumber={siteSettings.whatsapp_number} />
      </div>
      <SiteFooter />
    </main>
  );
}
