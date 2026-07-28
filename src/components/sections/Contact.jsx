import { useEffect, useRef, useState } from 'react'
import { SITE, SOCIALS, WEB3FORMS_ACCESS_KEY, WEB3FORMS_ENDPOINT } from '../../data/site'
import { Section } from '../layout/Section'
import { Icon } from '../ui/Icon'
import { cn } from '../../lib/utils'
import styles from './Contact.module.css'

const INITIAL_VALUES = { name: '', email: '', message: '' }

const VALIDATORS = {
  name: (value) =>
    value.trim().length >= 2 ? '' : 'Please enter your name (at least 2 characters).',
  email: (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
      ? ''
      : 'Please enter a valid email address.',
  message: (value) =>
    value.trim().length >= 10 ? '' : 'Tell me a little more (at least 10 characters).',
}

export function Contact() {
  const [values, setValues] = useState(INITIAL_VALUES)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const formRef = useRef(null)
  const resetTimerRef = useRef(null)

  useEffect(() => () => clearTimeout(resetTimerRef.current), [])

  const setField = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }))
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: VALIDATORS[field](event.target.value) }))
    }
  }

  const validateField = (field) => () => {
    setErrors((current) => ({ ...current, [field]: VALIDATORS[field](values[field]) }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (status === 'sending') return

    const nextErrors = Object.fromEntries(
      Object.keys(VALIDATORS).map((field) => [field, VALIDATORS[field](values[field])]),
    )
    setErrors(nextErrors)

    const firstInvalid = Object.keys(nextErrors).find((field) => nextErrors[field])
    if (firstInvalid) {
      formRef.current?.elements[firstInvalid]?.focus()
      return
    }

    // Honeypot: real users never see this checkbox, bots often tick it.
    if (formRef.current?.elements.botcheck?.checked) {
      setStatus('success')
      return
    }

    setStatus('sending')
    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Portfolio inquiry from ${values.name.trim()}`,
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
        }),
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.message || 'Submission rejected')

      setStatus('success')
      setValues(INITIAL_VALUES)
      resetTimerRef.current = setTimeout(() => setStatus('idle'), 6000)
    } catch {
      setStatus('error')
    }
  }

  return (
    <Section
      id="contact"
      num="09"
      eyebrow="Contact"
      title="Let's find it before they do"
      meta="Usually replies within a day"
    >
      <div className={styles.grid}>
        <div>
          <p className={styles.pitch}>
            Hiring for a security team, need a system tested before someone less
            friendly tests it, or want a compliance program that survives an
            audit? Start here.
          </p>

          <div className={styles.block}>
            <p className={styles.blockLabel}>Email</p>
            <a href={`mailto:${SITE.email}`} className={styles.emailLink}>
              {SITE.email}
            </a>
          </div>

          <div className={styles.block}>
            <p className={styles.blockLabel}>Elsewhere</p>
            <ul className={styles.socials} aria-label="Social profiles">
              {SOCIALS.filter((social) => social.icon !== 'mail').map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    <Icon name={social.icon} size={16} />
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.block}>
            <p className={styles.blockLabel}>Based in</p>
            <p className={styles.locale}>
              <Icon name="map-pin" size={14} /> {SITE.location}
            </p>
          </div>
        </div>

        <div>
          <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label htmlFor="contact-name" className={styles.label}>
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                className={cn(styles.input, errors.name && styles.inputError)}
                value={values.name}
                onChange={setField('name')}
                onBlur={validateField('name')}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'contact-name-error' : undefined}
                required
              />
              {errors.name && (
                <p id="contact-name-error" className={styles.error}>
                  {errors.name}
                </p>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="contact-email" className={styles.label}>
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                className={cn(styles.input, errors.email && styles.inputError)}
                value={values.email}
                onChange={setField('email')}
                onBlur={validateField('email')}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'contact-email-error' : undefined}
                required
              />
              {errors.email && (
                <p id="contact-email-error" className={styles.error}>
                  {errors.email}
                </p>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="contact-message" className={styles.label}>
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                placeholder="What are we securing?"
                className={cn(styles.input, styles.textarea, errors.message && styles.inputError)}
                value={values.message}
                onChange={setField('message')}
                onBlur={validateField('message')}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'contact-message-error' : undefined}
                required
              />
              {errors.message && (
                <p id="contact-message-error" className={styles.error}>
                  {errors.message}
                </p>
              )}
            </div>

            <input
              type="checkbox"
              name="botcheck"
              className={styles.honeypot}
              tabIndex={-1}
              aria-hidden="true"
              autoComplete="off"
            />

            <button
              type="submit"
              className={cn(
                styles.submit,
                status === 'success' && styles.submitSuccess,
                status === 'error' && styles.submitError,
              )}
              disabled={status === 'sending'}
            >
              {status === 'idle' && (
                <>
                  Send message
                  <Icon name="arrow-right" size={16} />
                </>
              )}
              {status === 'sending' && <>Sending…</>}
              {status === 'success' && (
                <>
                  <Icon name="check" size={16} />
                  Message sent
                </>
              )}
              {status === 'error' && (
                <>
                  <Icon name="alert" size={16} />
                  Try again
                </>
              )}
            </button>

            <div aria-live="polite" className={styles.liveRegion}>
              {status === 'success' && (
                <p className={cn(styles.feedback, styles.feedbackSuccess)}>
                  Message received. I&apos;ll reply within a day, usually sooner.
                </p>
              )}
              {status === 'error' && (
                <p className={cn(styles.feedback, styles.feedbackError)}>
                  That didn&apos;t send. Try again, or reach me directly at{' '}
                  <a href={`mailto:${SITE.email}`} className={styles.feedbackLink}>
                    {SITE.email}
                  </a>
                  .
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </Section>
  )
}
