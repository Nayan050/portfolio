import { cn } from '../../lib/utils'
import styles from './Section.module.css'

/**
 * Semantic page section with a fixed header grammar so every section opens
 * identically:  [num chip] LABEL ———rule——— META  /  Title.
 * `tone="elev"` alternates the surface for page rhythm. `tabIndex={-1}`
 * lets in-page navigation move focus here.
 */
export function Section({ id, num, eyebrow, title, meta, tone, className, children }) {
  const headingId = `${id}-heading`
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      tabIndex={-1}
      className={cn(styles.section, tone === 'elev' && styles.toneElev, className)}
    >
      <div className={cn('container', styles.inner)}>
        <header className={styles.header}>
          <div className={styles.kicker}>
            {num && (
              <span className={styles.num} aria-hidden="true">
                {num}
              </span>
            )}
            <p className={styles.eyebrow}>{eyebrow}</p>
            <span className={styles.rule} aria-hidden="true" />
            {meta && <p className={styles.meta}>{meta}</p>}
          </div>
          <h2 id={headingId} className={styles.title}>
            {title}
          </h2>
        </header>
        {children}
      </div>
    </section>
  )
}
