-- Maison du Thé : diagnostic mémoire / disque (lecture seule, ne modifie rien)
-- Supabase > SQL Editor > coller > Run, puis envoyer une capture des 3 résultats (onglets en bas).

-- A) Connexions ouvertes : qui les tient et depuis quand
select coalesce(nullif(application_name, ''), '(sans nom)') as appli, usename, state, count(*) as nb,
       max(now() - state_change) as plus_ancienne
from pg_stat_activity where datname = current_database()
group by 1, 2, 3 order by nb desc;

-- B) Requêtes les plus coûteuses (temps total et lectures disque)
select calls, round(total_exec_time::numeric / 1000, 1) as secondes, shared_blks_read as blocs_lus_disque,
       temp_blks_written as blocs_temp, left(regexp_replace(query, '\s+', ' ', 'g'), 140) as requete
from extensions.pg_stat_statements order by total_exec_time desc limit 12;

-- C) Taille des tables
select n.nspname || '.' || c.relname as table_, pg_size_pretty(pg_total_relation_size(c.oid)) as taille
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where c.relkind = 'r' and n.nspname in ('public', 'cron', 'net', 'storage', 'auth')
order by pg_total_relation_size(c.oid) desc limit 12;
