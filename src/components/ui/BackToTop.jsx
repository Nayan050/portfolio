import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'
import { cn } from '../../lib/utils'
import styles from './BackToTop.module.css'

/* Show it only once there is something to go back to. At the top of the page
   the button would be a control that does nothing, sitting over the hero. */
const SHOW_AFTER = 600

/**
 * Floating scroll-to-top control, bottom-right on every page.
 * The footer already has a text "Back to top"; this is the one you can reach
 * without scrolling to the bottom first.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false)
  const frameRef = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = requestAnimationFrame(() => {
        setVisible(window.scrollY > SHOW_AFTER)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const toTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
    /* Send focus back to the top of the document, or a keyboard user is left
       parked at the page foot with the button gone from under them. */
    document.getElementById('home')?.focus({ preventScroll: true })
  }

  return (
    <button
      type="button"
      className={cn(styles.button, visible && styles.visible)}
      onClick={toTop}
      aria-label="Back to top"
      /* Removed from the tab order while off-screen: a hidden control that
         still takes focus is worse than no control. */
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
    >
      <Icon name="arrow-down" size={18} className={styles.icon} />
    </button>
  )
}
