/* ═══════════════════════════════════════════════════════
   EVERYTHING REMOTE JOB — SERVICE WORKER
   Cache-first for app shell, network-first for fonts
═══════════════════════════════════════════════════════ */
const CACHE   = 'erj-v56';
const OFFLINE = '/offline.html';

const SHELL = [
  '/index.html',
  '/register.html',
  '/masterytraining/index.html',
  '/getaremotejob/index.html',
  '/cvscan/index.html',
  '/masterclass/index.html',
  '/innercircle/index.html',
  '/dashboard.html',
  '/login.html',
  '/admin-login.html',
  '/instructor-login.html',
  '/blog.html',
  '/testimonials.html',
  '/erj-nav.js',
  '/erj-theme.js',
  '/erj-product.js',
  '/erj-site.js',
  '/product.css',
  '/manifest.json',
  '/logo.png',
  '/founder-oluwaseyi.jpg',
  '/icon192.png',
  '/icon512.png',
  '/favicon32.png',
  OFFLINE,
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.all(
        SHELL.map(u => c.add(new Request(u, { cache: 'reload' })).catch(function(){ return null; }))
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
      // Self-heal: reload every open page so devices stuck on stale cached HTML
      // immediately pick up fresh content served by this new worker.
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then(clients => Promise.all(
        clients.map(c => ('navigate' in c) ? c.navigate(c.url).catch(() => null) : null)
      ))
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  if (url.hostname.includes('fonts.google') || url.hostname.includes('fonts.gstatic')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }

  // HTML pages: NETWORK-FIRST — published updates always show; cache is only the offline fallback.
  const isHTML = e.request.mode === 'navigate' ||
    (e.request.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(e.request).then(cached => cached || caches.match(OFFLINE)))
    );
    return;
  }

  // Static assets (css/js/images): STALE-WHILE-REVALIDATE — instant from cache, silently refreshed in background.
  e.respondWith(
    caches.match(e.request).then(cached => {
      const network = fetch(e.request)
        .then(res => {
          if (res && res.status === 200 && res.type !== 'opaque') {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});

self.addEventListener('push', e => {
  let data; try { data = e.data.json(); } catch (x) { data = { title: 'Everything Remote Job', body: 'You have an update!' }; }
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon192.png',
      badge: '/icon192.png',
      vibrate: [200, 100, 200],
      data: { url: data.url || '/dashboard.html' },
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data.url));
});
