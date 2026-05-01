-- =====================================================================
-- Bluefields MVP — schema inicial
-- =====================================================================
-- Cria tabelas profiles, startups, updates + view startup_overview
-- Habilita Row Level Security em todas as tabelas
-- Idempotente: pode ser rodada novamente em ambiente vazio
-- =====================================================================

-- ---------- profiles -------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Profiles: leitura por autenticados" on public.profiles;
create policy "Profiles: leitura por autenticados"
  on public.profiles for select
  to authenticated
  using (true);

drop policy if exists "Profiles: usuário edita o próprio" on public.profiles;
create policy "Profiles: usuário edita o próprio"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Trigger: quando um novo auth.user é criado, materializa um profile.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- startups -------------------------------------------------
create table if not exists public.startups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  segment text not null,
  phase text not null check (phase in ('ideation', 'mvp', 'traction', 'scale')),
  responsible_id uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists startups_responsible_idx on public.startups (responsible_id);

alter table public.startups enable row level security;

drop policy if exists "Startups: leitura por autenticados" on public.startups;
create policy "Startups: leitura por autenticados"
  on public.startups for select
  to authenticated
  using (true);

drop policy if exists "Startups: insert por autenticados" on public.startups;
create policy "Startups: insert por autenticados"
  on public.startups for insert
  to authenticated
  with check (true);

drop policy if exists "Startups: update por autenticados" on public.startups;
create policy "Startups: update por autenticados"
  on public.startups for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Startups: delete por autenticados" on public.startups;
create policy "Startups: delete por autenticados"
  on public.startups for delete
  to authenticated
  using (true);

-- Trigger para manter updated_at
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists startups_touch_updated_at on public.startups;
create trigger startups_touch_updated_at
  before update on public.startups
  for each row execute function public.touch_updated_at();

-- ---------- updates --------------------------------------------------
create table if not exists public.updates (
  id uuid primary key default gen_random_uuid(),
  startup_id uuid not null references public.startups(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete restrict,
  update_date date not null default current_date,
  what_happened text not null,
  blockers text not null default '',
  next_steps text not null default '',
  risk_at_update text not null check (risk_at_update in ('green', 'yellow', 'red')),
  created_at timestamptz not null default now()
);

create index if not exists updates_startup_idx on public.updates (startup_id, update_date desc, created_at desc);
create index if not exists updates_author_idx on public.updates (author_id);

alter table public.updates enable row level security;

drop policy if exists "Updates: leitura por autenticados" on public.updates;
create policy "Updates: leitura por autenticados"
  on public.updates for select
  to authenticated
  using (true);

drop policy if exists "Updates: autor cria" on public.updates;
create policy "Updates: autor cria"
  on public.updates for insert
  to authenticated
  with check (author_id = auth.uid());

drop policy if exists "Updates: autor edita" on public.updates;
create policy "Updates: autor edita"
  on public.updates for update
  to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

drop policy if exists "Updates: autor exclui" on public.updates;
create policy "Updates: autor exclui"
  on public.updates for delete
  to authenticated
  using (author_id = auth.uid());

-- ---------- view: startup_overview ----------------------------------
-- Risco da startup = risco do último update (single source of truth)
create or replace view public.startup_overview
with (security_invoker = true) as
select
  s.id,
  s.name,
  s.segment,
  s.phase,
  s.responsible_id,
  p.full_name as responsible_name,
  s.created_at,
  s.updated_at,
  latest.risk_at_update as current_risk,
  latest.update_date    as last_update_date,
  latest.id             as last_update_id
from public.startups s
left join public.profiles p on p.id = s.responsible_id
left join lateral (
  select u.id, u.risk_at_update, u.update_date
  from public.updates u
  where u.startup_id = s.id
  order by u.update_date desc, u.created_at desc
  limit 1
) latest on true;

grant select on public.startup_overview to authenticated;
