import { unstable_noStore as noStore } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type BillingSubscriptionSnapshotRow = {
  project_key: string;
  client_name: string | null;
  product_name: string | null;
  subscription_status: string | null;
  billing_interval: string | null;
  amount_cents: number | null;
  currency: string | null;
  latest_payment_status: string | null;
  latest_payment_paid_at: string | null;
  current_period_end_at: string | null;
  cancel_at_period_end: boolean;
  snapshot_version: string | null;
  synced_at: string;
  raw_payload: Record<string, unknown> | null;
};

type BillingSnapshotConfig = {
  apiUrl: string;
  projectKey: string;
  apiToken: string;
};

function getBillingSnapshotConfig(): BillingSnapshotConfig {
  const apiUrl = process.env.ZIFFERA_BILLING_API_URL?.trim();
  const projectKey = process.env.ZIFFERA_BILLING_PROJECT_KEY?.trim();
  const apiToken = process.env.ZIFFERA_BILLING_API_TOKEN?.trim();

  if (!apiUrl) {
    throw new Error("Missing required environment variable: ZIFFERA_BILLING_API_URL");
  }

  if (!projectKey) {
    throw new Error("Missing required environment variable: ZIFFERA_BILLING_PROJECT_KEY");
  }

  if (!apiToken) {
    throw new Error("Missing required environment variable: ZIFFERA_BILLING_API_TOKEN");
  }

  return { apiUrl, projectKey, apiToken };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unwrapSnapshotPayload(payload: unknown) {
  if (!isRecord(payload)) {
    return null;
  }

  if (isRecord(payload.snapshot)) {
    return payload.snapshot;
  }

  if (isRecord(payload.data)) {
    return payload.data;
  }

  return payload;
}

function pickString(source: Record<string, unknown> | null, keys: string[]) {
  if (!source) {
    return null;
  }

  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }

  return null;
}

function pickNumber(source: Record<string, unknown> | null, keys: string[]) {
  if (!source) {
    return null;
  }

  for (const key of keys) {
    const value = source[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return Math.trunc(value);
    }
    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return Math.trunc(parsed);
      }
    }
  }

  return null;
}

function pickBoolean(source: Record<string, unknown> | null, keys: string[]) {
  if (!source) {
    return null;
  }

  for (const key of keys) {
    const value = source[key];
    if (typeof value === "boolean") {
      return value;
    }
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (normalized === "true") {
        return true;
      }
      if (normalized === "false") {
        return false;
      }
    }
  }

  return null;
}

function pickDate(source: Record<string, unknown> | null, keys: string[]) {
  const value = pickString(source, keys);

  return value || null;
}

function normalizeRawPayload(payload: unknown) {
  return isRecord(payload) ? (payload as Record<string, unknown>) : null;
}

function mapBillingSnapshotRow(
  payload: unknown,
  projectKey: string
): BillingSubscriptionSnapshotRow {
  const rawPayload = normalizeRawPayload(payload);
  const snapshot = unwrapSnapshotPayload(payload);
  const record = isRecord(snapshot) ? snapshot : null;
  const subscription = isRecord(record?.subscription) ? record.subscription : null;
  const latestPayment = isRecord(record?.latest_payment) ? record.latest_payment : null;
  const billingAmount =
    pickNumber(record, ["amount_cents", "amount"]) ??
    pickNumber(subscription, ["amount_cents", "amount"]) ??
    pickNumber(record, ["price_amount_cents", "price_amount"]) ??
    pickNumber(subscription, ["price_amount_cents", "price_amount"]);

  return {
    project_key: projectKey,
    client_name:
      pickString(record, ["client_name", "customer_name", "account_name", "company_name"]) ??
      pickString(subscription, ["client_name", "customer_name", "account_name", "company_name"]),
    product_name:
      pickString(record, ["product_name", "plan_name", "subscription_name"]) ??
      pickString(subscription, ["product_name", "plan_name", "subscription_name"]),
    subscription_status:
      pickString(record, ["subscription_status", "status"]) ??
      pickString(subscription, ["subscription_status", "status"]),
    billing_interval:
      pickString(record, ["billing_interval", "interval"]) ??
      pickString(subscription, ["billing_interval", "interval"]),
    amount_cents: billingAmount,
    currency:
      pickString(record, ["currency", "price_currency"]) ??
      pickString(subscription, ["currency", "price_currency"]),
    latest_payment_status:
      pickString(record, ["latest_payment_status", "payment_status"]) ??
      pickString(latestPayment, ["status", "payment_status"]),
    latest_payment_paid_at:
      pickDate(record, ["latest_payment_paid_at", "paid_at", "last_payment_paid_at"]) ??
      pickDate(latestPayment, ["paid_at", "created_at", "updated_at"]),
    current_period_end_at:
      pickDate(record, ["current_period_end_at", "period_end_at", "renewal_at", "next_renewal_at"]) ??
      pickDate(subscription, ["current_period_end_at", "period_end_at", "renewal_at", "next_renewal_at"]),
    cancel_at_period_end:
      pickBoolean(record, ["cancel_at_period_end"]) ??
      pickBoolean(subscription, ["cancel_at_period_end"]) ??
      false,
    snapshot_version:
      pickString(record, ["snapshot_version", "version"]) ??
      pickString(subscription, ["snapshot_version", "version"]),
    synced_at: new Date().toISOString(),
    raw_payload: rawPayload,
  };
}

export async function syncBillingSubscriptionSnapshot() {
  noStore();
  const { apiUrl, projectKey, apiToken } = getBillingSnapshotConfig();
  const snapshotUrl = new URL(`/api/internal/billing/snapshots/${projectKey}`, apiUrl);
  const response = await fetch(snapshotUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Unable to load billing snapshot from Ziffera (${response.status}).`);
  }

  const payload = (await response.json()) as unknown;
  const snapshotRow = mapBillingSnapshotRow(payload, projectKey);
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("billing_subscription_snapshots")
    .upsert(snapshotRow, { onConflict: "project_key" })
    .select(
      "project_key,client_name,product_name,subscription_status,billing_interval,amount_cents,currency,latest_payment_status,latest_payment_paid_at,current_period_end_at,cancel_at_period_end,snapshot_version,synced_at,raw_payload"
    )
    .single();

  if (error || !data) {
    throw error ?? new Error("Unable to upsert the billing snapshot mirror.");
  }

  return data as BillingSubscriptionSnapshotRow;
}

export async function getBillingSubscriptionSnapshot(projectKey?: string) {
  noStore();
  const resolvedProjectKey = projectKey?.trim() || getBillingSnapshotConfig().projectKey;
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("billing_subscription_snapshots")
    .select(
      "project_key,client_name,product_name,subscription_status,billing_interval,amount_cents,currency,latest_payment_status,latest_payment_paid_at,current_period_end_at,cancel_at_period_end,snapshot_version,synced_at,raw_payload"
    )
    .eq("project_key", resolvedProjectKey)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as BillingSubscriptionSnapshotRow | null) ?? null;
}

