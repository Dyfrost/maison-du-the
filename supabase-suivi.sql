-- L’Unanimithé — suivi pour l’admin : visites par jour + santé de la base
-- À lancer une fois dans Supabase → SQL Editor (tout coller, puis Run). Sans effet sur le reste du site.
-- Relançable sans risque.
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

-- ============================================================
-- Santé de la base (Admin → Accueil → « 🩺 Santé de la base »)
-- Taille, plus grosses tables, connexions, tâches planifiées, file des notifications.
-- Lecture seule, réservée aux admins.
-- ============================================================
create or replace function public.mdt_db_stats() returns jsonb
language plpgsql security definer set search_path = public as $$
declare r jsonb; t jsonb; c jsonb := 'null'; n jsonb := 'null'; hit numeric;
begin
  if not public.mdt_is_admin() then raise exception 'Réservé aux admins.'; end if;
  select coalesce(jsonb_agg(x order by (x->>'bytes')::bigint desc), '[]') into t from (
    select jsonb_build_object('name', n.nspname || '.' || c.relname, 'bytes', pg_total_relation_size(c.oid), 'rows', greatest(c.reltuples, 0)::bigint) x
    from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where c.relkind = 'r' and n.nspname not in ('pg_catalog', 'information_schema', 'pg_toast')
    order by pg_total_relation_size(c.oid) desc limit 12) s;
  select round(100 * sum(heap_blks_hit) / nullif(sum(heap_blks_hit) + sum(heap_blks_read), 0), 1) into hit from pg_statio_user_tables;
  begin
    execute $q$ select jsonb_build_object('runs', count(*), 'failed', count(*) filter (where status = 'failed'), 'last', max(end_time),
      'lastFail', (select return_message from cron.job_run_details where status = 'failed' order by end_time desc nulls last limit 1))
      from cron.job_run_details where start_time > now() - interval '24 hours' $q$ into c;
  exception when others then c := 'null'; end;
  begin
    execute $q$ select jsonb_build_object('responses', (select count(*) from net._http_response), 'queue', (select count(*) from net.http_request_queue),
      'errors1h', (select count(*) from net._http_response where created > now() - interval '1 hour' and (status_code is null or status_code >= 400))) $q$ into n;
  exception when others then n := 'null'; end;
  r := jsonb_build_object('at', now(), 'dbBytes', pg_database_size(current_database()), 'tables', t, 'cacheHit', hit,
    'connections', (select count(*) from pg_stat_activity where datname = current_database()),
    'activeQueries', (select count(*) from pg_stat_activity where datname = current_database() and state = 'active'),
    'cron', c, 'net', n,
    'items', (select count(*) from public.mdt_items), 'errors', (select count(*) from public.mdt_errors));
  return r;
end $$;
grant execute on function public.mdt_db_stats() to authenticated;

notify pgrst, 'reload schema';

-- Adresse du site utilisée dans les notifications (domaine lunanimithe.fr)
create or replace function public.mdt_site() returns text language sql immutable as $$
  select 'https://lunanimithe.fr/'
$$;
