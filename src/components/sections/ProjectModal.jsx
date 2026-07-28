import { useEffect, useRef } from 'react'
import { lockScroll } from '../../lib/scroll'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { Pill } from '../ui/Pill'
import styles from './ProjectModal.module.css'

/**
 * Case-study overlay on the native <dialog> element — focus trapping and
 * background inerting come from the platform.
 *
 * React state is the single source of truth for open/closed. The dialog's
 * `close` event is deliberately not relied upon: it does not bubble and
 * proved unreliable, which previously left the page scroll locked after
 * dismissal. Esc is intercepted via `cancel` and routed through the same
 * state path so the two can never disagree.
 *
 * @param {React.RefObject<HTMLElement>} restoreFocusRef element to refocus on close
 */
export function ProjectModal({ project, onClose, restoreFocusRef }) {
  const dialogRef = useRef(null)
  const contentRef = useRef(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (project) {
      if (!dialog.open) {
        dialog.showModal()
        lockScroll(true)
        contentRef.current?.scrollTo?.(0, 0)
      }
    } else if (dialog.open) {
      dialog.close()
      lockScroll(false)
      // After close(), so focus is not stolen back by the dialog teardown.
      restoreFocusRef?.current?.focus()
    }
  }, [project, restoreFocusRef])

  // Release the lock if this ever unmounts while open.
  useEffect(() => () => lockScroll(false), [])

  /* Esc, guaranteed. `cancel` below covers spec-compliant browsers, but a
     plain keydown listener is not dependent on native dialog eventing —
     without it, a browser that swallows `cancel` would leave the overlay
     stuck open with the page scroll locked. Both routes call the same
     state setter, so a double fire is harmless. */
  useEffect(() => {
    if (!project) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current?.()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [project])

  const handleCancel = (event) => {
    event.preventDefault()
    onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      onCancel={handleCancel}
      aria-labelledby={project ? 'case-study-title' : undefined}
    >
      {project && (
        <div className={styles.frame}>
          {/* Click-to-dismiss backdrop. Deliberately not focusable: it used
              to capture initial focus when the dialog opened. Keyboard users
              close with Esc or the close button. */}
          <div className={styles.scrim} onClick={onClose} aria-hidden="true" />

          <article ref={contentRef} className={styles.content}>
            <button
              type="button"
              className={styles.close}
              onClick={onClose}
              aria-label="Close project details"
            >
              <Icon name="close" size={18} />
            </button>

            <header className={styles.head}>
              <p className="eyebrow">
                {project.categoryLabel}
                {project.year ? ` · ${project.year}` : ''}
              </p>
              <h2 id="case-study-title" className={styles.title}>
                {project.title}
              </h2>
              <p className={styles.tagline}>{project.tagline}</p>
              <ul className={styles.stack} aria-label="Technology stack">
                {project.stack.map((tech) => (
                  <Pill as="li" key={tech}>
                    {tech}
                  </Pill>
                ))}
              </ul>
            </header>

            {project.summary ? (
              <section aria-labelledby="case-summary" className={styles.block}>
                <h3 id="case-summary" className={styles.blockTitle}>
                  What It Is
                </h3>
                <p className={styles.challenge}>{project.summary}</p>
              </section>
            ) : null}

            {project.challenge ? (
              <section aria-labelledby="case-challenge" className={styles.block}>
                <h3 id="case-challenge" className={styles.blockTitle}>
                  The Challenge
                </h3>
                <p className={styles.challenge}>{project.challenge}</p>
              </section>
            ) : null}

            {project.process ? (
              <section aria-labelledby="case-process" className={styles.block}>
                <h3 id="case-process" className={styles.blockTitle}>
                  The Process
                </h3>
                {/* Scrolls horizontally, so it must be reachable by keyboard */}
                <ol
                  className={styles.timeline}
                  tabIndex={0}
                  aria-label="Process steps, scrollable"
                >
                  {project.process.map((step, index) => (
                    <li key={step.title} className={styles.step}>
                      <span className={styles.stepNum} aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h4 className={styles.stepTitle}>{step.title}</h4>
                      <p className={styles.stepText}>{step.text}</p>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            {project.outcomes ? (
              <section aria-labelledby="case-outcomes" className={styles.block}>
                <h3 id="case-outcomes" className={styles.blockTitle}>
                  The Outcome
                </h3>
                <ul className={styles.outcomes}>
                  {project.outcomes.map((outcome) => (
                    <li key={outcome} className={styles.outcome}>
                      <Icon
                        name="check"
                        size={15}
                        className={styles.outcomeIcon}
                        aria-hidden="true"
                      />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {project.links.length > 0 ? (
              <footer className={styles.links}>
                {project.links.map((link) => (
                  <Button
                    key={link.href}
                    href={link.href}
                    external
                    variant="ghost"
                    icon={link.icon}
                  >
                    {link.label}
                  </Button>
                ))}
              </footer>
            ) : project.kind !== 'build' ? (
              /* Only client engagements need the confidentiality note; a
                 student build with no link is just a build with no link. */
              <p className={styles.footnote}>
                Engagement details are generalized to respect client confidentiality.
              </p>
            ) : null}
          </article>
        </div>
      )}
    </dialog>
  )
}
