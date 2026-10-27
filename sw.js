// Chỉ lưu sẵn phần vỏ app (logo, trang khung) để mở nhanh. Web HĐCM bên trong luôn tải mới từ Google.
var BAN = 'hdcm-vo-4';
var VO = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(BAN).then(function (c) { return c.addAll(VO); })); self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== BAN; }).map(function (k) { return caches.delete(k); })); }));
  self.clients.claim();
});
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (u.origin !== self.location.origin) return;              // không đụng tới Google
  e.respondWith(fetch(e.request).then(function (r) {         // ưu tiên bản mới, mất mạng thì dùng bản lưu
    var c = r.clone(); caches.open(BAN).then(function (k) { k.put(e.request, c); }); return r;
  }).catch(function () { return caches.match(e.request); }));
});
