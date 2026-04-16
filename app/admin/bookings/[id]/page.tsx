import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingStatusActions } from "@/components/admin/booking-status-actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { whatsappHref, type Booking } from "@/lib/admin/bookings";

type BookingDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BookingDetailsPage({ params }: BookingDetailsPageProps) {
  const { id } = await params;
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase.from("bookings").select("*").eq("id", id).single();

  if (error || !data) {
    notFound();
  }

  const booking = data as Booking;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[28px] border border-slate-200 bg-white px-6 py-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
                Booking details
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                {booking.full_name}
              </h1>
              <p className="text-sm text-slate-600">
                {booking.preferred_date} · {booking.preferred_time_slot}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/admin/bookings/day/${booking.preferred_date}`}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
              >
                Back to day
              </Link>
              <Link
                href={`/admin/bookings?month=${booking.preferred_date.slice(0, 7)}`}
                className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:border-blue-300"
              >
                Back to calendar
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
          <div className="space-y-6">
            <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailCard label="Phone" value={booking.phone} />
                <DetailCard label="Email" value={booking.email} />
                <DetailCard label="House / Street" value={booking.house_street} />
                <DetailCard label="Address" value={booking.address} />
                <DetailCard label="Eircode" value={booking.eircode || "—"} />
                <DetailCard label="Service" value={booking.service_type} />
                <DetailCard label="Car model" value={booking.car_model} />
                <DetailCard
                  label="Booking"
                  value={`${booking.preferred_date} · ${booking.preferred_time_slot}`}
                />
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Selected extras
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {booking.selected_extras.length > 0 ? (
                  booking.selected_extras.map((extra) => (
                    <span
                      key={extra}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700"
                    >
                      {extra}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-600">No extras selected.</p>
                )}
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Notes
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                {booking.notes || "No notes provided."}
              </p>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Quick actions
              </p>
              <a
                href={whatsappHref(booking.phone)}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-green-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-600"
              >
                WhatsApp customer
              </a>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Status
              </p>
              <p className="mt-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                {booking.status}
              </p>

              <div className="mt-5">
                <BookingStatusActions bookingId={booking.id} initialStatus={booking.status} />
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-900">{value}</p>
    </div>
  );
}
