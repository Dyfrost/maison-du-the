-- Maison du Thé : réduction des accès disque (Disk IO budget)
-- À exécuter une fois dans Supabase > SQL Editor. Sans danger à relancer.

-- 1) Envois programmés toutes les 5 minutes au lieu de chaque minute
--    (les notifications immédiates partent toujours tout de suite grâce au déclencheur mdt_notif_kick)
select cron.unschedule(jobid) from cron.job where jobname = 'mdt-push';
select cron.schedule('mdt-push', '*/5 * * * *', $cron$
  select net.http_post(url := 'https://hnyomaobuftunuhwkzox.supabase.co/functions/v1/bright-endpoint',
                       headers := '{"Content-Type": "application/json"}'::jsonb, body := '{}'::jsonb);
$cron$);

-- 2) Rappels (thé du jour, Tea pets, Wrapped) calculés une seule fois par heure au lieu de 60
create or replace function public.mdt_notif_run() returns table (id bigint, endpoint text, p256dh text, auth text, title text, body text, url text)
language plpgsql security definer set search_path = public as $$
begin
  if extract(minute from now())::int < 5 then
    perform public.mdt_notif_due();
    delete from public.mdt_notif where created_at < now() - interval '30 days';
  end if;
  return query
    with taken as (
      update public.mdt_notif q set sent_at = now()
       where q.sent_at is null and q.created_at > now() - interval '1 day'
      returning q.*
    )
    select t.id, s.endpoint, s.p256dh, s.auth, t.title, t.body, t.url from taken t join public.mdt_push s on s.nom = t.nom;
end $$;

-- 3) Index pour les recherches fréquentes (sachets d'un membre, dégustations d'un sachet, Tea pets)
create index if not exists mdt_items_kind_owner on public.mdt_items (kind, owner) where not deleted;
create index if not exists mdt_items_log_lot on public.mdt_items ((data->>'lotId')) where kind = 'log' and not deleted;

-- 4) Ménage de l'historique de pg_cron (une ligne écrite à chaque exécution) + tâche quotidienne
delete from cron.job_run_details where end_time < now() - interval '1 day';
select cron.unschedule(jobid) from cron.job where jobname = 'mdt-cleanup';
select cron.schedule('mdt-cleanup', '17 4 * * *', $cron$
  delete from cron.job_run_details where end_time < now() - interval '1 day';
$cron$);

-- 5) Statistiques à jour pour le planificateur
analyze public.mdt_items;
