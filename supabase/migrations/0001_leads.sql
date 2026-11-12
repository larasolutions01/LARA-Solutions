-- LARA Solutions — lead storage
-- Run in the Supabase SQL editor or via `supabase db push`.
-- Access model: Row Level Security is enabled with NO public policies, so the
-- table is unreachable with the anon/publishable key. The website server
-- writes with the service-role key (server-side only). Team members read
-- leads through the Supabase dashboard (admin-only).

create table if not exists public.leads (
  id uuid primary key,
  created_at timestamptz not null default now(),
  type text not null check (type in ('contact', 'roadmap', 'assistant', 'newsletter')),
  name text,
  email text not null,
  company text,
  phone text,
  country text,
  industry text,
  service text,
  budget text,
  message text,
  details jsonb,
  consent boolean not null default false,
  source_ip text,
  user_agent text,
  referer text,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed', 'spam'))
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_type_idx on public.leads (type);
create index if not exists leads_email_idx on public.leads (lower(email));

alter table public.leads enable row level security;

-- Intentionally no policies: only the service role (which bypasses RLS) can read/write.
revoke all on public.leads from anon, authenticated;
