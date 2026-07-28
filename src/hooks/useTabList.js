import { useCallback, useRef, useState } from 'react'

/**
 * Accessible tablist state: selection plus the keyboard interaction pattern
 * from the WAI-ARIA Authoring Practices (Left/Right/Up/Down, Home, End).
 * Tabs use a roving tabindex — only the selected tab is in the tab order.
 *
 * @param {string[]} ids - tab ids in visual order
 * @param {string} [initialId]
 */
export function useTabList(ids, initialId) {
  const [activeId, setActiveId] = useState(initialId ?? ids[0])
  const tabRefs = useRef(new Map())

  const registerTab = useCallback(
    (id) => (node) => {
      if (node) tabRefs.current.set(id, node)
      else tabRefs.current.delete(id)
    },
    [],
  )

  const select = useCallback((id) => {
    setActiveId(id)
    tabRefs.current.get(id)?.focus()
  }, [])

  const onKeyDown = useCallback(
    (event) => {
      const index = ids.indexOf(activeId)
      if (index === -1) return

      let nextIndex = null
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          nextIndex = (index + 1) % ids.length
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          nextIndex = (index - 1 + ids.length) % ids.length
          break
        case 'Home':
          nextIndex = 0
          break
        case 'End':
          nextIndex = ids.length - 1
          break
        default:
          return
      }

      event.preventDefault()
      select(ids[nextIndex])
    },
    [activeId, ids, select],
  )

  return { activeId, setActiveId, select, onKeyDown, registerTab }
}
