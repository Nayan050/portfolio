import { HUB_LINKS, NAV_LINKS, SITE, SOCIALS } from '../../data/site'
import { scrollToTarget } from '../../lib/scroll'
import { Icon } from '../ui/Icon'
import styles from './Footer.module.css'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <p className={styles.wordmark}>
              {SITE.monogram}
              <span className={styles.dot}>.</span>
            </p>
            <p className={styles.tagline}>
              Most of this work is invisible. That is what it looks like when it
              is going well.
            </p>
          </div>

          <nav aria-label="Footer" className={styles.col}>
            <p className={styles.colTitle}>Navigate</p>
            <ul className={styles.list}>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={styles.link}
                    onClick={(event) => {
                      event.preventDefault()
                      scrollToTarget(link.href)
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.col}>
            <p className={styles.colTitle}>Resources</p>
            <ul className={styles.list}>
              {HUB_LINKS.map((hub) => (
                <li key={hub.href}>
                  <a
                    href={hub.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    {hub.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <p className={styles.colTitle}>Connect</p>
            <ul className={styles.list}>
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    className={styles.link}
                    {...(social.href.startsWith('http')
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                  >
                    <Icon name={social.icon} size={15} className={styles.linkIcon} />
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            © {year} {SITE.name} · Found a bug in here? You know where to find
            me.
          </p>
          <button
            type="button"
            className={styles.toTop}
            onClick={() => scrollToTarget('#home')}
          >
            Back to top
            <Icon name="arrow-down" size={15} className={styles.toTopIcon} />
          </button>
        </div>
      </div>
    </footer>
  )
}
