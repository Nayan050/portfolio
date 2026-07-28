import { useEffect, useMemo, useRef, useState } from 'react'
import { NAV_LINKS, SITE } from '../../data/site'
import { useTheme } from '../../hooks/useTheme'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import { scrollToTarget } from '../../lib/scroll'
import { Icon } from '../ui/Icon'
import { cn } from '../../lib/utils'
import styles from './Header.module.css'

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const progressRef = useRef(null)

  const sectionIds = useMemo(
    () => ['home', ...NAV_LINKS.map((link) => link.href.slice(1))],
    [],
  )
  const activeId = useScrollSpy(sectionIds)

  useEffect(() => {
    let rafId = 0
    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24)
        const doc = document.documentElement
        const max = doc.scrollHeight - doc.clientHeight
        const progress = max > 0 ? window.scrollY / max : 0
        progressRef.current?.style.setProperty('--progress', progress.toFixed(4))
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const navigate = (event, href) => {
    event.preventDefault()
    setMenuOpen(false)
    scrollToTarget(href)
  }

  const renderLinks = (linkClass) =>
    NAV_LINKS.map((link) => (
      <li key={link.href}>
        <a
          href={link.href}
          onClick={(event) => navigate(event, link.href)}
          className={cn(linkClass, activeId === link.href.slice(1) && styles.active)}
          aria-current={activeId === link.href.slice(1) ? 'true' : undefined}
        >
          {link.label}
        </a>
      </li>
    ))

  return (
    <header className={cn(styles.header, scrolled && styles.scrolled)}>
      <a href="#main" className="skip-link" onClick={(event) => navigate(event, '#main')}>
        Skip to content
      </a>
      <div className={cn('container', styles.inner)}>
        <a
          href="#home"
          className={styles.logo}
          onClick={(event) => navigate(event, '#home')}
          aria-label={`${SITE.name}, back to top`}
        >
          {SITE.monogram}
          <span className={styles.logoDot}>.</span>
        </a>

        <nav aria-label="Primary" className={styles.desktopNav}>
          <ul className={styles.navList}>{renderLinks(styles.navLink)}</ul>
        </nav>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            <span className={cn(styles.themeIcon, theme === 'dark' && styles.themeIconActive)}>
              <Icon name="moon" size={17} />
            </span>
            <span className={cn(styles.themeIcon, theme === 'light' && styles.themeIconActive)}>
              <Icon name="sun" size={17} />
            </span>
          </button>

          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={20} />
            <span className="visually-hidden">{menuOpen ? 'Close menu' : 'Open menu'}</span>
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Primary, mobile"
        className={styles.mobileNav}
        hidden={!menuOpen}
      >
        <ul className={styles.mobileList}>{renderLinks(styles.mobileLink)}</ul>
      </nav>

      <span ref={progressRef} className={styles.progress} aria-hidden="true" />
    </header>
  )
}
