/* ===========================================================================
   Service worker: make the second visit fast, even on a bad connection.

   WHAT THIS BUYS
   On a repeat visit the browser serves the fonts, CSS and JS straight from
   disk instead of asking the network. On a slow or flaky link that is the
   difference between a blank page and an instant one — and the site keeps
   working with no connection at all.

   STRATEGY, PER KIND OF REQUEST

   1. Content-hashed build output  (/assets/index-BrQlZOIY.js, the woff2 fonts)
      Cache-first, kept forever. The hash IS the version: when the content
      changes Vite emits a new filename, so a cached entry can never be stale.
      Old ones are swept on activate.

   2. HTML documents  (/, /news/, /tools/, /knowledge/)
      Network-first, falling back to cache. A visitor always gets the newest
      page when the network answers, and a cached one when it does not. This
      is what stops a service worker pinning people to an old build.

   3. Unhashed static  (/assets/js/*.js, /assets/hub.css, /assets/data/*.json)
      Stale-while-revalidate: serve the cached copy immediately, fetch a fresh
      one in the background for next time. These filenames never change, so
      cache-first would strand an edit; network-first would waste the speed-up.

   4. Everything cross-origin  (RSS feeds, GitHub, NVD, Wikipedia, Web3Forms)
      Not intercepted at all. Those already cache in localStorage with their
      own freshness rules, and a form POST must never be served from a cache.

   BUMP `VERSION` when the caching rules here change. Asset changes do not
   need it — the hashes and the revalidation handle themselves.
=========================================================================== */

const VERSION = 'v2'
const IMMUTABLE_CACHE = `immutable-${VERSION}`
const PAGE_CACHE = `pages-${VERSION}`
const STATIC_CACHE = `static-${VERSION}`
const CURRENT = [IMMUTABLE_CACHE, PAGE_CACHE, STATIC_CACHE]

/* Hand-written files live at known paths and their names never change, so
   they are listed rather than pattern-matched. This check runs BEFORE the
   hash test on purpose.

   The hash test alone got this wrong: `sw-register.js` contains a hyphen
   followed by exactly eight letters, so it looked hash-named and was cached
   as immutable — meaning a future change to the registration logic could
   never reach a browser that already had it. Matching a filename shape is a
   guess; an explicit list is not. */
const MUTABLE_PATHS = [
  '/assets/js/',
  '/assets/data/',
  '/assets/fonts/',
  '/assets/images/',
  '/assets/hub.css',
]

const isMutable = (pathname) => MUTABLE_PATHS.some((prefix) => pathname.startsWith(prefix))

/* Vite emits `name-<hash>.ext`. The hash IS the version, which is what makes
   cache-first safe here. Only reached for paths not already known mutable. */
const HASHED = /-[A-Za-z0-9_-]{8,}\.(?:js|css|woff2|woff|ttf)$/

/* The dev server's own plumbing. Caching any of it breaks hot reload. */
const DEV_PATHS = /^\/(?:@|src\/|node_modules\/)/

self.addEventListener('install', () => {
  /* No precache list: it would have to name the hashed files, which change
     every build. Everything is cached on first use instead, so install is
     instant and nothing is downloaded that the visitor never asks for. */
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys()
      await Promise.all(
        names.filter((name) => !CURRENT.includes(name)).map((name) => caches.delete(name)),
      )
      await self.clients.claim()
    })(),
  )
})

/** Cache-first: disk if present, otherwise network and remember it. */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const hit = await cache.match(request)
  if (hit) return hit

  const response = await fetch(request)
  if (response.ok) cache.put(request, response.clone())
  return response
}

/** Network-first: freshest wins, cache is the safety net. */
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  try {
    const response = await fetch(request)
    if (response.ok) cache.put(request, response.clone())
    return response
  } catch (error) {
    const hit = await cache.match(request)
    if (hit) return hit
    /* Nothing cached and no network: let the browser show its own offline
       page rather than inventing one. */
    throw error
  }
}

/** Stale-while-revalidate: instant from cache, refreshed underneath. */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const hit = await cache.match(request)

  const network = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone())
      return response
    })
    .catch(() => null)

  if (hit) return hit
  const response = await network
  if (response) return response
  throw new Error('offline and uncached')
}

self.addEventListener('fetch', (event) => {
  const { request } = event

  // Only GET is cacheable; a POST to Web3Forms must always hit the network.
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // Third-party APIs and feeds keep their own caching. Leave them alone.
  if (url.origin !== self.location.origin) return

  if (DEV_PATHS.test(url.pathname)) return

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, PAGE_CACHE))
    return
  }

  if (!isMutable(url.pathname) && HASHED.test(url.pathname)) {
    event.respondWith(cacheFirst(request, IMMUTABLE_CACHE))
    return
  }

  if (url.pathname.startsWith('/assets/') || url.pathname === '/favicon.svg') {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE))
  }
})

/* Lets a page force the new worker to take over without a second reload. */
self.addEventListener('message', (event) => {
  if (event.data === 'skip-waiting') self.skipWaiting()
})
