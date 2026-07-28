/* Resolve the theme before first paint, so there is no flash of the wrong
   scheme. Reads the same localStorage key ("theme") every page uses.

   This lives in a file rather than an inline <script> on purpose: an inline
   script forces `script-src 'unsafe-inline'` in the Content-Security-Policy,
   and that single keyword is what makes a CSP useless against injected
   `onerror=` handlers. Loaded synchronously in <head>, an external script
   still runs before the body paints, so nothing is lost.

   Keep this file tiny — it blocks rendering by design. */
;(function () {
  try {
    var saved = localStorage.getItem('theme')
    /* Light is the default. A saved choice still wins, but with nothing saved
       the site opens light regardless of the visitor's OS setting — this used
       to follow prefers-color-scheme, so a visitor on a dark desktop landed on
       the dark theme and never saw the intended one. */
    document.documentElement.dataset.theme = saved === 'dark' ? 'dark' : 'light'
  } catch (e) {
    document.documentElement.dataset.theme = 'light'
  }
})()
