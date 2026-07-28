/* Career timeline + credentials.
   EXPERIENCE is ordered reverse-chronologically by end date (an ongoing
   role counts as most recent). Keep it that way when adding entries. */

export const EXPERIENCE = [
  {
    org: 'Foneloan Pvt. Ltd. (F1Soft Group)',
    href: 'https://foneloan.com.np/',
    role: 'Information Security Analyst',
    location: 'Lalitpur, Nepal',
    period: 'Jul 2025 – Present',
    current: true,
    highlights: [
      'Monitor and investigate alerts across SIEM, IDS/IPS, WAF, EDR, XDR and PAM protecting live fintech infrastructure.',
      'Helped integrate DevSecOps scanning into CI/CD pipelines at Foneloan and across F1Soft Group teams: Semgrep for SAST, OWASP Dependency-Check for vulnerable libraries, Syft for SBOMs, Trivy for container and IaC scanning, and Gitleaks for secret detection.',
      'Tuned scanner rules, baselines and severity gates to cut false positives, so engineering teams act on findings instead of ignoring the pipeline.',
      'Coordinate incident resolution with IT, network and application teams; drive vulnerability management to closure.',
      'Execute VAPT and system hardening; support ISO 27001 internal and external audits.',
      'Carried two organizations through to ISO/IEC 27001:2022 certification: Foneloan Pvt. Ltd. in Nepal and Filps Ltd. in Dubai.',
      'Run phishing simulations and security awareness programs across the organization.',
    ],
  },
  {
    org: 'CodeRush',
    href: 'https://www.linkedin.com/company/code-rush-nepal/',
    role: 'Security Research Analyst (Apprenticeship)',
    location: 'Kathmandu, Nepal',
    period: 'Dec 2025 – Mar 2026',
    current: false,
    highlights: [
      'Completed an intensive 70-day program across security governance, risk and compliance domains.',
      'Applied ISO 27001/27002/27005, ISO 31000, COBIT and NIST CSF 2.0 to structured audit exercises.',
      'Worked hands-on with SIG questionnaires, RFP support and supplier risk assessment workflows.',
    ],
  },
  {
    org: 'Miracle Yard Pvt. Ltd.',
    href: 'https://miracleyard.com/',
    role: 'IT Support & Office Administrator',
    location: 'Kupondole, Lalitpur, Nepal',
    period: 'May 2025 – Jun 2025',
    current: false,
    highlights: [
      'Resolved daily IT issues, led software training, and ran QA checks on client-side implementations.',
      'Managed team tasks and mentored interns through project delivery.',
    ],
  },
  {
    org: 'Tata Consultancy Services',
    href: 'https://drive.google.com/file/d/1g3-6WiixcTj0nSJ_DszuRgnwoHYMMKZX/view?usp=sharing',
    role: 'Cybersecurity Analyst (Job Simulation)',
    location: 'Bangalore, India',
    period: 'Jan 2024',
    current: false,
    highlights: [
      'Completed an IAM-focused simulation with a cybersecurity consulting team, aligning identity strategy with business objectives.',
    ],
  },
  {
    org: 'Emertxe Information Technologies',
    href: 'https://www.linkedin.com/company/emertxeit/',
    role: 'IoT Intern',
    location: 'Bangalore, India',
    period: 'Mar 2023 – May 2023',
    current: false,
    highlights: [
      'Built embedded systems in C on micro-controllers, covering peripherals, interrupts and serial communication.',
      'Delivered a home-automation project applying IoT sensing and control end to end.',
    ],
  },
  {
    org: 'Verzeo EduTech',
    href: 'https://www.linkedin.com/company/verzeo/',
    role: 'Cybersecurity Intern',
    location: 'Bangalore, India',
    period: 'Oct 2022 – Dec 2022',
    current: false,
    highlights: [
      'Practiced network scanning, enumeration and system exploitation in lab environments.',
      'Studied social engineering techniques and SQL injection against deliberately vulnerable targets.',
    ],
  },
  {
    org: 'The Spark Foundation',
    href: null,
    role: 'Web Development & Designing Intern',
    location: 'Bangalore, India',
    period: 'Sep 2022 – Nov 2022',
    current: false,
    highlights: [
      'Built responsive interfaces with HTML5, CSS3, JavaScript and Bootstrap 5.',
      'Translated design briefs into working, cross-device layouts.',
    ],
  },
]

/* Certifications, training and licences, newest first.
   `type` labels the card ('Certification' when omitted); `field` is the
   discipline shown above the name. `href` is the credential document: Drive
   files are shown on the card and in the viewer, anything else opens out.
   `verifyUrl` is an optional issuer record shown alongside. */
/* Seal colour per discipline. Thirteen fields collapse into eight families so
   the wall reads as a set of sealed documents rather than a rainbow. Anything
   unmapped falls back to slate. */
export const CERT_TONES = {
  'Defensive Security': 'navy',
  'Security Operations': 'navy',
  'Threat Intelligence': 'navy',
  'Offensive Security': 'oxblood',
  'AI & LLM Security': 'violet',
  'Social Engineering Defense': 'amber',
  'Awareness & Phishing': 'amber',
  'Governance & Compliance': 'forest',
  'Professional License': 'forest',
  'Identity & Access Management': 'teal',
  Programming: 'bronze',
  'Cybersecurity Foundations': 'slate',
  'Security Education': 'slate',
}

export const CERTIFICATIONS = [
  {
    name: 'Certified LLM Security Professional (CLLMSP)',
    issuer: 'Red Team Leaders',
    date: 'July 2026',
    field: 'AI & LLM Security',
    href: 'https://drive.google.com/file/d/1hSj-hEWUKRQAjIOLSfLGIJvTMoVMBJnU/view?usp=sharing',
  },
  {
    name: 'AI Fluency for Cybersecurity Professionals',
    type: 'Training',
    issuer: 'SOCRadar Extended Threat Intelligence',
    date: 'June 2026',
    field: 'AI & LLM Security',
    href: 'https://drive.google.com/file/d/1FFSQ9vOS7hCdcEcXwJsNk2CTKIxVqLc8/view?usp=sharing',
  },
  {
    name: 'Certified Social Engineering Defense Practitioner (CSEDP)',
    issuer: 'The SecOps Group',
    date: 'June 2026',
    field: 'Social Engineering Defense',
    href: 'https://drive.google.com/file/d/1jglD2AElWj-_WqrV5zrm5nZg-NFMyYs4/view?usp=sharing',
  },
  {
    name: 'Certified Blue Team Practitioner (CBTP)',
    issuer: 'The SecOps Group',
    date: 'March 2026',
    field: 'Defensive Security',
    href: 'https://drive.google.com/file/d/1WiIW_pcoAXuXNbNxkf1nBGWyfAIaSWlS/view?usp=sharing',
  },
  {
    name: 'Falcon Next-Gen SIEM Specialist',
    issuer: 'CrowdStrike',
    date: 'March 2026',
    field: 'Security Operations',
    href: 'https://drive.google.com/file/d/18WuI2qfgESQpY6BJh62-xc1AW8tJ4X9Z/view?usp=sharing',
  },
  {
    name: 'Certified Phishing Prevention Specialist (CPPS)',
    issuer: 'Hack & Fix',
    date: 'December 2025',
    field: 'Awareness & Phishing',
    href: 'https://drive.google.com/file/d/1RO7AmbK8udoY13--Va7bW_OuJ4l8JD3D/view?usp=sharing',
  },
  {
    name: 'Certified Cybersecurity Educator Professional (CCEP)',
    issuer: 'Red Team Leaders',
    date: 'November 2025',
    field: 'Security Education',
    href: 'https://drive.google.com/file/d/1CGS7EvlyE8t7gQaBRO0HEd_mnyoQjPd2/view?usp=sharing',
  },
  {
    name: 'ISO/IEC 27001:2022 Lead Auditor',
    issuer: 'MasterMind',
    date: 'July 2025',
    field: 'Governance & Compliance',
    href: 'https://drive.google.com/file/d/1suCwwUd31qy79LbQddaV6TtomHBm2OIP/view?usp=sharing',
    /* The issuer's own record. Its page refuses framing, so it is offered as
       a link rather than embedded. */
    verifyUrl: 'https://learn.mastermindassurance.com/certificates/zrcs6fa4te',
  },
  {
    name: 'Registered Computer Engineer',
    type: 'License',
    issuer: 'Nepal Engineering Council',
    date: 'April 2025',
    field: 'Professional License',
    href: null,
  },
  {
    name: 'Cybersecurity Analyst Job Simulation',
    type: 'Training',
    issuer: 'Tata Consultancy Services · Forage',
    date: 'January 2024',
    field: 'Identity & Access Management',
    href: 'https://drive.google.com/file/d/1g3-6WiixcTj0nSJ_DszuRgnwoHYMMKZX/view?usp=sharing',
  },
  {
    name: 'SQL Injection Attacks',
    issuer: 'EC-Council',
    date: 'September 2023',
    field: 'Offensive Security',
    href: 'https://drive.google.com/file/d/1W9WVVMoH2MyDmfj4vgK6txSqF3KNx30S/view?usp=sharing',
  },
  {
    name: 'Google Cybersecurity Professional Certificate',
    issuer: 'Google',
    date: 'August 2023',
    field: 'Cybersecurity Foundations',
    href: 'https://drive.google.com/file/d/1PYMu-c1se8fVFmNeW3zAU8jReefuEqXh/view?usp=sharing',
  },
  {
    name: 'Introduction to Dark Web, Anonymity & Cryptocurrency',
    issuer: 'EC-Council',
    date: 'March 2023',
    field: 'Threat Intelligence',
    href: 'https://drive.google.com/file/d/1AAa_21C1ggJqX0JwAd9mgd5npe8P3tqr/view?usp=sharing',
  },
  {
    name: 'Ethical Hacking Essentials',
    issuer: 'EC-Council',
    date: 'February 2023',
    field: 'Offensive Security',
    href: 'https://drive.google.com/file/d/1JQpzf3wE7rGmHgSjkIsq50-E6u96AUfM/view?usp=sharing',
  },
  {
    name: 'Python Foundation',
    type: 'Training',
    issuer: 'Infosys Springboard',
    date: 'January 2023',
    field: 'Programming',
    href: 'https://drive.google.com/file/d/1LbaqlYtcEfviJ9R39oICXViBtKtwF6_c/view?usp=sharing',
  },
  {
    name: 'Python (Basic)',
    issuer: 'HackerRank',
    date: 'January 2023',
    field: 'Programming',
    href: 'https://drive.google.com/file/d/1A0o05gmRQA2CXw0-0iPaLG9YuTsSee6Z/view?usp=sharing',
  },
  {
    name: 'Associate in IT Foundation Skills (Java)',
    type: 'Training',
    issuer: 'Infosys Springboard',
    date: 'May 2022',
    field: 'Programming',
    href: 'https://drive.google.com/file/d/1YGmfHQshOOnuoVkL-YZQT7UjhMurz0dx/view?usp=sharing',
  },
  {
    name: 'Associate in IT Foundation Skills (Python)',
    type: 'Training',
    issuer: 'Infosys Springboard',
    date: 'May 2022',
    field: 'Programming',
    href: 'https://drive.google.com/file/d/1Ms5ejZH2qYc9w5HIjvC-Yv04DhXx694V/view?usp=sharing',
  },
  {
    name: 'Cyber Security Foundation',
    type: 'Training',
    issuer: 'Infosys Springboard',
    date: 'May 2022',
    field: 'Cybersecurity Foundations',
    href: 'https://drive.google.com/file/d/1yqZ_JRsSnpKQWCZHC5lW49zGp6X0aNWB/view?usp=sharing',
  },
]

export const EDUCATION = [
  {
    degree: 'B.Tech in Computer Science & Engineering, IoT',
    school: 'Jain (Deemed-to-be) University',
    location: 'Bangalore, India',
    period: '2020 – 2024',
    status: 'Graduated',
    image: '/assets/images/educat/uni.jpg',
  },
  {
    degree: 'Science (Grade XI & XII)',
    school: 'Manimukunda College',
    location: 'Butwal, Nepal',
    period: '2018 – 2020',
    status: 'Completed',
    image: '/assets/images/educat/college.jpg',
  },
  {
    degree: 'Schooling up to Grade X',
    school: 'Arjun English Boarding High School',
    location: 'Tamghas, Gulmi, Nepal',
    period: '2006 – 2018',
    status: 'Completed',
    image: '/assets/images/educat/school.jpg',
  },
]
