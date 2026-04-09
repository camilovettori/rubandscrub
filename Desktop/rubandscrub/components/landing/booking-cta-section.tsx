import Link from "next/link";
import { SectionShell } from "./section-shell";

export function BookingCTASection() {
  return (
    <SectionShell
      id="booking"
      eyebrow="Book Your Valet"
      title="Ready to book your valet?"
      description="Choose your preferred service and send your booking request in a few steps."
    >
      <div className="flex flex-col items-center gap-6">
        <Link
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-blue-700 hover:shadow-xl"
          href="/booking"
        >
          Start Booking
        </Link>
        <p className="text-center text-gray-600">
          Or contact us directly for faster response
        </p>
        <a
          className="inline-flex items-center justify-center rounded-full border-2 border-blue-600 bg-white px-8 py-4 text-base font-semibold text-blue-600 transition hover:bg-blue-50"
          href="https://wa.me/353000000000"
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp Us
        </a>
      </div>
    </SectionShell>
  );
}