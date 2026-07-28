let allKnowledge = [];
let filteredKnowledge = [];
let isSearching = false;

// ─── Bootstrap ───────────────────────────────────────────────────────────────
async function fetchKnowledge() {
    try {
        const response = await fetch('../assets/data/knowledge.json');
        allKnowledge = await response.json();
        filteredKnowledge = [...allKnowledge];
        renderKnowledge();
        setupSearch();
    } catch (error) {
        console.error('Error fetching knowledge:', error);
    }
}

function renderKnowledge() {
    const grid = document.getElementById('knowledge-grid');
    if (!grid) return;
    grid.innerHTML = '';
    filteredKnowledge.forEach(topic => {
        const card = document.createElement('div');
        card.className = 'knowledge-card';
        card.innerHTML = `
            <div class="icon-head">
                <i class="${esc(topic.icon)}" aria-hidden="true"></i>
                <h3>${esc(topic.category)}</h3>
            </div>
            <p>${esc(topic.description)}</p>
            <div class="link-list">
                ${topic.resources.map(resourceLink).join('')}
            </div>
        `;
        grid.appendChild(card);
    });
}

/* Every outbound link on this page is built the same way: scheme-checked, and
   always with rel="noopener noreferrer" so a target page cannot reach back
   through window.opener. A link that fails the scheme check is rendered as
   plain text rather than silently dropped. */
function outboundLink(url, label, className = '') {
    const href = safeUrl(url);
    const cls = className ? ` class="${esc(className)}"` : '';
    if (!href) return `<span${cls}>${label}</span>`;
    return `<a${cls} href="${esc(href)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
}

function resourceLink(resource) {
    return outboundLink(
        resource.link,
        `<i class="fas fa-external-link-alt" aria-hidden="true"></i> ${esc(resource.name)}`,
    );
}

function setupSearch() {
    const input = document.getElementById('knowledge-search');
    const askBtn = document.getElementById('ask-btn');
    if (askBtn) askBtn.addEventListener('click', () => performSearch());
    if (input) input.addEventListener('keypress', e => { if (e.key === 'Enter') performSearch(); });
}

function setQuery(text) {
    const input = document.getElementById('knowledge-search');
    if (input) {
        input.value = text;
        performSearch();
    }
}

// ─── Main Search ──────────────────────────────────────────────────────────────
async function performSearch() {
    if (isSearching) return;
    const input = document.getElementById('knowledge-search');
    const query = input ? input.value.trim() : "";
    if (!query) return;

    isSearching = true;
    showLoader();

    try {
        // Answer and reference list are independent, so neither blocks the other.
        const [answer, results] = await Promise.all([
            fetchAnswer(query),
            fetchSearchResults(query),
        ]);
        renderResults(query, results, answer);
    } catch (error) {
        console.error('Search error:', error);
        renderError();
    } finally {
        isSearching = false;
    }
}

function showLoader() {
    const container = document.getElementById('search-results-container');
    if (!container) return;
    container.style.display = 'block';
    container.innerHTML = `
        <div class="result-loading">
            <div class="loader" style="width:3rem;height:3rem;margin:0 auto 1.5rem;"></div>
            <p>Searching the web...</p>
        </div>`;
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ---------------------------------------------------------------------------
   Search the curated library first.

   This page used to search only DuckDuckGo, through a CORS proxy, with no
   timeout: when the proxy stalled the page sat on "Searching the web..."
   forever. DuckDuckGo also answers 202 rather than 200 under load, which broke
   the parse, and its instant-answer API returns nothing for most security
   terms anyway.

   The 9 topics and 25 hand-picked resources here are the actual value, and
   searching them is instant and cannot fail. Web results are a bonus layered
   on top, with a hard timeout.
--------------------------------------------------------------------------- */
function searchLibrary(query) {
    const q = query.toLowerCase();
    const results = [];

    allKnowledge.forEach((topic) => {
        const haystack = `${topic.category} ${topic.description}`.toLowerCase();
        if (haystack.includes(q)) {
            results.push({
                title: topic.category,
                excerpt: topic.description,
                link: topic.resources?.[0]?.link || '#',
                source: 'Knowledge base',
                icon: 'fas fa-book',
            });
        }

        (topic.resources || []).forEach((resource) => {
            if (resource.name.toLowerCase().includes(q)) {
                results.push({
                    title: resource.name,
                    excerpt: `${topic.category} · curated resource`,
                    link: resource.link,
                    source: 'Knowledge base',
                    icon: 'fas fa-link',
                });
            }
        });
    });

    return results;
}

/* ---------------------------------------------------------------------------
   Answers, not just links.

   Two sources, both CORS-enabled so no proxy is involved:
     - a CVE identifier goes to NVD and comes back with the real description,
       CVSS vector, CWE and the vendor references
     - anything else goes to Wikipedia, which returns actual prose

   Both were verified live before being wired in: NVD returns CVSS 10.0 and 103
   references for CVE-2021-44228; Wikipedia returns a 564-character extract for
   SQL injection.
--------------------------------------------------------------------------- */
const CVE_PATTERN = /\bCVE-\d{4}-\d{4,7}\b/i;

async function fetchCveAnswer(cveId) {
    const response = await fetch(
        `https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=${encodeURIComponent(cveId)}`,
        { signal: AbortSignal.timeout(15000) },
    );
    if (!response.ok) throw new Error('NVD ' + response.status);
    const cve = (await response.json()).vulnerabilities?.[0]?.cve;
    if (!cve) throw new Error('CVE not found');

    const metric =
        cve.metrics?.cvssMetricV31?.[0]?.cvssData ||
        cve.metrics?.cvssMetricV30?.[0]?.cvssData ||
        null;

    const facts = [];
    if (metric) {
        facts.push({ label: 'CVSS', value: `${metric.baseScore} ${metric.baseSeverity}` });
        facts.push({ label: 'Vector', value: metric.vectorString });
    }
    const cwe = cve.weaknesses?.[0]?.description?.find((d) => d.value?.startsWith('CWE'))?.value;
    if (cwe) facts.push({ label: 'Weakness', value: cwe });
    if (cve.published) {
        facts.push({ label: 'Published', value: new Date(cve.published).toLocaleDateString() });
    }

    return {
        kind: 'cve',
        severity: metric?.baseSeverity?.toLowerCase() || '',
        title: cve.id,
        body: cve.descriptions?.find((d) => d.lang === 'en')?.value || '',
        facts,
        source: 'NVD',
        sourceUrl: `https://nvd.nist.gov/vuln/detail/${cve.id}`,
        /* One per host. NVD returned 103 references for Log4Shell and the
           first five were all the same site, which tells a reader nothing. */
        references: (() => {
            const hosts = new Set();
            const picked = [];
            for (const ref of cve.references || []) {
                let host;
                try { host = new URL(ref.url).hostname.replace(/^www\./, ''); } catch (e) { continue; }
                if (hosts.has(host)) continue;
                hosts.add(host);
                picked.push({ label: host, url: ref.url });
                if (picked.length === 6) break;
            }
            return picked;
        })(),
    };
}

async function fetchWikiAnswer(query) {
    // Resolve the best-matching article first; a raw query rarely matches a title.
    const search = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=1`,
        { signal: AbortSignal.timeout(8000) },
    );
    if (!search.ok) throw new Error('wiki search ' + search.status);
    const title = (await search.json()).query?.search?.[0]?.title;
    if (!title) throw new Error('no article');

    const summary = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
        { signal: AbortSignal.timeout(8000) },
    );
    if (!summary.ok) throw new Error('wiki summary ' + summary.status);
    const page = await summary.json();
    if (!page.extract) throw new Error('no extract');

    return {
        kind: 'concept',
        title: page.title,
        body: page.extract,
        facts: page.description ? [{ label: 'In short', value: page.description }] : [],
        source: 'Wikipedia',
        sourceUrl: page.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
        references: [],
    };
}

/* Arithmetic only, and only when the whole query is an expression, so a search
   for "OWASP Top 10" is never mistaken for a sum. */
const MATH_PATTERN = /^[\d\s+\-*/^().%]+$/;
const isExpression = (q) => MATH_PATTERN.test(q) && /\d/.test(q) && /[+\-*/^%]/.test(q);

async function fetchMathAnswer(query) {
    const response = await fetch(
        'https://api.mathjs.org/v4/?expr=' + encodeURIComponent(query),
        { signal: AbortSignal.timeout(6000) },
    );
    if (!response.ok) throw new Error('mathjs ' + response.status);
    const value = (await response.text()).trim();
    if (!value || /error/i.test(value)) throw new Error('not evaluable');

    return {
        kind: 'calc',
        title: `${query.trim()} = ${value}`,
        body: '',
        facts: [],
        source: 'math.js',
        sourceUrl: 'https://mathjs.org/',
        references: [],
    };
}

/* DuckDuckGo's Answer field handles conversions, encodings and lookups. It
   reports AnswerType "calc" for plain arithmetic but returns nothing, which is
   why math.js is tried first. */
async function fetchInstantAnswer(query) {
    const response = await fetch(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`,
        { signal: AbortSignal.timeout(7000) },
    );
    if (!response.ok) throw new Error('DDG ' + response.status);
    const data = await response.json();
    const answer = (data.Answer || '').toString().trim();
    if (!answer) throw new Error('no instant answer');

    return {
        kind: 'calc',
        title: answer.replace(/<[^>]*>/g, ''),
        body: '',
        facts: data.AnswerType ? [{ label: 'Type', value: data.AnswerType }] : [],
        source: 'DuckDuckGo',
        sourceUrl: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
        references: [],
    };
}

/* Most specific source that can actually answer, in order. Every answer is an
   indexed description from a named source, never generated text. */
async function fetchAnswer(query) {
    const trimmed = query.trim();
    const attempts = [];

    const cveMatch = trimmed.match(CVE_PATTERN);
    if (cveMatch) attempts.push(() => fetchCveAnswer(cveMatch[0].toUpperCase()));
    if (isExpression(trimmed)) attempts.push(() => fetchMathAnswer(trimmed));
    attempts.push(() => fetchInstantAnswer(trimmed));
    attempts.push(() => fetchWikiAnswer(trimmed));

    for (const attempt of attempts) {
        try {
            const answer = await attempt();
            if (answer) return answer;
        } catch (e) {
            /* Try the next source. */
        }
    }
    return null;
}

async function fetchSearchResults(query) {
    const local = searchLibrary(query);

    /* DuckDuckGo sends Access-Control-Allow-Origin: *, so the proxy this used
       to route through was never needed. Bounded so it can never hang. */
    const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`;

    try {
        const response = await fetch(ddgUrl, { signal: AbortSignal.timeout(6000) });
        if (!response.ok) throw new Error('DDG ' + response.status);
        const data = await response.json();

        let results = [];

        // 1. Primary Highlight (Abstract)
        if (data.AbstractText && data.AbstractURL) {
            results.push({
                title: data.Heading || query,
                excerpt: data.AbstractText,
                link: data.AbstractURL,
                source: 'DuckDuckGo',
                icon: 'fas fa-search'
            });
        }

        // 2. Related Topics (Links)
        if (data.RelatedTopics && data.RelatedTopics.length > 0) {
            data.RelatedTopics.forEach(topic => {
                // Topic might be an object with Text/FirstURL or a sub-category 'Topics'
                if (topic.Text && topic.FirstURL && topic.FirstURL !== data.AbstractURL) {
                    results.push({
                        title: topic.Text.split(' - ')[0] || topic.Text.substring(0, 50),
                        excerpt: topic.Text,
                        link: topic.FirstURL,
                        source: 'Web Search',
                        icon: 'fas fa-link'
                    });
                } else if (topic.Topics) {
                    // Handle sub-categories if they exist
                    topic.Topics.forEach(subTopic => {
                        if (subTopic.Text && subTopic.FirstURL) {
                            results.push({
                                title: subTopic.Text.split(' - ')[0] || subTopic.Text.substring(0, 50),
                                excerpt: subTopic.Text,
                                link: subTopic.FirstURL,
                                source: 'Web Search',
                                icon: 'fas fa-link'
                            });
                        }
                    });
                }
            });
        }

        // Library hits lead; the web only fills in behind them.
        const seenUrls = new Set();
        const merged = [...local, ...results].filter((item) => {
            if (!item.link || seenUrls.has(item.link)) return false;
            seenUrls.add(item.link);
            return true;
        });

        merged.push(webFallback(query));
        return merged.slice(0, 10);

    } catch (e) {
        // Web lookup unavailable: the curated library still answers.
        console.warn('Web search unavailable:', e.name);
        return [...local, webFallback(query)];
    }
}

function webFallback(query) {
    return {
        title: `Search the web for "${query}"`,
        excerpt: 'Opens DuckDuckGo with this query for anything the library does not cover.',
        link: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
        source: 'Web',
        icon: 'fas fa-external-link-alt',
    };
}

function renderAnswer(answer) {
    if (!answer) return '';
    /* NVD descriptions, Wikipedia extracts and DuckDuckGo abstracts are all
       third-party text, so everything here is encoded on output. */
    const facts = answer.facts?.length
        ? `<dl class="answer-facts">${answer.facts
            .map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`)
            .join('')}</dl>`
        : '';
    const refs = answer.references?.length
        ? `<div class="answer-refs"><span class="answer-refs-label">References</span>${answer.references
            .map((r) => outboundLink(r.url, esc(r.label)))
            .join('')}</div>`
        : '';

    return `
        <section class="answer" data-kind="${esc(answer.kind)}" data-severity="${esc(answer.severity || '')}">
            <div class="answer-head">
                <h2>${esc(answer.title)}</h2>
                ${outboundLink(
                    answer.sourceUrl,
                    `${esc(answer.source)} <i class="fas fa-external-link-alt" aria-hidden="true"></i>`,
                    'answer-source',
                )}
            </div>
            ${facts}
            <p class="answer-body">${esc(answer.body)}</p>
            ${refs}
        </section>`;
}

function renderResults(query, results, answer) {
    const container = document.getElementById('search-results-container');
    if (!container) return;
    container.innerHTML = '';

    if (answer) container.insertAdjacentHTML('beforeend', renderAnswer(answer));

    if (results.length === 0) {
        container.innerHTML = `
            <div class="result-empty">
                <i class="fas fa-search" aria-hidden="true"></i>
                <p>No results found for "<strong>${esc(query)}</strong>"</p>
                <span>Try a different or more specific term.</span>
            </div>`;
        return;
    }

    // Header
    const header = document.createElement('div');
    header.style.marginBottom = '2rem';
    const fromLibrary = results.filter((r) => r.source === 'Knowledge base').length;
    const label = results.length === 1 ? 'result' : 'results';
    header.innerHTML = `<p class="results-count">${results.length} ${label}${fromLibrary ? ` · ${fromLibrary} from the library` : ''}</p>`;
    container.appendChild(header);

    // Results
    results.forEach(res => {
        const card = document.createElement('div');
        card.className = 'search-result-card';
        card.innerHTML = `
            <div class="result-source">
                <i class="${esc(res.icon || 'fas fa-globe')}" aria-hidden="true"></i>
                <span>${esc(res.source)}</span>
            </div>
            ${outboundLink(res.link, esc(res.title), 'result-title')}
            <p class="result-excerpt">${esc(res.excerpt)}</p>
            ${outboundLink(
                res.link,
                'Visit site <i class="fas fa-external-link-alt" aria-hidden="true"></i>',
                'result-link',
            )}
        `;
        container.appendChild(card);
    });
}

function renderError() {
    const container = document.getElementById('search-results-container');
    if (!container) return;
    container.innerHTML = `
        <div class="result-empty">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Search service is temporarily unavailable</p>
            <span>Please check your connection and try again later.</span>
        </div>`;
}

document.addEventListener('DOMContentLoaded', fetchKnowledge);
