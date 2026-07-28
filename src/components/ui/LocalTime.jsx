import { useEffect, useState } from 'react'

/** Live clock for a fixed IANA time zone (refreshes every 30s). */
export function LocalTime({ timeZone, className }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  const label = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now)

  return (
    <time className={className} dateTime={now.toISOString()}>
      {label}
    </time>
  )
}
