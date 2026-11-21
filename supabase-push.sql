-- ============================================================================================
-- L’Unanimithé — notifications sur le téléphone (à coller dans Supabase → SQL Editor → Run)
-- À lancer APRÈS supabase-v2.sql. Peut être relancé sans risque.
-- Les notifications partent d'une petite fonction Supabase (slug « bright-endpoint », code dans supabase/functions/push)
-- appelée chaque minute par pg_cron.
-- ============================================================================================

-- ---------- Appareils abonnés (un téléphone / navigateur = une ligne)
create table if not exists public.mdt_push (
  endpoint text primary key,
  nom text not null,
  p256dh text not null,
  auth text not null,
  ua text,
  created_at timestamptz not null default now()
);
alter table public.mdt_push enable row level security;
revoke all on public.mdt_push from anon, authenticated;

-- ---------- File d'attente des notifications
create table if not exists public.mdt_notif (
  id bigserial primary key,
  nom text not null,
  type text not null,
  title text not null,
  body text,
  url text,
  dedup text unique,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);
create index if not exists mdt_notif_todo on public.mdt_notif (created_at) where sent_at is null;
alter table public.mdt_notif enable row level security;
revoke all on public.mdt_notif from anon, authenticated;

-- ---------- Réglages de chacun (Paramètres → Notifications, tout est désactivé par défaut)
create or replace function public.mdt_npref(n text, t text) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select (data->'prefs'->'notif'->>t)::boolean from public.mdt_items where kind = 'profile' and id = n and not deleted), false)
$$;

create or replace function public.mdt_site() returns text language sql immutable as $$
  select 'https://dyfrost.github.io/maison-du-the/Site%20The.dc.html'
$$;

-- met une notification en file si la personne l'a activée et a au moins un appareil abonné
create or replace function public.mdt_notify(n text, t text, ti text, bo text, u text, dd text default null) returns void
language plpgsql security definer set search_path = public as $$
begin
  if n is null or n = '' then return; end if;
  if t <> 'test' and not public.mdt_npref(n, t) then return; end if;
  if not exists (select 1 from public.mdt_push where nom = n) then return; end if;
  insert into public.mdt_notif (nom, type, title, body, url, dedup) values (n, t, ti, bo, u, dd) on conflict (dedup) do nothing;
end $$;

-- nom du thé d'un sachet
create or replace function public.mdt_tea_of(sid text) returns text
language sql stable security definer set search_path = public as $$
  select coalesce((select coalesce(nullif(p.data->>'nom', ''), p.data->>'the') from public.mdt_items s
                   join public.mdt_items p on p.kind = 'prod' and p.id = s.data->>'prodId'
                   where s.kind = 'sachet' and s.id = sid), 'un thé')
$$;

-- ---------- Événements → notifications
create or replace function public.mdt_notif_trg() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  d jsonb := coalesce(new.data, '{}'::jsonb);
  o jsonb := case when tg_op = 'UPDATE' then coalesce(old.data, '{}'::jsonb) else '{}'::jsonb end;
  actor text := new.updated_by;
  base text := public.mdt_site();
  x text;
begin
  if new.deleted then return null; end if;
  -- admins / modérateurs
  if new.kind = 'report' and tg_op = 'INSERT' then
    for x in select nom from public.maison_members where role in ('admin', 'moderator') loop
      perform public.mdt_notify(x, 'adm_report', '🚩 Nouveau signalement', coalesce(d->>'label', '') || coalesce(' — « ' || nullif(d->>'reason', '') || ' »', ''), base || '#go=admin-mod');
    end loop;
  end if;
  if new.kind in ('cat', 'decl') and d->>'pending' = 'true' and coalesce(o->>'pending', '') <> 'true' then
    for x in select nom from public.maison_members where role in ('admin', 'moderator') loop
      perform public.mdt_notify(x, 'adm_pending', '⏳ Ajout au catalogue à valider', coalesce(d->>'nom', '?') || ' (par ' || coalesce(actor, '?') || ')', base || '#go=admin-mod');
    end loop;
  end if;
  -- membres
  if new.kind = 'friend' and d->>'status' = 'pending' and o->>'status' is distinct from 'pending' then
    perform public.mdt_notify(d->>'to', 'friend_req', '🤝 Demande d''ami', coalesce(d->>'from', 'Quelqu''un') || ' veut devenir votre ami.', base || '#go=friends');
  end if;
  if new.kind = 'salon' then
    for x in select jsonb_array_elements_text(coalesce(d->'invites', '[]'::jsonb)) except select jsonb_array_elements_text(coalesce(o->'invites', '[]'::jsonb)) loop
      perform public.mdt_notify(x, 'salon_invite', '🏮 Invitation dans un salon', coalesce(actor, 'Quelqu''un') || ' vous invite dans « ' || coalesce(d->>'name', 'un salon') || ' ».', base || '#go=salon');
    end loop;
  end if;
  if new.kind = 'log' then
    for x in select jsonb_array_elements_text(coalesce(d->'with', '[]'::jsonb)) except select jsonb_array_elements_text(coalesce(o->'with', '[]'::jsonb)) loop
      if x is distinct from actor then
        perform public.mdt_notify(x, 'log_with', '☕ Dégustation partagée', coalesce(d->>'author', '?') || ' vous a ajouté à sa dégustation de ' || public.mdt_tea_of(d->>'lotId') || '.', base || '#log=' || new.id);
      end if;
    end loop;
    -- salon : une dégustation terminée d'un membre (une seule fois par dégustation)
    if coalesce(d->>'live', 'false') <> 'true' and (tg_op = 'INSERT' or coalesce(o->>'live', 'false') = 'true') then
      for x in select distinct m from public.mdt_items s, jsonb_array_elements_text(s.data->'members') m
               where s.kind = 'salon' and not s.deleted and (s.data->'members') ? (d->>'author') loop
        if x <> d->>'author' and not (coalesce(d->'with', '[]'::jsonb) ? x) then
          perform public.mdt_notify(x, 'salon_log', '🍵 ' || (d->>'author') || ' a dégusté', public.mdt_tea_of(d->>'lotId') || coalesce(' · ' || nullif(d->>'note', '') || '/20', ''), base || '#log=' || new.id, 'salon_log:' || new.id || ':' || x);
        end if;
      end loop;
    end if;
  end if;
  if new.kind = 'sachet' and tg_op = 'UPDATE' and new.owner is distinct from old.owner and new.owner is distinct from actor then
    perform public.mdt_notify(new.owner, 'gift', '🎁 Un sachet pour vous', 'Un sachet de ' || public.mdt_tea_of(new.id) || ' vous a été '
      || case when public.mdt_role_of(actor) = 'admin' then 'attribué.' else 'offert par ' || coalesce(actor, '?') || '.' end, base);
  end if;
  if new.kind = 'opt' and new.id = 'announce' and coalesce(d->'v'->>'text', '') <> '' and (d->'v'->>'at') is distinct from (o->'v'->>'at') then
    for x in select nom from public.maison_members loop
      perform public.mdt_notify(x, 'announce', '📣 L’Unanimithé', d->'v'->>'text', base, 'announce:' || (d->'v'->>'at') || ':' || x);
    end loop;
  end if;
  return null;
exception when others then
  return null;   -- une notification ne doit jamais bloquer un enregistrement
end $$;

drop trigger if exists mdt_items_notif on public.mdt_items;
create trigger mdt_items_notif after insert or update on public.mdt_items
for each row execute function public.mdt_notif_trg();

create or replace function public.mdt_member_notif() returns trigger
language plpgsql security definer set search_path = public as $$
declare x text;
begin
  for x in select nom from public.maison_members where role = 'admin' and nom <> new.nom loop
    perform public.mdt_notify(x, 'adm_member', '👋 Nouveau membre', new.nom || ' vient de créer son compte.', public.mdt_site() || '#go=admin-usr');
  end loop;
  return null;
exception when others then return null;
end $$;
drop trigger if exists mdt_members_notif on public.maison_members;
create trigger mdt_members_notif after insert on public.maison_members
for each row execute function public.mdt_member_notif();

-- ---------- Rappels quotidiens, à l'heure choisie par chacun (thé du jour, tea pet assoiffé, Tea Wrapped le 1er)
create or replace function public.mdt_notif_due() returns void
language plpgsql security definer set search_path = public as $$
declare
  r record; g record; nf jsonb; lt timestamp; hr int; dy text; sid text; tname text; last text; days int;
  mois text[] := array['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
begin
  for r in select m.nom, p.data->'prefs'->'notif' as nf from public.maison_members m
           join public.mdt_items p on p.kind = 'profile' and p.id = m.nom and not p.deleted
           where exists (select 1 from public.mdt_push s where s.nom = m.nom) loop
    nf := coalesce(r.nf, '{}'::jsonb);
    begin lt := now() at time zone coalesce(nullif(nf->>'tz', ''), 'Europe/Paris'); exception when others then lt := now() at time zone 'Europe/Paris'; end;
    hr := coalesce(nullif(nf->>'teaHour', '')::int, 9);
    continue when extract(hour from lt)::int <> hr;
    dy := to_char(lt, 'YYYY-MM-DD');
    if coalesce((nf->>'tea_day')::boolean, false) then
      sid := null;
      select s.id, coalesce(nullif(p.data->>'nom', ''), p.data->>'the') into sid, tname
        from public.mdt_items s join public.mdt_items p on p.kind = 'prod' and p.id = s.data->>'prodId' and not p.deleted
       where s.kind = 'sachet' and not s.deleted and s.owner = r.nom and coalesce(s.data->>'empty', 'false') <> 'true'
       order by (select max(l.data->>'date') from public.mdt_items l where l.kind = 'log' and not l.deleted and l.data->>'lotId' = s.id) asc nulls first, random()
       limit 1;
      if sid is not null then
        perform public.mdt_notify(r.nom, 'tea_day', '🎲 Thé du jour', 'Et si vous buviez ' || tname || ' aujourd''hui ?', public.mdt_site() || '#go=log', 'tea_day:' || r.nom || ':' || dy);
      end if;
    end if;
    if coalesce((nf->>'pet_thirst')::boolean, false) then
      for g in select id, data->>'name' as name from public.mdt_items where kind = 'gear' and not deleted and owner = r.nom and data->>'type' = 'teapet' loop
        select max(l.data->>'date') into last from public.mdt_items l
         where l.kind = 'log' and not l.deleted and ((l.data->'gearIds') ? g.id or l.data->>'gearId' = g.id);
        days := case when last ~ '^\d{4}-\d{2}-\d{2}$' then (lt::date - last::date) else 99 end;
        if days >= 3 then
          perform public.mdt_notify(r.nom, 'pet_thirst', '💧 ' || g.name || ' a soif', g.name || case when days >= 99 then ' n''a encore jamais bu de thé.' else ' n''a pas bu de thé depuis ' || days || ' jours.' end, public.mdt_site() || '#go=log', 'pet:' || g.id || ':' || dy);
        end if;
      end loop;
    end if;
    if coalesce((nf->>'wrap')::boolean, false) and extract(day from lt)::int = 1 then
      perform public.mdt_notify(r.nom, 'wrap', '🎁 Ton Tea Wrapped est prêt', 'Le résumé de ton mois de ' || mois[extract(month from (lt - interval '1 month'))::int] || ' t''attend.', public.mdt_site() || '#go=wrap', 'wrap:' || r.nom || ':' || to_char(lt, 'YYYY-MM'));
    end if;
  end loop;
end $$;

-- ---------- Appelée chaque minute par la fonction « push » : prend les notifications à envoyer
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

-- ---------- Appelées par le site
create or replace function public.mdt_push_save(e text, k text, a text, u text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if public.mdt_me() is null then raise exception 'Non connecté.'; end if;
  insert into public.mdt_push (endpoint, nom, p256dh, auth, ua) values (e, public.mdt_me(), k, a, left(u, 200))
  on conflict (endpoint) do update set nom = excluded.nom, p256dh = excluded.p256dh, auth = excluded.auth, ua = excluded.ua;
end $$;

create or replace function public.mdt_push_delete(e text) returns void
language sql security definer set search_path = public as $$
  delete from public.mdt_push where endpoint = e and nom = public.mdt_me()
$$;

create or replace function public.mdt_push_count() returns int
language sql stable security definer set search_path = public as $$
  select count(*)::int from public.mdt_push where nom = public.mdt_me()
$$;

create or replace function public.mdt_notif_test() returns void
language plpgsql security definer set search_path = public as $$
begin
  if public.mdt_me() is null then raise exception 'Non connecté.'; end if;
  perform public.mdt_notify(public.mdt_me(), 'test', '🍵 L’Unanimithé', 'Les notifications fonctionnent sur cet appareil !', public.mdt_site());
end $$;

revoke all on function public.mdt_notify(text, text, text, text, text, text), public.mdt_notif_run(), public.mdt_notif_due(),
  public.mdt_npref(text, text), public.mdt_tea_of(text) from public, anon, authenticated;
revoke all on function public.mdt_push_save(text, text, text, text), public.mdt_push_delete(text), public.mdt_push_count(), public.mdt_notif_test() from public;
grant execute on function public.mdt_push_save(text, text, text, text), public.mdt_push_delete(text), public.mdt_push_count(), public.mdt_notif_test() to authenticated;

-- ---------- Envoi chaque minute : pg_cron appelle la fonction « push »
create extension if not exists pg_cron;
create extension if not exists pg_net;
select cron.unschedule(jobid) from cron.job where jobname = 'mdt-push';
select cron.schedule('mdt-push', '*/5 * * * *', $cron$
  select net.http_post(url := 'https://hnyomaobuftunuhwkzox.supabase.co/functions/v1/bright-endpoint',
                       headers := '{"Content-Type": "application/json"}'::jsonb, body := '{}'::jsonb);
$cron$);

-- ---------- Envoi immédiat : dès qu'une notification entre dans la file, la fonction est appelée
-- (pg_net est asynchrone : l'enregistrement n'attend pas l'envoi ; la tâche de chaque minute reste en filet de sécurité)
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
