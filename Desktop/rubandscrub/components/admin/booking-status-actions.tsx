"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BookingStatus } from "@/lib/admin/bookings";

const statusStyles: Record<
  BookingStatus,
  { label: string; active: string; idle: string }
> = {
  pending: {
    label: "Pending",
    active: "border-amber-300 bg-amber-50 text-amber-800",
    idle: "border-slate-200 bg-white text-slate-700 hover:border-amber-300 hover:bg-amber-50",
  },
  confirmed: {
    label: "Confirmed",
    active: "border-blue-300 bg-blue-50 text-blue-800",
    idle: "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50",
  },
  completed: {
    label: "Completed",
    active: "border-emerald-300 bg-emerald-50 text-emerald-800",
    idle:
      "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50",
  },
  cancelled: {
    label: "Cancelled",
    active: "border-rose-300 bg-rose-50 text-rose-800",
    idle: "border-slate-200 bg-white text-slate-700 hover:border-rose-300 hover:bg-rose-50",
  },
};

export function BookingStatusActions({
  bookingId,
  initialStatus,
}: {
  bookingId: string;
  initialStatus: BookingStatus;
}) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState<BookingStatus>(initialStatus);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function updateStatus(status: BookingStatus) {
    setError(null);
    setIsSaving(true);

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to update booking status.");
      }

      setCurrentStatus(status);
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-2">
        {(Object.keys(statusStyles) as BookingStatus[]).map((status) => {
          const active = currentStatus === status;

          return (
            <button
              key={status}
              type="button"
              disabled={isSaving}
              onClick={() =>
                updateStatus(status).catch((updateError: unknown) => {
                  setError(
                    updateError instanceof Error
                      ? updateError.message
                      : "Failed to update booking status."
                  );
                })
              }
              className={[
                "rounded-full border px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
                active ? statusStyles[status].active : statusStyles[status].idle,
              ].join(" ")}
            >
              {statusStyles[status].label}
            </button>
          );
        })}
      </div>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
