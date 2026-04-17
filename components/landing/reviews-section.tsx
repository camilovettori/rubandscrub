import Link from "next/link";
import { SectionShell } from "./section-shell";
import { getApprovedReviews } from "@/lib/reviews";
import { ReviewsCards } from "./reviews-cards";

export async function ReviewsSection({ reviewPath }: { reviewPath: string }) {
  const reviews = await getApprovedReviews();

  return (
    <SectionShell
      id="reviews"
      eyebrow="Reviews"
      title="What our customers say"
      description="Don't just take our word for it - hear from Dublin drivers who've experienced our service."
    >
      <ReviewsCards reviews={reviews} />
      <div className="mt-12 text-center space-y-4">
        <p className="text-sm text-gray-600">
          Join our customers by leaving a review after your visit.
        </p>
        <Link
          href={reviewPath}
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700"
        >
          Leave a review
        </Link>
      </div>
    </SectionShell>
  );
}
