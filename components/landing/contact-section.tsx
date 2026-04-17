"use client";

import Link from "next/link";
import { SectionShell } from "./section-shell";
import { formatWhatsAppDisplay, getWhatsAppBaseUrl } from "@/lib/booking/whatsapp";

export function ContactSection({ whatsappNumber }: { whatsappNumber: string }) {
  const whatsappHref = getWhatsAppBaseUrl(whatsappNumber);
  const whatsappDisplay = formatWhatsAppDisplay(whatsappNumber);

  return (
    <SectionShell
      id="contact"
      eyebrow="Contact"
      title="Get in touch"
      description="Have questions about our service? We are here to help."
    >
      <div className="flex flex-col gap-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-lg sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <p className="text-lg font-semibold text-gray-900">WhatsApp: {whatsappDisplay}</p>
          <p className="text-gray-600">Fast response for booking enquiries</p>
          <p className="text-sm text-gray-500">Operating hours: Mon-Sat 8:00-20:00</p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-blue-700 hover:shadow-xl"
            href="/booking"
          >
            Book Your Valet
          </Link>
          <a
            className="inline-flex items-center justify-center rounded-full border-2 border-blue-600 bg-white px-8 py-4 text-base font-semibold text-blue-600 transition hover:bg-blue-50"
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </SectionShell>
  );
}

