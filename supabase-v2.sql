-- ============================================================================================
-- Maison du Thé — stockage v2 (à coller UNE fois dans Supabase → SQL Editor → Run)
--
-- Remplace la « fiche unique » (the_data) par une table où chaque thé, sachet, dégustation,
-- objet, profil… est une ligne à part, avec ses propres droits :
--   • la base elle-même applique « public / mes salons et amis / mes amis / privé » ;
--   • chacun n'écrit que ce qui le concerne (plus d'écrasement entre deux téléphones) ;
--   • rôles : admin, modérateur, membre ; ajouts au catalogue à valider ;
--   • signalements, journal d'erreurs, suppression de compte (RGPD).
-- Ce script ne touche pas aux données actuelles : la migration se lance ensuite depuis le site
-- (Administration → Données → « Passer au nouveau stockage »), puis l'ancienne fiche est verrouillée.
-- ============================================================================================

-- ---------- Membres : prénom ↔ compte, rôle, numéro (#0001)
create table if not exists public.maison_members (
  nom text primary key,
  user_id uuid not null unique references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.maison_members add column if not exists role text not null default 'member';
alter table public.maison_members add column if not exists num text;
alter table public.maison_members enable row level security;
revoke all on public.maison_members from anon, authenticated;

-- Rôles admin repris de l'ancienne fiche (options.admins), sinon Raph et Maël
update public.maison_members m set role = 'admin'
where m.nom in (
  select jsonb_array_elements_text(coalesce((select payload->'options'->'admins' from public.the_data where id = 'maison'), '["Raph","Maël"]'::jsonb))
);
-- Numéros repris de l'ancienne fiche (options.userIds), sinon par ordre d'arrivée
update public.maison_members m set num = (select payload->'options'->'userIds'->>m.nom from public.the_data where id = 'maison') where m.num is null;
with ordered as (select nom, row_number() over (order by created_at) as rn from public.maison_members where num is null)
update public.maison_members m set num = lpad((coalesce((select max(num::int) from public.maison_members where num ~ '^\d+$'), 0) + o.rn)::text, 4, '0')
from ordered o where m.nom = o.nom;

-- ---------- Table principale
create table if not exists public.mdt_items (
  kind text not null,              -- prod, sachet, log, gear, price, cat, decl, over, opt, profile, salon, friend, game, react, event, report
  id text not null,
  owner text,                      -- prénom du propriétaire (déduit par la base)
  parties text[] not null default '{}',  -- prénoms qui peuvent modifier la ligne (déduits par la base)
  data jsonb not null default '{}'::jsonb,
  deleted boolean not null default false,
  updated_at timestamptz not null default clock_timestamp(),
  updated_by text,
  primary key (kind, id)
);
create index if not exists mdt_items_updated on public.mdt_items (updated_at);
create index if not exists mdt_items_owner on public.mdt_items (owner);
alter table public.mdt_items enable row level security;
revoke all on public.mdt_items from anon, authenticated;
grant select on public.mdt_items to anon, authenticated;
grant insert, update on public.mdt_items to authenticated;

-- ---------- Journal d'erreurs (tout le monde écrit, seuls les admins lisent)
create table if not exists public.mdt_errors (
  id bigserial primary key,
  ts timestamptz not null default now(),
  who text,
  msg text,
  stack text,
  url text,
  ua text
);
alter table public.mdt_errors enable row level security;
revoke all on public.mdt_errors from anon, authenticated;
grant insert on public.mdt_errors to anon, authenticated;
grant usage, select on sequence public.mdt_errors_id_seq to anon, authenticated;

-- ---------- Fonctions utilitaires (security definer : elles lisent sans repasser par les règles)
create or replace function public.mdt_me() returns text
language sql stable security definer set search_path = public as $$
  select nom from public.maison_members where user_id = auth.uid()
$$;

create or replace function public.mdt_role_of(n text) returns text
language sql stable security definer set search_path = public as $$
  select coalesce((select role from public.maison_members where nom = n), 'member')
$$;

create or replace function public.mdt_is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select role = 'admin' from public.maison_members where user_id = auth.uid()), false)
$$;

create or replace function public.mdt_is_mod() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select role in ('admin', 'moderator') from public.maison_members where user_id = auth.uid()), false)
$$;

create or replace function public.mdt_pref(o text, k text, def text) returns text
language sql stable security definer set search_path = public as $$
  select coalesce((select data->'prefs'->>k from public.mdt_items where kind = 'profile' and id = o and not deleted), def)
$$;

create or replace function public.mdt_are_friends(a text, b text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.mdt_items where kind = 'friend' and not deleted
                 and data->>'status' = 'ok' and parties @> array[a, b])
$$;

create or replace function public.mdt_same_salon(a text, b text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.mdt_items where kind = 'salon' and not deleted
                 and (data->'members') ? a and (data->'members') ? b)
$$;

-- vis : 'public' | 'salons' (salons + amis) | 'friends' (amis seulement) | 'private'
create or replace function public.mdt_vis_ok(vis text, o text, viewer text) returns boolean
language plpgsql stable security definer set search_path = public as $$
begin
  if o is null or o = viewer then return true; end if;
  if vis = 'public' then return true; end if;
  if viewer is null or vis = 'private' then return false; end if;
  if public.mdt_are_friends(o, viewer) then return true; end if;
  return vis = 'salons' and public.mdt_same_salon(o, viewer);
end $$;

create or replace function public.mdt_can_read(k text, o text, p text[], pending text) returns boolean
language plpgsql stable security definer set search_path = public as $$
declare me text := public.mdt_me();
begin
  if public.mdt_is_admin() then return true; end if;
  if k in ('cat', 'decl') and pending = 'true' then return o = me or public.mdt_is_mod(); end if;
  if k in ('prod', 'cat', 'decl', 'over', 'opt') then return true; end if;
  if k = 'report' then return o = me or public.mdt_is_mod(); end if;
  if me is not null and me = any(p) then return true; end if;
  if k in ('sachet', 'log', 'gear') then return public.mdt_vis_ok(public.mdt_pref(o, 'contentVis', 'public'), o, me); end if;
  if k = 'price' then return public.mdt_vis_ok(public.mdt_pref(o, 'priceVis', 'public'), o, me); end if;
  if me is null then return false; end if;                       -- visiteurs : rien d'autre
  if k in ('profile', 'salon', 'friend', 'react') then return true; end if;
  if k = 'event' then return public.mdt_vis_ok(public.mdt_pref(o, 'contentVis', 'public'), o, me); end if;
  return false;                                                   -- game : seulement les participants
end $$;

-- ---------- Règles d'accès
drop policy if exists "mdt lecture" on public.mdt_items;
create policy "mdt lecture" on public.mdt_items for select to anon, authenticated
  using (public.mdt_can_read(kind, owner, parties, data->>'pending'));
drop policy if exists "mdt ajout" on public.mdt_items;
create policy "mdt ajout" on public.mdt_items for insert to authenticated with check (auth.uid() is not null);
drop policy if exists "mdt modif" on public.mdt_items;
create policy "mdt modif" on public.mdt_items for update to authenticated
  using (public.mdt_is_admin() or public.mdt_me() = any(parties) or kind = 'prod'
         or (kind = 'log' and public.mdt_same_salon(owner, public.mdt_me()))
         or (kind in ('cat', 'decl', 'over', 'report', 'profile', 'event', 'log') and public.mdt_is_mod())
         or (kind in ('cat', 'decl') and owner = public.mdt_me()))
  with check (true);
drop policy if exists "mdt erreurs ajout" on public.mdt_errors;
create policy "mdt erreurs ajout" on public.mdt_errors for insert to anon, authenticated
  with check (length(coalesce(msg, '')) < 2000 and length(coalesce(stack, '')) < 6000);
drop policy if exists "mdt erreurs lecture" on public.mdt_errors;
create policy "mdt erreurs lecture" on public.mdt_errors for select to authenticated using (public.mdt_is_admin());
grant select, delete on public.mdt_errors to authenticated;
drop policy if exists "mdt erreurs purge" on public.mdt_errors;
create policy "mdt erreurs purge" on public.mdt_errors for delete to authenticated using (public.mdt_is_admin());

-- ---------- Garde-fou : propriétaire et participants déduits par la base, droits vérifiés ligne par ligne
create or replace function public.mdt_items_guard() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  me text := public.mdt_me();
  adm boolean := public.mdt_is_admin();
  modr boolean := public.mdt_is_mod();
  d jsonb := coalesce(new.data, '{}'::jsonb);
  o text;
  p text[];
begin
  -- suppression de compte (mdt_delete_me) : pas de contrôle
  if current_setting('mdt.purge', true) = '1' then
    if tg_op = 'DELETE' then return old; end if;
    return new;
  end if;
  -- propriétaire déduit du contenu
  o := case new.kind
    when 'sachet' then d->>'owner'
    when 'gear' then d->>'owner'
    when 'log' then d->>'author'
    when 'salon' then coalesce(d->>'creator', d->>'chief')
    when 'friend' then d->>'from'
    when 'game' then coalesce(d->>'by', d->>'master')
    when 'profile' then new.id
    when 'event' then d->>'who'
    when 'price' then coalesce(new.owner, me)
    when 'react' then coalesce(new.owner, me)
    when 'report' then coalesce(new.owner, me)
    else coalesce(case when tg_op = 'UPDATE' then old.owner end, new.owner, me)
  end;
  if tg_op = 'UPDATE' and new.kind = 'salon' then o := coalesce(old.owner, o); end if;
  new.owner := o;
  -- participants déduits du contenu
  p := case new.kind
    when 'sachet' then array[o] || coalesce(array(select jsonb_array_elements(coalesce(d->'shares', '[]'::jsonb))->>'to'), '{}')
    when 'log' then array[o] || coalesce(array(select jsonb_array_elements_text(coalesce(d->'with', '[]'::jsonb))), '{}')
    when 'salon' then array[o, d->>'chief'] || coalesce(array(select jsonb_array_elements_text(coalesce(d->'members', '[]'::jsonb))), '{}')
                       || coalesce(array(select jsonb_array_elements_text(coalesce(d->'invites', '[]'::jsonb))), '{}')
    when 'friend' then array[d->>'from', d->>'to']
    when 'game' then array[o, d->>'master'] || coalesce(array(select jsonb_array_elements_text(coalesce(d->'players', '[]'::jsonb))), '{}')
    else array[o]
  end;
  new.parties := array(select distinct x from unnest(p) x where x is not null);
  new.updated_at := clock_timestamp();
  new.updated_by := me;

  if auth.uid() is null or adm then return new; end if;            -- SQL Editor / admin
  if me is null then raise exception 'Compte non lié à un prénom : reconnectez-vous.'; end if;

  if tg_op = 'INSERT' then
    -- upsert sur une ligne existante : les contrôles se font dans la partie UPDATE (déclenchée juste après)
    if exists (select 1 from public.mdt_items where kind = new.kind and id = new.id) then return new; end if;
    if new.kind in ('sachet', 'gear', 'log', 'profile', 'event', 'react', 'report', 'salon', 'price') and o is distinct from me then
      raise exception 'Vous ne pouvez créer que vos propres éléments.';
    end if;
    if new.kind = 'friend' and d->>'from' is distinct from me then raise exception 'Demande d''ami invalide.'; end if;
    if new.kind = 'game' and not (me = any(new.parties)) then raise exception 'Partie invalide.'; end if;
    if new.kind in ('over', 'opt') and not (modr and new.kind = 'over') then raise exception 'Réservé aux admins.'; end if;
    if new.kind in ('cat', 'decl') and not modr then new.data := d || '{"pending": true}'::jsonb; end if;
    return new;
  end if;

  -- UPDATE
  if new.kind = 'opt' then raise exception 'Réservé aux admins.'; end if;
  if new.kind in ('profile', 'react', 'event', 'report') and old.owner is distinct from me
     and not (modr and new.kind in ('profile', 'event', 'report')) then
    raise exception 'Vous ne pouvez modifier que vos propres éléments.';
  end if;
  if new.kind in ('sachet', 'gear', 'price') and new.owner is distinct from old.owner and old.owner is distinct from me then
    raise exception 'Seul le propriétaire peut donner ce sachet ou cet objet.';
  end if;
  if new.kind = 'gear' and old.owner is distinct from me then raise exception 'Vous ne pouvez pas modifier le matériel de %.', old.owner; end if;
  if new.kind = 'price' and old.owner is distinct from me and new.data is distinct from old.data then raise exception 'Prix réservé au propriétaire.'; end if;
  if new.kind = 'log' and new.owner is distinct from old.owner then raise exception 'L''auteur d''une dégustation ne change pas.'; end if;
  if new.kind in ('cat', 'decl') and not modr then
    if old.owner is distinct from me or coalesce(old.data->>'pending', 'false') <> 'true' then raise exception 'Seuls les modérateurs modifient le catalogue.'; end if;
    new.data := d || '{"pending": true}'::jsonb;
  end if;
  if new.deleted and not old.deleted then
    if new.kind in ('friend', 'game') then null;                   -- un des deux / un participant
    elsif modr and new.kind in ('log', 'event', 'prod', 'cat', 'decl') then null;   -- modération
    elsif new.kind = 'prod' then
      if old.owner is distinct from me then raise exception 'Seuls les admins suppriment un thé ajouté par quelqu''un d''autre.'; end if;
    elsif old.owner is distinct from me then raise exception 'Vous ne pouvez supprimer que vos propres éléments.';
    end if;
  end if;
  return new;
end $$;

drop trigger if exists mdt_items_guard on public.mdt_items;
create trigger mdt_items_guard before insert or update on public.mdt_items
for each row execute function public.mdt_items_guard();

-- ---------- Fonctions appelées par le site
-- Lie le compte connecté à son prénom (premier arrivé), renvoie { nom, role, num } ou une erreur si le prénom est pris
create or replace function public.mdt_register() returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  wanted text := coalesce(nullif(trim(auth.jwt()->'user_metadata'->>'nom'), ''), split_part(auth.jwt()->>'email', '@', 1));
  m public.maison_members;
begin
  if uid is null then return null; end if;
  select * into m from public.maison_members where user_id = uid;
  if m.nom is null then
    if exists (select 1 from public.maison_members where lower(nom) = lower(wanted)) then
      return jsonb_build_object('error', 'Le prénom « ' || wanted || ' » est déjà pris par un autre compte.');
    end if;
    insert into public.maison_members (nom, user_id, num)
    values (wanted, uid, lpad((coalesce((select max(num::int) from public.maison_members where num ~ '^\d+$'), 0) + 1)::text, 4, '0'))
    returning * into m;
  end if;
  return jsonb_build_object('nom', m.nom, 'role', m.role, 'num', m.num);
end $$;

create or replace function public.mdt_members() returns table (nom text, role text, num text)
language sql stable security definer set search_path = public as $$
  select nom, role, num from public.maison_members order by created_at
$$;

create or replace function public.mdt_set_role(n text, r text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.mdt_is_admin() then raise exception 'Réservé aux admins.'; end if;
  if r not in ('member', 'moderator', 'admin') then raise exception 'Rôle inconnu.'; end if;
  update public.maison_members set role = r where nom = n;
end $$;

-- Verrouille l'ancienne fiche unique une fois la migration faite (admin seulement)
create or replace function public.mdt_lock_v1() returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.mdt_is_admin() then raise exception 'Réservé aux admins.'; end if;
  execute 'revoke select on public.the_data from anon';
  execute 'revoke insert, update on public.the_data from authenticated';
  execute 'drop policy if exists "visiteurs lisent" on public.the_data';
end $$;

-- RGPD : supprime le compte connecté et ses données personnelles
create or replace function public.mdt_delete_me() returns void
language plpgsql security definer set search_path = public as $$
declare me text := public.mdt_me(); uid uuid := auth.uid();
begin
  if uid is null or me is null then raise exception 'Non connecté.'; end if;
  perform set_config('mdt.purge', '1', true);
  -- ses éléments personnels : effacés
  update public.mdt_items set deleted = true, data = '{}'::jsonb
   where owner = me and kind in ('sachet', 'gear', 'price', 'log', 'profile', 'react', 'event', 'report', 'friend', 'game');
  -- ses amitiés (reçues) : effacées
  update public.mdt_items set deleted = true where kind = 'friend' and me = any(parties);
  -- ses participations : son prénom retiré des dégustations et des salons des autres
  update public.mdt_items set data = jsonb_set(data, '{with}', coalesce((select jsonb_agg(x) from jsonb_array_elements_text(data->'with') x where x <> me), '[]'::jsonb))
   where kind = 'log' and (data->'with') ? me;
  update public.mdt_items set data = data
      || jsonb_build_object('members', coalesce((select jsonb_agg(x) from jsonb_array_elements_text(data->'members') x where x <> me), '[]'::jsonb))
      || jsonb_build_object('invites', coalesce((select jsonb_agg(x) from jsonb_array_elements_text(coalesce(data->'invites', '[]'::jsonb)) x where x <> me), '[]'::jsonb))
   where kind = 'salon' and ((data->'members') ? me or (coalesce(data->'invites', '[]'::jsonb)) ? me);
  delete from public.maison_members where user_id = uid;
  delete from auth.users where id = uid;
  perform set_config('mdt.purge', '0', true);
end $$;

revoke all on function public.mdt_register(), public.mdt_members(), public.mdt_set_role(text, text), public.mdt_lock_v1(), public.mdt_delete_me() from public;
grant execute on function public.mdt_register(), public.mdt_set_role(text, text), public.mdt_lock_v1(), public.mdt_delete_me() to authenticated;
grant execute on function public.mdt_members() to anon, authenticated;
grant execute on function public.mdt_me(), public.mdt_is_admin(), public.mdt_is_mod(), public.mdt_can_read(text, text, text[], text) to anon, authenticated;
