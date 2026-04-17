import Link from "next/link";
import { ReviewModerationActions } from "@/components/admin/review-moderation-actions";
import { SupportCard } from "@/components/admin/support-card";
import { SubscriptionCard } from "@/components/admin/subscription-card";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";
import { requireAdminPage } from "@/lib/auth/admin";
import {
  type BillingSubscriptionSnapshotRow,
  getBillingSubscriptionSnapshot,
  syncBillingSubscriptionSnapshot,
} from "@/lib/billing-subscriptions";
import { getPendingReviews, type AdminReviewCard } from "@/lib/reviews";
import { getSiteSettings } from "@/lib/site-settings";
import {
  getMonthlySupportRequestUsage,
  SUPPORT_REQUEST_MONTHLY_LIMIT,
} from "@/lib/support-requests";

export default async function AdminPage() {
  await requireAdminPage();
  const siteSettings = await getSiteSettings();
  let billingSubscription: BillingSubscriptionSnapshotRow | null = null;
  let supportUsage = {
    usedThisMonth: 0,
    limit: SUPPORT_REQUEST_MONTHLY_LIMIT,
  };
  let pendingReviews: AdminReviewCard[] = [];
  let reviewsError: string | null = null;

  try {
    await syncBillingSubscriptionSnapshot();
  } catch (error) {
    console.error("Billing snapshot sync error:", error);
  }

  try {
    billingSubscription = await getBillingSubscriptionSnapshot();
  } catch (error) {
    console.error("Billing snapshot load error:", error);
  }

  try {
    supportUsage = await getMonthlySupportRequestUsage();
  } catch (error) {
    console.error("Support usage load error:", error);
  }

  try {
    pendingReviews = await getPendingReviews(3);
  } catch (error) {
    reviewsError =
      error instanceof Error ? error.message : "Unable to load pending reviews right now.";
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[28px] border border-slate-200 bg-white px-6 py-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
                Admin
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                Settings and reviews
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Update the active site settings and review queue from one internal control page.
              </p>
            </div>
            <form action="/api/admin/auth/logout" method="post">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
              >
                Log out
              </button>
            </form>
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white px-6 py-6 shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
                Settings
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                Contact settings
              </h2>
            </div>
          </div>

          <div className="pt-5">
            <SiteSettingsForm initialSettings={siteSettings} />
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white px-6 py-6 shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
                Reviews
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                Pending reviews
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
                {pendingReviews.length} pending
              </span>
              <Link
                href="/admin/reviews"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
              >
                Open all reviews
              </Link>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {reviewsError ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
                {reviewsError}
              </div>
            ) : pendingReviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                No pending reviews right now.
              </div>
            ) : (
              pendingReviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-slate-900">{review.name}</h3>
                      <p className="text-sm text-slate-600">
                        {review.areaLocation} - {review.rating}/5 - {review.createdAt.slice(0, 10)}
                      </p>
                      <p className="text-sm leading-6 text-slate-700">{review.reviewText}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <ReviewModerationActions reviewId={review.id} />
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white px-6 py-6 shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
                Support
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                Support requests
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                The monthly plan includes 2 support requests per month for admin help.
              </p>
            </div>
          </div>

          <div className="pt-5">
            <SupportCard initialUsage={supportUsage.usedThisMonth} />
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white px-6 py-6 shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
                Billing
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                Subscription details
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                View the current plan and billing status for this account.
              </p>
            </div>
          </div>

          <div className="pt-5">
            <SubscriptionCard snapshot={billingSubscription} />
          </div>
        </section>
      </div>
    </main>
  );
}
