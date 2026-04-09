"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export function BookingSuccess() {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg">
      <div className="flex flex-col items-center text-center space-y-6">
        <CheckCircle2 className="h-16 w-16 text-green-600" />
        
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">
            Booking request received
          </h2>
          <p className="text-lg text-gray-600">
            Thanks — your request has been sent successfully.
          </p>
        </div>

        <p className="text-gray-600 max-w-md">
          We&apos;ll confirm your booking within 2 hours during business hours. You&apos;ll receive a confirmation via email and phone.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-white font-semibold hover:bg-blue-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
