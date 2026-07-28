import { useEffect, useState } from 'react'
import { MEDIUM, FALLBACK_POSTS } from '../data/site'

const WORDS_PER_MINUTE = 220

function stripHtml(html = '') {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&rsquo;/g, '’')
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

function truncate(text, max = 165) {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  return `${cut.slice(0, cut.lastIndexOf(' ')) || cut}…`
}

function firstImage(html = '') {
  return html.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] ?? null
}

function readingTime(html = '') {
  const words = stripHtml(html).split(' ').filter(Boolean).length
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

/* Medium publications keep their own domain. Naming the publication is a
   stronger signal than "Medium" — these are edited outlets, not a blog. */
const PUBLICATIONS = {
  'infosecwriteups.com': 'InfoSec Write-ups',
  'medium.com': 'Medium',
}

function publicationOf(link) {
  try {
    const host = new URL(link).hostname.replace(/^www\./, '')
    return PUBLICATIONS[host] ?? 'Medium'
  } catch {
    return 'Medium'
  }
}

/** Medium returns slug-style tags ("web-security") — render them as words. */
function formatTag(tag) {
  return tag
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/** Normalize one rss2json item into the shape the Blog section renders. */
function normalize(item) {
  const body = item.content || item.description || ''
  return {
    title: stripHtml(item.title),
    link: item.link,
    date: item.pubDate?.slice(0, 10) ?? null,
    excerpt: truncate(stripHtml(item.description || item.content || '')),
    image: item.thumbnail || firstImage(body),
    minutes: readingTime(body),
    tags: (item.categories ?? []).slice(0, 3).map(formatTag),
    publication: publicationOf(item.link),
  }
}

/**
 * Live Medium posts, with the curated snapshot as both the initial paint and
 * the failure state — the section always renders real content, never a
 * spinner or an empty shell.
 *
 * @returns {{posts: object[], isLive: boolean, loading: boolean}}
 */
export function useMediumPosts() {
  const [posts, setPosts] = useState(() =>
    FALLBACK_POSTS.slice(0, MEDIUM.maxPosts).map((post) => ({
      ...post,
      publication: publicationOf(post.link),
    })),
  )
  const [isLive, setIsLive] = useState(false)
  const [loading, setLoading] = useState(Boolean(MEDIUM.username))

  useEffect(() => {
    if (!MEDIUM.username) return undefined

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    fetch(MEDIUM.proxy(MEDIUM.feedUrl), { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Feed responded ${response.status}`)
        return response.json()
      })
      .then((data) => {
        if (data.status !== 'ok' || !Array.isArray(data.items) || !data.items.length) {
          throw new Error('Feed returned no items')
        }
        setPosts(data.items.slice(0, MEDIUM.maxPosts).map(normalize))
        setIsLive(true)
      })
      .catch(() => {
        /* Keep the snapshot already on screen. */
      })
      .finally(() => {
        clearTimeout(timeout)
        setLoading(false)
      })

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [])

  return { posts, isLive, loading }
}
