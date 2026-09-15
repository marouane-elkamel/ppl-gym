// Offline support: precache the app and every exercise photo.
// Bump CACHE when you change files so phones pick up the new version.
const CACHE = "ppl-v3";

const SHELL = [
  "./",
  "index.html",
  "styles.css",
  "app.js",
  "store.js",
  "logic.js",
  "timer.js",
  "charts.js",
  "data/program.js",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // cache: "reload" so a CACHE bump really re-fetches, past the browser's HTTP cache.
    const fresh = (paths) => cache.addAll(paths.map((p) => new Request(p, { cache: "reload" })));
    await fresh(SHELL);
    await fresh(await (await fetch("img/index.json", { cache: "reload" })).json());
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  // Photos never change: cache first.
  if (url.pathname.includes("/img/")) {
    event.respondWith(caches.match(request).then((hit) => hit ?? fetchAndCache(request)));
    return;
  }

  // App files: answer from cache immediately, refresh the cache in the background.
  event.respondWith((async () => {
    const hit = await caches.match(request, { ignoreSearch: true });
    const refresh = fetchAndCache(request);
    if (hit) {
      event.waitUntil(refresh.catch(() => {}));
      return hit;
    }
    return refresh;
  })());
});

async function fetchAndCache(request) {
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}
