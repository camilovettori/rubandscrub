"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { SUPPORT_REQUEST_MONTHLY_LIMIT } from "@/lib/support-requests";

type SupportCardProps = {
  initialUsage: number;
};

export function SupportCard({ initialUsage }: SupportCardProps) {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [monthlyUsed, setMonthlyUsed] = useState(initialUsage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const limitReached = monthlyUsed >= SUPPORT_REQUEST_MONTHLY_LIMIT;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (limitReached || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/admin/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          message,
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
        usage?: {
          usedThisMonth: number;
          limit: number;
        };
      };

      if (!response.ok) {
        if (response.status === 429 && payload.usage) {
          setMonthlyUsed(payload.usage.usedThisMonth);
        }

        throw new Error(
          payload.error ||
            "Unable to send the support request right now. Please try again."
        );
      }

      if (payload.usage) {
        setMonthlyUsed(payload.usage.usedThisMonth);
      } else {
        setMonthlyUsed((current) => current + 1);
      }

      setSubject("");
      setMessage("");
      setSuccessMessage("Support request sent.");
      router.refresh();
    } catch (submissionError) {
      setErrorMessage(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to send the support request right now. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
            Support
          </p>
          <h3 className="text-lg font-semibold tracking-tight text-slate-950">
            Request help from the site team
          </h3>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            Use this for quick admin help under the monthly plan. Each request is emailed directly to the support inbox.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
          {monthlyUsed} / {SUPPORT_REQUEST_MONTHLY_LIMIT} used this month
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-sky-500 transition-all duration-300"
          style={{
            width: `${Math.min(100, (monthlyUsed / SUPPORT_REQUEST_MONTHLY_LIMIT) * 100)}%`,
          }}
        />
      </div>

      {limitReached ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
          Your monthly support request limit has been reached. For urgent issues, contact hello@ziffera.ie or WhatsApp 0830483222.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Subject
            <input
              type="text"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Brief summary of the issue"
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Message
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="mt-2 min-h-[140px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Describe what you need help with"
              required
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-slate-500">
              Keep it concise and actionable. Urgent issues are still supported by email or WhatsApp.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_35px_-18px_rgba(37,99,235,0.8)] transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_18px_45px_-18px_rgba(37,99,235,0.95)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send request"}
            </button>
          </div>
        </form>
      )}

      {successMessage ? <p className="mt-4 text-sm font-medium text-emerald-700">{successMessage}</p> : null}
      {errorMessage ? <p className="mt-4 text-sm font-medium text-rose-600">{errorMessage}</p> : null}
    </div>
  );
}
