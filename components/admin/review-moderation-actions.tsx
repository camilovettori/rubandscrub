"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ReviewStatus } from "@/lib/reviews";

export function ReviewModerationActions({
  reviewId,
}: {
  reviewId: string;
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(status: ReviewStatus) {
    setError(null);
    setIsSaving(true);

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Unable to update review status.");
      }

      router.refresh();
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteReview() {
    const confirmed = window.confirm("Are you sure you want to delete this review?");

    if (!confirmed) {
      return;
    }

    setError(null);
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete review.");
      }

      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={isSaving}
          onClick={() =>
            updateStatus("approved").catch((updateError: unknown) => {
              setError(
                updateError instanceof Error ? updateError.message : "Unable to approve review."
              );
            })
          }
          className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Approve
        </button>
        <button
          type="button"
          disabled={isSaving}
          onClick={() =>
            updateStatus("rejected").catch((updateError: unknown) => {
              setError(
                updateError instanceof Error ? updateError.message : "Unable to reject review."
              );
            })
          }
          className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Reject
        </button>
        <button
          type="button"
          disabled={isSaving || isDeleting}
          onClick={() =>
            deleteReview().catch((deleteError: unknown) => {
              setError(
                deleteError instanceof Error ? deleteError.message : "Unable to delete review."
              );
            })
          }
          className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
