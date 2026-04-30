import type { Metadata } from "next";
import Script from "next/script";
import { SiteFooter } from "@/components/landing/site-footer";
import { breadcrumbSchema } from "@/lib/jsonLd";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms of service for Rub & Scrub Mobile Valeting Dublin.",
  alternates: { canonical: "/terms-and-conditions" },
};

export default function TermsAndConditionsPage() {
  return (
    <>
      <Script
        id="ld-bc"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: "https://www.rubandscrub.ie" },
              {
                name: "Terms & Conditions",
                url: "https://www.rubandscrub.ie/terms-and-conditions",
              },
            ])
          ),
        }}
      />
      <main className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="prose prose-gray mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms &amp; Conditions</h1>

          <p className="text-gray-600 mb-6">
            These terms and conditions outline the rules and regulations for the use of Rub &amp; Scrub Mobile Valeting&apos;s services.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Service Terms</h2>
          <p className="text-gray-600 mb-4">
            Our mobile car valeting service is provided at your specified location. We reserve the right to refuse service if conditions are unsafe or unsuitable.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Booking and Cancellation</h2>
          <p className="text-gray-600 mb-4">
            Bookings can be made through our website or by contacting us directly. Cancellations must be made at least 24 hours in advance.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Payment Terms</h2>
          <p className="text-gray-600 mb-4">
            Payment is due upon completion of service. We accept cash and major credit cards.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Liability</h2>
          <p className="text-gray-600">
            While we take every care with your vehicle, we cannot be held responsible for pre-existing damage or wear and tear.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
