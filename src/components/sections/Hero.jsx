import { scrollToTarget } from '../../lib/scroll'
import { HUB_LINKS, SITE, SOCIALS } from '../../data/site'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import styles from './Hero.module.css'

export function Hero() {
  return (
    <section id="home" tabIndex={-1} aria-label="Introduction" className={styles.hero}>
      <div className={styles.backdrop} aria-hidden="true">
        <span className={styles.dots} />
        <span className={styles.wash} />
      </div>

      <div className={`container ${styles.inner}`}>
        <p className={styles.status}>
          <span className={styles.statusBreak}>{SITE.status.breaking}</span>
          <span className={styles.statusSeam} aria-hidden="true" />
          <span className={styles.statusSecure}>{SITE.status.securing}</span>
        </p>

        {/* The {' '} is load-bearing. Both spans are display:block, so JSX
            dropping the newline between them cost nothing visually but made
            h1.textContent read "NayanAcharya". Rendered-text extraction copes
            with the block boundary, but the name in the h1 is the single
            strongest on-page signal for a search on it, and there is no reason
            to make anything infer the word break. Whitespace between two block
            boxes collapses to nothing, so this changes no layout. */}
        <h1 className={styles.title}>
          <span className={styles.line}>Nayan</span>{' '}
          <span className={`${styles.line} gradient-text`}>Acharya</span>
        </h1>

        <div className={styles.intro}>
          <div>
            <p className={styles.role}>{SITE.role}</p>
            <p className={styles.handle}>@{SITE.handle}</p>
          </div>
          <div className={styles.creed}>
            <p className={styles.creedQuote}>{SITE.valueProp.creed}</p>
            <p className={styles.creedGloss}>{SITE.valueProp.gloss}</p>
          </div>
        </div>

        <div className={styles.actions}>
          <Button icon="arrow-down" onClick={() => scrollToTarget('#about')}>
            About me
          </Button>
          <Button variant="ghost" onClick={() => scrollToTarget('#contact')}>
            Get in touch
          </Button>
          <Button variant="ghost" href={SITE.resumeUrl} external icon="external">
            Resume
          </Button>
        </div>

        {/* Full-width footer bar: profiles left, resource hubs right */}
        <div className={styles.bar}>
          <ul className={styles.socials} aria-label="Social profiles">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  aria-label={social.label}
                  className={styles.socialLink}
                  {...(social.href.startsWith('http')
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  <Icon name={social.icon} size={18} />
                </a>
              </li>
            ))}
          </ul>

          {/* Direct entry to the standalone hubs, without scrolling the page */}
          <nav className={styles.hubs} aria-label="Resource hubs">
            <span className={styles.hubsLabel}>Resources</span>
            <ul className={styles.hubsList}>
              {HUB_LINKS.map((hub) => (
                <li key={hub.href}>
                  <a
                    href={hub.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.hubLink}
                  >
                    <Icon name={hub.icon} size={14} />
                    {hub.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  )
}
