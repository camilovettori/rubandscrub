import { unstable_noStore as noStore } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const SUPPORT_REQUEST_PROJECT_KEY = "rubandscrub";
export const SUPPORT_REQUEST_MONTHLY_LIMIT = 2;
export const SUPPORT_REQUEST_EMAIL = "hello@ziffera.ie";

export type SupportRequestRow = {
  id: string;
  project_key: string;
  subject: string;
  message: string;
  created_at: string;
};

export type SupportRequestInput = {
  subject: string;
  message: string;
};

export type SupportRequestUsage = {
  usedThisMonth: number;
  limit: number;
};

function getUtcMonthBounds(referenceDate = new Date()) {
  const start = new Date(
    Date.UTC(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth(), 1)
  );
  const end = new Date(
    Date.UTC(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth() + 1, 1)
  );

  return {
    monthStart: start.toISOString(),
    nextMonthStart: end.toISOString(),
  };
}

export async function getMonthlySupportRequestUsage(
  projectKey = SUPPORT_REQUEST_PROJECT_KEY
): Promise<SupportRequestUsage> {
  noStore();
  const supabase = createSupabaseServerClient();
  const { monthStart, nextMonthStart } = getUtcMonthBounds();

  const { count, error } = await supabase
    .from("support_requests")
    .select("id", { count: "exact", head: true })
    .eq("project_key", projectKey)
    .gte("created_at", monthStart)
    .lt("created_at", nextMonthStart);

  if (error) {
    throw error;
  }

  return {
    usedThisMonth: count ?? 0,
    limit: SUPPORT_REQUEST_MONTHLY_LIMIT,
  };
}

export async function createSupportRequest(input: SupportRequestInput, projectKey = SUPPORT_REQUEST_PROJECT_KEY) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("support_requests")
    .insert({
      project_key: projectKey,
      subject: input.subject,
      message: input.message,
    })
    .select("id,project_key,subject,message,created_at")
    .single();

  if (error || !data) {
    throw error ?? new Error("Unable to save the support request.");
  }

  return data as SupportRequestRow;
}
