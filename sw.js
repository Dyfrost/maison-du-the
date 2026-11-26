// L’Unanimithé — service worker : notifications + cache des fichiers fixes (ouverture plus rapide)
const CACHE = 'mdt-static-v1';
// Fichiers qui changent rarement : servis depuis le cache, puis rafraîchis en arrière-plan.
// La page, version.js et les scripts du site passent toujours par le réseau (mises à jour immédiates).
const STATIC = /\/(vendor|_ds|img)\/|\.(png|jpe?g|webp|avif|svg|ico|woff2?|ttf)$|\/(image-slot|crop|i18n)\.js$/i;
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || r.cache === 'no-store') return;
  let u; try { u = new URL(r.url); } catch (x) { return; }
  if (u.origin !== self.location.origin || !STATIC.test(u.pathname)) return;
  e.respondWith(caches.open(CACHE).then(c => c.match(r).then(hit => {
    const net = fetch(r).then(res => { if (res && res.ok) c.put(r, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  })));
});
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('mdt-static-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'L’Unanimithé', {
    body: d.body || '', icon: 'icon-192.png', badge: 'icon-192.png', tag: d.tag || undefined, data: { url: d.url || './' }
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if ('focus' in c) { c.postMessage({ mdtOpen: url }); return c.focus(); } }
    return self.clients.openWindow(url);
  }));
});
