"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";

const ratingOptions = [5, 4, 3, 2, 1];

function fieldClassName() {
  return "mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
}

export function LeaveReviewForm() {
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: String(formData.get("name") ?? "").trim(),
          areaLocation: String(formData.get("areaLocation") ?? "").trim(),
          rating,
          reviewText: String(formData.get("reviewText") ?? "").trim(),
        }),
      });

      const payload = (await response.json()) as { error?: string; reviewLink?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to submit your review.");
      }

      setSuccess(true);
      event.currentTarget.reset();
      setRating(5);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to submit your review right now."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Review received</p>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Thank you for your review</h2>
          <p className="text-sm leading-6 text-gray-600">
            Your feedback helps us improve our service.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Back to home
            </Link>
            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="inline-flex items-center justify-center rounded-2xl border border-gray-300 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Submit another review
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
      <div className="grid gap-6">
        <label className="block text-sm font-medium text-gray-700">
          Name
          <input className={fieldClassName()} name="name" type="text" required />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Area / Location
          <input className={fieldClassName()} name="areaLocation" type="text" required />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Rating
          <select
            className={fieldClassName()}
            name="rating"
            value={rating}
            onChange={(event) => setRating(Number(event.target.value))}
            required
          >
            {ratingOptions.map((value) => (
              <option key={value} value={value}>
                {value} stars
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Review
          <textarea
            className={fieldClassName()}
            name="reviewText"
            rows={6}
            placeholder="Tell others about your experience"
            required
          />
        </label>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <div className="mt-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 text-yellow-400" aria-hidden="true">
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={index}
              className={index < rating ? "h-4 w-4 fill-yellow-400 text-yellow-400" : "h-4 w-4 text-gray-300"}
            />
          ))}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </form>
  );
}
