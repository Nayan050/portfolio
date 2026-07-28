import { useMemo, useRef, useState } from 'react'
import { CATEGORY_TONES, PROJECTS, PROJECT_FILTERS } from '../../data/projects'
import { Section } from '../layout/Section'
import { Icon } from '../ui/Icon'
import { cn } from '../../lib/utils'
import { ProjectModal } from './ProjectModal'
import styles from './Projects.module.css'

/* Catalogue number per project, fixed to its place in the full list rather
   than its position in the filtered view — so a project keeps the same number
   whichever filter you arrive through. */
const CATALOGUE = new Map(PROJECTS.map((project, index) => [project.id, index + 1]))

/* Two chips plus an overflow count. Four would wrap to a second line on the
   narrowest column and push the card taller than its neighbours. */
const CHIP_LIMIT = 2

export function Projects() {
  const [filter, setFilter] = useState('all')
  const [activeProject, setActiveProject] = useState(null)
  const openerRef = useRef(null)

  const visible = useMemo(
    () =>
      filter === 'all'
        ? PROJECTS
        : PROJECTS.filter((project) => project.category === filter),
    [filter],
  )

  const openProject = (event, project) => {
    openerRef.current = event.currentTarget
    setActiveProject(project)
  }

  /* State-only: ProjectModal closes the dialog and restores focus to
     openerRef once it has actually closed. */
  const closeProject = () => setActiveProject(null)

  return (
    <>
      <Section
        id="work"
        num="03"
        eyebrow="Selected Work"
        title="Built and broken"
        meta={
          filter === 'all'
            ? `${PROJECTS.length} projects`
            : `${visible.length} of ${PROJECTS.length}`
        }
      >
        <div
          role="group"
          aria-label="Filter projects by discipline"
          className={styles.filters}
        >
          {PROJECT_FILTERS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setFilter(option.id)}
              aria-pressed={filter === option.id}
              data-tone={option.tone}
              className={cn(styles.filter, filter === option.id && styles.filterActive)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <ul className={styles.grid}>
          {visible.map((project) => (
            <li key={project.id} className={styles.cell}>
              <article
                data-tone={CATEGORY_TONES[project.category]}
                className={cn(styles.card, 'sweep-card')}
              >
                {/* The whole card is the click target, but only the title is
                    the control. A heading cannot live inside a <button> — a
                    button takes phrasing content only — so the button sits
                    inside the heading instead and its ::after is stretched
                    over the card. That keeps fourteen project names as real
                    headings for search engines and for anyone navigating by
                    heading, which they were not as <span>s. */}
                {/* Decorative layers, behind the text and out of the a11y
                    tree: a tone-tinted corner wash, a fine diagonal hatch
                    echoing the certificate guilloche, and the catalogue
                    number set large in the serif. */}
                <span className={styles.glow} aria-hidden="true" />
                <span className={styles.hatch} aria-hidden="true" />
                <span className={styles.index} aria-hidden="true">
                  {String(CATALOGUE.get(project.id)).padStart(2, '0')}
                </span>

                <div className={styles.face}>
                  {/* The year lives in the CTA row, not here: at top-right it
                      landed on top of the catalogue numeral. */}
                  <span className={styles.meta}>
                    <span className={styles.dot} aria-hidden="true" />
                    {project.categoryLabel}
                  </span>

                  <h3 className={styles.cardTitle}>
                    <button
                      type="button"
                      className={styles.titleButton}
                      onClick={(event) => openProject(event, project)}
                      aria-haspopup="dialog"
                    >
                      {project.title}
                    </button>
                  </h3>

                  <span className={styles.tagline}>{project.tagline}</span>

                  {project.stack?.length > 0 && (
                    <span className={styles.chips} aria-hidden="true">
                      {project.stack.slice(0, CHIP_LIMIT).map((item) => (
                        <span key={item} className={styles.chip}>
                          {item}
                        </span>
                      ))}
                      {project.stack.length > CHIP_LIMIT && (
                        <span className={styles.chipMore}>
                          +{project.stack.length - CHIP_LIMIT}
                        </span>
                      )}
                    </span>
                  )}

                  <span className={styles.cta} aria-hidden="true">
                    <span className={styles.ctaLabel}>
                      {project.kind === 'build' ? 'Details' : 'Case study'}
                    </span>
                    {project.year && <span className={styles.year}>{project.year}</span>}
                    <span className={styles.ctaIcon}>
                      <Icon name="arrow-right" size={13} />
                    </span>
                  </span>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Section>

      <ProjectModal
        project={activeProject}
        onClose={closeProject}
        restoreFocusRef={openerRef}
      />
    </>
  )
}
