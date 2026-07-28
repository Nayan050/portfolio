import { ABOUT } from '../../data/about'
import { PROFILE_STATS, SITE } from '../../data/site'
import { Section } from '../layout/Section'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { LocalTime } from '../ui/LocalTime'
import { cn } from '../../lib/utils'
import styles from './About.module.css'

export function About() {
  return (
    <Section
      id="about"
      num="01"
      eyebrow="About"
      title="The person behind the alerts"
      meta={SITE.location}
    >
      <p className={styles.lede}>{ABOUT.paragraphs[0]}</p>

      <div className={styles.grid}>
        <div className={styles.main}>
          {ABOUT.paragraphs.slice(1).map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className={styles.body}>
              {paragraph}
            </p>
          ))}

          <ul className={styles.roles}>
            {ABOUT.titles.map((title) => (
              <li key={title} className={styles.role}>
                <Icon name="check" size={14} className={styles.roleIcon} />
                {title}
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            <Button href={SITE.resumeUrl} external icon="document">
              Download resume
            </Button>
            <Button href={`mailto:${SITE.email}`} variant="ghost" icon="mail">
              Email me
            </Button>
          </div>
        </div>

        <dl className={styles.facts}>
          {ABOUT.facts.map((fact) => (
            <div
              key={fact.label}
              className={cn(styles.fact, fact.emphasis && styles.factOpen)}
            >
              <dt className={styles.factLabel}>{fact.label}</dt>
              <dd className={styles.factValue}>{fact.value}</dd>
            </div>
          ))}
          <div className={styles.fact}>
            <dt className={styles.factLabel}>Local time</dt>
            <dd className={styles.factValue}>
              <LocalTime timeZone={SITE.timezone} className={styles.time} />
              <span className={styles.zone}>{SITE.timezoneLabel}</span>
            </dd>
          </div>
        </dl>
      </div>

      <dl className={styles.stats}>
        {PROFILE_STATS.map((stat) => (
          <div key={stat.label} className={styles.stat}>
            <dt className={styles.statLabel}>{stat.label}</dt>
            <dd className={`${styles.statValue} gradient-text`}>
              {stat.value}
              {stat.suffix}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
