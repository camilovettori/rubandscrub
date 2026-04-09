import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  buildMonthGrid,
  groupBookingsByDate,
  monthLabel,
  monthParam,
  toDateKey,
  type Booking,
  type MonthCell,
} from "@/lib/admin/bookings";

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function monthLink(baseMonth: Date, delta: number) {
  const shifted = new Date(baseMonth.getFullYear(), baseMonth.getMonth() + delta, 1);
  return `/admin/bookings?month=${monthParam(shifted)}`;
}

function CalendarCell({
  cell,
  bookings,
  todayKey,
}: {
  cell: MonthCell;
  bookings: Booking[];
  todayKey: string;
}) {
  const dayBookings = bookings.slice(0, 2);
  const count = bookings.length;
  const isToday = cell.key === todayKey;

  return (
    <Link
      href={`/admin/bookings/day/${cell.key}`}
      className={[
        "group flex min-h-[118px] flex-col rounded-2xl border bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md sm:min-h-[142px]",
        cell.inCurrentMonth ? "border-slate-200" : "border-slate-100 bg-slate-50 text-slate-400",
        isToday ? "ring-2 ring-blue-500/30" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={[
            "text-sm font-semibold",
            cell.inCurrentMonth ? "text-slate-900" : "text-slate-400",
          ].join(" ")}
        >
          {cell.date.getDate()}
        </span>
        {count > 0 ? (
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
            {count} booking{count === 1 ? "" : "s"}
          </span>
        ) : null}
      </div>

      <div className="mt-3 space-y-2">
        {dayBookings.map((booking) => (
          <div
            key={booking.id}
            className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2"
          >
            <p className="truncate text-sm font-medium text-slate-900">{booking.full_name}</p>
            <p className="truncate text-xs text-slate-500">
              {booking.preferred_time_slot} · {booking.service_type}
            </p>
          </div>
        ))}
        {count > dayBookings.length ? (
          <p className="text-xs font-medium text-slate-500">+{count - dayBookings.length} more</p>
        ) : null}
        {count === 0 ? <p className="text-xs text-slate-400">No bookings</p> : null}
      </div>
    </Link>
  );
}

export function BookingsCalendar({
  bookings,
  currentMonth,
}: {
  bookings: Booking[];
  currentMonth: Date;
}) {
  const grouped = groupBookingsByDate(bookings);
  const cells = buildMonthGrid(currentMonth);
  const todayKey = toDateKey(new Date());

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
            Bookings calendar
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            {monthLabel(currentMonth)}
          </h2>
          <p className="text-sm text-slate-600">
            Review the month at a glance, then open a day to manage that day&apos;s bookings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={monthLink(currentMonth, -1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <Link
            href="/admin/bookings"
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
          >
            Today
          </Link>
          <Link
            href={monthLink(currentMonth, 1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
        {dayNames.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {cells.map((cell) => (
          <CalendarCell
            key={cell.key}
            cell={cell}
            bookings={grouped[cell.key] ?? []}
            todayKey={todayKey}
          />
        ))}
      </div>
    </section>
  );
}
