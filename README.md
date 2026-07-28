# Nayan Acharya — Portfolio

A static, animation-free portfolio: React 19 + Vite, a token-driven
light/dark design system, and content that lives entirely in `src/data/`.

## Commands

```bash
npm install       # once
npm run dev       # local dev server
npm run build     # production build → dist/
npm run preview   # serve the production build locally
```

## Where things live

```
index.html                  Meta + no-flash theme script
public/
  assets/                   Images carried over from the previous site
  news/ tools/ knowledge/   Standalone hub pages, served at /news/ etc.
src/
  styles/                   tokens.css (design tokens) · base.css · utilities.css
  data/                     ← EDIT CONTENT HERE
    site.js                 Identity, socials, nav, stats, Medium feed config
    about.js                About copy + the IEEE research paper
    practice.js             The seven "What I Do" tabs
    projects.js             Case studies + the "Also built" archive
    experience.js           Roles, certifications, education
  hooks/                    useTheme · useTabList · useMediumPosts
  lib/                      scroll.js · utils.js
  components/
    layout/                 Header · Footer · Section
    ui/                     Button · Pill · Icon · LocalTime
    sections/               Hero · About · Expertise · Projects · ProjectModal
                            Experience · Credentials · Research · Blog
                            Libraries · Contact
legacy/                     The entire previous site, untouched
```

## Notes

- **No animation.** There are no scroll reveals, no smooth scrolling, no
  keyframes and no motion libraries. Only colour/border transitions on
  hover remain, and those are dropped under `prefers-reduced-motion`.
- **Content edits** never require touching components — everything renders
  from `src/data/*`.
- **Case-study metrics** in `projects.js` are representative placeholders.
  Replace them with verified numbers.
- **Contact form** posts to Web3Forms using the access key in `site.js`.
- **Blog** pulls `medium.com/feed/@nayanacharya050` through rss2json (Medium
  sends no CORS header). Never add rss2json's `count` parameter — it 422s
  without a paid key. A snapshot in `site.js` renders if the fetch fails.
- **Certification `href`s** are kept as a record of where each credential can
  be verified, but are intentionally not shown in the UI.
- **Colours** live in `src/styles/tokens.css` — monochrome warm neutrals;
  emphasis comes from contrast, not hue.

## Deploying

`dist/` is a plain static folder — upload it as-is.

**Do not add a catch-all SPA rewrite** (`/* → /index.html`). This site has no
client-side router; it is one page with hash anchors. A catch-all would
swallow `/news/`, `/tools/` and `/knowledge/`, which are standalone static
pages, and serve the portfolio in their place. Default static hosting with
directory indexes is all that is required.
