-- L’Unanimithé — compteur de visites (graphe « connectés par jour » de l’admin)
-- À lancer une fois dans Supabase → SQL Editor. Sans effet sur le reste du site.
-- Une ligne par membre et par jour (heure de Paris) : très léger.

create table if not exists public.mdt_visits (
  day date not null,
  nom text not null,
  primary key (day, nom)
);
alter table public.mdt_visits enable row level security;
revoke all on public.mdt_visits from anon, authenticated;

-- Appelée par le site à chaque ouverture (membre connecté)
create or replace function public.mdt_visit() returns void
language plpgsql security definer set search_path = public as $$
declare n text;
begin
  select nom into n from public.maison_members where user_id = auth.uid();
  if n is null then return; end if;
  insert into public.mdt_visits (day, nom) values ((now() at time zone 'Europe/Paris')::date, n)
  on conflict do nothing;
end $$;
grant execute on function public.mdt_visit() to authenticated;

-- Statistiques pour l’admin : nombre de membres venus par jour
create or replace function public.mdt_visits_stats(days int default 90)
returns table (day date, n int, noms text[])
language sql stable security definer set search_path = public as $$
  select v.day, count(*)::int, array_agg(v.nom order by v.nom)
  from public.mdt_visits v
  where public.mdt_is_admin() and v.day > (now() at time zone 'Europe/Paris')::date - least(greatest(days, 1), 400)
  group by v.day order by v.day
$$;
grant execute on function public.mdt_visits_stats(int) to authenticated;

-- Point de départ : la dernière venue connue de chaque membre
insert into public.mdt_visits (day, nom)
select (last_seen at time zone 'Europe/Paris')::date, nom from public.maison_members where last_seen is not null
on conflict do nothing;

-- Ménage : on garde un peu plus d’un an
delete from public.mdt_visits where day < current_date - 400;

notify pgrst, 'reload schema';
