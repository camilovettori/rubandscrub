import type { Database } from "@/types/database";

export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type BookingStatus = Booking["status"];

export type MonthCell = {
  date: Date;
  key: string;
  inCurrentMonth: boolean;
};

export const bookingStatuses: BookingStatus[] = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];

export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isDateKey(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function parseDateKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function normalizeMonthParam(monthParam?: string | string[]) {
  const raw = Array.isArray(monthParam) ? monthParam[0] : monthParam;

  if (!raw || !/^\d{4}-\d{2}$/.test(raw)) {
    return startOfMonth(new Date());
  }

  const [year, month] = raw.split("-").map(Number);
  const monthIndex = month - 1;

  if (Number.isNaN(year) || Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
    return startOfMonth(new Date());
  }

  return new Date(year, monthIndex, 1);
}

export function monthParam(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${year}-${month}`;
}

export function monthLabel(date: Date) {
  return new Intl.DateTimeFormat("en-IE", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function fullDateLabel(dateKey: string) {
  const date = parseDateKey(dateKey);

  return new Intl.DateTimeFormat("en-IE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function buildMonthGrid(date: Date): MonthCell[] {
  const cells: MonthCell[] = [];
  const firstDay = startOfMonth(date);
  const dayOfWeek = firstDay.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const gridStart = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() + mondayOffset);
  const currentMonth = date.getMonth();

  for (let index = 0; index < 42; index += 1) {
    const cellDate = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index);

    cells.push({
      date: cellDate,
      key: toDateKey(cellDate),
      inCurrentMonth: cellDate.getMonth() === currentMonth,
    });
  }

  return cells;
}

export function groupBookingsByDate(bookings: Booking[]) {
  return bookings.reduce<Record<string, Booking[]>>((groups, booking) => {
    const key = booking.preferred_date;

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(booking);
    return groups;
  }, {});
}

export function sortBookings(bookings: Booking[]) {
  return [...bookings].sort((left, right) => {
    const leftTime = left.preferred_time_slot.localeCompare(right.preferred_time_slot);
    if (leftTime !== 0) {
      return leftTime;
    }

    return new Date(left.created_at).getTime() - new Date(right.created_at).getTime();
  });
}

export function stripPhoneNumber(phone: string) {
  return phone.replace(/[^\d]/g, "");
}

export function whatsappHref(phone: string) {
  const sanitized = stripPhoneNumber(phone);
  return sanitized ? `https://wa.me/${sanitized}` : "https://wa.me/";
}
