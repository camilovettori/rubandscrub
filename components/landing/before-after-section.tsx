"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { SectionShell } from "./section-shell";
import { fadeInUp, staggerContainer, sectionViewport } from "./motion-presets";

const highlights = [
  "Brighter paintwork",
  "Sharper reflections",
  "A cleaner finish inside and out",
];

function ComparisonCard({
  label,
  image,
  caption,
}: {
  label: string;
  image: string;
  caption: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl shadow-slate-900/10">
      <div className="relative aspect-[4/3] w-full bg-slate-100">
        <Image
          src={image}
          alt={label}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-white">
          {label}
        </div>
      </div>
      <div className="p-5">
        <p className="text-sm leading-6 text-slate-600">{caption}</p>
      </div>
    </div>
  );
}

export function BeforeAfterSection() {
  return (
    <SectionShell
      id="before-after"
      eyebrow="Before / After"
      title="See the difference a proper detail makes"
      description="A quick visual proof point that builds confidence before the customer even hits book."
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
        className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center"
      >
        <motion.div variants={fadeInUp}>
          <ComparisonCard
            label="Before"
            image="/images/before1.png"
            caption="Dull surfaces, road film, and the everyday buildup that hides the car's best finish."
          />
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="flex items-center justify-center lg:h-full"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-blue-100 bg-white shadow-lg shadow-blue-100">
            <ArrowRight className="h-6 w-6 text-blue-600 lg:rotate-0 rotate-90" />
          </div>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <ComparisonCard
            label="After"
            image="/images/after1.png"
            caption="A cleaner, brighter result with the kind of finish that makes the booking feel worth it."
          />
        </motion.div>
      </motion.div>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
        className="mt-8 grid gap-3 sm:grid-cols-3"
      >
        {highlights.map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm"
          >
            <Sparkles className="h-4 w-4 shrink-0 text-blue-600" />
            <span>{item}</span>
          </div>
        ))}
      </motion.div>
    </SectionShell>
  );
}

