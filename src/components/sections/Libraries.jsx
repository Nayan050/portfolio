import { HUB_LINKS } from '../../data/site'
import { Section } from '../layout/Section'
import { Icon } from '../ui/Icon'
import { cn } from '../../lib/utils'
import styles from './Libraries.module.css'

/**
 * Showcase for the three standalone hubs carried over from the previous
 * site — living resources that keep working alongside the portfolio.
 */
export function Libraries() {
  return (
    <Section
      id="resources"
      num="08"
      tone="elev"
      eyebrow="Open Resources"
      title="Beyond the resume"
      meta="3 hubs · continuously updated"
    >
      <ul className={styles.grid}>
        {HUB_LINKS.map((hub) => (
          <li key={hub.href} className={styles.cell}>
            <div data-tone={hub.tone} className={cn(styles.card, 'sweep-card')}>
              {/* Same decorative language as the project cards: tone wash,
                  hatch, and the hub's own kicker number set as a watermark. */}
              <span className={styles.glow} aria-hidden="true" />
              <span className={styles.hatch} aria-hidden="true" />
              <span className={styles.index} aria-hidden="true">
                {hub.num}
              </span>

              <a
                href={hub.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                <span className={styles.head}>
                  <span className={styles.iconWrap} aria-hidden="true">
                    <Icon name={hub.icon} size={20} />
                  </span>
                  <span className={styles.meta}>{hub.meta}</span>
                </span>

                <h3 className={styles.title}>{hub.label}</h3>
                <span className={styles.desc}>{hub.description}</span>

                {hub.note && <span className={styles.note}>{hub.note}</span>}

                <span className={styles.cta}>
                  <span className={styles.ctaLabel}>Enter the hub</span>
                  <span className={styles.ctaIcon}>
                    <Icon name="arrow-right" size={13} />
                  </span>
                </span>
              </a>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}
