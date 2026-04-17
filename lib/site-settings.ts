import { cache } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SiteSettings = {
  id: string;
  whatsapp_number: string;
  notification_email: string;
  review_path: string;
  updated_at: string;
};

export type SiteSettingsInput = {
  whatsapp_number: string;
  notification_email: string;
  review_path: string;
};

export const defaultSiteSettings: SiteSettings = {
  id: "",
  whatsapp_number: "353852243913",
  notification_email: "",
  review_path: "/leave-a-review",
  updated_at: "",
};

function normalizeWhatsAppNumber(value: string) {
  return value.replace(/[^\d]/g, "");
}

function normalizeReviewPath(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return defaultSiteSettings.review_path;
  }

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  const collapsed = withLeadingSlash.replace(/\/{2,}/g, "/");

  if (collapsed.length > 1 && collapsed.endsWith("/")) {
    return collapsed.slice(0, -1);
  }

  return collapsed;
}

function mapSettings(row: Partial<SiteSettings> | null | undefined): SiteSettings {
  return {
    id: row?.id ?? defaultSiteSettings.id,
    whatsapp_number: row?.whatsapp_number || defaultSiteSettings.whatsapp_number,
    notification_email: row?.notification_email || defaultSiteSettings.notification_email,
    review_path: row?.review_path || defaultSiteSettings.review_path,
    updated_at: row?.updated_at || defaultSiteSettings.updated_at,
  };
}

export const getSiteSettings = cache(async () => {
  try {
    noStore();
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("id,whatsapp_number,notification_email,review_path,updated_at")
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return defaultSiteSettings;
    }

    return mapSettings(data as SiteSettings);
  } catch {
    return defaultSiteSettings;
  }
});

export async function saveSiteSettings(input: SiteSettingsInput) {
  const supabase = createSupabaseServerClient();
  const payload = {
    whatsapp_number: normalizeWhatsAppNumber(input.whatsapp_number),
    notification_email: input.notification_email.trim(),
    review_path: normalizeReviewPath(input.review_path),
    updated_at: new Date().toISOString(),
  };

  const { data: existingSettings, error: readError } = await supabase
    .from("site_settings")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (readError) {
    throw readError;
  }

  const writeResult = existingSettings?.id
    ? await supabase
        .from("site_settings")
        .update(payload)
        .eq("id", existingSettings.id)
        .select("id,whatsapp_number,notification_email,review_path,updated_at")
        .single()
    : await supabase
        .from("site_settings")
        .insert(payload)
        .select("id,whatsapp_number,notification_email,review_path,updated_at")
        .single();

  if (writeResult.error || !writeResult.data) {
    throw writeResult.error ?? new Error("Unable to save site settings.");
  }

  return mapSettings(writeResult.data as SiteSettings);
}

export function getWhatsAppUrl(whatsappNumber: string) {
  const sanitized = normalizeWhatsAppNumber(whatsappNumber);

  return sanitized ? `https://wa.me/${sanitized}` : "https://wa.me/";
}

export function formatWhatsAppDisplay(whatsappNumber: string) {
  const sanitized = normalizeWhatsAppNumber(whatsappNumber);

  return sanitized ? `+${sanitized}` : "Not configured";
}

export function normalizeReviewAliasPath(path: string) {
  return normalizeReviewPath(path);
}

export function matchesReviewPath(requestPath: string[], configuredPath: string) {
  const normalizedConfigured = normalizeReviewPath(configuredPath);
  const configuredSegments = normalizedConfigured.split("/").filter(Boolean);

  return requestPath.join("/") === configuredSegments.join("/");
}
