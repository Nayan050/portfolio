/* Site-wide identity and contact data. Edit here — components only render. */

export const SITE = {
  name: 'Nayan Acharya',
  monogram: 'NA',
  /* Research / bug-bounty handle */
  handle: 'cyberzod',
  role: 'Security Researcher',
  /* Set as an epigraph in the hero: `creed` carries alone in the serif, the
     gloss sits under it in the UI face. */
  valueProp: {
    creed: 'Show me a system nobody has broken and I will show you a system nobody has tried.',
    gloss: "Systems don't stay secure, they stay untested. I remove the illusion.",
  },
  /* Sits beside the live dot, so it reads as present tense: both halves of
     the job in one line, employer second. */
  /* Two opposing clauses. The hero badge renders them as a broken half and
     a whole half, so the rule under each one carries the meaning. */
  status: {
    breaking: "Breaking what's trusted",
    securing: 'Securing what matters',
  },
  location: 'Kathmandu, Nepal',
  timezone: 'Asia/Kathmandu',
  timezoneLabel: 'NPT · UTC+5:45',
  email: 'nayanacharya51@gmail.com',
  resumeUrl:
    'https://drive.google.com/file/d/1dMd2RvRslL23nplx68eO07hP6hlsn5k9/view?usp=sharing',
}

export const SOCIALS = [
  { label: 'GitHub', icon: 'github', href: 'https://github.com/Nayan050' },
  { label: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/in/nayan050/' },
  { label: 'Medium', icon: 'medium', href: 'https://medium.com/@nayanacharya050' },
  { label: 'Telegram', icon: 'telegram', href: 'https://t.me/NayanAcharya' },
  { label: 'Email', icon: 'mail', href: 'mailto:nayanacharya51@gmail.com' },
]

/* ---------------------------------------------------------------------------
   Medium blog feed.
   Medium's RSS endpoint sends no CORS header, so the browser cannot read it
   directly; `proxy` converts the feed to JSON from a CORS-enabled origin.
   Swap `proxy` for your own serverless function if you'd rather not depend
   on a third party — the hook only needs `{ status, items[] }` back.
--------------------------------------------------------------------------- */
export const MEDIUM = {
  username: 'nayanacharya050',
  profileUrl: 'https://medium.com/@nayanacharya050',
  feedUrl: 'https://medium.com/feed/@nayanacharya050',
  /* No `count` param — rss2json rejects it without a paid API key (HTTP 422).
     The feed returns Medium's latest 10; `maxPosts` trims client-side. */
  proxy: (feedUrl) =>
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`,
  maxPosts: 3,
}

/* Snapshot of the live feed (July 2026). Rendered instantly on load and kept
   if the network fetch fails, so the section is never empty or spinning. */
export const FALLBACK_POSTS = [
  {
    title: "I Didn't Hack OAuth — I Just Clicked 'Login' Eight Times.",
    link: 'https://infosecwriteups.com/i-didnt-hack-oauth-i-just-clicked-login-eight-times-037b8773c8b2',
    date: '2026-06-29',
    excerpt:
      'An authentication flow that trusted repetition more than identity, and what eight clicks revealed about session handling.',
    tags: ['OAuth', 'Authentication', 'Bug Bounty'],
  },
  {
    title:
      'How I Accidentally Stumbled Into a 225,000-Record Data Leak (And Got Paid For It)',
    link: 'https://infosecwriteups.com/how-i-accidentally-stumbled-into-a-225-000-record-data-leak-and-got-paid-for-it-751e6f3ad1fd',
    date: '2026-06-27',
    excerpt:
      'A misconfiguration hiding in plain sight, the disclosure process that followed, and why boring recon still wins.',
    tags: ['Data Leak', 'Recon', 'Responsible Disclosure'],
  },
  {
    title:
      "I Popped Admin on a SaaS Platform in 2 HTTP Requests — Here's the Whole Kill Chain",
    link: 'https://infosecwriteups.com/i-popped-admin-on-a-saas-platform-in-2-http-requests-heres-the-whole-kill-chain-942c3f83b85e',
    date: '2026-06-27',
    excerpt:
      'Two requests from anonymous to administrator: the full chain, the root cause, and the fix that should have existed.',
    tags: ['Privilege Escalation', 'SaaS', 'Kill Chain'],
  },
]

export const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'Credentials', href: '#credentials' },
  { label: 'Research', href: '#research' },
  { label: 'Blog', href: '#blog' },
  { label: 'Resources', href: '#resources' },
  { label: 'Contact', href: '#contact' },
]

/* Headline numbers, shown in the About section. */
export const PROFILE_STATS = [
  { value: 3, suffix: '+', label: 'Years in security' },
  { value: 19, suffix: '+', label: 'Certifications earned' },
  { value: 14, suffix: '+', label: 'Projects delivered' },
  /* No "+" on this one: there is exactly one paper, and "1+" reads as a
     hedge. The others are genuine floors. */
  { value: 1, suffix: '', label: 'Published research' },
]

/* Standalone hub pages carried over from the previous site (served from
   /public) — showcased in the Libraries section and linked in the footer. */
/* `num` matches the kicker number each hub page carries in its own header, so
   the card and the page it opens are numbered the same. `tone` draws from the
   shared discipline palette and `note` is the one-line "what's actually in
   there" that the cards previously left to the description alone. */
export const HUB_LINKS = [
  {
    label: 'Cyber News Hub',
    href: '/news/',
    icon: 'rss',
    num: '01',
    tone: 'oxblood',
    meta: 'Live feed',
    note: '23 sources · updated continuously',
    description:
      'Breaking advisories, ransomware campaigns and global incident coverage, updated in real time.',
  },
  {
    label: 'Security Tool Library',
    href: '/tools/',
    icon: 'tool',
    num: '02',
    tone: 'navy',
    meta: 'Curated arsenal',
    note: '87 tools · 14 categories',
    description:
      'A hand-picked toolbox: Nmap, Metasploit, Burp Suite, Ghidra, BloodHound and more, with what each is for.',
  },
  {
    label: 'Knowledge Base',
    href: '/knowledge/',
    icon: 'book',
    num: '03',
    tone: 'forest',
    meta: 'Research notes',
    note: '9 topics · 25 curated resources',
    description:
      'Deep-dives on OWASP Top 10, cryptography, OSINT, Active Directory, cloud security and zero-days.',
  },
]

/* Live Web3Forms access key carried over from the previous site. */
export const WEB3FORMS_ACCESS_KEY = '7bf0c72c-3145-40e4-9ba7-700eb52a2518'
export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'
