/* Registers the caching service worker (see /sw.js).

   Deliberately skipped on localhost. A cache layer sitting in front of the
   dev server turns "I edited that file and nothing changed" into a recurring
   mystery, and hot reload and a service worker do not mix well. Production is
   where the speed-up matters, so that is where it runs.

   To try it locally anyway, from DevTools console:
     navigator.serviceWorker.register('/sw.js')
   and to undo that:
     navigator.serviceWorker.getRegistrations().then(r => r.forEach(x => x.unregister()))
*/
;(function () {
  if (!('serviceWorker' in navigator)) return

  var host = self.location.hostname
  var isLocal = host === 'localhost' || host === '127.0.0.1' || host === '[::1]'
  if (isLocal) return

  /* After load, so registration never competes with the page's own requests
     for bandwidth on the first visit — the one visit it cannot speed up. */
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').catch(function () {
      /* Unsupported, blocked, or served without HTTPS. The site works
         exactly as before; it simply is not cached. */
    })
  })
})()
