-- Maison du Thé — protection côté base (à coller une fois dans Supabase → SQL Editor → Run)
-- 1) Chaque prénom est lié à un seul compte : impossible de se faire passer pour quelqu'un.
-- 2) Les non-admins peuvent ajouter au catalogue mais pas le modifier ; ils ne touchent ni aux réglages ni aux admins,
--    ni supprimer les thés, sachets ou dégustations des autres.

create table if not exists public.maison_members (
  nom text primary key,
  user_id uuid not null unique references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.maison_members enable row level security;
revoke all on public.maison_members from anon, authenticated;

-- Lie les comptes existants à leur prénom (le plus ancien compte gagne en cas de doublon)
insert into public.maison_members (nom, user_id)
select distinct on (nom) nom, id
from (
  select coalesce(nullif(trim(raw_user_meta_data->>'nom'), ''), split_part(email, '@', 1)) as nom, id, created_at
  from auth.users
) u
order by nom, created_at
on conflict do nothing;

create or replace function public.maison_guard() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  me text := coalesce(nullif(trim(auth.jwt()->'user_metadata'->>'nom'), ''), split_part(auth.jwt()->>'email', '@', 1));
  bound uuid;
  o jsonb := coalesce(old.payload, '{}'::jsonb);
  n jsonb := coalesce(new.payload, '{}'::jsonb);
  adm jsonb := coalesce(o->'options'->'admins', '["Raph","Maël"]'::jsonb);
  k text;
  x jsonb;
begin
  -- SQL Editor / clé service : pas de contrôle
  if uid is null then return new; end if;

  -- Prénom ↔ compte
  select user_id into bound from public.maison_members where nom = me;
  if bound is null then
    insert into public.maison_members (nom, user_id) values (me, uid) on conflict do nothing;
    select user_id into bound from public.maison_members where nom = me;
  end if;
  if bound is distinct from uid then
    raise exception 'Le prénom « % » appartient déjà à un autre compte.', me;
  end if;

  if adm ? me then return new; end if;  -- admin : tout est permis

  -- Catalogue : les non-admins peuvent seulement ajouter des thés et des variantes
  if not (coalesce(n->'teas', '[]'::jsonb) @> coalesce(o->'teas', '[]'::jsonb))
     or not (coalesce(n->'decl', '[]'::jsonb) @> coalesce(o->'decl', '[]'::jsonb)) then
    raise exception 'Seuls les admins peuvent modifier ou retirer des thés du catalogue.';
  end if;
  foreach k in array array['admins', 'catalog', 'freqs', 'techs', 'vessels', 'importDone'] loop
    if (o->'options'->k) is distinct from (n->'options'->k) then
      raise exception 'Seuls les admins peuvent modifier « % ».', k;
    end if;
  end loop;

  -- Listes où l'on peut seulement ajouter
  foreach k in array array['users', 'tagList'] loop
    if coalesce(o->'options'->k, '[]'::jsonb) <> '[]'::jsonb
       and not (coalesce(n->'options'->k, '[]'::jsonb) @> coalesce(o->'options'->k, '[]'::jsonb)) then
      raise exception 'Seuls les admins peuvent retirer des éléments de « % ».', k;
    end if;
  end loop;
  if not (coalesce(n->'options'->'userIds', '{}'::jsonb) @> coalesce(o->'options'->'userIds', '{}'::jsonb)) then
    raise exception 'Les identifiants existants ne peuvent pas être modifiés.';
  end if;

  -- Profils : chacun ne modifie que le sien
  for k in select jsonb_object_keys(coalesce(o->'options'->'profiles', '{}'::jsonb) || coalesce(n->'options'->'profiles', '{}'::jsonb)) loop
    if k <> me and (o->'options'->'profiles'->k) is distinct from (n->'options'->'profiles'->k) then
      raise exception 'Vous ne pouvez modifier que votre propre profil.';
    end if;
  end loop;

  -- Sachets des autres : ni supprimés, ni changés de propriétaire
  for x in select * from jsonb_array_elements(coalesce(o->'sachets', '[]'::jsonb)) loop
    if x->>'owner' <> me and not exists (
      select 1 from jsonb_array_elements(coalesce(n->'sachets', '[]'::jsonb)) y
      where y->>'id' = x->>'id' and y->>'owner' = x->>'owner') then
      raise exception 'Vous ne pouvez pas supprimer ou récupérer le sachet de %.', x->>'owner';
    end if;
  end loop;

  -- Matériel des autres : ni supprimé, ni modifié
  for x in select * from jsonb_array_elements(coalesce(o->'gear', '[]'::jsonb)) loop
    if x->>'owner' <> me and not exists (
      select 1 from jsonb_array_elements(coalesce(n->'gear', '[]'::jsonb)) y where y = x) then
      raise exception 'Vous ne pouvez pas modifier le matériel de %.', x->>'owner';
    end if;
  end loop;

  -- Dégustations des autres : jamais supprimées
  for x in select * from jsonb_array_elements(coalesce(o->'logs', '[]'::jsonb)) loop
    if coalesce(x->>'author', '') <> me and not exists (
      select 1 from jsonb_array_elements(coalesce(n->'logs', '[]'::jsonb)) y where y->>'id' = x->>'id') then
      raise exception 'Vous ne pouvez pas supprimer la dégustation de %.', x->>'author';
    end if;
  end loop;

  -- Thés du commerce encore utilisés par les sachets des autres : jamais supprimés
  for x in select * from jsonb_array_elements(coalesce(o->'prods', '[]'::jsonb)) loop
    if exists (select 1 from jsonb_array_elements(coalesce(n->'sachets', '[]'::jsonb)) s
               where s->>'prodId' = x->>'id' and s->>'owner' <> me)
       and not exists (select 1 from jsonb_array_elements(coalesce(n->'prods', '[]'::jsonb)) y where y->>'id' = x->>'id') then
      raise exception 'Ce thé du commerce est utilisé par d''autres membres.';
    end if;
  end loop;

  return new;
end $$;

drop trigger if exists maison_guard on public.the_data;
create trigger maison_guard before update on public.the_data
for each row execute function public.maison_guard();

-- Personne ne peut supprimer la ligne depuis le site, ni créer d'autres lignes
revoke delete on public.the_data from authenticated;
drop policy if exists "membres ajoutent" on public.the_data;
create policy "membres ajoutent" on public.the_data for insert to authenticated with check (id = 'maison');
