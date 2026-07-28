/* ---------------------------------------------------------------------------
   Practice areas — the disciplines from the resume, as tabbed panels.
   Ordered by depth of evidence: daily operational work first, the emerging
   specialism next, supporting disciplines after. The first entry is what
   loads by default, so it should be the strongest claim.

   `tab` is the short tab label; `title` heads the panel.
--------------------------------------------------------------------------- */

export const PRACTICE_AREAS = [
  {
    id: 'siem',
    tone: 'navy',
    tab: 'SIEM & Detection',
    title: 'SIEM & Threat Detection',
    summary:
      'Turning raw log volume into decisions. Detection engineering on CrowdStrike Falcon Next-Gen SIEM, tuned against real adversary behavior rather than vendor defaults.',
    activities: [
      'Onboard and normalize log sources so events arrive as queryable, correlated fields.',
      'Author detection rules mapped to MITRE ATT&CK techniques, not just signatures.',
      'Build triage dashboards and severity routing that match how the team actually responds.',
      'Tune noisy rules weekly, pushing signal-to-noise up instead of alert volume.',
      'Hunt proactively for the activity that never tripped a rule.',
    ],
    tools: [
      'CrowdStrike Falcon NG-SIEM',
      'Falcon Insight EDR',
      'MITRE ATT&CK',
      'Security Operations Center (SOC)',
      'Cyber Threat Intelligence',
      'IDS / IPS',
      'F5 BIG-IP WAF',
    ],
  },
  {
    id: 'devsecops',
    tone: 'bronze',
    tab: 'DevSecOps',
    title: 'DevSecOps & Pipeline Security',
    summary:
      'Security that runs on every commit. Scanning wired into CI/CD at Foneloan and across F1Soft Group, tuned until engineers trust the output enough to act on it.',
    activities: [
      'Integrate SAST, dependency, container and secret scanning directly into build pipelines.',
      'Generate and track SBOMs so every release ships with a known component inventory.',
      'Tune rules and baselines so findings read as actionable, not as background noise.',
      'Set severity gates that stop genuinely risky merges without blocking delivery.',
      'Onboard engineering teams and triage the first findings alongside them.',
    ],
    tools: [
      'Semgrep',
      'OWASP Dependency-Check',
      'Syft',
      'Trivy',
      'Gitleaks',
      'SBOM',
      'CI/CD Pipelines',
    ],
  },
  {
    id: 'vapt',
    tone: 'oxblood',
    tab: 'Pentesting',
    /* VAPT already contains "penetration testing", so the old
       "Penetration Testing & VAPT" said it twice. Spelled out in full. */
    title: 'Vulnerability Assessment and Penetration Testing',
    summary:
      'Proving what an attacker could actually reach. Full-cycle assessment that ends in verified fixes, not a PDF nobody opens.',
    activities: [
      'Agree scope, rules of engagement and safe-exploitation boundaries up front.',
      'Map the attack surface through recon, enumeration and technology fingerprinting.',
      'Chain OWASP Top 10 findings into demonstrable, evidence-backed impact.',
      'Report severity-ranked findings with reproduction steps and concrete remediation.',
      'Retest after fixes and confirm the critical paths are genuinely closed.',
    ],
    tools: [
      'Burp Suite',
      'Nmap',
      'Metasploit',
      'Kali Linux',
      'SQLMap',
      'OWASP Top 10',
      'Application Security',
    ],
  },
  {
    id: 'aisec',
    tone: 'violet',
    tab: 'AI & LLM Security',
    title: 'AI & LLM Security',
    summary:
      'The newest attack surface, treated with the same discipline as any other. Red-teaming LLM features before they reach production.',
    activities: [
      'Red-team LLM applications against the OWASP Top 10 for LLMs.',
      'Probe for prompt injection, jailbreaks and system-prompt leakage.',
      'Design guardrails that constrain what a model can do, not merely what it says.',
      'Assess data exposure across AI pipelines, retrieval sources and logging.',
      'Advise on AI governance so model use stays auditable and policy-aligned.',
    ],
    tools: [
      'LLM Security',
      'OWASP Top 10 for LLMs',
      'AI Red Teaming',
      'Prompt Injection Mitigation',
      'Prompt Engineering & Validation',
      'AI Governance',
    ],
  },
  {
    id: 'ir',
    tone: 'slate',
    tab: 'Incident Response',
    title: 'Incident Response',
    summary:
      'When an alert turns real: contain it, understand it, and make sure the same path never works a second time.',
    activities: [
      'Triage and validate alerts across SIEM, EDR, XDR and PAM.',
      'Scope the blast radius and contain affected assets before it spreads.',
      'Reconstruct the attack timeline and establish root cause.',
      'Coordinate resolution with IT, network and application teams.',
      'Convert every incident into new detections and hardening actions.',
    ],
    tools: [
      'Falcon Insight EDR',
      'XDR',
      'PAM',
      'Sandbox Analysis',
      'IOC Extraction',
      'Forensics',
    ],
  },
  {
    id: 'vm',
    tone: 'teal',
    tab: 'Patch Management',
    title: 'Patch and Vulnerability Management',
    summary:
      'A closed loop, not a scan report. Find it, rank it by what an attacker could really do with it, get it patched, then prove the fix holds.',
    activities: [
      'Run authenticated scans across servers, endpoints and network infrastructure.',
      'Rank findings by real exploitability and blast radius, not raw CVSS score.',
      'Track patch cycles and chase the exceptions that keep slipping.',
      'Assign owners and drive every item through to closure.',
      'Verify remediation with targeted rescans before signing anything off.',
      'Harden systems against CIS benchmarks and cloud best practice.',
    ],
    tools: [
      'Tenable Nessus',
      'CIS Benchmarks',
      'Patch Management',
      'Azure Security',
      'System Hardening',
    ],
  },
  {
    id: 'iso',
    tone: 'forest',
    tab: 'ISO 27001 & GRC',
    title: 'ISO 27001:2022 Auditing & GRC',
    summary:
      'Making security provable. Certified Lead Auditor who has taken two companies the whole distance, from gap analysis to a certificate that survived external audit.',
    activities: [
      'Certified two organizations to ISO/IEC 27001:2022: Foneloan Pvt. Ltd. in Nepal and Filps Ltd. in Dubai.',
      'Run gap analyses against ISO 27001:2022 Annex A controls.',
      'Perform risk assessment and treatment planning to ISO 27005.',
      'Draft policies, procedures and the Statement of Applicability.',
      'Conduct internal audits and support external certification audits.',
      'Assess third-party and supply-chain risk through SIG questionnaires.',
    ],
    tools: [
      'ISO 27000 Series',
      'ISO 27005 / 31000',
      'NIST CSF 2.0',
      'COBIT',
      'GDPR · PCI DSS',
      'Zero Trust Architecture',
      'Data Privacy',
      'Third-Party Risk',
    ],
  },
  {
    id: 'awareness',
    tone: 'amber',
    tab: 'Awareness',
    title: 'Security Awareness & Phishing Simulation',
    summary:
      'Hardening the human layer with evidence instead of lectures. Measured, targeted at the people who need it, and repeated until the numbers move.',
    activities: [
      'Design pretexts modeled on live campaigns actually hitting the region.',
      'Launch simulations in waves, tracking click and report rates separately.',
      'Segment results by department to find where the real exposure sits.',
      "Deliver targeted training built on the organization's own data.",
      'Re-test to prove the behavioral change, then report the delta.',
    ],
    tools: [
      'Phishing Simulation',
      'Social Engineering',
      'Awareness Training',
      'Campaign Metrics',
      'Reporting',
    ],
  },
]
