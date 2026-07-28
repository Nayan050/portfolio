import { cn } from '../../lib/utils'
import { Icon } from './Icon'
import styles from './Button.module.css'

/**
 * Primary action element. Renders an <a> when `href` is given, otherwise a
 * <button>.
 *
 * @param {'primary'|'ghost'} variant
 */
export function Button({
  href,
  variant = 'primary',
  icon,
  external = false,
  type = 'button',
  className,
  children,
  ...rest
}) {
  const classes = cn(styles.button, styles[variant], className)
  const content = (
    <>
      <span className={styles.label}>{children}</span>
      {icon && <Icon name={icon} size={16} className={styles.icon} />}
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {content}
      </a>
    )
  }
  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  )
}
