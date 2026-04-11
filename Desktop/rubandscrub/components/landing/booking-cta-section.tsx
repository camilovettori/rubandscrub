"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SectionShell } from "./section-shell";
import { fadeInUp, sectionViewport } from "./motion-presets";
import { getWhatsAppBaseUrl } from "@/lib/booking/whatsapp";

export function BookingCTASection() {
  return (
    <SectionShell
      id="booking"
      eyebrow="Book Your Valet"
      title="Ready to book your valet?"
      description="Fill out a quick request and WhatsApp opens with everything the team needs to arrange your visit."
    >
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
        className="flex flex-col items-center gap-6 rounded-3xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 px-6 py-10 shadow-xl sm:px-10"
      >
        <Link
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-blue-700 hover:shadow-xl"
          href="/booking"
        >
          Start Booking
        </Link>
        <p className="text-center text-gray-600">
          Or skip the form and chat directly on WhatsApp
        </p>
        <a
          className="inline-flex items-center justify-center rounded-full border-2 border-blue-600 bg-white px-8 py-4 text-base font-semibold text-blue-600 transition hover:bg-blue-50"
          href={getWhatsAppBaseUrl()}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp Us
        </a>
      </motion.div>
    </SectionShell>
  );
}

