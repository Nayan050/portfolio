import { EXPERIENCE } from '../../data/experience'
import { Section } from '../layout/Section'
import { Icon } from '../ui/Icon'
import { cn } from '../../lib/utils'
import styles from './Experience.module.css'

export function Experience() {
  return (
    <Section
      id="experience"
      num="04"
      tone="elev"
      eyebrow="Work Experience"
      title="Where I've made systems safer"
      meta="2022 – present"
    >
      <ol className={styles.timeline}>
        {EXPERIENCE.map((job) => (
          <li key={`${job.org}-${job.period}`} className={styles.item}>
            <span
              className={cn(styles.marker, job.current && styles.markerCurrent)}
              aria-hidden="true"
            />
            <div className={styles.when}>
              <p className={styles.period}>
                {job.period}
                {job.current && <span className={styles.now}>Now</span>}
              </p>
              <p className={styles.place}>{job.location}</p>
            </div>
            <div className={styles.what}>
              <h3 className={styles.role}>{job.role}</h3>
              {job.href ? (
                <a
                  href={job.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.org}
                >
                  {job.org}
                  <Icon name="external" size={13} />
                </a>
              ) : (
                <p className={styles.org}>{job.org}</p>
              )}
              <ul className={styles.highlights}>
                {job.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}
