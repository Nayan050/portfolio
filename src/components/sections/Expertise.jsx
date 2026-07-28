import { useMemo } from 'react'
import { PRACTICE_AREAS } from '../../data/practice'
import { useTabList } from '../../hooks/useTabList'
import { Section } from '../layout/Section'
import { Pill } from '../ui/Pill'
import { Icon } from '../ui/Icon'
import { cn } from '../../lib/utils'
import styles from './Expertise.module.css'

/* Spelled-out counts so the heading tracks the data instead of drifting. */
const COUNT_WORDS = [
  'Zero',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
]

/**
 * "What I do" — one tab per practice area from the resume.
 * Follows the WAI-ARIA tabs pattern: roving tabindex, arrow/Home/End keys,
 * and a labelled panel per tab.
 */
export function Expertise() {
  const ids = useMemo(() => PRACTICE_AREAS.map((area) => area.id), [])
  const { activeId, select, onKeyDown, registerTab } = useTabList(ids)
  const active = PRACTICE_AREAS.find((area) => area.id === activeId)

  return (
    <Section
      id="expertise"
      num="02"
      tone="elev"
      eyebrow="What I Do"
      title="The work, by discipline"
      meta={`${PRACTICE_AREAS.length} practice areas`}
    >
      <div className={styles.wrap}>
        <div
          role="tablist"
          aria-label="Practice areas"
          aria-orientation="horizontal"
          className={styles.tablist}
          onKeyDown={onKeyDown}
        >
          {PRACTICE_AREAS.map((area, index) => (
            <button
              key={area.id}
              ref={registerTab(area.id)}
              type="button"
              role="tab"
              id={`tab-${area.id}`}
              aria-selected={activeId === area.id}
              aria-controls={`panel-${area.id}`}
              tabIndex={activeId === area.id ? 0 : -1}
              onClick={() => select(area.id)}
              data-tone={area.tone}
              className={cn(styles.tab, activeId === area.id && styles.tabActive)}
            >
              <span className={styles.tabNum} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              {area.tab}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`panel-${active.id}`}
          aria-labelledby={`tab-${active.id}`}
          tabIndex={0}
          data-tone={active.tone}
          className={styles.panel}
        >
          {/* Same decorative language as the project and hub cards. The
              numeral also gives the reserved space at the panel foot
              something to be, instead of reading as a gap. */}
          <span className={styles.glow} aria-hidden="true" />
          <span className={styles.hatch} aria-hidden="true" />
          <span className={styles.index} aria-hidden="true">
            {String(PRACTICE_AREAS.findIndex((area) => area.id === active.id) + 1).padStart(2, '0')}
          </span>

          <div className={styles.panelHead}>
            <h3 className={styles.panelTitle}>{active.title}</h3>
            <p className={styles.panelSummary}>{active.summary}</p>
          </div>

          <div className={styles.panelBody}>
            <div>
              <p className={styles.colLabel}>How I work</p>
              <ul className={styles.activities}>
                {active.activities.map((activity) => (
                  <li key={activity} className={styles.activity}>
                    <Icon name="check" size={15} className={styles.activityIcon} />
                    <span>{activity}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className={styles.colLabel}>Tools &amp; standards</p>
              <ul className={styles.tools}>
                {active.tools.map((tool) => (
                  <Pill as="li" key={tool}>
                    {tool}
                  </Pill>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
