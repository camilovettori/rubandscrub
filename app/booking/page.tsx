import type { Metadata } from "next";
import Script from "next/script";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { breadcrumbSchema } from "@/lib/jsonLd";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Book a Mobile Car Valet in Dublin",
  description:
    "Book your Dublin mobile car valet in minutes. Submit details and continue on WhatsApp. Full Valet from €80, optional add-ons available.",
  alternates: { canonical: "/booking" },
  openGraph: {
    title: "Book a Mobile Car Valet in Dublin | Rub & Scrub",
    description: "Book in minutes via WhatsApp. We come to your home or workplace.",
    url: "https://www.rubandscrub.ie/booking",
    images: ["/og/og-booking.jpg"],
  },
};

export default async function BookingPage() {
  const siteSettings = await getSiteSettings();

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-cyan-50 py-12">
      <Script
        id="ld-bc"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: "https://www.rubandscrub.ie" },
              { name: "Book", url: "https://www.rubandscrub.ie/booking" },
            ])
          ),
        }}
      />
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Book a Mobile Car Valet in Dublin
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Complete your request in just a few steps and we&apos;ll open WhatsApp with everything
            ready to send.
          </p>
        </div>
        <BookingWizard whatsappNumber={siteSettings.whatsapp_number} />
      </div>
    </main>
  );
}
