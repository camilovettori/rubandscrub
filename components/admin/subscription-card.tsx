"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BillingSubscriptionSnapshotRow } from "@/lib/billing-subscriptions";

function formatMoney(amountCents: number | null, currency: string | null, interval: string | null) {
  if (amountCents === null || !currency) {
    return "Not available";
  }

  const amount = amountCents / 100;
  const formattedAmount = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);

  const intervalLabel =
    interval === "month" ? " / month" : interval === "year" ? " / year" : interval ? ` / ${interval}` : "";

  return `${formattedAmount}${intervalLabel}`;
}

function formatDate(value: string | null) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function statusClassName(status: string | null) {
  const normalized = status?.toLowerCase() ?? "";

  if (normalized.includes("active") || normalized.includes("paid")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (normalized.includes("trial")) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (normalized.includes("past") || normalized.includes("overdue") || normalized.includes("canceled")) {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

export function SubscriptionCard({
  snapshot,
}: {
  snapshot: BillingSubscriptionSnapshotRow | null;
}) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRefresh() {
    setIsRefreshing(true);
    setFeedback(null);
    setError(null);

    try {
      const response = await fetch("/api/admin/billing/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const payload = (await response.json()) as {
        error?: string;
        success?: boolean;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to refresh subscription.");
      }

      setFeedback("Subscription updated.");
      router.refresh();
      window.setTimeout(() => setFeedback(null), 2500);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to refresh subscription."
      );
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      {snapshot ? (
        <div className="space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
                {snapshot.client_name || "Subscription"}
              </p>
              <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
                {snapshot.product_name || "Plan not named"}
              </h3>
              <p className="text-sm leading-6 text-slate-600">
                Simple billing details for this account.
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <span
                className={`inline-flex w-fit rounded-full border px-3 py-1 text-sm font-semibold ${statusClassName(snapshot.subscription_status)}`}
              >
                {snapshot.subscription_status || "Unknown status"}
              </span>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isRefreshing ? "Refreshing..." : "Refresh subscription"}
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-white/70 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Billing amount
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {formatMoney(snapshot.amount_cents, snapshot.currency, snapshot.billing_interval)}
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Last payment
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {snapshot.latest_payment_status || "Not available"}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {formatDate(snapshot.latest_payment_paid_at)}
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Next renewal
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {formatDate(snapshot.current_period_end_at)}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {snapshot.cancel_at_period_end ? "Cancels at period end" : "Renews automatically"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-slate-200 pt-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Last updated <span className="font-semibold text-slate-900">{formatDate(snapshot.synced_at)}</span>
            </p>
          </div>
          {feedback ? <p className="text-sm font-medium text-emerald-700">{feedback}</p> : null}
          {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
        </div>
      ) : (
        <div className="space-y-2">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">
            No subscription details yet
          </h3>
          <p className="text-sm leading-6 text-slate-600">
            Refresh the subscription to load the latest details.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRefreshing ? "Refreshing..." : "Refresh subscription"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
