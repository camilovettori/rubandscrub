import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[28px] border border-slate-200 bg-white px-6 py-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
            Admin area
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Booking operations
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Open the bookings calendar to review requests by day and manage each booking in a
            clean, lightweight workflow.
          </p>
          <Link
            href="/admin/bookings"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Open bookings calendar
          </Link>
        </section>
      </div>
    </main>
  );
}
