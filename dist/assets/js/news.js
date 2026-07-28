let breakingNews = [];
let advisories = [];
let cves = [];
let threatIntel = [];
let securityResearch = [];
let dataBreaches = [];
let exploits = [];
let allArticles = [];
let filteredArticles = [];

let currentCategory = 'all';
let currentLimit = 12;
let searchQuery = '';
let filterDate = '';

// Track pagination for each category
let categoryOffsets = {
    news: 0,
    advisory: 0,
    cve: 0,
    threat: 0,
    research: 0,
    breach: 0,
    exploit: 0
};

let kevEntries = [];
let kevArticles = [];

/* Distinguishes "the catalogue says zero" from "the catalogue never arrived".
   Rendering an unreachable source as 0 claimed nothing was being exploited,
   which is never true of CISA KEV and is the worst possible thing for this
   page to assert. Same for NVD behind the critical-CVE count. */
let kevLoaded = false;
let nvdLoaded = false;

async function newsHubInit() {
    setupFilters(); // Set up filters immediately so they are interactive
    setupSearchShortcut();
    // KEV is the highest-signal feed on the page, so it renders first rather
    // than waiting on seventeen RSS fetches.
    fetchKEV();
    await loadMoreForCategory('all');
    renderStats();
}

/* ---------------------------------------------------------------------------
   CISA Known Exploited Vulnerabilities.

   The one feed that changes what a defender does today: everything in it is
   confirmed exploited in the wild, and federal agencies have a legal deadline
   to patch it.

   cisa.gov serves this without CORS headers, so a direct browser fetch throws.
   It goes through the same proxy chain as the RSS feeds, and is cached hard
   because the catalogue only changes when CISA adds an entry.
--------------------------------------------------------------------------- */
const KEV_URL = 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json';

/* Cache under a versioned key, not KEV_URL itself. The stored value is a
   trimmed sixty-row slice, and the slice direction was wrong — anyone holding
   the old entry would keep seeing the 2021 seed batch for up to
   CACHE_MAX_AGE_MS. Bumping the key retires those entries on next load
   instead of waiting a day for them to age out. */
const KEV_CACHE_KEY = KEV_URL + '#newest60';

/* Not every proxy can carry this one: the catalogue is ~1.5MB and
   corsproxy.io caps responses at 1MB, answering 413. That is why the pool
   matters here even more than for RSS — corsfix returns the full 1526KB.
   The 413 is cheap and the loop just moves on, so no special-casing. */

async function fetchKevJson() {
    /* The catalogue is ~1.5MB, so it gets a longer timeout than an RSS feed,
       but not the 25s it used to have: four proxies at 25s meant a fully
       unreachable catalogue held a request slot for a minute and a half. */
    for (const index of proxyOrder()) {
        try {
            const response = await fetch(PROXIES[index](KEV_URL), {
                signal: AbortSignal.timeout(18000),
            });
            if (!response.ok) continue;
            const parsed = JSON.parse(await response.text());
            if (Array.isArray(parsed.vulnerabilities)) {
                rememberProxy(index);
                return parsed;
            }
        } catch (e) {
            /* Next proxy. */
        }
    }
    return null;
}

async function fetchKEV() {
    try {
        const cached = readCache(KEV_CACHE_KEY, true);
        let json;
        if (cached) {
            json = JSON.parse(cached);
        } else {
            json = await fetchKevJson();
            if (!json) throw new Error('all proxies refused');
            /* Store only what is rendered: the full catalogue is ~1.5MB.

               slice(0, 60), NOT slice(-60). CISA publishes the catalogue
               NEWEST-FIRST, so taking from the end collects the oldest
               entries. Measured against catalogue 2026.07.24 (1653 entries,
               2026-07-22 down to 2021-11-03): slice(-60) returned sixty rows
               all dated 2021-11-03, so the "actively exploited" tab was
               showing the original November 2021 seed batch and the 30-day
               counter read 0 with 24 entries genuinely added that month.

               Same failure as the NVD window above — an API that hands back a
               range in an order nobody checked. */
            const trimmed = {
                catalogVersion: json.catalogVersion,
                vulnerabilities: json.vulnerabilities.slice(0, 60),
            };
            writeCache(KEV_CACHE_KEY, JSON.stringify(trimmed));
            json = trimmed;
        }

        kevEntries = (json.vulnerabilities || [])
            .slice()
            .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

        // Folded into the same article pool as every other source so it is a
        // tab in the feed rather than a separate lane.
        kevArticles = kevEntries.map((entry) => {
            const due = entry.dueDate ? new Date(entry.dueDate) : null;
            const overdue = due && due < new Date();
            return {
                title: `${entry.cveID} · ${entry.vulnerabilityName || entry.product}`,
                link: `https://nvd.nist.gov/vuln/detail/${entry.cveID}`,
                description: entry.shortDescription || '',
                pubDate: new Date(entry.dateAdded),
                source: 'CISA KEV',
                category: 'kev',
                ransomware: entry.knownRansomwareCampaignUse === 'Known',
                due: due ? due.toLocaleDateString() : '',
                overdue,
            };
        });

        kevLoaded = true;
        markKevTabLive();
        combineAndFilter();
        renderStats();
    } catch (err) {
        console.warn('KEV unavailable:', err.message);
        // Tab stays hidden, so an unavailable catalogue is simply absent
        // rather than an empty blinking alert.
        markKevTabLive();
    }
}

/* The tab only pulses once there is genuinely something behind it: a blinking
   alert with nothing to show is noise. */
function markKevTabLive() {
    const tab = document.querySelector('.filter-btn[data-category="kev"]');
    if (!tab) return;
    const count = kevArticles.length;
    tab.hidden = count === 0;
    if (count) tab.setAttribute('data-live', 'true');
    const badge = tab.querySelector('.filter-count');
    if (badge) badge.textContent = count;
}

/* Situational awareness strip: what is loaded, how fresh, and how much of it
   actually needs attention. */
function renderStats() {
    const set = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };

    const critical = allArticles.filter(
        (a) => a.category === 'cve' && parseFloat(a.cvss) >= 9,
    ).length;

    const thirtyDaysAgo = Date.now() - 30 * 864e5;
    const kevRecent = kevEntries.filter((e) => new Date(e.dateAdded).getTime() > thirtyDaysAgo).length;

    const sources = new Set(allArticles.map((a) => a.source)).size;

    set('stat-items', allArticles.length || '—');
    set('stat-sources', sources || '—');
    /* An em dash means "not loaded". A 0 would be a claim. */
    set('stat-critical', nvdLoaded ? critical : '—');
    set('stat-kev', kevLoaded ? kevRecent : '—');
    set(
        'stat-updated',
        allArticles.length
            ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '—',
    );
}

/* Press "/" to jump to search, the way every tool a security person already
   uses behaves. */
function setupSearchShortcut() {
    document.addEventListener('keydown', (event) => {
        if (event.key !== '/' || event.metaKey || event.ctrlKey) return;
        const tag = document.activeElement?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        event.preventDefault();
        document.getElementById('news-search')?.focus();
    });
}

/* Relative time reads better than a date on a live feed: "3h ago" tells you
   whether to care, "26/07/2026" does not. */
function timeAgo(date) {
    const ms = Date.now() - date.getTime();
    if (isNaN(ms)) return 'Recently';
    const mins = Math.round(ms / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return mins + 'm ago';
    const hours = Math.round(mins / 60);
    if (hours < 24) return hours + 'h ago';
    const days = Math.round(hours / 24);
    if (days < 30) return days + 'd ago';
    return date.toLocaleDateString();
}

async function loadMoreForCategory(category, isLoadMoreAction = false) {
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn && isLoadMoreAction) {
        loadMoreBtn.disabled = true;
        loadMoreBtn.innerHTML = '<span>Loading...</span><i class="fas fa-spinner fa-spin"></i>';
    }

    // Parallelize category fetches to reduce wait time
    const tasks = [];
    if (category === 'all' || category === 'news') tasks.push(fetchBreakingNews());
    if (category === 'all' || category === 'advisory') tasks.push(fetchAdvisories());
    if (category === 'all' || category === 'cve') tasks.push(fetchCVEs(isLoadMoreAction));
    if (category === 'all' || category === 'threat') tasks.push(fetchThreatIntel());
    if (category === 'all' || category === 'research') tasks.push(fetchSecurityResearch());
    if (category === 'all' || category === 'breach') tasks.push(fetchDataBreaches());
    if (category === 'all' || category === 'exploit') tasks.push(fetchExploits());

    await Promise.allSettled(tasks);

    if (loadMoreBtn) {
        loadMoreBtn.disabled = false;
        loadMoreBtn.innerHTML = '<span>Load More Intelligence</span><i class="fas fa-sync-alt"></i>';
    }
}

// Pagination state
let cveStartIndex = 0;

/* Every URL below was verified live before being added: HTTP status, item
   count and payload size were checked directly. Feeds that 404'd, returned
   zero items, or shipped a 13MB payload (Project Zero's Blogspot feed) were
   dropped rather than left in to fail silently. */

async function fetchBreakingNews() {
    const sources = [
        { name: 'The Hacker News', url: 'https://feeds.feedburner.com/TheHackersNews' },
        { name: 'BleepingComputer', url: 'https://www.bleepingcomputer.com/feed/' },
        { name: 'Krebs on Security', url: 'https://krebsonsecurity.com/feed/' },
        { name: 'SecurityWeek', url: 'https://www.securityweek.com/feed/' },
        { name: 'Infosecurity', url: 'https://www.infosecurity-magazine.com/rss/news/' },
        { name: 'Help Net Security', url: 'https://www.helpnetsecurity.com/feed/' },
        { name: 'Ars Technica', url: 'https://arstechnica.com/security/feed/' },
        { name: 'Security Affairs', url: 'https://securityaffairs.com/feed' }
    ];
    await fetchRSSFeeds(sources, breakingNews, 'news');
}

async function fetchAdvisories() {
    const sources = [
        { name: 'CISA', url: 'https://www.cisa.gov/cybersecurity-advisories/all.xml' },
        { name: 'SANS ISC', url: 'https://isc.sans.edu/rssfeed_full.xml' }
    ];
    await fetchRSSFeeds(sources, advisories, 'advisory');
}

/* Deliberately NOT async, and it never should have been — it performs no I/O.
   The name said "fetch" and the signature said async, but all it does is merge
   two arrays.

   That mattered, because it caused silent data loss. Callers wrote

       breakingNews = await fetchTitleDeDuped(breakingNews, items)

   which splits a read-modify-write across an await boundary. mapPool runs four
   feed workers at once, and several feeds share a category, so:

       worker A reads breakingNews (empty), yields at the await
       worker B reads breakingNews (STILL empty), yields
       A resumes, assigns [A]
       B resumes, assigns [B]        <- A's articles are gone

   Measured on a cold load of the built site: all 24 feeds fetched and cached
   successfully, yet only 10 sources survived into the rendered arrays. The
   race predates the stale-first cache pass, but that change doubled the number
   of writes per feed (one paint from cache, one from the network) and turned an
   occasional loss into most of them.

   Synchronous, the merge is atomic: no await between reading the array and
   assigning it back, so two workers cannot interleave. */
function mergeTitleDeDuped(targetArray, newItems) {
    const existingTitles = new Set(targetArray.map(a => a.title));
    const uniqueNew = newItems.filter(a => !existingTitles.has(a.title));
    // Merge and sort by date descending
    return [...uniqueNew, ...targetArray].sort((a, b) => b.pubDate - a.pubDate);
}

/* ---------------------------------------------------------------------------
   Feed transport.

   Previously every feed went through api.rss2json.com. Its free tier limits
   how many *new* feeds you may convert in a window, so firing seventeen at
   once returned HTTP 429 for most of them and the page rendered four sources
   out of seventeen. Measured: even at 900ms spacing, 6 of 13 still 429'd.

   Instead the raw XML is proxied and parsed here with DOMParser. There is no
   per-feed conversion quota, and because the proxy fetches server-side with
   its own address, feeds that answer 403 to a browser (BleepingComputer,
   SecurityWeek, Talos) come back fine.

   Proxies are tried in order: they each fail on different upstreams, so one
   alone is not dependable. Responses are cached in localStorage so a reload
   costs nothing and repeat visits do not hammer the proxies.
--------------------------------------------------------------------------- */

/* Ordered by measured health. Every number below was measured from a cold
   browser on 2026-07-27, not assumed.

   TRANSPORT, PER PROXY — how many of the 23 feeds each one can actually
   reach. They fail on *different* upstreams, which is the whole reason a pool
   exists rather than a favourite:

     proxy.corsfix.com   22/23   ~180ms
     corsproxy.io        20/23    ~35ms   (fastest, so it leads)
     cors.eu.org         19/23  ~1470ms
     ------------------------------------
     union               23/23

   BleepingComputer, CrowdStrike and DataBreaches.net were logged as
   permanently unavailable for months. They are not. corsproxy.io answers 403
   for all three and it was the only proxy in the pool that worked, so they
   looked dead. corsfix fetches all three fine. Coverage is now complete
   without any self-hosted infrastructure.

   REMOVED, with cause — these were the "loads very slow, sometimes shows
   nothing" bug. Both are down AND fail slowly, and they used to be first in
   a strictly sequential list, so every feed ate two ~12s stalls before the
   one working proxy was tried:

     api.allorigins.win   times out at 12_500ms
     api.codetabs.com     times out at 12_500ms
     thingproxy           dead for years, fails in 250ms

   A dead proxy that fails FAST is harmless; one that hangs is not. If either
   recovers it can go back in the list — but behind the three above, and only
   with a fresh measurement.

   Direct fetch is not attempted: of the 23 feeds, exactly two (The Record and
   Dark Reading) send permissive CORS headers. The other 21 block the browser
   outright, so a direct-first path would burn a failed round trip on 91% of
   feeds to save a proxy hop on 9%. */
const PROXIES = [
    (u) => `https://corsproxy.io/?url=${encodeURIComponent(u)}`,
    (u) => `https://proxy.corsfix.com/?${u}`,
    (u) => `https://cors.eu.org/${u}`,
];

const CACHE_PREFIX = 'feed:';
const CACHE_TTL_MS = 20 * 60 * 1000; // considered fresh
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000; // still better than nothing
const FEED_TIMEOUT_MS = 12000;
const MAX_CONCURRENT = 4;

/* How long a proxy gets to itself before the next one is brought up alongside
   it. The healthy proxy answers in ~80ms, so 1.5s means the common case still
   costs exactly one request; it only escalates when something is actually
   wrong. */
const HEDGE_MS = 1500;

/* Start from whichever proxy last worked. Which proxy is healthy tends to
   hold for a whole session, so remembering the last success keeps the common
   case at a single request. Persisted, so a reload starts warm.

   Key is versioned: it stores an INDEX into PROXIES, and PROXIES was
   reordered. A returning visitor holding `2` under the old key would start on
   what is now a different proxy. Harmless — it fails over and re-remembers —
   but a one-character key bump discards the stale indices outright. */
const PROXY_PREF_KEY = 'feed:proxy2';

function preferredProxyIndex() {
    const stored = Number(localStorage.getItem(PROXY_PREF_KEY));
    return Number.isInteger(stored) && stored >= 0 && stored < PROXIES.length ? stored : 0;
}

function rememberProxy(index) {
    try {
        localStorage.setItem(PROXY_PREF_KEY, String(index));
    } catch (e) {
        /* Storage unavailable: ordering is an optimisation, not a requirement. */
    }
}

/* Proxy indices, healthiest-first. */
function proxyOrder() {
    const start = preferredProxyIndex();
    return PROXIES.map((_, i) => (start + i) % PROXIES.length);
}

/* `allowStale` exists because public proxies rate-limit by IP. When a visitor
   reloads a few times every proxy starts refusing, and without this the page
   would empty itself. Yesterday's headlines beat an empty page. */
function readCache(url, allowStale = false) {
    try {
        const raw = localStorage.getItem(CACHE_PREFIX + url);
        if (!raw) return null;
        const { at, xml } = JSON.parse(raw);
        const age = Date.now() - at;
        if (age <= CACHE_TTL_MS) return xml;
        if (allowStale && age <= CACHE_MAX_AGE_MS) return xml;
        return null;
    } catch (e) {
        return null;
    }
}

function writeCache(url, xml) {
    try {
        localStorage.setItem(CACHE_PREFIX + url, JSON.stringify({ at: Date.now(), xml }));
    } catch (e) {
        /* Quota exceeded: caching is an optimisation, never a requirement. */
    }
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* One attempt through one proxy. Throws on anything that is not a real feed,
   so a 200 carrying a rate-limit HTML page counts as a failure like any other
   and the caller does not have to special-case it. */
async function proxyAttempt(url, index, signal) {
    const response = await fetch(PROXIES[index](url), { signal });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const text = await response.text();
    if (!/<item[\s>]|<entry[\s>]/i.test(text)) throw new Error('not a feed');
    return { text, index };
}

/* First fulfilled attempt, or null once every one of them has rejected. */
const firstSuccess = (attempts) => Promise.any(attempts).catch(() => null);

/* Hedged fetch. Start the healthiest proxy; if it has not answered within
   HEDGE_MS, bring the next one up ALONGSIDE it rather than instead of it.
   First valid feed wins, the losers are aborted.

   Strict sequential fallback was the bug: a proxy that fails slowly blocked a
   proxy that answers in 81ms, and no amount of reordering fixes that — it
   just moves which visitor pays. Racing all of them from the start would also
   fix the latency, but it triples request volume against services that
   rate-limit by IP, which is what makes them fail in the first place. Hedging
   costs one request when things are healthy and escalates only when they are
   not. */
async function fetchOverProxies(url) {
    const ac = new AbortController();
    const cap = setTimeout(() => ac.abort(), FEED_TIMEOUT_MS);
    const attempts = [];
    let winner = null;

    try {
        for (const index of proxyOrder()) {
            const attempt = proxyAttempt(url, index, ac.signal);
            /* Every attempt keeps a no-op handler. Losers reject when the
               controller aborts, and an unhandled rejection would print a
               console error on an otherwise perfectly healthy load. */
            attempt.catch(() => {});
            attempts.push(attempt);

            winner = await Promise.race([
                firstSuccess(attempts),
                delay(HEDGE_MS).then(() => null),
            ]);
            if (winner) break;
        }
        // Everything is in flight now; wait out whatever is still running.
        if (!winner) winner = await firstSuccess(attempts);
    } finally {
        clearTimeout(cap);
        ac.abort();
    }

    return winner;
}

async function fetchFeedXml(url) {
    const fresh = readCache(url);
    if (fresh) return fresh;

    const won = await fetchOverProxies(url);
    if (won) {
        writeCache(url, won.text);
        rememberProxy(won.index);
        return won.text;
    }

    // Every proxy refused. Fall back to whatever was last stored.
    return readCache(url, true);
}

const stripHtml = (s) => (s || '').replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
const pick = (node, ...names) => {
    for (const n of names) {
        const el = node.querySelector(n);
        if (el && el.textContent.trim()) return el.textContent.trim();
    }
    return '';
};

function parseFeed(xml, sourceName, category) {
    const doc = new DOMParser().parseFromString(xml, 'text/xml');
    if (doc.querySelector('parsererror')) return [];

    return [...doc.querySelectorAll('item, entry')].map((node) => {
        // Atom puts the URL on <link href>; RSS puts it in the text node.
        let link = pick(node, 'link');
        if (!link) {
            const el = node.querySelector('link[href]');
            if (el) link = el.getAttribute('href');
        }
        const description = stripHtml(
            pick(node, 'description', 'summary', 'content'),
        ).slice(0, 180);

        return {
            title: stripHtml(pick(node, 'title')),
            link,
            description: description ? description + '...' : '',
            pubDate: new Date(pick(node, 'pubDate', 'published', 'updated', 'dc\\:date')),
            source: sourceName,
            category,
        };
    }).filter((item) => item.title && item.link);
}

/* Small concurrency pool: all-at-once trips proxy rate limits, one-at-a-time
   makes a cold load take half a minute. */
async function mapPool(items, limit, worker) {
    const out = [];
    let cursor = 0;
    const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
        while (cursor < items.length) {
            const index = cursor++;
            out[index] = await worker(items[index]);
        }
    });
    await Promise.all(runners);
    return out;
}

/* One place that knows which bucket a category writes to. The long if/else
   chain this replaces was repeated twice and had to be edited in step. */
/* Synchronous on purpose — see mergeTitleDeDuped. Adding an await anywhere in
   this function reintroduces the lost-update race. */
function mergeIntoCategory(category, items) {
    if (!items.length) return;
    if (category === 'news') breakingNews = mergeTitleDeDuped(breakingNews, items);
    else if (category === 'advisory') advisories = mergeTitleDeDuped(advisories, items);
    else if (category === 'cve') cves = mergeTitleDeDuped(cves, items);
    else if (category === 'threat') threatIntel = mergeTitleDeDuped(threatIntel, items);
    else if (category === 'research') securityResearch = mergeTitleDeDuped(securityResearch, items);
    else if (category === 'breach') dataBreaches = mergeTitleDeDuped(dataBreaches, items);
    else if (category === 'exploit') exploits = mergeTitleDeDuped(exploits, items);
}

async function fetchRSSFeeds(sources, targetArray, category) {
    try {
        /* Render per feed, not per category.
           Every feed is tried against up to four proxies at a 12s timeout
           each, so a single unreachable source can hold a category for the
           best part of a minute. Waiting for the whole category before the
           first paint meant a cold load showed nothing but a spinner for
           roughly 25 seconds, measured. Now the first feed to answer puts
           cards on screen and the rest fill in behind it. */
        await mapPool(sources, MAX_CONCURRENT, async (source) => {
            /* Synchronous from parse through merge to render. Nothing here
               awaits, so a concurrent worker cannot interleave between reading
               a category array and writing it back. */
            const paint = (xml) => {
                const parsed = parseFeed(xml, source.name, category);
                if (!parsed.length) return parsed;
                parsed.sort((a, b) => b.pubDate - a.pubDate);
                mergeIntoCategory(category, parsed);
                combineAndFilter();
                return parsed;
            };

            try {
                /* Stale-first. The cache was previously a last resort, only
                   read once every proxy had already refused — so a returning
                   visitor with a perfectly good copy on disk still watched a
                   spinner for the length of the network round trip, and saw
                   nothing at all if the proxies were having a bad day.

                   Painting it up front makes a repeat visit instant and means
                   the page is never empty while the network is being tried.
                   mergeIntoCategory de-dupes by title, so the refresh below
                   re-merges over the top harmlessly. */
                const stale = readCache(source.url, true);
                if (stale) paint(stale);

                const xml = await fetchFeedXml(source.url);
                if (!xml) {
                    // Only a real gap if there was nothing on disk either.
                    if (!stale) console.warn(`Feed unavailable: ${source.name}`);
                    return [];
                }
                // Identical bytes: fetchFeedXml served the same cache entry.
                if (xml === stale) return parseFeed(xml, source.name, category);
                return paint(xml);
            } catch (err) {
                console.warn(`Feed ${source.name} skipped:`, err.message);
                return [];
            }
        });

        combineAndFilter();
        return true;
    } catch (error) {
        console.error(`${category} process error:`, error);
        return false;
    }
}

async function fetchCVEs(isLoadMore = false) {
    try {
        // Page counter, not a row offset: the row offset is derived below.
        if (isLoadMore) cveStartIndex += 1;
        else cveStartIndex = 0;

        /* NVD returns a window oldest-first and offers no sort parameter, so
           startIndex=0 hands back the OLDEST CVEs in the range. The previous
           code asked for a 60-day window at index 0 and rendered vulnerabilities
           two months stale. Ask for the count first, then page in from the end.

           The window is short on purpose: NVD published 860 CVEs in three days
           during testing, so a wide range only buys latency. */
        const WINDOW_DAYS = 4;
        const PAGE_SIZE = 50;
        const now = new Date();
        const endDate = now.toISOString().split('T')[0];
        const startDate = new Date(now.getTime() - WINDOW_DAYS * 864e5)
            .toISOString().split('T')[0];

        if (!isLoadMore) {
            const rssSources = [
                { name: 'Vulners', url: 'https://vulners.com/rss.xml' }
            ];
            await fetchRSSFeeds(rssSources, cves, 'cve');
        }

        const range = `pubStartDate=${startDate}T00:00:00.000&pubEndDate=${endDate}T23:59:59.999`;
        const base = `https://services.nvd.nist.gov/rest/json/cves/2.0?${range}`;

        const head = await fetch(`${base}&resultsPerPage=1&startIndex=0`).then((r) => r.json());
        const total = head.totalResults || 0;
        if (!total) return;

        // Walk backwards from the newest as "load more" is pressed.
        const offsetFromEnd = PAGE_SIZE * (cveStartIndex + 1);
        const startIndex = Math.max(0, total - offsetFromEnd);
        const pageSize = Math.min(PAGE_SIZE, total - startIndex);

        const response = await fetch(`${base}&resultsPerPage=${pageSize}&startIndex=${startIndex}`);
        const data = await response.json();

        if (data.vulnerabilities && Array.isArray(data.vulnerabilities)) {
            const newCVEs = data.vulnerabilities.map(vuln => {
                const cve = vuln.cve;
                const cveId = cve.id;
                const description = cve.descriptions?.find(d => d.lang === 'en')?.value || 'No description available';
                const cvssV3 = cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore ||
                    cve.metrics?.cvssMetricV30?.[0]?.cvssData?.baseScore || 'N/A';
                const published = cve.published || new Date().toISOString();

                return {
                    title: cveId,
                    link: `https://nvd.nist.gov/vuln/detail/${cveId}`,
                    description: description.substring(0, 180) + '...',
                    pubDate: new Date(published),
                    source: 'NVD Database',
                    cvss: cvssV3,
                    category: 'cve'
                };
            }).sort((a, b) => b.pubDate - a.pubDate);

            if (isLoadMore) {
                cves = [...cves, ...newCVEs];
            } else {
                const existingTitles = new Set(cves.map(a => a.title));
                const uniqueNew = newCVEs.filter(a => !existingTitles.has(a.title));
                cves = [...uniqueNew, ...cves].sort((a, b) => b.pubDate - a.pubDate);
            }
            nvdLoaded = true;
        }
        combineAndFilter();
    } catch (error) {
        console.error('CVE fetch error:', error);
    }
}

async function fetchThreatIntel() {
    /* Mandiant's feed was removed: it answers HTTP 200 with 2.3MB of HTML and
       zero <item> elements — the blog moved under Google Cloud and the old
       path now serves a page, not a feed. It had never contributed an article.
       Unit 42 replaces it: same kind of source, 15 items, verified live. */
    const sources = [
        { name: 'CrowdStrike', url: 'https://www.crowdstrike.com/blog/feed/' },
        { name: 'The Record', url: 'https://therecord.media/feed' },
        { name: 'Unit 42', url: 'https://unit42.paloaltonetworks.com/feed/' },
        { name: 'Dark Reading', url: 'https://www.darkreading.com/rss.xml' }
    ];
    await fetchRSSFeeds(sources, threatIntel, 'threat');
}

async function fetchSecurityResearch() {
    const sources = [
        /* Project Zero's Blogspot feed ships full post bodies: 13MB for ten
           entries. Not worth it on every page load. */
        { name: 'Talos Intelligence', url: 'https://blog.talosintelligence.com/rss/' },
        { name: 'Schneier on Security', url: 'https://www.schneier.com/feed/atom/' },
        { name: 'Graham Cluley', url: 'https://grahamcluley.com/feed/atom/' }
    ];
    await fetchRSSFeeds(sources, securityResearch, 'research');
}

async function fetchDataBreaches() {
    /* HIBP alone left this category weeks stale, because it only publishes
       when a corpus is actually loaded. DataBreaches.net covers incidents as
       they are reported. */
    const sources = [
        { name: 'DataBreaches.net', url: 'https://databreaches.net/feed/' },
        { name: 'Have I Been Pwned', url: 'https://feeds.feedburner.com/HaveIBeenPwnedLatestBreaches' }
    ];
    await fetchRSSFeeds(sources, dataBreaches, 'breach');
}

async function fetchExploits() {
    const sources = [
        /* Exploit-DB publishes in bursts and its feed was 18 days old when
           checked, so ZDI leads here: verified same-day, 200 entries. */
        { name: 'Zero Day Initiative', url: 'https://www.zerodayinitiative.com/rss/published/' },
        { name: 'ZDI Upcoming', url: 'https://www.zerodayinitiative.com/rss/upcoming/' },
        { name: 'Exploit-DB', url: 'https://www.exploit-db.com/rss.xml' }
    ];
    await fetchRSSFeeds(sources, exploits, 'exploit');
}

// Universal Auto-Refresh every 10 minutes
setInterval(() => {
    loadMoreForCategory(currentCategory);
}, 10 * 60 * 1000);

function setupFilters() {
    const searchInput = document.getElementById('news-search');
    const dateInput = document.getElementById('news-date');
    const clearDateBtn = document.getElementById('clear-date');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const reloadBtn = document.getElementById('reload-news');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            currentLimit = 12;
            combineAndFilter();
        });
    }

    if (dateInput) {
        dateInput.addEventListener('change', (e) => {
            filterDate = e.target.value;
            if (clearDateBtn) clearDateBtn.style.display = filterDate ? 'inline-block' : 'none';
            currentLimit = 12;
            combineAndFilter();
        });
    }

    if (clearDateBtn) {
        clearDateBtn.addEventListener('click', () => {
            filterDate = '';
            if (dateInput) dateInput.value = '';
            clearDateBtn.style.display = 'none';
            currentLimit = 12;
            combineAndFilter();
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            currentLimit = 12;
            combineAndFilter();
        });
    });

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', async () => {
            currentLimit += 12;
            await loadMoreForCategory(currentCategory, true);
            renderArticles();
        });
    }

    if (reloadBtn) {
        reloadBtn.addEventListener('click', async () => {
            if (reloadBtn.disabled) return;
            const icon = reloadBtn.querySelector('i');
            reloadBtn.disabled = true;
            if (icon) icon.classList.add('fa-spin');
            try {
                currentLimit = 12;
                await loadMoreForCategory('all', true);
            } finally {
                if (icon) icon.classList.remove('fa-spin');
                reloadBtn.disabled = false;
            }
        });
    }
}

function combineAndFilter() {
    allArticles = [...kevArticles, ...breakingNews, ...advisories, ...cves, ...threatIntel, ...securityResearch, ...dataBreaches, ...exploits];

    // Global sort by date descending across all categories
    allArticles.sort((a, b) => {
        const dateA = a.pubDate instanceof Date ? a.pubDate : new Date(a.pubDate);
        const dateB = b.pubDate instanceof Date ? b.pubDate : new Date(b.pubDate);
        if (isNaN(dateA)) return 1;
        if (isNaN(dateB)) return -1;
        return dateB - dateA;
    });

    let categoryFiltered = currentCategory === 'all'
        ? allArticles
        : allArticles.filter(item => item.category === currentCategory);

    // Apply Date Filter
    if (filterDate) {
        categoryFiltered = categoryFiltered.filter(item => {
            if (!item.pubDate || isNaN(item.pubDate)) return false;
            try {
                const itemDateStr = item.pubDate.toISOString().split('T')[0];
                return itemDateStr === filterDate;
            } catch (e) { return false; }
        });
    }

    filteredArticles = searchQuery
        ? categoryFiltered.filter(item =>
            item.title.toLowerCase().includes(searchQuery) ||
            item.description.toLowerCase().includes(searchQuery) ||
            item.source.toLowerCase().includes(searchQuery)
        )
        : categoryFiltered;

    renderArticles();
    renderStats();
}

function renderArticles() {
    const container = document.getElementById('general-news-container');
    const loadMoreContainer = document.getElementById('load-more-container');
    if (!container) return;

    ['general-news-container', 'cisa-news-container', 'cve-container'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '';
    });

    if (filteredArticles.length === 0) {
        container.innerHTML = `
            <p style="text-align:center; font-size:1.8rem; opacity:0.7; padding: 5rem 0; grid-column: 1/-1;">
                ${allArticles.length === 0 ? 'Loading intelligence feeds...' : 'No results found. Try a different search or filter.'}
            </p>
        `;
        if (loadMoreContainer) loadMoreContainer.style.display = 'none';
        return;
    }

    const toShow = filteredArticles.slice(0, currentLimit);

    toShow.forEach(item => {
        /* Category drives a data attribute; the discipline colours live in
           /assets/hub.css so this feed matches the rest of the site. */
        const card = document.createElement('div');
        card.className = 'news-card';
        card.dataset.category = item.category || 'news';

        let severity = '';
        if (item.category === 'cve') {
            const cvss = parseFloat(item.cvss);
            if (cvss >= 9) severity = 'critical';
            else if (cvss >= 7) severity = 'high';
            else if (cvss >= 4) severity = 'medium';
            else if (!isNaN(cvss)) severity = 'low';
        }

        /* Everything interpolated below arrived from a third party, so it is
           encoded on the way in. See the note in hub.js. */
        card.innerHTML = `
            <div class="content">
                <div class="card-meta">
                    <span class="chip">${esc(item.source)}</span>
                    ${item.ransomware ? '<span class="chip chip-ransom">Ransomware</span>' : ''}
                    ${item.due ? `<span class="chip chip-due" data-overdue="${esc(item.overdue)}">${item.overdue ? 'Patch overdue' : 'Due ' + esc(item.due)}</span>` : ''}
                    ${item.cvss && item.cvss !== 'N/A' ? `<span class="chip chip-cvss" data-severity="${esc(severity)}">CVSS ${esc(item.cvss)}</span>` : ''}
                </div>
                <h3>${esc(item.title)}</h3>
                <p>${esc(item.description)}</p>
            </div>
            <div class="footer">
                <span class="source"><i class="fas fa-external-link-alt"></i> View details</span>
                <span class="date">${esc(timeAgo(item.pubDate))}</span>
            </div>
        `;

        /* A feed can hand back any string as a link. Only http(s) survives
           safeUrl; anything else leaves the card inert rather than opening a
           `javascript:` URL in this origin. */
        const href = safeUrl(item.link);
        if (href) {
            card.addEventListener('click', () => window.open(href, '_blank', 'noopener,noreferrer'));
        } else {
            card.dataset.inert = 'true';
        }
        container.appendChild(card);
    });

    if (loadMoreContainer) {
        loadMoreContainer.style.display = currentLimit < filteredArticles.length ? 'block' : 'none';
    }

    if (window.sr) {
        sr.reveal('.news-card', {
            interval: 50,
            origin: 'bottom',
            distance: '20px',
            opacity: 0,
            scale: 0.95,
            duration: 600,
            reset: false
        });
    }
}

document.addEventListener('DOMContentLoaded', newsHubInit);
