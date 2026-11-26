-- L’Unanimithé — ménage automatique des historiques (pour que la base et les synchronisations ne grossissent pas sans fin)
-- À lancer une fois dans Supabase → SQL Editor. Relançable sans risque. Rien de ce que les membres possèdent n’est touché
-- (thés, sachets, dégustations, matériel, profils, salons, parties en cours…).
--   • fil d’actualité / journal (events) : on garde les 1 500 plus récents
--   • historique de modération (modlog)  : on garde les 500 plus récents
--   • éléments supprimés (corbeille interne) : effacés définitivement après 30 jours
--   • parties de Devine le thé terminées : effacées après 180 jours

create or replace function public.mdt_menage() returns jsonb
language plpgsql security definer set search_path = public as $$
declare n_ev int; n_ml int; n_del int; n_game int;
begin
  with old as (select kind, id from public.mdt_items where kind = 'event' and not deleted order by updated_at desc offset 1500)
  delete from public.mdt_items i using old where i.kind = old.kind and i.id = old.id; get diagnostics n_ev = row_count;
  with old as (select kind, id from public.mdt_items where kind = 'modlog' and not deleted order by updated_at desc offset 500)
  delete from public.mdt_items i using old where i.kind = old.kind and i.id = old.id; get diagnostics n_ml = row_count;
  delete from public.mdt_items where deleted and updated_at < now() - interval '30 days'; get diagnostics n_del = row_count;
  delete from public.mdt_items where kind = 'game' and coalesce(data->>'phase', '') = 'ended' and updated_at < now() - interval '180 days'; get diagnostics n_game = row_count;
  return jsonb_build_object('events', n_ev, 'modlog', n_ml, 'supprimes', n_del, 'parties', n_game);
end $$;
revoke all on function public.mdt_menage() from public, anon, authenticated;

-- tous les jours à 4 h 27 (UTC)
select cron.unschedule(jobid) from cron.job where jobname = 'mdt-menage';
select cron.schedule('mdt-menage', '27 4 * * *', $cron$ select public.mdt_menage(); $cron$);

-- Santé de la base (Admin) : affiche aussi la corbeille et l’état du ménage
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
    'items', (select count(*) from public.mdt_items where not deleted), 'deletedRows', (select count(*) from public.mdt_items where deleted), 'errors', (select count(*) from public.mdt_errors),
    'menage', (select exists (select 1 from pg_proc where proname = 'mdt_menage')));
  return r;
end $$;
grant execute on function public.mdt_db_stats() to authenticated;
notify pgrst, 'reload schema';

-- premier passage tout de suite (affiche ce qui a été effacé)
select public.mdt_menage();
