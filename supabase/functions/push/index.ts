// Maison du Thé — envoi des notifications (Supabase Edge Function « push »)
// Appelée chaque minute par pg_cron (voir supabase-push.sql). Secrets à définir dans
// Supabase → Edge Functions → Secrets : VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT (ex. mailto:vous@exemple.fr).
// SUPABASE_DB_URL est fourni automatiquement par Supabase.
import webpush from "npm:web-push@3.6.7";
import postgres from "npm:postgres@3.4.4";

const sql = postgres(Deno.env.get("SUPABASE_DB_URL")!, { prepare: false, max: 2 });
webpush.setVapidDetails(
  Deno.env.get("VAPID_SUBJECT") ?? "mailto:contact@example.com",
  Deno.env.get("VAPID_PUBLIC_KEY")!,
  Deno.env.get("VAPID_PRIVATE_KEY")!,
);

Deno.serve(async () => {
  const rows = await sql`select * from public.mdt_notif_run()`;
  let sent = 0, removed = 0, failed = 0;
  await Promise.all(rows.map(async (r: any) => {
    try {
      await webpush.sendNotification(
        { endpoint: r.endpoint, keys: { p256dh: r.p256dh, auth: r.auth } },
        JSON.stringify({ title: r.title, body: r.body, url: r.url, tag: "mdt-" + r.id }),
        { TTL: 6 * 3600 },
      );
      sent++;
    } catch (e: any) {
      if (e && (e.statusCode === 404 || e.statusCode === 410)) { removed++; await sql`delete from public.mdt_push where endpoint = ${r.endpoint}`; }
      else failed++;
    }
  }));
  return new Response(JSON.stringify({ total: rows.length, sent, removed, failed }), { headers: { "Content-Type": "application/json" } });
});
