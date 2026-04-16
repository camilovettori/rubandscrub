"use client";

import { motion } from "framer-motion";
import { CheckCircle, MessageSquare, Sparkles, Truck } from "lucide-react";
import { SectionShell } from "./section-shell";
import { fadeInUp, staggerContainer, sectionViewport } from "./motion-presets";

const steps = [
  {
    icon: Sparkles,
    title: "Choose your service",
    description: "Select Mini Valet, Full Valet, or add extras.",
  },
  {
    icon: MessageSquare,
    title: "Share your details",
    description: "Fill in your contact, vehicle, and location info.",
  },
  {
    icon: Truck,
    title: "Send on WhatsApp",
    description: "Submit the request and WhatsApp opens with the full message.",
  },
  {
    icon: CheckCircle,
    title: "We arrange the visit",
    description: "The team contacts you to confirm a day and time.",
  },
];

export function HowItWorksSection() {
  return (
    <SectionShell
      id="how-it-works"
      eyebrow="How It Works"
      title="Simple booking in 4 steps"
      description="Get your car sparkling clean with a straightforward WhatsApp booking flow."
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
        className="grid gap-8 md:grid-cols-2 xl:grid-cols-4"
      >
        {steps.map((step, index) => (
          <motion.article
            key={step.title}
            variants={fadeInUp}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.45 }}
            className="relative rounded-3xl border border-gray-200 bg-white p-6 shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <step.icon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="absolute -top-2 -left-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              {index + 1}
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">{step.title}</h3>
            <p className="text-sm leading-6 text-gray-600">{step.description}</p>
          </motion.article>
        ))}
      </motion.div>
    </SectionShell>
  );
}

