"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Car, Sparkles, Wrench, type LucideIcon } from "lucide-react";
import { SectionShell } from "./section-shell";
import { fadeInUp, staggerContainer, sectionViewport } from "./motion-presets";

const miniValet = [
  "Exterior wash & dry",
  "Wheel clean",
  "Interior vacuum",
  "Dashboard & plastics wiped",
  "Windows cleaned (inside & out)",
];

const fullValet = [
  "Full exterior wash & dry",
  "Wheels deep cleaned",
  "Wax protection",
  "Full interior vacuum",
  "Seats & carpets shampooed",
  "Dashboard & trims deep cleaned",
  "Door shuts cleaned",
  "Windows polished",
];

const extras = [
  "Seat shampoo: EUR20 - EUR40",
  "Pet hair removal: EUR15 - EUR25",
  "Engine bay clean: EUR25 - EUR50",
  "Hand wax/polish: EUR30 - EUR60",
];

function ServiceCard({
  title,
  price,
  items,
  icon: Icon,
  popular = false,
}: {
  title: string;
  price: string;
  items: string[];
  icon: LucideIcon;
  popular?: boolean;
}) {
  return (
    <motion.article
      variants={fadeInUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.45 }}
      className={`relative flex h-full flex-col rounded-3xl border bg-white p-8 shadow-lg transition hover:shadow-xl ${
        popular ? "border-blue-300 ring-2 ring-blue-100" : "border-gray-200"
      }`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
          Most Popular
        </div>
      )}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
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
          className="block w-full rounded-full bg-blue-600 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Book Now
        </Link>
      </div>
    </motion.article>
  );
}

export function ServicesSection() {
  return (
    <SectionShell
      id="services"
      eyebrow="Services"
      title="Clear pricing, premium finish"
      description="Choose the valet level that fits your vehicle and current condition."
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
        className="grid gap-8 lg:grid-cols-3"
      >
        <ServiceCard title="Mini Valet" price="From EUR40 - EUR60" items={miniValet} icon={Car} />
        <ServiceCard
          title="Full Valet"
          price="From EUR80 - EUR120"
          items={fullValet}
          icon={Sparkles}
          popular
        />
        <motion.article
          variants={fadeInUp}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.45 }}
          className="flex h-full flex-col rounded-3xl border border-gray-200 bg-white p-8 shadow-lg"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <Wrench className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Optional Extras</p>
              <p className="text-2xl font-bold text-gray-900">Add-ons</p>
            </div>
          </div>
          <ul className="mb-6 space-y-3 text-sm leading-6 text-gray-600">
            {extras.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-auto rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-600">
            Final price may vary depending on vehicle size and condition.
          </div>
        </motion.article>
      </motion.div>
    </SectionShell>
  );
}

