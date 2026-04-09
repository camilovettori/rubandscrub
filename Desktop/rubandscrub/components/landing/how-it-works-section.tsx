"use client";

import { motion } from "framer-motion";
import { Calendar, CheckCircle, MessageSquare, Settings } from "lucide-react";
import { SectionShell } from "./section-shell";

const steps = [
  {
    icon: Settings,
    title: "Choose your service",
    description: "Select Mini Valet, Full Valet, or add extras",
  },
  {
    icon: Calendar,
    title: "Pick date & time",
    description: "Choose your preferred time window",
  },
  {
    icon: MessageSquare,
    title: "Send booking request",
    description: "Submit your details and location",
  },
  {
    icon: CheckCircle,
    title: "We come to you",
    description: "Professional service at your location",
  },
];

export function HowItWorksSection() {
  return (
    <SectionShell
      id="how-it-works"
      eyebrow="How It Works"
      title="Simple booking in 4 steps"
      description="Get your car sparkling clean with our straightforward mobile valeting process."
    >
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((step, index) => (
          <motion.article
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
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
      </div>
    </SectionShell>
  );
}
