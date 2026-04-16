"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  addMonths,
  buildMonthGrid,
  fullDateLabel,
  groupBookingsByDate,
  monthLabel,
  monthParam,
  normalizeMonthParam,
  sortBookings,
  toDateKey,
  type Booking,
  type MonthCell,
} from "@/lib/admin/bookings";

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getInitialSelectedDateKey(bookings: Booking[], currentMonth: Date) {
  const todayKey = toDateKey(new Date());
  const grouped = groupBookingsByDate(bookings);

  if (grouped[todayKey]?.length) {
    return todayKey;
  }

  const currentMonthPrefix = monthParam(currentMonth);
  const firstInMonth = bookings.find((booking) =>
    booking.preferred_date.startsWith(currentMonthPrefix)
  );

  if (firstInMonth) {
    return firstInMonth.preferred_date;
  }

  return bookings[0]?.preferred_date ?? todayKey;
}

function CalendarCell({
  cell,
  bookings,
  isSelected,
  isToday,
  onSelect,
}: {
  cell: MonthCell;
  bookings: Booking[];
  isSelected: boolean;
  isToday: boolean;
  onSelect: (dateKey: string) => void;
}) {
  const count = bookings.length;
  const previewBookings = bookings.slice(0, 2);

  return (
    <button
      type="button"
      onClick={() => onSelect(cell.key)}
      className={[
        "relative min-h-[76px] rounded-2xl border bg-white p-2.5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md sm:min-h-[142px] sm:p-3",
        cell.inCurrentMonth ? "border-slate-200" : "border-slate-100 bg-slate-50 text-slate-400",
        isToday ? "ring-2 ring-blue-500/25" : "",
        isSelected ? "border-blue-300 bg-blue-50/70 ring-2 ring-blue-500/25" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={[
            "text-sm font-semibold sm:text-base",
            cell.inCurrentMonth ? "text-slate-900" : "text-slate-400",
          ].join(" ")}
        >
          {cell.date.getDate()}
        </span>

        {count > 0 ? (
          <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white shadow-sm sm:px-2 sm:py-1 sm:text-[11px]">
            {count}
          </span>
        ) : null}
      </div>

      {count > 0 ? (
        <>
          <div className="mt-2 flex flex-wrap gap-1.5 sm:hidden">
            {Array.from({ length: Math.min(count, 3) }, (_, index) => (
              <span
                key={`${cell.key}-dot-${index}`}
                className="h-1.5 w-1.5 rounded-full bg-blue-300"
              />
            ))}
          </div>

          <div className="mt-3 hidden space-y-2 sm:block">
            {previewBookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2"
              >
                <p className="truncate text-sm font-medium text-slate-900">{booking.full_name}</p>
                <p className="truncate text-xs text-slate-500">
                  {booking.preferred_time_slot} - {booking.service_type}
                </p>
              </div>
            ))}
            {count > previewBookings.length ? (
              <p className="text-xs font-medium text-slate-500">
                +{count - previewBookings.length} more
              </p>
            ) : null}
          </div>
        </>
      ) : null}
    </button>
  );
}

export function BookingsCalendar({
  bookings,
  currentMonthKey,
}: {
  bookings: Booking[];
  currentMonthKey: string;
}) {
  const [visibleMonthKey, setVisibleMonthKey] = useState(currentMonthKey);

  const currentMonth = useMemo(() => normalizeMonthParam(visibleMonthKey), [visibleMonthKey]);
  const grouped = useMemo(() => groupBookingsByDate(bookings), [bookings]);
  const cells = useMemo(() => buildMonthGrid(currentMonth), [currentMonth]);
  const [selectedDateKey, setSelectedDateKey] = useState(() =>
    getInitialSelectedDateKey(bookings, currentMonth)
  );
  const todayKey = toDateKey(new Date());

  const selectedDayBookings = useMemo(() => {
    return sortBookings(grouped[selectedDateKey] ?? []);
  }, [grouped, selectedDateKey]);

  const selectedDateLabel = useMemo(() => fullDateLabel(selectedDateKey), [selectedDateKey]);

  function goToMonth(delta: number) {
    const nextMonth = addMonths(currentMonth, delta);
    const nextKey = monthParam(nextMonth);
    setVisibleMonthKey(nextKey);

    const nextSelected = getInitialSelectedDateKey(bookings, nextMonth);
    setSelectedDateKey(nextSelected);
  }

  function resetToToday() {
    const todayMonth = normalizeMonthParam(monthParam(new Date()));
    setVisibleMonthKey(monthParam(todayMonth));
    setSelectedDateKey(getInitialSelectedDateKey(bookings, todayMonth));
  }

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
            Tap a day to load its bookings below the calendar on mobile, or in the right panel on
            desktop.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goToMonth(-1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={resetToToday}
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => goToMonth(1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500 sm:gap-2 sm:text-xs sm:tracking-[0.24em]">
        {dayNames.map((day) => (
          <div key={day} className="py-1 sm:py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1.5 sm:gap-2">
        {cells.map((cell) => (
          <CalendarCell
            key={cell.key}
            cell={cell}
            bookings={grouped[cell.key] ?? []}
            isSelected={cell.key === selectedDateKey}
            isToday={cell.key === todayKey}
            onSelect={setSelectedDateKey}
          />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.85fr)]">
        <section className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
                Selected day
              </p>
              <h3 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
                {selectedDateLabel}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                {selectedDayBookings.length} booking
                {selectedDayBookings.length === 1 ? "" : "s"}
              </span>
              <Link
                href={`/admin/bookings/day/${selectedDateKey}`}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
              >
                Open day page
              </Link>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {selectedDayBookings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-5 text-sm text-slate-600">
                No bookings for this day.
              </div>
            ) : (
              selectedDayBookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/admin/bookings/${booking.id}`}
                  className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold text-slate-900">{booking.full_name}</h4>
                      <p className="text-sm text-slate-600">
                        {booking.preferred_time_slot} - {booking.service_type}
                      </p>
                      <p className="text-sm text-slate-500">{booking.phone}</p>
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
          </div>
        </section>

        <aside className="hidden rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm lg:block sm:p-5">
          <div className="space-y-2 border-b border-slate-200 pb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
              Mobile flow
            </p>
            <p className="text-sm leading-6 text-slate-600">
              On phones, the calendar stays compact and the booking list below does the heavy
              lifting. That keeps the grid readable and touch-friendly.
            </p>
          </div>

          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p className="rounded-2xl bg-slate-50 px-4 py-3">
              Day cells show only the date and a small booking count badge on mobile.
            </p>
            <p className="rounded-2xl bg-slate-50 px-4 py-3">
              Tap a day to update the selected list below without leaving the calendar.
            </p>
            <p className="rounded-2xl bg-slate-50 px-4 py-3">
              Open the day page or booking detail page when you need more room.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
