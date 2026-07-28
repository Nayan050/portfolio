/* About section + published research. */

export const ABOUT = {
  titles: [
    'Security Researcher',
    'Information Security Analyst',
    'ISO 27001:2022 Lead Auditor',
    'Certified LLM Security Professional',
    'Certified Blue Team Practitioner',
    'Registered Computer Engineer (NEC)',
  ],
  /* Deliberately short. This section had grown to four dense paragraphs that
     re-listed the tools already shown as pills in Expertise, the ISO work
     already in Experience, and the certificates already on the wall in
     Credentials — the page arguing with itself. About only has to say who is
     behind all that and how wide the practice runs; the sections underneath
     carry the proof.

     Fintech stays the employer, not the scope: the page also holds bug bounty
     write-ups, VAPT, LLM security and an IEEE-published IoT paper. */
  /* "Embedded" became "supply chain": it is both closer to the actual work
     (SBOMs with Syft, dependency and container scanning, secret detection)
     and current, where embedded pointed back at older academic work. The
     IEEE paper is not named here — the Research section presents it properly
     and About should not read as a CV in miniature. */
  paragraphs: [
    'Web, cloud, identity, supply chain, and now the AI layer bolted onto all of them. The attack surface keeps widening; the same failures keep recurring. I work both sides of that: the detection that catches an intruder mid-operation, and the offensive testing that finds the gap first.',
    'Fintech is the day job: SIEM and EDR detection, DevSecOps built into the pipeline across F1Soft Group teams, ISO 27001 controls that survive an external auditor. Outside it, bug bounty on public programs, VAPT against web applications, and LLM systems, which fail in ways no existing playbook covers.',
    'Understanding how systems break is what makes me better at keeping them whole. Whatever matters gets rebuilt in a lab and turned into detections, hardening and awareness material.',
  ],
  /* Logistics only. The handle is already under the name in the hero and the
     location is already in this section's own header, so neither earns a row
     here. `emphasis` marks the row a recruiter is actually looking for. */
  facts: [
    { label: 'Currently', value: 'Information Security Analyst, Foneloan (F1Soft Group)' },
    { label: 'Focus', value: 'Threat detection, DevSecOps, VAPT, AI security, ISO 27001' },
    {
      label: 'Open to',
      value: 'Security roles, VAPT engagements, research collaboration',
      emphasis: true,
    },
  ],
}

/* Only details verifiable from the IEEE Xplore record are stated here.
   Authorship position and the conference name are deliberately omitted —
   add them once confirmed rather than guessing. */
export const RESEARCH = {
  title: 'EcoSense: A GSM-Enabled IoT Solution for Intelligent Waste Management',
  venue: 'IEEE Xplore',
  year: '2024',
  topic: 'IoT & embedded systems',
  abstract:
    'Municipal waste collection runs on fixed schedules, wasting fuel on empty bins while full ones overflow for days. This research presents a GSM-enabled IoT system that uses ultrasonic sensors to monitor bin fill levels in real time and alerts sanitation authorities once thresholds are crossed, replacing rigid routes with on-demand collection that works without internet coverage.',
  highlights: [
    { label: 'Sensing', value: 'Ultrasonic fill-level monitoring' },
    { label: 'Transport', value: 'GSM alerts, no internet required' },
    { label: 'Outcome', value: 'On-demand collection routing' },
  ],
  links: [
    {
      label: 'Read the paper',
      href: 'https://ieeexplore.ieee.org/document/10593240',
      icon: 'external',
      primary: true,
    },
    {
      label: 'Source code',
      href: 'https://github.com/Nayan050/EcoSense-A-GSM-Enabled-IoT-Solution-for-Intelligent-Waste-Management',
      icon: 'github',
      primary: false,
    },
  ],
}
