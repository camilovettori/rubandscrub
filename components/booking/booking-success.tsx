"use client";

import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";

export function BookingSuccess({ whatsappUrl }: { whatsappUrl: string }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
      <div className="flex flex-col items-center space-y-6 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-600" />

        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">WhatsApp is opening now</h2>
          <p className="text-lg text-gray-600">
            Your booking request is ready. If WhatsApp did not open automatically, tap the button
            below.
          </p>
        </div>

        <p className="max-w-md text-gray-600">
          The message already includes your details, vehicle, extras, and notes so the team can
          arrange a day and time with you quickly.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-8 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            <MessageCircle className="h-4 w-4" />
            Open WhatsApp
          </a>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl border border-gray-300 px-8 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

