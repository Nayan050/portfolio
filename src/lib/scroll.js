/**
 * Jump to an in-page target and move focus there.
 * Instant by design — the site uses no scroll animation.
 */
export function scrollToTarget(hash) {
  const element = document.querySelector(hash)
  if (!element) return

  element.scrollIntoView()
  element.focus({ preventScroll: true })
  if (history.replaceState) history.replaceState(null, '', hash)
}

/** Freeze page scrolling while a modal owns the viewport. */
export function lockScroll(locked) {
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}
