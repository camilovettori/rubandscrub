import Link from "next/link";
import { ReviewModerationActions } from "@/components/admin/review-moderation-actions";
import { requireAdminPage } from "@/lib/auth/admin";
import { getAllReviews, type AdminReviewCard } from "@/lib/reviews";

function statusTone(status: string) {
  switch (status) {
    case "approved":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "rejected":
      return "border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
}

export default async function AdminReviewsPage() {
  await requireAdminPage();
  let reviews: AdminReviewCard[] = [];
  let loadError: string | null = null;

  try {
    reviews = await getAllReviews();
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Unable to load reviews right now.";
  }

  const pendingCount = reviews.filter((review) => review.status === "pending").length;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[28px] border border-slate-200 bg-white px-6 py-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
                Admin reviews
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Review moderation
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Customer reviews stay pending until approved. This page keeps moderation separate
                from the settings card on the admin home screen.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
                Pending: {pendingCount}
              </span>
              <Link
                href="/admin"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
              >
                Admin home
              </Link>
              <form action="/api/admin/auth/logout" method="post">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                >
                  Log out
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          {loadError ? (
            <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">
              {loadError}
            </div>
          ) : reviews.length === 0 ? (
            <div className="rounded-[24px] border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
              No reviews have been submitted yet.
            </div>
          ) : (
            reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-semibold text-slate-900">{review.name}</h2>
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusTone(
                          review.status
                        )}`}
                      >
                        {review.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      {review.areaLocation} - {review.rating}/5 - {review.createdAt.slice(0, 10)}
                    </p>
                    <p className="max-w-3xl text-sm leading-7 text-slate-700">{review.reviewText}</p>
                  </div>
                </div>

                <div className="mt-5">
                  <ReviewModerationActions reviewId={review.id} />
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
