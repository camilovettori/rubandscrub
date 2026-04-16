import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  fullDateLabel,
  isDateKey,
  sortBookings,
  type Booking,
} from "@/lib/admin/bookings";

type DayBookingsPageProps = {
  params: Promise<{
    date: string;
  }>;
};

export default async function DayBookingsPage({ params }: DayBookingsPageProps) {
  const { date } = await params;

  if (!isDateKey(date)) {
    notFound();
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("preferred_date", date)
    .order("preferred_time_slot", { ascending: true });

  const bookings = sortBookings((data ?? []) as Booking[]);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[28px] border border-slate-200 bg-white px-6 py-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
                Selected day
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                {fullDateLabel(date)}
              </h1>
              <p className="text-sm text-slate-600">
                {bookings.length} booking{bookings.length === 1 ? "" : "s"} scheduled for this
                day.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/admin/bookings?month=${date.slice(0, 7)}`}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
              >
                Back to calendar
              </Link>
            </div>
          </div>
        </section>

        {error ? (
          <section className="mt-6 rounded-[24px] border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
            Failed to load bookings: {error.message}
          </section>
        ) : (
          <section className="mt-6 space-y-4">
            {bookings.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-sm">
                No bookings found for this date.
              </div>
            ) : (
              bookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/admin/bookings/${booking.id}`}
                  className="block rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-slate-900">{booking.full_name}</h2>
                      <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                        <span>{booking.preferred_time_slot}</span>
                        <span>·</span>
                        <span>{booking.service_type}</span>
                        <span>·</span>
                        <span>{booking.phone}</span>
                      </div>
                    </div>

                    <span
                      className={[
                        "inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold",
                        booking.status === "pending"
                          ? "bg-amber-50 text-amber-700"
                          : booking.status === "confirmed"
                            ? "bg-blue-50 text-blue-700"
                            : booking.status === "completed"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700",
                      ].join(" ")}
                    >
                      {booking.status}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </section>
        )}
      </div>
    </main>
  );
}
