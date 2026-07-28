import { useEffect, useRef } from 'react'
import { lockScroll } from '../../lib/scroll'
import { certificateEmbedUrl } from '../../lib/certificate'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import styles from './CertificateModal.module.css'

/**
 * Shows the actual credential document in-page.
 *
 * Mirrors ProjectModal's dialog handling deliberately: React state is the one
 * source of truth for open/closed, and Esc is caught with a plain keydown
 * listener rather than trusting the native `close` event, which does not
 * bubble and previously left the page scroll locked after dismissal.
 *
 * @param {React.RefObject<HTMLElement>} restoreFocusRef element to refocus on close
 */
export function CertificateModal({ cert, onClose, restoreFocusRef }) {
  const dialogRef = useRef(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (cert) {
      if (!dialog.open) {
        dialog.showModal()
        lockScroll(true)
      }
    } else if (dialog.open) {
      dialog.close()
      lockScroll(false)
      restoreFocusRef?.current?.focus()
    }
  }, [cert, restoreFocusRef])

  useEffect(() => () => lockScroll(false), [])

  useEffect(() => {
    if (!cert) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current?.()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [cert])

  const handleCancel = (event) => {
    event.preventDefault()
    onClose()
  }

  const embed = cert ? certificateEmbedUrl(cert.href) : null

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      onCancel={handleCancel}
      aria-labelledby={cert ? 'certificate-title' : undefined}
    >
      {cert && (
        <div className={styles.frame}>
          <div className={styles.scrim} onClick={onClose} aria-hidden="true" />

          <article className={styles.content}>
            <button
              type="button"
              className={styles.close}
              onClick={onClose}
              aria-label="Close certificate"
            >
              <Icon name="close" size={18} />
            </button>

            <header className={styles.head}>
              <p className="eyebrow">{cert.type ?? 'Certification'}</p>
              <h2 id="certificate-title" className={styles.title}>
                {cert.name}
              </h2>
              <p className={styles.meta}>
                {cert.issuer} · {cert.date}
              </p>
            </header>

            {embed ? (
              <div className={styles.viewer}>
                {/* Not lazy: the iframe only mounts once the overlay is
                    already open, so deferring gains nothing and risks the
                    frame never being considered in-viewport at all. */}
                <iframe
                  key={embed}
                  src={embed}
                  title={`${cert.name} certificate`}
                  className={styles.doc}
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : null}

            <footer className={styles.actions}>
              <Button href={cert.href} external variant="ghost" icon="external">
                {embed ? 'Open original' : 'View certificate'}
              </Button>
              {cert.verifyUrl ? (
                <Button href={cert.verifyUrl} external variant="ghost" icon="award">
                  Verify with issuer
                </Button>
              ) : null}
            </footer>
          </article>
        </div>
      )}
    </dialog>
  )
}
