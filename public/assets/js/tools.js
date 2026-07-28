let staticTools = [];
let liveTools = []; // GitHub trending
let allTools = [];
let filteredTools = [];
let currentCategory = 'all';
let searchQuery = '';
const PAGE_SIZE = 18;
let toolsShown = PAGE_SIZE;

const GITHUB_SEARCH_URL = 'https://api.github.com/search/repositories';

/* GitHub allows 10 unauthenticated searches per hour per IP. The trending
   list changes slowly, so it is cached hard: without this, a handful of
   visitors (or one person reloading) exhausts the quota and the lane dies. */
const TRENDING_CACHE_KEY = 'tools:trending';
const TRENDING_TTL_MS = 6 * 60 * 60 * 1000;

function readTrendingCache() {
    try {
        const raw = localStorage.getItem(TRENDING_CACHE_KEY);
        if (!raw) return null;
        const { at, items } = JSON.parse(raw);
        return Date.now() - at < TRENDING_TTL_MS ? items : null;
    } catch (e) {
        return null;
    }
}

async function fetchInitialTools() {
    try {
        const response = await fetch('/assets/data/tools.json');
        staticTools = await response.json();
    } catch (error) {
        console.error('Curated tool list unavailable:', error);
        staticTools = [];
    }

    // Filters are built from the data, never hardcoded, so a category added
    // to tools.json is reachable immediately.
    buildFilters();
    combineAndRender();
    setupSearchAndFilters();
    renderToolStats();

    const cached = readTrendingCache();
    if (cached) {
        liveTools = cached;
        combineAndRender();
        renderToolStats();
        return;
    }

    try {
        const hotResponse = await fetch(
            `${GITHUB_SEARCH_URL}?q=topic:security+topic:hacking+stars:>5000&sort=stars&order=desc&per_page=15`,
            { signal: AbortSignal.timeout(8000) },
        );
        if (!hotResponse.ok) throw new Error('GitHub ' + hotResponse.status);
        const hotData = await hotResponse.json();

        if (hotData.items) {
            liveTools = hotData.items.map((item) => ({
                name: item.name,
                category: 'Trending',
                description: (item.description || 'Popular security project.').substring(0, 150) + '...',
                link: item.html_url,
                icon: 'fab fa-github',
                stars: item.stargazers_count,
                owner: item.owner?.login,
                isLive: true,
            }));
            try {
                localStorage.setItem(
                    TRENDING_CACHE_KEY,
                    JSON.stringify({ at: Date.now(), items: liveTools }),
                );
            } catch (e) { /* quota */ }
            combineAndRender();
            renderToolStats();
        }
    } catch (error) {
        // Rate limited or offline: the curated library is the real content,
        // so this degrades to "no trending lane" rather than an error.
        console.warn('GitHub trending unavailable:', error.message);
    }
}

/* One button per category that actually exists in the data, with counts.
   The hardcoded list this replaces offered 7 of 14 categories, leaving 42 of
   87 tools reachable only by search. */
function buildFilters() {
    const wrap = document.getElementById('category-btns');
    if (!wrap) return;

    const counts = staticTools.reduce((acc, tool) => {
        acc[tool.category] = (acc[tool.category] || 0) + 1;
        return acc;
    }, {});

    const categories = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);

    wrap.innerHTML =
        `<button class="filter-btn active" data-category="all">All<span class="filter-count">${staticTools.length}</span></button>` +
        `<button class="filter-btn" data-category="Trending" data-tone="amber">Trending<span class="filter-count" id="trending-count">0</span></button>` +
        categories.map((category) =>
            `<button class="filter-btn" data-category="${esc(category)}" data-tone="${esc(toneFor(category))}">${esc(category)}<span class="filter-count">${esc(counts[category])}</span></button>`,
        ).join('');
}

/* Reuses the portfolio's discipline palette so a category reads the same
   colour here as it does on the main site. */
const CATEGORY_TONES = {
    'Network Mapping': 'navy',
    'Network Analysis': 'navy',
    'Packet Analysis': 'navy',
    Reconnaissance: 'teal',
    OSINT: 'teal',
    Exploitation: 'oxblood',
    'Password Cracking': 'oxblood',
    'Web Security': 'violet',
    'Vulnerability Scanning': 'forest',
    'Active Directory': 'forest',
    'Wireless Security': 'amber',
    Forensics: 'slate',
    'Reverse Engineering': 'slate',
    Utility: 'bronze',
};

const toneFor = (category) => CATEGORY_TONES[category] || 'slate';

/* Who publishes it. GitHub links carry the owner in the path; everything else
   falls back to the project's own domain, which is the honest answer for
   vendor tools like Burp Suite or Cobalt Strike. */
function authorOf(tool) {
    if (tool.owner) return tool.owner;
    const link = tool.link || '';
    const gh = link.match(/github\.com\/([^/]+)/i);
    if (gh) return gh[1];
    try {
        return new URL(link).hostname.replace(/^www\./, '');
    } catch (e) {
        return '';
    }
}

/* Two-letter monogram beats a generic glyph: it is always distinct, needs no
   icon font, and reads as the tool's own mark. */
function monogramOf(name) {
    const cleaned = (name || '').replace(/[^A-Za-z0-9 ]/g, ' ').trim();
    const words = cleaned.split(/\s+/).filter(Boolean);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return cleaned.slice(0, 2).toUpperCase() || '??';
}

function renderToolStats() {
    const set = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };
    /* "+" because the library is curated plus whatever GitHub is trending
       today: the total is a floor, not a fixed number. */
    set('stat-tools', staticTools.length ? staticTools.length + '+' : '—');
    set('stat-categories', new Set(staticTools.map((t) => t.category)).size || '—');
    set('stat-trending', liveTools.length ? liveTools.length + '+' : '—');
    const badge = document.getElementById('trending-count');
    if (badge) badge.textContent = liveTools.length;
}

async function searchGitHub(query) {
    try {
        // Try direct search first (best for specific tool names)
        const response = await fetch(`${GITHUB_SEARCH_URL}?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=12`, { signal: AbortSignal.timeout(8000) });
        const data = await response.json();

        let results = [];
        if (data.items && data.items.length > 0) {
            results = data.items.map(item => ({
                name: item.name,
                category: "GitHub Live",
                description: item.description || "No description available.",
                link: item.html_url,
                icon: "fab fa-github",
                stars: item.stargazers_count,
                isLive: true
            }));
        }

        // If very few results, try adding 'security' keywords
        if (results.length < 3) {
            const secQuery = `${query} security tool`;
            const secResponse = await fetch(`${GITHUB_SEARCH_URL}?q=${encodeURIComponent(secQuery)}&sort=stars&order=desc&per_page=5`, { signal: AbortSignal.timeout(8000) });
            const secData = await secResponse.json();
            if (secData.items) {
                const secResults = secData.items.map(item => ({
                    name: item.name,
                    category: "GitHub Live",
                    description: item.description || "No description available.",
                    link: item.html_url,
                    icon: "fab fa-github",
                    stars: item.stargazers_count,
                    isLive: true
                }));
                // Combine and de-duplicate
                const existingNames = new Set(results.map(r => r.name.toLowerCase()));
                secResults.forEach(r => {
                    if (!existingNames.has(r.name.toLowerCase())) results.push(r);
                });
            }
        }

        return results;
    } catch (err) {
        console.error('GitHub Search Error:', err);
        return [];
    }
}

function combineAndRender() {
    /* The curated entry always wins a name collision, and only borrows the
       star count from its trending twin.

       Previously the live list came first, so when GitHub trending happened to
       include a curated tool (Bettercap, RustScan) the trending copy replaced
       it and brought category "Trending" with it. Those tools then vanished
       from their real category: "Network Mapping" showed 6 of 8. */
    /* Keyed by name AND category, because a tool can legitimately sit in two:
       Nikto is listed under both Web Security and Vulnerability Scanning.
       Keying on name alone silently dropped it from one of them. The "All"
       view collapses these back to one card (see applyFilters). */
    const byName = new Map();

    staticTools.forEach((tool) => {
        byName.set(tool.name.toLowerCase() + '|' + tool.category, { ...tool });
    });

    liveTools.forEach((tool) => {
        const existing = [...byName.values()].find(
            (t) => t.name.toLowerCase() === tool.name.toLowerCase(),
        );
        if (existing) {
            if (tool.stars && !existing.stars) existing.stars = tool.stars;
            return;
        }
        byName.set(tool.name.toLowerCase() + '|' + tool.category, tool);
    });

    // Trending first for the unfiltered view, curated order after.
    const all = [...byName.values()];
    allTools = [...all.filter((t) => t.isLive), ...all.filter((t) => !t.isLive)];
    applyFilters();
}

function renderTools() {
    const toolsContainer = document.getElementById('tools-library');
    const loadMoreContainer = document.getElementById('load-more-container');

    toolsContainer.innerHTML = '';

    if (filteredTools.length === 0) {
        toolsContainer.innerHTML = `
            <div class="empty-state">
                <p class="empty-title">Nothing matches that.</p>
                <p class="empty-hint">Search covers tool names, descriptions and categories. Try a broader term, or jump to a category:</p>
                <div class="empty-actions">
                    <button type="button" class="btn" data-jump="Exploitation">Exploitation</button>
                    <button type="button" class="btn" data-jump="OSINT">OSINT</button>
                    <button type="button" class="btn" data-jump="Web Security">Web Security</button>
                    <button type="button" class="btn" data-jump="all">Show everything</button>
                </div>
            </div>
        `;
        toolsContainer.querySelectorAll('[data-jump]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const input = document.getElementById('tool-search');
                if (input) input.value = '';
                searchQuery = '';
                document.querySelector(`.filter-btn[data-category="${btn.dataset.jump}"]`)?.click();
            });
        });
        loadMoreContainer.style.display = 'none';
        return;
    }

    const toShow = filteredTools.slice(0, toolsShown);

    toShow.forEach(tool => {
        const card = document.createElement('div');
        /* Markup only. Sizing and colour live in /assets/hub.css: the inline
           styles this used to carry assumed a 10px root font size from the
           previous stylesheet and hardcoded the old palette. */
        card.className = 'news-card';
        card.dataset.tone = tool.isLive ? 'amber' : toneFor(tool.category);

        /* Names, descriptions and owners in the trending lane come straight
           from the GitHub search API, and a repo description is free text
           anyone can set. Encoded on output — see the note in hub.js. */
        const author = authorOf(tool);
        card.innerHTML = `
            <div class="content">
                <div class="tool-head">
                    <span class="tool-icon" aria-hidden="true">${esc(monogramOf(tool.name))}</span>
                    <span class="tool-id">
                        <h3>${esc(tool.name)}</h3>
                        <span class="tool-meta">
                            ${author ? `<span class="tool-author">${esc(author)}</span>` : ''}
                            ${tool.stars ? `<span class="tool-stars"><i class="fas fa-star"></i> ${esc(tool.stars.toLocaleString())}</span>` : ''}
                        </span>
                    </span>
                </div>
                <p>${esc(tool.description)}</p>
            </div>
            <div class="footer">
                <span class="source"><i class="fas fa-tag"></i> ${esc(tool.category)}</span>
                <span class="date">Get tool <i class="fas fa-external-link-alt"></i></span>
            </div>
        `;

        const href = safeUrl(tool.link);
        if (href) {
            card.addEventListener('click', () => window.open(href, '_blank', 'noopener,noreferrer'));
        } else {
            card.dataset.inert = 'true';
        }
        toolsContainer.appendChild(card);
    });

    loadMoreContainer.style.display = toolsShown < filteredTools.length ? 'block' : 'none';

    if (!document.getElementById('live-indicator-style')) {
        const style = document.createElement('style');
        style.id = 'live-indicator-style';
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(0.95); opacity: 0.7; }
                70% { transform: scale(1.1); opacity: 0.3; }
                100% { transform: scale(0.95); opacity: 0.7; }
            }
        `;
        document.head.appendChild(style);
    }

    if (window.sr) {
        sr.reveal('.news-card', { interval: 50, origin: 'bottom', distance: '20px', opacity: 0, scale: 0.95, duration: 600, reset: false });
    }
}

let searchTimeout;
function setupSearchAndFilters() {
    const searchInput = document.getElementById('tool-search');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const loadMoreBtn = document.getElementById('load-more-btn');

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        toolsShown = PAGE_SIZE;

        /* Filter the curated library on this keystroke, always.
           Previously a query longer than two characters skipped straight to a
           600ms debounce plus a GitHub round trip, and only rendered when that
           came back — so the list sat visibly stale while you typed, and if
           GitHub was rate-limited it stayed stale until the request timed out.
           The 87 local tools are the actual content and matching them is free;
           GitHub results are a bonus that merges in when it arrives. */
        applyFilters();

        clearTimeout(searchTimeout);
        if (searchQuery.length > 2) {
            const queryAtRequest = searchQuery;
            searchTimeout = setTimeout(async () => {
                const liveResults = await searchGitHub(queryAtRequest);
                // Ignore a late reply for a query the visitor has moved on from.
                if (queryAtRequest !== searchQuery) return;
                const currentSearchIds = new Set(allTools.map(t => t.name.toLowerCase()));
                const newLive = liveResults.filter(t => !currentSearchIds.has(t.name.toLowerCase()));
                applyFilters(newLive);
            }, 600);
        }
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            toolsShown = PAGE_SIZE;
            applyFilters();
        });
    });

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            toolsShown += PAGE_SIZE;
            renderTools();
        });
    }
}

function applyFilters(additionalResults = []) {
    const allForSearch = [...allTools, ...additionalResults];
    const searchTerms = searchQuery.split(' ').filter(term => term.length > 0);

    // Weighted search results
    const scoredResults = allForSearch.map(tool => {
        let score = 0;
        const name = tool.name.toLowerCase();
        const desc = tool.description.toLowerCase();
        const cat = tool.category.toLowerCase();

        const matchesCategory = currentCategory === 'all' || tool.category === currentCategory;

        if (searchQuery) {
            searchTerms.forEach(term => {
                if (name === term) score += 100;
                else if (name.includes(term)) score += 50;

                if (desc.includes(term)) score += 20;
                if (cat.includes(term)) score += 10;
            });

            if (!matchesCategory) score -= 5;
        } else {
            if (!matchesCategory) score = -1;
            else score = 1;
        }

        return { ...tool, searchScore: score };
    });

    /* With a query, a tool that matches nothing scores 0. Keeping ">= 0" meant
       a nonsense search returned the entire library presented as results, so a
       search must now actually score. */
    filteredTools = scoredResults
        .filter((item) => (searchQuery ? item.searchScore > 0 : item.searchScore >= 0))
        .sort((a, b) => b.searchScore - a.searchScore);

    // A cross-listed tool should appear once when nothing is narrowing the view.
    if (currentCategory === 'all') {
        const seenName = new Set();
        filteredTools = filteredTools.filter((tool) => {
            const key = tool.name.toLowerCase();
            if (seenName.has(key)) return false;
            seenName.add(key);
            return true;
        });
    }

    /* Related suggestions only make sense next to a real hit. With zero hits
       they read as results, so the empty state takes over instead. */
    if (searchQuery && filteredTools.length > 0 && filteredTools.length < 3) {
        const topCategory = filteredTools[0].category;
        const recommendations = allForSearch
            .filter((tool) => !filteredTools.some((f) => f.name === tool.name))
            .filter((tool) => tool.category === topCategory)
            .slice(0, 3);

        filteredTools = [...filteredTools, ...recommendations];
    }

    renderTools();
}

document.addEventListener('DOMContentLoaded', fetchInitialTools);
