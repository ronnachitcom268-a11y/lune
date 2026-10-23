/* Lune service worker: เปิดหน้าเว็บได้แม้ออฟไลน์ชั่วคราว (เก็บเฉพาะหน้าหลัก ไม่แตะข้อมูลจากฐานข้อมูล) */
const C = "lune-v1";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  if (r.mode === "navigate") {
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(C).then(x => x.put("./", c)); return res; }).catch(() => caches.match("./")));
  }
});
