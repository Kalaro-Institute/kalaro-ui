/* Content for the service pages. Slugs match the nav links so the
   nav and the pages can never drift apart.

   A Service is PAID WORK the institute performs on a client's
   behalf - it is not a course. It has no curriculum, no lessons and
   no duration; it is bought once, for a fee, and delivered by the
   team. priceUsd is the base fee, converted per visitor location
   at render time by useLocationPricing().                          */

export type Service = {
  slug: string;
  title: string;
  tagline: string;
  icon: string;
  /** Base fee in USD for this service. */
  priceUsd: number;
  /** Rough turnaround once engaged, shown as reassurance on the page. */
  turnaround?: string;
  description: string;
  includes: string[];
  process: { step: string; title: string; detail: string }[];
  faqs?: { q: string; a: string }[];
};

/* â”€â”€ NCLEX services â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export const NCLEX_SERVICES: Service[] = [
  {
    slug: "nclex-registration",
    title: "NCLEX Registration Support",
    tagline: "We handle the paperwork so you focus on the exam.",
    icon: "clipboard",
    priceUsd: 120,
    turnaround: "5-7 working days",
    description:
      "Full end-to-end support with NCLEX registration for both RN and PN candidates â€” from eligibility checks to final submission and confirmation.",
    includes: [
      "Eligibility & registration assessment",
      "Pearson VUE account creation",
      "Form completion and review",
      "Payment processing and receipts",
      "Registration confirmation tracking",
    ],
    process: [
      { step: "01", title: "Eligibility check", detail: "We confirm your qualification route and eligibility to sit the exam." },
      { step: "02", title: "Pearson VUE setup", detail: "Your account is created and all forms are completed accurately." },
      { step: "03", title: "Review & payment", detail: "You review every detail before we submit and pay on your behalf." },
      { step: "04", title: "Confirmation", detail: "You receive your registration number and full next-step guidance." },
    ],
    faqs: [
      { q: "How long does registration take?", a: "Most registrations are completed within 5â€“7 working days, subject to board processing times." },
      { q: "Do I need to be in the country?", a: "No. Our support is fully remote â€” we work with candidates across all time zones." },
    ],
  },
  {
    slug: "nclex-booking",
    title: "NCLEX Booking & Pearson VUE",
    tagline: "Secure your test date, centre and reschedule when you need to.",
    icon: "calendar",
    priceUsd: 90,
    turnaround: "24-48 hours",
    description:
      "Pearson VUE test-centre booking, rescheduling, cancellation and date-change support â€” plus guidance on what to bring and how the day runs.",
    includes: [
      "Test centre selection & booking",
      "Date change & rescheduling",
      "Appointment cancellation guidance",
      "Day-of-exam checklist",
      "Delays and incident escalation",
    ],
    process: [
      { step: "01", title: "Choose your centre", detail: "We shortlist Pearson VUE centres nearest to you with realistic availability." },
      { step: "02", title: "Book the slot", detail: "Your appointment is secured and confirmed with all details in writing." },
      { step: "03", title: "Prepare & attend", detail: "You receive an ID checklist, directions and a full day-of-exam briefing." },
    ],
    faqs: [
      { q: "Can I reschedule my exam?", a: "Yes â€” rescheduling follows Pearson VUE's published notice windows. We handle the change and any fee." },
    ],
  },
  {
    slug: "nclex-prep",
    priceUsd: 150,
    turnaround: "2-4 weeks",
    title: "NCLEX Study Plan & Question Bank",
    tagline: "A structured plan, CAT practice and targeted remediation.",
    icon: "book",
    description:
      "Structured preparation built around the Next Generation NCLEX blueprint, with practice questions, Computerized Adaptive Testing sessions and remediation coaching.",
    includes: [
      "Personalised study schedule",
      "Content-area breakdown sessions",
      "CAT practice assessments",
      "Rationale review workshops",
      "Remediation coaching",
    ],
    process: [
      { step: "01", title: "Diagnostic", detail: "A baseline assessment identifies your strengths and weak areas." },
      { step: "02", title: "Study plan", detail: "You receive a dated plan mapped to your exam window." },
      { step: "03", title: "Practice & review", detail: "Weekly CATs and rationale reviews keep you tracking upward." },
    ],
  },
  {
    slug: "nursing-board",
    priceUsd: 130,
    turnaround: "10-14 working days",
    title: "Nursing Board & Alert Support",
    tagline: "State board applications, alerts and licence verification.",
    icon: "shield",
    description:
      "We manage the administrative side of nursing board matters â€” initial application, additional alerts, licence verification and renewal paperwork.",
    includes: [
      "State board application filing",
      "Background check coordination",
      "Additional board alerts handling",
      "Licence verification requests",
      "Renewal and reinstatement paperwork",
    ],
    process: [
      { step: "01", title: "Board mapping", detail: "We identify the correct board for your school and licence type." },
      { step: "02", title: "Application filing", detail: "Forms, transcripts and attestations are submitted accurately and on time." },
      { step: "03", title: "Follow-up", detail: "We track your application until the board issues its decision." },
    ],
  },
  {
    slug: "ati-support",
    priceUsd: 80,
    turnaround: "5-7 working days",
    title: "ATI / TEAS Application Support",
    tagline: "Get through the pre-application gate with a strong score.",
    icon: "award",
    description:
      "Support with ATI TEAS registration, scheduling and preparation â€” the entrance assessment required by many U.S. nursing schools before you can apply.",
    includes: [
      "TEAS registration & scheduling",
      "Program-specific score targets",
      "Content-area preparation plan",
      "Score improvement tracking",
      "Re-test strategy",
    ],
    process: [
      { step: "01", title: "Target setting", detail: "We identify the TEAS score required by your target programme." },
      { step: "02", title: "Preparation", detail: "A focused plan for the four TEAS content areas." },
      { step: "03", title: "Sit the exam", detail: "We handle registration and confirm your result pathway." },
    ],
  },
  {
    slug: "credential-evaluation",
    priceUsd: 140,
    turnaround: "7-10 working days",
    title: "Credential Evaluation & Verification",
    tagline: "Your foreign credentials, evaluated and verified for local and international use.",
    icon: "file",
    description:
      "Professional credential evaluation and verification services for state boards, employers and immigration applications â€” handled end to end.",
    includes: [
      "Education credential evaluation",
      "Professional credential verification",
      "Report preparation & notarisation",
      "Board and employer submissions",
      "Expedited turnaround available",
    ],
    process: [
      { step: "01", title: "Document intake", detail: "We audit your transcripts, licences and identity documents." },
      { step: "02", title: "Evaluation", detail: "Your credentials are evaluated against the target body's requirements." },
      { step: "03", title: "Delivery", detail: "The completed report is issued directly to you or the receiving body." },
    ],
  },
  {
    slug: "document-processing",
    priceUsd: 60,
    turnaround: "3-5 working days",
    title: "Professional Document Processing",
    tagline: "Accurate, notarised, and delivered without delay.",
    icon: "mail",
    description:
      "We process professional documentation â€” notarised letters, transcripts, attestation forms, apostille-ready documents and certified copies.",
    includes: [
      "Notarised & certified documents",
      "Transcript request handling",
      "Attestation form preparation",
      "Apostille-ready documentation",
      "Secure courier delivery",
    ],
    process: [
      { step: "01", title: "Request intake", detail: "Tell us what is needed, by when, and who the recipient is." },
      { step: "02", title: "Processing", detail: "We prepare, notarise and quality-check every document." },
      { step: "03", title: "Delivery", detail: "Documents are hand-delivered or couriered with tracking." },
    ],

  },
];

/* â”€â”€ International Permanent Residency services â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   "PH" was a typo for Permanent Residency. These are the
   immigration / relocation services behind the PR programmes.   */
export const PR_SERVICES: Service[] = [
  {
    slug: "canada-admission",
    priceUsd: 180,
    turnaround: "2-3 weeks",
    title: "Canada Admission Support",
    tagline: "From school selection to a submitted application.",
    icon: "globe",
    description:
      "Guidance through the Canadian school admission process â€” shortlisting schools that fit your profile, preparing your application and supporting every document requirement along the way.",
    includes: [
      "School selection guidance",
      "Application for admission to Canadian schools",
      "Application & document support",
      "Admission process guidance",
    ],
    process: [
      { step: "01", title: "Profile & shortlist", detail: "We review your academic background and shortlist schools that genuinely fit." },
      { step: "02", title: "Application", detail: "Your application is prepared and every supporting document is organised." },
      { step: "03", title: "Submit & follow up", detail: "We submit, track correspondence and respond to admissions queries." },
    ],
    faqs: [
      { q: "Do I need to be in Nigeria to apply?", a: "No. We work with you remotely from start to submission." },
    ],
  },
  {
    slug: "canada-study-visa",
    priceUsd: 200,
    turnaround: "2-4 weeks",
    title: "Canada Study Visa Support",
    tagline: "Study permit applications, prepared properly the first time.",
    icon: "file",
    description:
      "Support with the Canadian study permit process â€” document preparation, application review and guidance through the visa application itself.",
    includes: [
      "Study permit application support",
      "Document preparation guidance",
      "Application review",
      "Study visa application guidance",
    ],
    process: [
      { step: "01", title: "Document check", detail: "We confirm you have every document the permit requires." },
      { step: "02", title: "Application review", detail: "Your application is reviewed for gaps, errors and weak points." },
      { step: "03", title: "Guidance & submission", detail: "We guide you through submission and track your application." },
    ],
  },
  {
    slug: "canada-express-entry",
    priceUsd: 220,
    turnaround: "Ongoing",
    title: "Canada Express Entry Support",
    tagline: "A stronger profile, built and guided end to end.",
    icon: "award",
    description:
      "Express Entry profile creation and guidance â€” from building a competitive profile to documentation support and advice through the full Express Entry process.",
    includes: [
      "Express Entry profile creation",
      "Profile guidance",
      "Documentation support",
      "Guidance through the Express Entry process",
    ],
    process: [
      { step: "01", title: "Profile build", detail: "We build your profile and identify the points you can realistically improve." },
      { step: "02", title: "Documents", detail: "All supporting documentation is prepared and checked." },
      { step: "03", title: "Process guidance", detail: "We stay with you through the rounds and next steps." },
    ],
  },
  {
    slug: "international-payments",
    priceUsd: 40,
    turnaround: "24-48 hours",
    title: "International Payments",
    tagline: "Pay in the currency the application actually requires.",
    icon: "globe",
    description:
      "Assistance making payments in different currencies, including support for international application and professional registration payments.",
    includes: [
      "Payments in different currencies",
      "Support for international application payments",
      "Professional registration payments",
      "Receipts & confirmation",
    ],
    process: [
      { step: "01", title: "Requirement", detail: "We confirm the exact currency, amount and receiving account." },
      { step: "02", title: "Payment", detail: "The payment is made through a compliant channel on your behalf." },
      { step: "03", title: "Confirm", detail: "You receive receipts and written confirmation of the payment." },
    ],
  },
  {
    slug: "kenya-travel-support",
    priceUsd: 320,
    turnaround: "Full duration of your stay",
    title: "Kenya NCLEX & Travel Support",
    tagline: "Complete support for your whole stay in Kenya.",
    icon: "plane",
    description:
      "End-to-end support throughout your Kenya stay â€” flights, payments, entry documentation, accommodation, airport pickup and ground transport for your NCLEX journey.",
    includes: [
      "Flight booking",
      "Payment assistance",
      "Yellow Card assistance",
      "Passport registration & renewal support",
      "Accommodation",
      "Airport pickup & transportation",
      "Transportation throughout your stay",
      "NCLEX-related support",
    ],
    process: [
      { step: "01", title: "Plan", detail: "Share your travel dates, exam date and accommodation needs." },
      { step: "02", title: "Arrange", detail: "Flights, Yellow Card, accommodation and transport are all confirmed." },
      { step: "03", title: "Support on the ground", detail: "You are met at the airport and supported through your stay and exam." },
    ],
    faqs: [
      { q: "Can someone meet me at the airport?", a: "Yes â€” airport pickup is arranged in advance and shared with you in writing." },
    ],
  },
];

/** Lookup helpers â€” routes resolve page content by slug. */
export const findNclexService = (slug: string) => NCLEX_SERVICES.find((s) => s.slug === slug);
export const findPrService = (slug: string) => PR_SERVICES.find((s) => s.slug === slug);
