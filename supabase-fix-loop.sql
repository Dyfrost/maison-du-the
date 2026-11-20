-- Maison du Thé : correctif de la boucle d'envoi des notifications
-- Cause : le déclencheur « envoi immédiat » se lançait à chaque tentative d'ajout, même quand la
-- notification existait déjà (doublon ignoré). La fonction d'envoi recalculait alors les rappels,
-- retentait l'ajout, relançait le déclencheur… en boucle, et chaque appel était stocké dans net._http_response.

-- 1) Le déclencheur ne part que si une notification a VRAIMENT été ajoutée
create or replace function public.mdt_notif_kick() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from new_rows) then return null; end if;
  perform net.http_post(url := 'https://hnyomaobuftunuhwkzox.supabase.co/functions/v1/bright-endpoint',
                        headers := '{"Content-Type": "application/json"}'::jsonb, body := '{}'::jsonb);
  return null;
exception when others then return null;
end $$;
drop trigger if exists mdt_notif_kick on public.mdt_notif;
create trigger mdt_notif_kick after insert on public.mdt_notif
referencing new table as new_rows
for each statement execute function public.mdt_notif_kick();

-- 2) Vide l'historique des appels HTTP (409 Mo) : il ne sert à rien, on libère la place tout de suite
truncate net._http_response;

-- 3) Ménage quotidien de cet historique (en plus de celui de pg_cron)
select cron.unschedule(jobid) from cron.job where jobname = 'mdt-cleanup';
select cron.schedule('mdt-cleanup', '17 4 * * *', $cron$
  delete from cron.job_run_details where end_time < now() - interval '1 day';
  delete from net._http_response where created < now() - interval '1 hour';
$cron$);
