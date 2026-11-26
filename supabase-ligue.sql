-- ============================================================================================
-- L’Unanimithé — 🏆 Ligue du Theordle + rappel du Theordle (à coller dans Supabase → SQL Editor → Run)
-- À lancer APRÈS supabase-v2.sql et supabase-push.sql. Peut être relancé sans risque.
-- ============================================================================================

-- ---------- Scores du Theordle (une ligne par joueur, par jour, par catégorie commune)
-- src : 'salon' (scope = id du salon) ou 'ency' (scope = '') ; pts : trouvé en 1 essai = 8 … en 8 = 1, perdu = 0
create table if not exists public.mdt_tdl_scores (
  day date not null,
  src text not null check (src in ('salon', 'ency')),
  scope text not null default '',
  nom text not null,
  won boolean not null,
  tries int not null check (tries between 1 and 8),
  pts int not null,
  rv int not null default 0,
  created_at timestamptz not null default now(),
  primary key (day, src, scope, nom),
  constraint mdt_tdl_pts check (pts = case when won then greatest(1, 9 - tries) else 0 end)
);
create index if not exists mdt_tdl_scores_nom on public.mdt_tdl_scores (nom, day);
alter table public.mdt_tdl_scores enable row level security;

drop policy if exists "tdl lecture" on public.mdt_tdl_scores;
create policy "tdl lecture" on public.mdt_tdl_scores for select to authenticated using (true);
drop policy if exists "tdl ajout" on public.mdt_tdl_scores;
create policy "tdl ajout" on public.mdt_tdl_scores for insert to authenticated with check (nom = public.mdt_me());
drop policy if exists "tdl modif" on public.mdt_tdl_scores;
create policy "tdl modif" on public.mdt_tdl_scores for update to authenticated using (nom = public.mdt_me()) with check (nom = public.mdt_me());
drop policy if exists "tdl suppression" on public.mdt_tdl_scores;
create policy "tdl suppression" on public.mdt_tdl_scores for delete to authenticated using (public.mdt_is_admin());
revoke all on public.mdt_tdl_scores from anon;
grant select, insert, update, delete on public.mdt_tdl_scores to authenticated;

-- ---------- Remise à zéro (26/11/2026) : les anciens scores provisoires (rangés dans les réactions) disparaissent
update public.mdt_items set deleted = true
 where kind = 'react' and not deleted and (id like 'tdl|%' or id like 'gs|%');

-- ---------- Rappel du Theordle : à l'heure choisie (Paramètres → Notifications), si on n'a pas encore joué aujourd'hui
create or replace function public.mdt_notif_due_tdl() returns void
language plpgsql security definer set search_path = public as $$
declare r record; nf jsonb; lt timestamp; hr int;
begin
  for r in select m.nom, p.data->'prefs'->'notif' as nf from public.maison_members m
           join public.mdt_items p on p.kind = 'profile' and p.id = m.nom and not p.deleted
           where exists (select 1 from public.mdt_push s where s.nom = m.nom) loop
    nf := coalesce(r.nf, '{}'::jsonb);
    continue when not coalesce((nf->>'tdl')::boolean, false);
    begin lt := now() at time zone coalesce(nullif(nf->>'tz', ''), 'Europe/Paris'); exception when others then lt := now() at time zone 'Europe/Paris'; end;
    hr := coalesce(nullif(nf->>'tdlHour', '')::int, 18);
    continue when extract(hour from lt)::int <> hr;
    continue when exists (select 1 from public.mdt_tdl_scores t where t.nom = r.nom and t.day = lt::date);
    perform public.mdt_notify(r.nom, 'tdl', '🧩 Theordle du jour', 'Le thé mystère du jour t’attend : sauras-tu le trouver ?',
                              public.mdt_site() || '#go=tdl', 'tdl:' || r.nom || ':' || to_char(lt, 'YYYY-MM-DD'));
  end loop;
end $$;
revoke all on function public.mdt_notif_due_tdl() from public, anon, authenticated;

-- même fonction que dans supabase-push.sql, avec le rappel du Theordle en plus
create or replace function public.mdt_notif_run() returns table (id bigint, endpoint text, p256dh text, auth text, title text, body text, url text)
language plpgsql security definer set search_path = public as $$
begin
  if extract(minute from now())::int < 5 then
    perform public.mdt_notif_due();
    begin perform public.mdt_notif_due_tdl(); exception when undefined_function or undefined_table then null; end;
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
revoke all on function public.mdt_notif_run() from public, anon, authenticated;
