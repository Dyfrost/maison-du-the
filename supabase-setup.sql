-- À coller une seule fois dans Supabase → SQL Editor → Run
create table if not exists public.the_data (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.the_data enable row level security;

-- Accès explicite (nécessaire si « Automatically expose new tables » est décoché)
revoke all on public.the_data from anon;
grant select, insert, update on public.the_data to authenticated;

drop policy if exists "membres lisent" on public.the_data;
drop policy if exists "membres ajoutent" on public.the_data;
drop policy if exists "membres modifient" on public.the_data;

create policy "membres lisent"    on public.the_data for select to authenticated using (true);
create policy "membres ajoutent"  on public.the_data for insert to authenticated with check (true);
create policy "membres modifient" on public.the_data for update to authenticated using (true) with check (true);

insert into public.the_data (id, payload) values ('maison', '{}'::jsonb) on conflict (id) do nothing;

-- Visiteurs sans compte : lecture seule de la collection
grant select on public.the_data to anon;
drop policy if exists "visiteurs lisent" on public.the_data;
create policy "visiteurs lisent" on public.the_data for select to anon using (true);
