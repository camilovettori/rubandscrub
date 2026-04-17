create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  area_location text not null,
  rating integer not null check (rating between 1 and 5),
  review_text text not null,
  consent boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

insert into public.reviews (name, area_location, rating, review_text, consent, status)
values
  (
    'Sarah Murphy',
    'Dublin 4',
    5,
    'Amazing service. The team arrived on time and left my car looking brand new. I will definitely book again.',
    true,
    'approved'
  ),
  (
    'John Kelly',
    'Dublin 15',
    5,
    'Convenient mobile service that fits my busy schedule. Professional work and great value for money.',
    true,
    'approved'
  ),
  (
    'Emma Byrne',
    'Dublin 6',
    5,
    'Outstanding attention to detail. My car has never looked this good. Highly recommend.',
    true,
    'approved'
  )
on conflict do nothing;
