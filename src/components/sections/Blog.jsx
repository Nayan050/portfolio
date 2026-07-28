import { MEDIUM } from '../../data/site'
import { useMediumPosts } from '../../hooks/useMediumPosts'
import { Section } from '../layout/Section'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { cn } from '../../lib/utils'
import styles from './Blog.module.css'

const DATE_FORMAT = { year: 'numeric', month: 'short', day: 'numeric' }

function formatDate(iso) {
  if (!iso) return null
  const date = new Date(iso)
  return Number.isNaN(date.valueOf())
    ? null
    : new Intl.DateTimeFormat('en-US', DATE_FORMAT).format(date)
}

/** Latest Medium writing, fetched live with a curated snapshot fallback. */
export function Blog() {
  const { posts, isLive } = useMediumPosts()

  return (
    <Section
      id="blog"
      num="07"
      eyebrow="Writing"
      title="Notes from the field"
      meta={isLive ? 'Live from Medium' : 'Published on Medium'}
    >
      <ul className={styles.grid}>
        {posts.map((post) => (
          <li key={post.link} className={styles.cell}>
            <article className={cn(styles.card, 'sweep-card')}>
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                {post.image && (
                  <span className={styles.thumb}>
                    <img src={post.image} alt="" loading="lazy" decoding="async" />
                  </span>
                )}

                <span className={styles.body}>
                  <span className={styles.meta}>
                    {formatDate(post.date) && (
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                    )}
                    {post.minutes && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{post.minutes} min read</span>
                      </>
                    )}
                  </span>

                  {post.publication && (
                    <span className={styles.publication}>{post.publication}</span>
                  )}

                  {/* A real heading: <a> takes its content model from the
                      parent <article>, so a heading is valid here, and post
                      titles are the section's actual content. */}
                  <h3 className={styles.title}>{post.title}</h3>
                  {post.excerpt && <span className={styles.excerpt}>{post.excerpt}</span>}

                  {post.tags?.length > 0 && (
                    <span className={styles.tags}>
                      {post.tags.map((tag) => (
                        <span key={tag} className={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </span>
                  )}

                  <span className={styles.cta}>
                    Read on {post.publication ?? 'Medium'}
                    <Icon name="arrow-right" size={15} className={styles.ctaIcon} />
                  </span>
                </span>
              </a>
            </article>
          </li>
        ))}
      </ul>

      <div className={styles.footer}>
        <Button href={MEDIUM.profileUrl} external variant="ghost" icon="external">
          All articles on Medium
        </Button>
      </div>
    </Section>
  )
}
