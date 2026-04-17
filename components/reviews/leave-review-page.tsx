import { LeaveReviewForm } from "./leave-review-form";

export function LeaveReviewPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-cyan-50 py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
            Reviews
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Leave a review
          </h1>
          <p className="mt-3 text-lg leading-7 text-gray-600">
            Share your experience with Rub &amp; Scrub. Your review will be checked before it is
            published on the site.
          </p>
        </div>
        <LeaveReviewForm />
      </div>
    </main>
  );
}
