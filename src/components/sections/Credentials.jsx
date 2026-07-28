import { useRef, useState } from 'react'
import { CERTIFICATIONS, CERT_TONES, EDUCATION } from '../../data/experience'
import { SITE } from '../../data/site'
import { certificateEmbedUrl } from '../../lib/certificate'
import { Section } from '../layout/Section'
import { Icon } from '../ui/Icon'
import { cn } from '../../lib/utils'
import { CertificateModal } from './CertificateModal'
import styles from './Credentials.module.css'

/** Certifications rendered as certificate documents, then formal education. */
export function Credentials() {
  const [activeCert, setActiveCert] = useState(null)
  const openerRef = useRef(null)

  const openCert = (event, cert) => {
    openerRef.current = event.currentTarget
    setActiveCert(cert)
  }

  return (
    <>
    <Section
      id="credentials"
      num="05"
      eyebrow="Credentials"
      title="The paper trail"
      meta={`${CERTIFICATIONS.length} credentials · ${EDUCATION.length} institutions`}
    >
      <div className={styles.subhead}>
        <h3 className={styles.subheading}>Certifications &amp; training</h3>
        <span className={styles.subRule} aria-hidden="true" />
        <span className={styles.subMeta}>2022 – 2026</span>
      </div>

      <ul className={styles.certGrid}>
        {CERTIFICATIONS.map((cert) => (
          <li key={cert.name} className={styles.cell}>
            {certificateEmbedUrl(cert.href) ? (
              <button
                type="button"
                className={cn(styles.certificate, styles.certificateOpenable)}
                onClick={(event) => openCert(event, cert)}
                aria-haspopup="dialog"
              >
                <CertificateFace cert={cert} showCue />
              </button>
            ) : cert.href ? (
              /* Issuer pages block framing, so these leave the site. */
              <a
                href={cert.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(styles.certificate, styles.certificateOpenable)}
              >
                <CertificateFace cert={cert} showCue external />
              </a>
            ) : (
              <div className={styles.certificate}>
                <CertificateFace cert={cert} />
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className={styles.subhead}>
        <h3 className={styles.subheading}>Education</h3>
        <span className={styles.subRule} aria-hidden="true" />
        <span className={styles.subMeta}>2006 – 2024</span>
      </div>

      <ul className={styles.eduGrid}>
        {EDUCATION.map((entry) => (
          <li key={entry.school} className={styles.cell}>
            <div className={cn(styles.eduCard, 'sweep-card')}>
              <span className={styles.eduThumb}>
                <img
                  src={entry.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width="480"
                  height="218"
                />
                <span className={styles.eduBadge}>
                  <Icon name="cap" size={14} />
                  {entry.period}
                </span>
              </span>
              <div className={styles.eduBody}>
                <h4 className={styles.eduDegree}>{entry.degree}</h4>
                <span className={styles.eduSchool}>{entry.school}</span>
                <span className={styles.eduFoot}>
                  <span className={styles.eduPlace}>
                    <Icon name="map-pin" size={13} />
                    {entry.location}
                  </span>
                  <span className={styles.eduStatus}>{entry.status}</span>
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Section>

    <CertificateModal
      cert={activeCert}
      onClose={() => setActiveCert(null)}
      restoreFocusRef={openerRef}
    />
    </>
  )
}

/** The certificate document itself — ruled frame, seal, and awarded-to line. */
function CertificateFace({ cert, showCue = false, external = false }) {
  return (
    <div className={styles.face} data-tone={CERT_TONES[cert.field] ?? 'slate'}>
      <span className={styles.guilloche} aria-hidden="true" />

      <div className={styles.certHead}>
        <span className={styles.certKicker}>{cert.type ?? 'Certification'}</span>
        <span className={styles.seal} aria-hidden="true">
          <Icon name="award" size={18} />
        </span>
      </div>

      <p className={styles.certField}>{cert.field}</p>
      <h4 className={styles.certName}>{cert.name}</h4>

      <div className={styles.certFoot}>
        <span className={styles.awarded}>
          <span className={styles.awardedLabel}>Awarded to</span>
          <span className={styles.awardedName}>{SITE.name}</span>
        </span>
        <span className={styles.issued}>
          <span className={styles.issuer}>{cert.issuer}</span>
          <span className={styles.date}>{cert.date}</span>
        </span>
      </div>

      {showCue ? (
        <span className={styles.viewCue}>
          {external ? 'Verify' : 'View certificate'}
          <Icon name={external ? 'external' : 'arrow-right'} size={13} />
        </span>
      ) : null}
    </div>
  )
}
