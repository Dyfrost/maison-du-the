-- Maison du Thé : correctif mémoire (à exécuter APRÈS avoir mis à jour le code de la fonction bright-endpoint)

-- 1) La fonction d'envoi passe désormais par l'API avec la clé de service
grant execute on function public.mdt_notif_run() to service_role;

-- 2) Ferme les connexions directes restées ouvertes par l'ancienne version de la fonction
select pg_terminate_backend(pid) from pg_stat_activity
where datname = current_database() and application_name = 'postgres.js' and pid <> pg_backend_pid();

-- 3) Coupe automatiquement toute connexion inactive dans une transaction depuis plus de 2 minutes
alter database postgres set idle_in_transaction_session_timeout = '2min';
