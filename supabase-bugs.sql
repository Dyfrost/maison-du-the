-- ---------- Remontée de bugs (bouton 🐞 du site → Administration → Développement)
create table if not exists public.mdt_bugs (
  id bigserial primary key,
  ts timestamptz not null default now(),
  who text,
  title text not null,
  body text,
  photos jsonb not null default '[]'::jsonb,
  url text,
  ua text,
  status text not null default 'open'
);
alter table public.mdt_bugs enable row level security;
revoke all on public.mdt_bugs from anon, authenticated;

create or replace function public.mdt_bug_submit(t text, b text, ph jsonb, u text, a text) returns bigint
language plpgsql security definer set search_path = public as $$
declare me text := public.mdt_me(); nid bigint; x text;
begin
  if me is null then raise exception 'Connectez-vous pour signaler un bug.'; end if;
  if coalesce(trim(t), '') = '' then raise exception 'Donnez un titre au bug.'; end if;
  if (select count(*) from public.mdt_bugs where who = me and ts > now() - interval '1 hour') >= 10 then raise exception 'Trop de signalements en une heure : merci, on a de quoi faire !'; end if;
  insert into public.mdt_bugs (who, title, body, photos, url, ua)
  values (me, left(trim(t), 150), left(coalesce(b, ''), 5000), coalesce(ph, '[]'::jsonb), left(u, 500), left(a, 300)) returning id into nid;
  begin   -- notification aux admins (si les notifications sont installées)
    for x in select nom from public.maison_members where role = 'admin' and nom <> me loop
      perform public.mdt_notify(x, 'adm_bug', '🐞 Nouveau bug signalé', left(trim(t), 120) || ' (par ' || me || ')', public.mdt_site() || '#go=admin-dev');
    end loop;
  exception when others then null;
  end;
  return nid;
end $$;

create or replace function public.mdt_bugs_list() returns setof public.mdt_bugs
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.mdt_is_admin() then raise exception 'Réservé aux admins.'; end if;
  return query select * from public.mdt_bugs order by (status = 'open') desc, ts desc limit 300;
end $$;

create or replace function public.mdt_bug_set(i bigint, s text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.mdt_is_admin() then raise exception 'Réservé aux admins.'; end if;
  if s = 'delete' then delete from public.mdt_bugs where id = i; return; end if;
  if s not in ('open', 'doing', 'done', 'rejected') then raise exception 'Statut inconnu.'; end if;
  update public.mdt_bugs set status = s where id = i;
end $$;

revoke all on function public.mdt_bug_submit(text, text, jsonb, text, text), public.mdt_bugs_list(), public.mdt_bug_set(bigint, text) from public;
grant execute on function public.mdt_bug_submit(text, text, jsonb, text, text), public.mdt_bugs_list(), public.mdt_bug_set(bigint, text) to authenticated;

notify pgrst, 'reload schema';
