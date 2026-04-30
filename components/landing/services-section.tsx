"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Zap, Star, Sparkles, type LucideIcon } from "lucide-react";
import { SectionShell } from "./section-shell";
import { fadeInUp, staggerContainer, sectionViewport } from "./motion-presets";

const BubblesBackground = dynamic(
  () => import("./bubbles-background").then((m) => m.BubblesBackground),
  { ssr: false, loading: () => null }
);

const services = [
  {
    title: "Mini Valet",
    price: "€50",
    icon: Zap,
    items: [
      "Hoover dashboard wipe",
      "Plastics cleaned",
      "Exterior wheel clean",
      "Prep",
      "Deep clean exterior",
      "Wash",
    ],
  },
  {
    title: "Gold Valet",
    price: "€80",
    icon: Star,
    popular: true as const,
    trustLabel: "Most booked",
    items: [
      "Exterior wash & dry",
      "Wheels cleaned",
      "Interior hoover & full wipe down",
      "Windows cleaned",
      "Tyres dressed",
    ],
  },
  {
    title: "Full Valet",
    price: "€100",
    icon: Sparkles,
    items: [
      "Exterior pre-wash, wash & dry",
      "Wheels cleaned",
      "Interior hoover & full deep clean",
      "Seats & carpets shampooed",
      "Dashboard & trims dressed",
      "Windows cleaned",
      "Tyres dressed",
    ],
  },
];

function ServiceCard({
  title,
  price,
  items,
  icon: Icon,
  popular = false,
  trustLabel,
}: {
  title: string;
  price: string;
  items: string[];
  icon: LucideIcon;
  popular?: boolean;
  trustLabel?: string;
}) {
  return (
    <motion.article
      variants={fadeInUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.45 }}
      className={`relative flex h-full flex-col rounded-[28px] border bg-white p-8 shadow-lg transition duration-200 hover:shadow-2xl ${
        popular
          ? "scale-[1.03] border-sky-200 bg-gradient-to-br from-white via-sky-50 to-blue-50 shadow-[0_24px_70px_-28px_rgba(59,130,246,0.45)] ring-1 ring-sky-200/70"
          : "border-gray-200"
      }`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-sky-200 bg-sky-600 px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-sky-200/40">
          {trustLabel || "Most booked"}
        </div>
      )}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-sky-50">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{price}</p>
        </div>
      </div>
      <ul className="mb-6 space-y-3 text-sm leading-6 text-gray-600">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto">
        <Link
          href="/booking"
          className="block w-full rounded-full bg-blue-600 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-700/25"
        >
          Book Now
        </Link>
      </div>
    </motion.article>
  );
}

export function ServicesSection() {
  return (
    <div className="relative overflow-hidden">
      <BubblesBackground />
      <SectionShell
        id="services"
        eyebrow="Services"
        title="Clear pricing, premium finish"
        description="Choose the valet level that fits your vehicle and current condition."
      >
        <>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={sectionViewport}
            className="grid gap-8 lg:grid-cols-3"
          >
            {services.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </motion.div>
          <p className="mt-6 text-center text-sm text-gray-500">
            Prices shown are standard rates. Final price may vary depending on vehicle size and condition.
          </p>
        </>
      </SectionShell>
    </div>
  );
}
