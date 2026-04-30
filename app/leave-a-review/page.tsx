import type { Metadata } from "next";
import Script from "next/script";
import { LeaveReviewPage } from "@/components/reviews/leave-review-page";
import { breadcrumbSchema } from "@/lib/jsonLd";

export const metadata: Metadata = {
  title: "Leave a Review",
  description: "Share your experience with Rub & Scrub Mobile Valeting Dublin.",
  alternates: { canonical: "/leave-a-review" },
  robots: { index: false, follow: true },
};

export default async function LeaveAReviewPage() {
  return (
    <>
      <Script
        id="ld-bc"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: "https://www.rubandscrub.ie" },
              { name: "Leave a review", url: "https://www.rubandscrub.ie/leave-a-review" },
            ])
          ),
        }}
      />
      <LeaveReviewPage />
    </>
  );
}
