create table if not exists public.support_requests (
  id uuid primary key default gen_random_uuid(),
  project_key text not null default 'rubandscrub',
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists support_requests_project_key_created_at_idx
  on public.support_requests (project_key, created_at desc);
