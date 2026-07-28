import { useEffect, useRef, useState } from 'react'

/**
 * Track which section currently occupies the reading band of the viewport.
 *
 * IntersectionObserver only reports sections whose visibility *changed*, so
 * ranking the callback's entries alone can crown a section that is barely
 * entering over the one already filling the band. Instead we keep a running
 * set of what is currently intersecting and pick the first in document
 * order, which is deterministic regardless of which entries fired.
 *
 * @param {string[]} ids - section element ids, in document order
 * @returns {string|null} active id, or null when no section is in the band
 */
export function useScrollSpy(ids) {
  const [activeId, setActiveId] = useState(null)
  const visibleRef = useRef(new Set())

  useEffect(() => {
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!sections.length) return undefined

    const visible = visibleRef.current
    visible.clear()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        setActiveId(ids.find((id) => visible.has(id)) ?? null)
      },
      // A narrow band across the middle of the viewport
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => {
      observer.disconnect()
      visible.clear()
    }
  }, [ids])

  return activeId
}
