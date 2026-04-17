"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { fadeInUp, staggerContainer, sectionViewport } from "./motion-presets";
import type { ReviewCard } from "@/lib/reviews";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
}

export function ReviewsCards({ reviews }: { reviews: ReviewCard[] }) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-600 shadow-lg">
        No approved reviews yet. Check back soon.
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
      className="grid gap-6 md:grid-cols-3"
    >
      {reviews.map((review) => (
        <motion.article
          key={review.id}
          variants={fadeInUp}
          whileHover={{ y: -3 }}
          transition={{ duration: 0.45 }}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
        >
          <div className="mb-4">
            <StarRating rating={review.rating} />
          </div>
          <blockquote className="mb-4 text-gray-700">&ldquo;{review.reviewText}&rdquo;</blockquote>
          <div className="text-sm">
            <div className="font-semibold text-gray-900">{review.name}</div>
            <div className="text-gray-600">{review.areaLocation}</div>
          </div>
        </motion.article>
      ))}
    </motion.div>
  );
}
