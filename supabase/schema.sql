-- Run this in your Supabase SQL editor to set up the database

-- Enable UUID extension (already on by default in Supabase)
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────────
-- OWNERS
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.owners (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete cascade unique not null,
  name         text not null,
  contact      text,
  gcash_number text,
  gcash_name   text,
  property_name text not null,
  slug         text unique not null,
  created_at   timestamptz default now()
);

alter table public.owners enable row level security;

create policy "Owner can view own record"
  on public.owners for select
  using (auth.uid() = user_id);

create policy "Owner can update own record"
  on public.owners for update
  using (auth.uid() = user_id);

create policy "Owner can insert own record"
  on public.owners for insert
  with check (auth.uid() = user_id);

-- Allow public to look up owner by slug (for guest booking page)
create policy "Public can read owner by slug"
  on public.owners for select
  using (true);

-- ─────────────────────────────────────────────────────────────────
-- ROOMS
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.rooms (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid references public.owners(id) on delete cascade not null,
  name          text not null,
  capacity      int not null check (capacity > 0),
  weekday_rate  numeric not null check (weekday_rate >= 0),
  weekend_rate  numeric check (weekend_rate >= 0),
  description   text,
  is_active     boolean default true,
  created_at    timestamptz default now()
);

alter table public.rooms enable row level security;

create policy "Owner can manage own rooms"
  on public.rooms for all
  using (
    owner_id in (select id from public.owners where user_id = auth.uid())
  );

-- Public can read active rooms (for guest booking page)
create policy "Public can read active rooms"
  on public.rooms for select
  using (is_active = true);

-- ─────────────────────────────────────────────────────────────────
-- BLOCKED DATES  (manual blocks set by owner)
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.blocked_dates (
  id         uuid primary key default gen_random_uuid(),
  room_id    uuid references public.rooms(id) on delete cascade not null,
  date       date not null,
  created_at timestamptz default now(),
  unique(room_id, date)
);

alter table public.blocked_dates enable row level security;

create policy "Owner can manage blocked dates for own rooms"
  on public.blocked_dates for all
  using (
    room_id in (
      select r.id from public.rooms r
      join public.owners o on o.id = r.owner_id
      where o.user_id = auth.uid()
    )
  );

-- Public can read blocked dates (availability check)
create policy "Public can read blocked dates"
  on public.blocked_dates for select
  using (true);

-- ─────────────────────────────────────────────────────────────────
-- BOOKINGS
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.bookings (
  id                uuid primary key default gen_random_uuid(),
  room_id           uuid references public.rooms(id) on delete cascade not null,
  owner_id          uuid references public.owners(id) on delete cascade not null,
  guest_name        text not null,
  guest_contact     text not null,
  check_in          date not null,
  check_out         date not null,
  pax               int not null check (pax > 0),
  status            text default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  deposit_ref       text,
  deposit_proof_url text,
  total_amount      numeric,
  notes             text,
  created_at        timestamptz default now(),
  check (check_out > check_in)
);

alter table public.bookings enable row level security;

create policy "Owner can manage own bookings"
  on public.bookings for all
  using (
    owner_id in (select id from public.owners where user_id = auth.uid())
  );

-- Guests can insert bookings (no account needed)
create policy "Public can create bookings"
  on public.bookings for insert
  with check (true);

-- Guests can read their own booking by id (for confirmation page)
create policy "Public can read bookings"
  on public.bookings for select
  using (true);

-- Guests can upload deposit proof
create policy "Public can update deposit proof"
  on public.bookings for update
  using (status = 'pending')
  with check (true);

-- ─────────────────────────────────────────────────────────────────
-- STORAGE BUCKET for deposit proof images
-- ─────────────────────────────────────────────────────────────────
-- Run in Supabase Storage UI: create a bucket called "deposits" (public)
-- Or via SQL:
insert into storage.buckets (id, name, public)
values ('deposits', 'deposits', true)
on conflict do nothing;

create policy "Anyone can upload deposit proof"
  on storage.objects for insert
  with check (bucket_id = 'deposits');

create policy "Anyone can view deposit proof"
  on storage.objects for select
  using (bucket_id = 'deposits');
