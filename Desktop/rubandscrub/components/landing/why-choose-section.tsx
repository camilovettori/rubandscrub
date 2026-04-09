"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, Shield, Star, Truck, Users } from "lucide-react";
import { SectionShell } from "./section-shell";

const reasons = [
  {
    icon: Truck,
    title: "Mobile Convenience",
    description: "We come directly to your home or workplace - no need to drive anywhere",
  },
  {
    icon: Star,
    title: "Premium Finish",
    description: "Professional detailing that makes your car look and feel brand new",
  },
  {
    icon: Clock,
    title: "Reliable Service",
    description: "Punctual, trustworthy service you can depend on every time",
  },
  {
    icon: MapPin,
    title: "Dublin Coverage",
    description: "Comprehensive service across all Dublin areas and surrounding regions",
  },
  {
    icon: Shield,
    title: "Insured & Professional",
    description: "Fully insured service with experienced, vetted detailers",
  },
  {
    icon: Users,
    title: "Local Business",
    description: "Dublin-based company committed to serving our local community",
  },
];

export function WhyChooseSection() {
  return (
    <SectionShell
      id="why-choose-us"
      eyebrow="Why Choose Us"
      title="Why Dublin drivers trust us"
      description="Experience the convenience of premium mobile car valeting with our professional, reliable service."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map((reason, index) => (
          <motion.article
            key={reason.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition hover:shadow-xl"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <reason.icon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">{reason.title}</h3>
            <p className="text-sm leading-6 text-gray-600">{reason.description}</p>
          </motion.article>
        ))}
      </div>
    </SectionShell>
  );
}
