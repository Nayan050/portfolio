/* ---------------------------------------------------------------------------
   Every project, in one list. `kind` decides how a card behaves:

     'case-study' — opens the deep-dive overlay, so it also carries
                    challenge / process / outcomes / stack.
     'build'      — a smaller piece of work; the card links straight out.

   Outcomes are stated qualitatively. Engagement figures are client data and
   the student work was never instrumented, so a number here would be a
   number nobody can check. Describe what changed, not how much.

   Security engagements are described in generalized terms — no client data.
--------------------------------------------------------------------------- */

/* `tone` maps to the shared discipline palette in tokens.css, so a project's
   category is the same colour here as in the credential wall. */
export const PROJECT_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'defense', label: 'Defense & Ops', tone: 'navy' },
  { id: 'offense', label: 'Offensive', tone: 'oxblood' },
  { id: 'engineering', label: 'Engineering & Research', tone: 'bronze' },
  { id: 'web', label: 'Web & Design', tone: 'teal' },
]

export const CATEGORY_TONES = {
  defense: 'navy',
  offense: 'oxblood',
  engineering: 'bronze',
  web: 'teal',
}

export const PROJECTS = [
  {
    id: 'siem',
    title: 'SIEM Implementation & Threat Detection',
    category: 'defense',
    categoryLabel: 'Defense & Ops',
    tagline: 'Real-time detection engineering across an enterprise log estate.',
    stack: ['CrowdStrike NG-SIEM', 'Correlation Rules', 'Dashboards', 'Threat Intel'],
    challenge:
      'Security events sat fragmented across servers, network gear and endpoint agents, so attacks could unfold quietly between silos. The organization needed a single pane of glass that turned raw log volume into decisions within minutes, not days.',
    process: [
      { title: 'Log estate audit', text: 'Mapped every event source worth ingesting and ranked it by detection value.' },
      { title: 'Ingestion pipeline', text: 'Onboarded sources with normalized parsing so events became queryable fields.' },
      { title: 'Detection engineering', text: 'Authored correlation rules mapped to MITRE ATT&CK techniques.' },
      { title: 'Dashboards & triage', text: 'Built live dashboards and severity-based routing for the response workflow.' },
      { title: 'Tuning loop', text: 'Iterated on noisy rules weekly, pushing signal-to-noise steadily upward.' },
    ],
    outcomes: [
      'Fragmented server, network and endpoint logs consolidated into one queryable estate.',
      'Correlation rules authored against MITRE ATT&CK techniques rather than vendor signatures.',
      'Triage moved from manual log-hunting to severity-routed dashboards the team works from daily.',
    ],
    links: [],
  },
  {
    id: 'vapt',
    title: 'VAPT: Web Application Security',
    category: 'offense',
    categoryLabel: 'Offensive',
    tagline: 'Full-cycle assessment: recon, exploitation, and remediation guidance.',
    stack: ['Burp Suite', 'Nmap', 'OWASP Top 10', 'Reporting'],
    challenge:
      'A production web application handled sensitive workflows without ever facing a structured adversarial test. Stakeholders needed proof of which weaknesses were exploitable in practice, plus an exact, prioritized path to closing them.',
    process: [
      { title: 'Scoping & rules', text: 'Defined targets, test windows and safe-exploitation boundaries.' },
      { title: 'Recon & mapping', text: 'Enumerated attack surface, technologies and authentication flows.' },
      { title: 'Exploitation', text: 'Chained OWASP Top 10 findings into demonstrable, evidence-backed impact.' },
      { title: 'Reporting', text: 'Delivered severity-ranked findings with reproduction steps and fixes.' },
      { title: 'Retest', text: 'Verified remediation and confirmed closure of critical paths.' },
    ],
    outcomes: [
      'Exploitable weaknesses demonstrated with working proof, not theoretical severity ratings.',
      'Findings delivered severity-ranked, with reproduction steps an engineer can follow.',
      'Critical paths retested after remediation and confirmed closed.',
    ],
    links: [],
  },
  {
    id: 'redteam',
    title: 'Red Team: Corporate Network Operation',
    category: 'offense',
    categoryLabel: 'Offensive',
    tagline: 'Simulated adversary campaign from initial access to objectives.',
    stack: ['Kali Linux', 'Metasploit', 'Active Directory', 'ATT&CK'],
    challenge:
      'Perimeter defenses looked solid on paper, but nobody had measured how far a determined attacker could actually travel inside the network. Leadership needed a realistic campaign that exposed lateral-movement paths before a real adversary found them.',
    process: [
      { title: 'Threat modeling', text: 'Selected adversary profile and objectives matched to the business.' },
      { title: 'Initial access', text: 'Gained a foothold through exposed services and social vectors.' },
      { title: 'Lateral movement', text: 'Escalated privileges and pivoted across network segments.' },
      { title: 'Objective capture', text: 'Demonstrated impact on crown-jewel assets with full evidence trail.' },
      { title: 'Debrief', text: 'Mapped every step to detections the blue team could build.' },
    ],
    outcomes: [
      'Lateral-movement paths traced from initial foothold through to crown-jewel assets.',
      'Every step of the kill chain mapped to a detection the blue team could build.',
      'Perimeter-only assumptions replaced with evidence of what a foothold actually reaches.',
    ],
    links: [],
  },
  {
    id: 'phishing',
    title: 'Phishing Simulation & Awareness Campaign',
    category: 'defense',
    categoryLabel: 'Defense & Ops',
    tagline: 'Measured the human attack surface, then trained it down.',
    stack: ['Social Engineering', 'Campaign Design', 'Awareness Training', 'Metrics'],
    challenge:
      'Technical controls were maturing while the human layer remained untested and unmeasured. The organization needed hard data on employee susceptibility, and a program that converted those numbers into lasting behavioral change.',
    process: [
      { title: 'Pretext design', text: 'Crafted realistic lures modeled on current regional threat campaigns.' },
      { title: 'Controlled launch', text: 'Ran the simulation in waves with tracked click and report rates.' },
      { title: 'Analysis', text: 'Segmented results by department to find the highest-risk groups.' },
      { title: 'Training', text: 'Delivered targeted awareness sessions built on real campaign data.' },
      { title: 'Re-test', text: 'Measured improvement with a follow-up wave and reported the delta.' },
    ],
    outcomes: [
      'Human-layer susceptibility measured against real data instead of assumed.',
      'Click and report rates tracked separately, so improvement was visible rather than inferred.',
      'Departments carrying genuine exposure identified, then trained on their own campaign results.',
    ],
    links: [],
  },
  {
    id: 'cloudsec',
    title: 'Cloud Infrastructure Security Audit',
    category: 'defense',
    categoryLabel: 'Defense & Ops',
    tagline: 'Azure hardening against CIS benchmarks, from IAM to storage.',
    stack: ['Azure', 'CIS Benchmarks', 'IAM', 'Storage Security'],
    challenge:
      'Cloud adoption had outpaced governance, leaving IAM policies and storage configurations drifting from best practice. The audit had to find every misconfiguration and translate it into a hardening roadmap engineers would actually execute.',
    process: [
      { title: 'Scope & baseline', text: 'Selected CIS benchmark controls relevant to the Azure estate.' },
      { title: 'Configuration review', text: 'Audited IAM, network rules, storage and logging settings.' },
      { title: 'Risk ranking', text: 'Scored findings by exploitability and blast radius.' },
      { title: 'Hardening', text: 'Implemented fixes with engineers, least-privilege first.' },
      { title: 'Compliance report', text: 'Documented benchmark alignment for audit evidence.' },
    ],
    outcomes: [
      'IAM, network rules, storage and logging audited against CIS benchmark controls.',
      'Findings ranked by exploitability and blast radius, then fixed with the engineers who owned them.',
      'Benchmark alignment documented as evidence an external auditor will accept.',
    ],
    links: [],
  },
  {
    id: 'malware',
    title: 'Malware Analysis & Reverse Engineering',
    category: 'defense',
    categoryLabel: 'Defense & Ops',
    tagline: 'Sandbox detonation and IOC extraction from live samples.',
    stack: ['Sandboxing', 'Static Analysis', 'IOC Extraction', 'YARA'],
    challenge:
      'Suspicious executables kept surfacing with no in-house capability to answer the only questions that matter: what does it do, and how do we detect it? Each unknown sample meant either risky guesswork or slow, expensive external escalation.',
    process: [
      { title: 'Lab setup', text: 'Built an isolated detonation environment with full traffic capture.' },
      { title: 'Static triage', text: 'Profiled samples via strings, imports, and packer detection.' },
      { title: 'Dynamic analysis', text: 'Observed behavior: persistence, C2 callbacks, file activity.' },
      { title: 'IOC extraction', text: 'Distilled hashes, domains and mutexes into shareable intel.' },
      { title: 'Detection handoff', text: 'Converted findings into SIEM and EDR detection content.' },
    ],
    outcomes: [
      'In-house capability to answer what an unknown sample does, without external escalation.',
      'Behavior profiled end to end: persistence, C2 callbacks and file activity.',
      'Extracted indicators converted straight into SIEM and EDR detection content.',
    ],
    links: [],
  },
  {
    id: 'ecosense',
    title: 'EcoSense: GSM-Enabled IoT Waste Management',
    category: 'engineering',
    categoryLabel: 'Engineering & Research',
    tagline: 'IEEE-published research: sensors that make sanitation on-demand.',
    stack: ['IoT', 'GSM', 'Ultrasonic Sensors', 'Embedded C'],
    challenge:
      'Municipal waste collection ran on fixed schedules, wasting fuel on empty bins while full ones overflowed for days. The system had to sense fill levels in real time and alert authorities over infrastructure that works without internet coverage.',
    process: [
      { title: 'Problem research', text: 'Studied collection inefficiencies and connectivity constraints.' },
      { title: 'Prototype', text: 'Paired ultrasonic sensing with a GSM module on embedded C.' },
      { title: 'Field calibration', text: 'Tuned thresholds against real bin geometries and materials.' },
      { title: 'Peer review', text: 'Wrote up methodology and results for IEEE review.' },
      { title: 'Publication', text: 'Published in IEEE Xplore, ICCCNT proceedings.' },
    ],
    outcomes: [
      'Peer reviewed and published in IEEE Xplore, with the source released openly.',
      'Ultrasonic fill-level sensing calibrated against real bin geometries and materials.',
      'Alerting carried over GSM, so it works where there is no internet coverage.',
    ],
    links: [
      { label: 'Read the paper', href: 'https://ieeexplore.ieee.org/document/10593240', icon: 'external' },
      { label: 'Source code', href: 'https://github.com/Nayan050/EcoSense-A-GSM-Enabled-IoT-Solution-for-Intelligent-Waste-Management', icon: 'github' },
    ],
  },
  {
    id: 'attendance',
    title: 'Advanced Attendance System',
    category: 'engineering',
    categoryLabel: 'Engineering & Research',
    tagline: 'Face-recognition attendance built on OpenCV.',
    stack: ['Python', 'OpenCV', 'Face Recognition', 'SQLite'],
    challenge:
      'Manual roll calls burned minutes of every session and produced records that were trivial to falsify. The fix needed to identify people passively, log them tamper-resistantly, and run on commodity hardware.',
    process: [
      { title: 'Dataset capture', text: 'Built an enrollment pipeline capturing faces across conditions.' },
      { title: 'Model training', text: 'Trained OpenCV recognizers on the enrolled dataset.' },
      { title: 'Live pipeline', text: 'Matched faces in real time from a webcam stream.' },
      { title: 'Record keeping', text: 'Wrote attendance events to a queryable local store.' },
      { title: 'Release', text: 'Published the system with setup docs on GitHub.' },
    ],
    outcomes: [
      'Passive face recognition replaced manual roll call entirely.',
      'Attendance events written to a queryable store that is not trivial to falsify.',
      'Runs on commodity hardware and a standard webcam, with setup docs published.',
    ],
    links: [
      { label: 'Source code', href: 'https://github.com/Nayan050/Advance-attendane-system', icon: 'github' },
    ],
  },

  /* ------------------------------- Builds -------------------------------- */

  {
    id: 'robocar',
    kind: 'build',
    title: 'Human Following Robocar',
    category: 'engineering',
    categoryLabel: 'Engineering & Research',
    year: '2023',
    tagline:
      'Arduino robot that tracks and follows a person using ultrasonic and IR sensors.',
    stack: ['Arduino', 'Ultrasonic Sensor', 'IR Sensors'],
    summary:
      'A rover that holds position behind a person as they walk. Ultrasonic ranging sets how close it follows, and the infrared pair handles direction, so it steers to stay with the target rather than driving straight on until it loses them.',
    links: [
      {
        label: 'Source code',
        href: 'https://github.com/Nayan050/Human-Following-Robocar',
        icon: 'github',
      },
    ],
  },
  {
    id: 'tollgate',
    kind: 'build',
    title: 'Smart Toll Gate',
    category: 'engineering',
    categoryLabel: 'Engineering & Research',
    year: '2023',
    tagline: 'Automated toll barrier built with Arduino, an ultrasonic sensor and a servo.',
    stack: ['Arduino', 'Ultrasonic Sensor', 'Servo'],
    summary:
      'A barrier that opens on approach instead of on a button. The ultrasonic sensor watches the lane, the servo lifts the arm once a vehicle is inside range, and it closes again once the lane reads clear.',
    links: [],
  },
  {
    id: 'personal-site',
    kind: 'build',
    title: 'Personal Website',
    category: 'web',
    categoryLabel: 'Web & Design',
    year: '2022',
    tagline: 'Portfolio site built with HTML5, CSS3, JavaScript, Bootstrap and jQuery.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'jQuery'],
    summary:
      'An early personal site, written before any framework habits had set in. Bootstrap carried the responsive grid and jQuery the interactions; the rest is hand-written markup and CSS.',
    links: [
      {
        label: 'Visit site',
        href: 'https://nayan050.github.io/Personal-Website/',
        icon: 'external',
      },
    ],
  },
  {
    id: 'tindog',
    kind: 'build',
    title: 'TinDog',
    category: 'web',
    categoryLabel: 'Web & Design',
    year: '2022',
    tagline: 'Dog-adoption themed responsive landing page in HTML, CSS and JavaScript.',
    stack: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages'],
    summary:
      'A single-page layout on a dog-adoption theme, built to practise responsive structure end to end: grid, breakpoints and type scale, with no framework doing the work.',
    links: [
      { label: 'Visit site', href: 'https://nayan050.github.io/Tindog/', icon: 'external' },
    ],
  },
  {
    id: 'hotel-design',
    kind: 'build',
    title: 'Hotel Website Design',
    category: 'web',
    categoryLabel: 'Web & Design',
    year: '2022',
    tagline: 'Hotel website concept designed end to end in Canva.',
    stack: ['Canva', 'Layout', 'Visual Design'],
    summary:
      'A hotel site taken from blank page to finished visual concept in Canva. Layout, type and imagery only, so it is a design exercise rather than a build.',
    links: [
      {
        label: 'Source files',
        href: 'https://github.com/Nayan050/Hotel-Website-Design',
        icon: 'github',
      },
    ],
  },
  {
    id: 'portfolio-v1',
    kind: 'build',
    title: 'Portfolio Website',
    category: 'web',
    categoryLabel: 'Web & Design',
    year: '2022',
    tagline: 'The first iteration of this portfolio, hand-built in HTML, CSS and JavaScript.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    summary:
      'The first version of this portfolio, hand-built without a framework. It is the direct ancestor of the site you are reading now, kept visible as the before.',
    links: [
      { label: 'Source code', href: 'https://github.com/Nayan050/portfolio', icon: 'github' },
    ],
  },
]
