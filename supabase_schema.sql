create extension if not exists pgcrypto;

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  title text not null,
  client_name text not null,
  client_email text not null,
  project_type text not null,
  status text not null default 'generated' check (status in ('generated', 'signed')),
  contract_text text not null,
  safety_score integer not null default 0,
  warnings jsonb not null default '[]'::jsonb,
  suggested_clauses jsonb not null default '[]'::jsonb,
  form_data jsonb not null,
  freelancer_signature text,
  client_signature text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists contracts_set_updated_at on public.contracts;
create trigger contracts_set_updated_at
before update on public.contracts
for each row execute procedure public.set_updated_at();

alter table public.contracts enable row level security;

drop policy if exists "Users can view own contracts" on public.contracts;
create policy "Users can view own contracts"
on public.contracts
for select
using (auth.uid() = owner_id);

drop policy if exists "Users can insert own contracts" on public.contracts;
create policy "Users can insert own contracts"
on public.contracts
for insert
with check (auth.uid() = owner_id);

drop policy if exists "Users can update own contracts" on public.contracts;
create policy "Users can update own contracts"
on public.contracts
for update
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);
