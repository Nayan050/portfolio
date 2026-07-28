import { cn } from '../../lib/utils'
import styles from './Pill.module.css'

/** Skill/stack tag. `core` marks headline capabilities with an accent fill. */
export function Pill({ children, core = false, as: Tag = 'span', className }) {
  return (
    <Tag className={cn(styles.pill, core && styles.core, className)}>{children}</Tag>
  )
}
