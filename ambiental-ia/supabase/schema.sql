-- Ambiental IA - Etapa 1
-- Schema inicial para Supabase.
-- Execute este arquivo no SQL Editor do Supabase.

create extension if not exists pgcrypto;

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price_cents integer not null default 0 check (price_cents >= 0),
  document_limit integer check (document_limit is null or document_limit >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  plan_id uuid references public.plans(id) on delete set null,
  full_name text,
  email text not null unique,
  company_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.document_templates (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references public.profiles(id) on delete set null,
  plan_id uuid references public.plans(id) on delete set null,
  document_type text not null,
  name text not null,
  description text,
  status text not null default 'draft' check (status in ('draft', 'active', 'inactive')),
  sections jsonb not null default '[]'::jsonb,
  required_fields jsonb not null default '[]'::jsonb,
  base_text text,
  version text not null default '1.0',
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  template_id uuid references public.document_templates(id) on delete set null,
  title text not null,
  document_type text not null,
  status text not null default 'draft' check (status in ('draft', 'generated', 'archived')),
  form_data jsonb not null default '{}'::jsonb,
  docx_url text,
  pdf_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  plan_id uuid not null references public.plans(id) on delete restrict,
  status text not null default 'inactive' check (status in ('inactive', 'active', 'canceled', 'past_due')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists profiles_plan_id_idx on public.profiles(plan_id);
create index if not exists document_templates_document_type_idx on public.document_templates(document_type);
create index if not exists documents_profile_id_idx on public.documents(profile_id);
create index if not exists documents_template_id_idx on public.documents(template_id);
create index if not exists subscriptions_profile_id_idx on public.subscriptions(profile_id);
create index if not exists subscriptions_plan_id_idx on public.subscriptions(plan_id);
