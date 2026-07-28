import { RESEARCH } from '../../data/about'
import { Section } from '../layout/Section'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import styles from './Research.module.css'

/** Published research — currently one IEEE Xplore paper, presented in full. */
export function Research() {
  return (
    <Section
      id="research"
      num="06"
      tone="elev"
      eyebrow="Research"
      title="Published work"
      meta={`${RESEARCH.venue} · ${RESEARCH.year}`}
    >
      <article className={styles.paper}>
        <header className={styles.head}>
          <span className={styles.badge}>
            <Icon name="flask" size={15} />
            {RESEARCH.venue}
          </span>
          <span className={styles.role}>
            Published {RESEARCH.year} · {RESEARCH.topic}
          </span>
        </header>

        <h3 className={styles.title}>{RESEARCH.title}</h3>

        <div className={styles.body}>
          <div>
            <p className={styles.label}>Abstract</p>
            <p className={styles.abstract}>{RESEARCH.abstract}</p>

            <div className={styles.actions}>
              {RESEARCH.links.map((link) => (
                <Button
                  key={link.href}
                  href={link.href}
                  external
                  icon={link.icon}
                  variant={link.primary ? 'primary' : 'ghost'}
                >
                  {link.label}
                </Button>
              ))}
            </div>
          </div>

          <dl className={styles.highlights}>
            {RESEARCH.highlights.map((item) => (
              <div key={item.label} className={styles.highlight}>
                <dt className={styles.highlightLabel}>{item.label}</dt>
                <dd className={styles.highlightValue}>{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </article>
    </Section>
  )
}
