// Maison du Thé — envoi des notifications (Supabase Edge Function « bright-endpoint »)
// Appelée toutes les 5 minutes par pg_cron et à chaque nouvelle notification (voir supabase-push.sql).
// Secrets à définir dans Supabase → Edge Functions → Secrets : VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT.
// SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont fournis automatiquement par Supabase.
// Passe par l'API (pool partagé) et non par une connexion directe à la base : aucune connexion
// ne reste ouverte entre deux appels, ce qui économise la mémoire de la petite instance.
import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
webpush.setVapidDetails(
  Deno.env.get("VAPID_SUBJECT") ?? "mailto:contact@example.com",
  Deno.env.get("VAPID_PUBLIC_KEY")!,
  Deno.env.get("VAPID_PRIVATE_KEY")!,
);

Deno.serve(async () => {
  const { data, error } = await sb.rpc("mdt_notif_run");
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  const rows = (data ?? []) as any[];
  let sent = 0, removed = 0, failed = 0;
  await Promise.all(rows.map(async (r) => {
    try {
      await webpush.sendNotification(
        { endpoint: r.endpoint, keys: { p256dh: r.p256dh, auth: r.auth } },
        JSON.stringify({ title: r.title, body: r.body, url: r.url, tag: "mdt-" + r.id }),
        { TTL: 6 * 3600 },
      );
      sent++;
    } catch (e: any) {
      if (e && (e.statusCode === 404 || e.statusCode === 410)) { removed++; await sb.from("mdt_push").delete().eq("endpoint", r.endpoint); }
      else failed++;
    }
  }));
  return new Response(JSON.stringify({ total: rows.length, sent, removed, failed }), { headers: { "Content-Type": "application/json" } });
});
