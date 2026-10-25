// সার্ভিস ওয়ার্কার: অ্যাপের মূল ফাইল ক্যাশ করে, যাতে ইন্টারনেট ছাড়াও খোলে। Supabase ও অন্য API সবসময় নেটওয়ার্ক থেকে।
const V = 'amar-bd-v52';
const SHELL = ['./MyBangladesh_App.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
// ঐচ্ছিক (না থাকলেও ইনস্টল আটকাবে না): নিজের ফন্ট ও লোকেশন-ডেটা
const EXTRA = ['./bangladesh-geo.json', './fonts/hind-siliguri-400.woff', './fonts/hind-siliguri-500.woff', './fonts/hind-siliguri-600.woff', './fonts/hind-siliguri-700.woff'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL).then(() => Promise.all(EXTRA.map(u => c.add(u).catch(() => {}))))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  // পেজ: আগে নেটওয়ার্ক (নতুন সংস্করণ পেতে), না পেলে ক্যাশ
  if (r.mode === 'navigate') { e.respondWith(fetch(r).then(x => { const c = x.clone(); caches.open(V).then(ch => ch.put(r, c)); return x; }).catch(() => caches.match(r).then(h => h || caches.match('./MyBangladesh_App.html')))); return; }
  e.respondWith(caches.match(r).then(h => h || fetch(r).then(x => { if (x && x.ok) { const c = x.clone(); caches.open(V).then(ch => ch.put(r, c)); } return x; })));
});

self.addEventListener('notificationclick', e => { e.notification.close(); e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs => { for (const c of cs) { if ('focus' in c) return c.focus(); } return self.clients.openWindow('./MyBangladesh_App.html'); })); });
