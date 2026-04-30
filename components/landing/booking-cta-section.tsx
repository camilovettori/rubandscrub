"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SectionShell } from "./section-shell";
import { fadeInUp, sectionViewport } from "./motion-presets";
import { getWhatsAppBaseUrl } from "@/lib/booking/whatsapp";
import { trackWhatsAppClick } from "@/lib/analytics";

export function BookingCTASection({ whatsappNumber }: { whatsappNumber: string }) {
  const whatsappHref = getWhatsAppBaseUrl(whatsappNumber);

  return (
    <SectionShell
      id="booking"
      eyebrow="Book Your Valet"
      title="Get your car looking brand new today"
      description="Book in minutes, open WhatsApp instantly, and let the team arrange a convenient visit without the back and forth."
    >
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
        className="flex flex-col items-center gap-6 rounded-[28px] border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-cyan-50 px-6 py-10 shadow-[0_24px_60px_-34px_rgba(37,99,235,0.35)] sm:px-10"
      >
        <Link
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-10 py-4 text-base font-semibold text-white shadow-[0_18px_45px_-18px_rgba(37,99,235,0.8)] transition duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-blue-700 hover:shadow-[0_24px_60px_-18px_rgba(37,99,235,0.95)]"
          href="/booking"
        >
          Start Booking
        </Link>
        <p className="max-w-xl text-center text-gray-600">
          Or skip the form and chat directly on WhatsApp
        </p>
        <a
          className="inline-flex items-center justify-center rounded-full border border-blue-600 bg-white px-8 py-4 text-base font-semibold text-blue-600 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-lg hover:shadow-blue-100"
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackWhatsAppClick("booking_whatsapp")}
        >
          WhatsApp Us
        </a>
      </motion.div>
    </SectionShell>
  );
}

