import Link from "next/link";
import { BookingsCalendar } from "@/components/admin/bookings-calendar";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  normalizeMonthParam,
  sortBookings,
  type Booking,
} from "@/lib/admin/bookings";

type BookingsPageProps = {
  searchParams?: Promise<{ month?: string | string[] }>;
};

export default async function AdminBookingsPage({ searchParams }: BookingsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const currentMonth = normalizeMonthParam(resolvedSearchParams?.month);
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("preferred_date", { ascending: true })
    .order("preferred_time_slot", { ascending: true });

  const bookings = sortBookings((data ?? []) as Booking[]);
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((booking) => booking.status === "pending").length;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[28px] border border-slate-200 bg-white px-6 py-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
                Admin bookings
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Booking calendar
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                A simple operational calendar for the Rub & Scrub team. Open a day to review
                that date&apos;s bookings, then jump into the detail view when you need full
                customer information.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <StatChip label="Total" value={totalBookings} />
              <StatChip label="Pending" value={pendingBookings} tone="amber" />
              <Link
                href="/admin"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
              >
                Admin home
              </Link>
            </div>
          </div>
        </section>

        {error ? (
          <section className="rounded-[24px] border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
            Failed to load bookings: {error.message}
          </section>
        ) : (
          <BookingsCalendar bookings={bookings} currentMonth={currentMonth} />
        )}
      </div>
    </main>
  );
}

function StatChip({
  label,
  value,
  tone = "blue",
}: {
  label: string;
  value: number;
  tone?: "blue" | "amber";
}) {
  const toneClass =
    tone === "amber"
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-blue-200 bg-blue-50 text-blue-700";

  return (
    <div className={`rounded-full border px-4 py-2 text-sm font-semibold ${toneClass}`}>
      {label}: {value}
    </div>
  );
}
