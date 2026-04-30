"use client";

import Link from "next/link";
import { getWhatsAppBaseUrl } from "@/lib/booking/whatsapp";
import { trackWhatsAppClick } from "@/lib/analytics";

export function PromotionalSection({ whatsappNumber }: { whatsappNumber: string }) {
  const whatsappHref = getWhatsAppBaseUrl(whatsappNumber);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-10 shadow-[0_24px_70px_-38px_rgba(15,23,42,0.9)] sm:px-10 sm:py-12">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-xl">
                Quick booking
              </div>
              <h2 className="max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-[1.04]">
                Need a cleaner car without the hassle?
              </h2>
              <p className="max-w-xl text-lg leading-8 text-slate-100/85">
                Book a mobile valet for your home or workplace in minutes. Clean results, easy scheduling,
                and a WhatsApp handoff that keeps everything simple.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-xl">
                  Home or workplace
                </span>
                <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-xl">
                  Fast WhatsApp booking
                </span>
                <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-xl">
                  Premium finish
                </span>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/10 p-6 shadow-[0_20px_50px_-32px_rgba(15,23,42,0.9)] backdrop-blur-2xl sm:p-8">
              <h3 className="text-xl font-semibold text-white">Book your valet today</h3>
              <p className="mt-3 text-sm leading-6 text-slate-100/80">
                No flyer, no clutter. Just a clean booking panel with the two actions customers actually use.
              </p>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                <Link
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-[0_18px_45px_-18px_rgba(37,99,235,0.8)] transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_22px_56px_-18px_rgba(37,99,235,0.95)]"
                  href="/booking"
                >
                  Book via WhatsApp
                </Link>
                <a
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-4 text-base font-semibold text-white transition duration-200 hover:bg-white/20 hover:shadow-lg hover:shadow-slate-950/20"
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackWhatsAppClick("promotional_whatsapp")}
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
