/* Which credential links can actually be displayed in-page.
   Google Drive serves a frameable viewer at /preview for files shared with
   "anyone with the link". Issuer credential pages generally send
   X-Frame-Options and render blank inside a frame, so those open in a new
   tab instead. Both were tested against the real URLs; do not assume a link
   is embeddable because its load event fires, because a blocked frame fires
   one too. */
const DRIVE_FILE = /drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)/

/**
 * @param {string|null|undefined} href credential URL
 * @returns {string|null} a frameable URL, or null if it must open externally
 */
export function certificateEmbedUrl(href) {
  if (!href) return null
  const match = DRIVE_FILE.exec(href)
  return match ? `https://drive.google.com/file/d/${match[1]}/preview` : null
}
