create table if not exists public.site_settings (
  id smallint primary key check (id = 1),
  whatsapp_number text not null,
  notification_email text not null default '',
  review_path text not null default '/leave-a-review',
  updated_at timestamptz not null default now()
);

insert into public.site_settings (
  id,
  whatsapp_number,
  notification_email,
  review_path,
  updated_at
)
values (
  1,
  '353852243913',
  '',
  '/leave-a-review',
  now()
)
on conflict (id) do update set
  whatsapp_number = excluded.whatsapp_number,
  notification_email = excluded.notification_email,
  review_path = excluded.review_path,
  updated_at = now();
