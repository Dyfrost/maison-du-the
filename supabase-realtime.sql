-- L’Unanimithé — temps réel : la base prévient le site dès qu’un élément change
-- (au lieu que chaque appareil interroge la base toutes les minutes).
-- À lancer une fois dans Supabase → SQL Editor. Relançable sans risque. Les droits de lecture (RLS) s’appliquent aussi au temps réel.
do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'mdt_items') then
    alter publication supabase_realtime add table public.mdt_items;
  end if;
end $$;

-- Contrôle : photos encore stockées en texte (base64) dans la base — à déplacer avec Admin → Accueil → Santé de la base
select kind, count(*) as lignes, pg_size_pretty(sum(length(data::text))::bigint) as taille
from public.mdt_items where not deleted and data::text like '%data:image%' group by kind order by 2 desc;
