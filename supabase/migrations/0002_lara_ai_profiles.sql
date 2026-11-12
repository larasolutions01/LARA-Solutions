-- LARA AI — member profiles (free sign-up for the AI tools)
-- Run in the Supabase SQL editor (after 0001_leads.sql) or via `supabase db push`.
--
-- Accounts themselves live in Supabase Auth (auth.users). This table holds the
-- extra sign-up details. Access model: Row Level Security lets each signed-in
-- member read, create and update ONLY their own row (the website server calls
-- PostgREST with the member's own access token). Nobody else can read it with
-- the publishable key. Team members see all rows in the Supabase dashboard.
-- Deleting the auth user deletes the profile (on delete cascade).

create table if not exists public.lara_ai_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null check (char_length(full_name) between 2 and 100),
  business_name text check (business_name is null or char_length(business_name) <= 120),
  phone text check (phone is null or char_length(phone) <= 24),
  newsletter boolean not null default false,
  signup_method text not null default 'email' check (signup_method in ('email', 'google')),
  terms_accepted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lara_ai_profiles_created_at_idx on public.lara_ai_profiles (created_at desc);

alter table public.lara_ai_profiles enable row level security;

drop policy if exists "Members read own LARA AI profile" on public.lara_ai_profiles;
create policy "Members read own LARA AI profile" on public.lara_ai_profiles
  for select to authenticated using ((select auth.uid()) = id);

drop policy if exists "Members create own LARA AI profile" on public.lara_ai_profiles;
create policy "Members create own LARA AI profile" on public.lara_ai_profiles
  for insert to authenticated with check ((select auth.uid()) = id);

drop policy if exists "Members update own LARA AI profile" on public.lara_ai_profiles;
create policy "Members update own LARA AI profile" on public.lara_ai_profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

revoke all on public.lara_ai_profiles from anon;
grant select, insert, update on public.lara_ai_profiles to authenticated;

-- Sign-ups are also sent through the lead pipeline as type 'lara_ai_signup'.
alter table if exists public.leads drop constraint if exists leads_type_check;
alter table if exists public.leads
  add constraint leads_type_check check (type in ('contact', 'roadmap', 'assistant', 'newsletter', 'lara_ai_signup'));
