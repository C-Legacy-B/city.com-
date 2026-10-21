/* City Legacy Bank PWA service worker — project-subpath safe for GitHub Pages. */
const CACHE_VERSION = 'clb-pwa-v2';
const SHELL_CACHE = CACHE_VERSION + '-shell';
const RUNTIME_CACHE = CACHE_VERSION + '-runtime';
const PRECACHE_URLS = [
  './', './index.html', './loan.html', './agent.html', './manifest.webmanifest',
  './favicon.png', './apple-touch-icon.png', './icon-72.png', './icon-96.png',
  './icon-128.png', './icon-144.png', './icon-152.png', './icon-180.png',
  './icon-192.png', './icon-256.png', './icon-384.png', './icon-512.png',
  './icon-maskable-192.png', './icon-maskable-512.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(SHELL_CACHE).then(async cache => {
    // Cache resources individually so one unavailable file cannot cancel the whole shell install.
    await Promise.all(PRECACHE_URLS.map(async path => {
      try { const response = await fetch(path, {cache:'reload'}); if (response.ok) await cache.put(path, response); } catch (_) {}
    }));
  }).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('clb-pwa-') && key !== SHELL_CACHE && key !== RUNTIME_CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
function isApiRequest(url) {
  const h = url.hostname || '';
  return h.includes('jsonbin.io') || h.includes('api.') || h.includes('googleapis.com') || h.includes('gstatic.com') || url.pathname.includes('/api/');
}
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) {
    if (isApiRequest(url)) return;
    event.respondWith(caches.open(RUNTIME_CACHE).then(async cache => {
      const cached = await cache.match(req);
      const network = fetch(req).then(res => { if (res && res.ok) cache.put(req, res.clone()); return res; }).catch(() => cached);
      return cached || network;
    }));
    return;
  }
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(fetch(req).then(res => { if (res && res.ok) caches.open(SHELL_CACHE).then(c => c.put(req, res.clone())); return res; }).catch(async () => {
      const path = new URL(req.url).pathname;
      const cached = await caches.match(req) || await caches.match(path) || await caches.match('./index.html') || await caches.match('./');
      return cached || new Response('City Legacy is offline. Reconnect to continue.', {status:503,headers:{'Content-Type':'text/plain'}});
    }));
    return;
  }
  event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(res => {
    if (res && res.ok) { const copy = res.clone(); caches.open(RUNTIME_CACHE).then(c => c.put(req, copy)); }
    return res;
  })));
});
self.addEventListener('message', event => { if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting(); });
