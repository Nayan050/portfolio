/* Shared helpers for the three static hubs. Loaded before news.js, tools.js
   and knowledge.js on every hub page. */

/* ---------------------------------------------------------------------------
   Output encoding.

   Every card on these three pages is built with innerHTML from data fetched
   at runtime out of somebody else's system: 22 RSS feeds, the GitHub search
   API, NVD, Wikipedia, DuckDuckGo, the CISA KEV catalogue. None of that is
   trustworthy input.

   Verified, not assumed: seeding a GitHub-shaped repo description of
   `<img src=x onerror=...>` into the trending cache and reloading /tools/ ran
   the handler in this origin. The same held on /news/ through a KEV
   shortDescription. The tag-stripping regex in news.js only covered the RSS
   path, and stripping is the wrong tool anyway — encode on output instead, at
   the single point where a string becomes markup.
--------------------------------------------------------------------------- */
const HTML_ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

/** Escape for HTML text and quoted-attribute contexts. */
function esc(value) {
  if (value === null || value === undefined) return ''
  return String(value).replace(/[&<>"']/g, (char) => HTML_ESCAPES[char])
}

/* Card clicks call window.open() with a URL that came from a feed. A
   `javascript:` or `data:` URL there executes in this origin, so the scheme is
   checked against an allowlist rather than a blocklist. Returns null when the
   URL is unusable, and callers must treat null as "not clickable". */
function safeUrl(value) {
  if (!value) return null
  const trimmed = String(value).trim()
  try {
    const url = new URL(trimmed, window.location.href)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null
  } catch (e) {
    return null
  }
}

window.esc = esc
window.safeUrl = safeUrl

/* Theme toggle for the static hubs.
   Uses the same `data-theme` attribute and the same localStorage key as the
   main site, so switching theme on a hub carries back to the portfolio and
   vice versa. The pre-paint read happens inline in each page's <head>; this
   only wires the button. */
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('theme-toggle')
  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'
      document.documentElement.dataset.theme = next
      localStorage.setItem('theme', next)
      toggle.setAttribute(
        'aria-label',
        next === 'light' ? 'Switch to dark theme' : 'Switch to light theme',
      )
    })
  }

  /* Footer year — was an inline <script> on each of the three pages. */
  const year = document.getElementById('year')
  if (year) year.textContent = new Date().getFullYear()

  /* Connect-column icons, matching src/components/ui/Icon.jsx so the footer is
     the portfolio's footer rather than a lookalike. Injected instead of being
     pasted into all three pages: they are decorative (aria-hidden), and one
     copy beats four that can drift apart. */
  const SOCIAL_PATHS = {
    github:
      'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
    linkedin:
      'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
    medium:
      'M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42S14.2 15.54 14.2 12s1.51-6.42 3.38-6.42S20.96 8.46 20.96 12zM24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z',
    telegram:
      'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z',
  }

  const SVG_NS = 'http://www.w3.org/2000/svg'

  document.querySelectorAll('[data-social]').forEach((link) => {
    const name = link.dataset.social
    const svg = document.createElementNS(SVG_NS, 'svg')
    svg.setAttribute('width', '15')
    svg.setAttribute('height', '15')
    svg.setAttribute('viewBox', '0 0 24 24')
    svg.setAttribute('aria-hidden', 'true')
    svg.setAttribute('focusable', 'false')
    svg.setAttribute('class', 'footer-link-icon')

    if (name === 'mail') {
      // The only stroke icon in the set; the rest are solid brand marks.
      svg.setAttribute('fill', 'none')
      svg.setAttribute('stroke', 'currentColor')
      svg.setAttribute('stroke-width', '2')
      svg.setAttribute('stroke-linecap', 'round')
      svg.setAttribute('stroke-linejoin', 'round')
      const rect = document.createElementNS(SVG_NS, 'rect')
      rect.setAttribute('x', '2')
      rect.setAttribute('y', '4')
      rect.setAttribute('width', '20')
      rect.setAttribute('height', '16')
      rect.setAttribute('rx', '2')
      const flap = document.createElementNS(SVG_NS, 'path')
      flap.setAttribute('d', 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7')
      svg.append(rect, flap)
    } else {
      const d = SOCIAL_PATHS[name]
      if (!d) return
      svg.setAttribute('fill', 'currentColor')
      const path = document.createElementNS(SVG_NS, 'path')
      path.setAttribute('d', d)
      svg.appendChild(path)
    }

    link.prepend(svg)
  })

  const scrollToTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  /* Footer "Back to top", matching the portfolio's. */
  const toTop = document.getElementById('back-to-top')
  if (toTop) toTop.addEventListener('click', scrollToTop)

  /* Floating scroll-to-top, mirroring src/components/ui/BackToTop.jsx.
     Built here rather than pasted into all three pages: it needs a scroll
     listener regardless, so the markup may as well live with the behaviour. */
  const float = document.createElement('button')
  float.type = 'button'
  float.className = 'float-top'
  float.setAttribute('aria-label', 'Back to top')
  float.innerHTML =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
    ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>'
  float.addEventListener('click', scrollToTop)
  document.body.appendChild(float)

  /* Hidden until there is something to go back to. */
  const SHOW_AFTER = 600
  let frame = 0
  const syncFloat = () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      const show = window.scrollY > SHOW_AFTER
      float.classList.toggle('is-visible', show)
      // A hidden control that still takes focus is worse than no control.
      float.tabIndex = show ? 0 : -1
      float.setAttribute('aria-hidden', show ? 'false' : 'true')
    })
  }
  syncFloat()
  window.addEventListener('scroll', syncFloat, { passive: true })

  /* Trending-topic chips on the knowledge page. These began life as inline
     onclick="setQuery(...)" attributes; wiring them here removes the last
     inline script from the hub markup. No-op on the other two pages. */
  document.querySelectorAll('.filter-btn[data-query]').forEach((chip) => {
    chip.addEventListener('click', () => {
      const input = document.getElementById('knowledge-search')
      if (input) input.value = chip.dataset.query
      if (typeof window.setQuery === 'function') window.setQuery(chip.dataset.query)
      else document.getElementById('ask-btn')?.click()
    })
  })
})
