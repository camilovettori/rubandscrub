"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteSettings } from "@/lib/site-settings";

function fieldClassName() {
  return "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
}

export function SiteSettingsForm({ initialSettings }: { initialSettings: SiteSettings }) {
  const router = useRouter();
  const [whatsappNumber, setWhatsappNumber] = useState(initialSettings.whatsapp_number);
  const [notificationEmail, setNotificationEmail] = useState(initialSettings.notification_email);
  const [isSaving, setIsSaving] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function getReviewUrl() {
    if (typeof window === "undefined") {
      return `https://rubandscrub.ie${initialSettings.review_path}`;
    }

    return new URL(initialSettings.review_path, window.location.origin).toString();
  }

  async function copyReviewLink() {
    try {
      setIsCopying(true);
      setCopyMessage(null);
      await navigator.clipboard.writeText(getReviewUrl());
      setCopyMessage("Review link copied.");
      window.setTimeout(() => setCopyMessage(null), 2000);
    } catch {
      setCopyMessage("Unable to copy the review link.");
    } finally {
      setIsCopying(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/admin/site-settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          whatsapp_number: whatsappNumber,
          notification_email: notificationEmail,
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
        settings?: SiteSettings;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to save settings.");
      }

      if (payload.settings) {
        setWhatsappNumber(payload.settings.whatsapp_number);
        setNotificationEmail(payload.settings.notification_email);
      }

      setMessage("Settings saved.");
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to save settings."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          WhatsApp number
          <input
            className={fieldClassName()}
            type="text"
            value={whatsappNumber}
            onChange={(event) => setWhatsappNumber(event.target.value)}
            placeholder="353852243913"
            required
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Notification email
          <input
            className={fieldClassName()}
            type="email"
            value={notificationEmail}
            onChange={(event) => setNotificationEmail(event.target.value)}
            placeholder="admin@example.com"
          />
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-slate-500">
          The review link is managed internally and can be copied without exposing the path.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={copyReviewLink}
            disabled={isCopying}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCopying ? "Copying..." : "Copy review link"}
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save settings"}
          </button>
        </div>
      </div>

      {copyMessage ? <p className="text-sm font-medium text-slate-600">{copyMessage}</p> : null}
      {message ? (
        <p className="text-sm font-medium text-emerald-700">{message}</p>
      ) : null}

      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
    </form>
  );
}
