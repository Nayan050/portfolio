/** Join class names, skipping falsy values. */
export function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function lerp(from, to, alpha) {
  return from + (to - from) * alpha
}
