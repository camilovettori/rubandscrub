"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { SectionShell } from "./section-shell";

const testimonials = [
  {
    name: "Sarah Murphy",
    location: "Dublin 4",
    rating: 5,
    text: "Amazing service! The team arrived on time and left my car looking brand new. Will definitely book again.",
  },
  {
    name: "John Kelly",
    location: "Dublin 15",
    rating: 5,
    text: "Convenient mobile service that fits my busy schedule. Professional work and great value for money.",
  },
  {
    name: "Emma Byrne",
    location: "Dublin 6",
    rating: 5,
    text: "Outstanding attention to detail. My car has never looked this good. Highly recommend!",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
}

export function ReviewsSection() {
  return (
    <SectionShell
      id="reviews"
      eyebrow="Reviews"
      title="What our customers say"
      description="Don't just take our word for it - hear from Dublin drivers who've experienced our service."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <motion.article
            key={testimonial.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
          >
            <div className="mb-4">
              <StarRating rating={testimonial.rating} />
            </div>
            <blockquote className="mb-4 text-gray-700">&ldquo;{testimonial.text}&rdquo;</blockquote>
            <div className="text-sm">
              <div className="font-semibold text-gray-900">{testimonial.name}</div>
              <div className="text-gray-600">{testimonial.location}</div>
            </div>
          </motion.article>
        ))}
      </div>
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-600">
          Join hundreds of satisfied Dublin drivers who trust us with their vehicles.
        </p>
      </div>
    </SectionShell>
  );
}