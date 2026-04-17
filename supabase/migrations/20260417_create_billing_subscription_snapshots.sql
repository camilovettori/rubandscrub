create table if not exists public.billing_subscription_snapshots (
  project_key text primary key,
  client_name text,
  product_name text,
  subscription_status text,
  billing_interval text,
  amount_cents integer,
  currency text,
  latest_payment_status text,
  latest_payment_paid_at timestamptz,
  current_period_end_at timestamptz,
  cancel_at_period_end boolean not null default false,
  snapshot_version text,
  synced_at timestamptz not null default now(),
  raw_payload jsonb
);

