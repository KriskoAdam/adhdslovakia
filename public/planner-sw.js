const CACHE_NAME = "adhd-planner-v1";
const APP_SHELL = ["/sk/planovac", "/en/planovac", "/sk/appky", "/en/appky", "/sk/appky/flow", "/en/appky/flow"];

async function cacheShell(cache, path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not cache planner page: ${path}`);
  await cache.put(path, response.clone());

  const html = await response.text();
  const assets = new Set(
    [...html.matchAll(/(?:src|href)=["']([^"']*\/_next\/static\/[^"']+)["']/g)]
      .map((match) => new URL(match[1], self.location.origin).href),
  );

  for (const asset of [...assets]) {
    try {
      const assetResponse = await fetch(asset);
      if (!assetResponse.ok) continue;
      await cache.put(asset, assetResponse.clone());
      if (asset.endsWith(".css")) {
        const css = await assetResponse.text();
        const fonts = [...css.matchAll(/url\(["']?([^"')]*\/_next\/static\/[^"')]+)["']?\)/g)]
          .map((match) => new URL(match[1], self.location.origin).href);
        for (const font of fonts) {
          try {
            const fontResponse = await fetch(font);
            if (fontResponse.ok) await cache.put(font, fontResponse);
          } catch { /* The page remains usable if a decorative font cannot be cached. */ }
        }
      }
    } catch { /* Nonessential chunks can be cached on the next online visit. */ }
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.all(APP_SHELL.map((path) => cacheShell(cache, path))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key.startsWith("adhd-planner-") && key !== CACHE_NAME)
        .map((key) => caches.delete(key)),
    )).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      }).catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        const fallback = url.pathname.startsWith("/en/") ? "/en/planovac" : "/sk/planovac";
        return (await caches.match(fallback)) || Response.error();
      }),
    );
    return;
  }

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })),
    );
  }
});
