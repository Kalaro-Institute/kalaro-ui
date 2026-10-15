/* Full course catalogue for the public course pages.

   Single source of truth for programme content: description,
   curriculum, what to expect, outcomes and price. The
   /course/:slug route resolves from here, so adding a programme to
   this file is all that is needed for it to go live.

   COURSES ONLY. Things the institute PERFORMS for a fee - NCLEX
   registration, exam booking, credential evaluation, travel and
   visa support - are not courses and must not be added here. They
   have no curriculum, no lessons and no duration, so they belong in
   services.ts and are paid for per service, not per programme.   */

export type CourseModule = {
  title: string;
  lessons: string[];
};

export type Course = {
  slug: string;
  title: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  /** Base price in USD; converted per visitor location at render time. */
  priceUsd: number;
  /** Canonical Nigerian fee. Nigerian IPs see this exact figure. Set on every course
      whose fee is confirmed; legacy entries fall back to converting priceUsd. */
  priceNgn?: number;
  durationWeeks: number;
  summary: string;
  overview: string;
  /** What the learner actually does week to week. */
  expectations: string[];
  modules: CourseModule[];
  outcomes: string[];
  requirements: string[];
  includes: string[];
  img: string;
  instructor: string;
};

/* Naira source of truth. Fees are set in NGN - priceUsd is always priceNgn / NGN_PER_USD
   so Nigerian visitors see the exact naira fee and everyone else sees the USD equivalent. */
export const NGN_PER_USD = 1550;

/* Format a week count without "1 weeks". */
export const weeksLabel = (n: number) => `${n} week${n === 1 ? "" : "s"}`;

/* ── Self-paced track ───────────────────────────────────────────
   Every full programme is offered in two tracks: the full
   programme as written above, and a trimmed SELF-PACED track at a
   flat fee. The self-paced format is deliberately identical
   everywhere so the offer never drifts between courses:

     - 3 modules (two video recordings + one knowledge-check quiz)
     - streaming only - recordings cannot be downloaded
     - NO certificate

   CPD micro-courses (CPD_CATEGORY below) are already the short
   format and are excluded via supportsSelfPaced().            */
export const SELF_PACED = {
  label: "Self-paced",
  priceNgn: 25000,
  priceUsd: 16,
  modules: [
    {
      title: "Foundations",
      lessons: ["Video recording 1 - stream only (downloads disabled)"],
    },
    {
      title: "In Practice",
      lessons: ["Video recording 2 - stream only (downloads disabled)"],
    },
    {
      title: "Knowledge Check",
      lessons: ["Course quiz"],
    },
  ],
  includes: [
    "3 modules of on-demand content",
    "2 video recordings - streaming only, downloads disabled",
    "1 knowledge-check quiz",
    "Lifetime access to the recordings",
  ],
  expectations: [
    "Work through three compact modules at your own pace",
    "Watch two focused video recordings, streamed inside the platform",
    "Close the track with a knowledge-check quiz",
  ],
};

/* ── Continuous Professional Development (CPD) ────────────────────
   Short professional-development courses priced flat in naira.
   They live in the same CATALOG as the full programmes, so they
   get real /course/<slug> pages, search, and their own category
   pill for free. */
export const CPD_CATEGORY = "Continuous Professional Development";

const IMG = {
  insurance:
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
  hospital:
    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
  office:
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
  ai: "https://images.unsplash.com/photo-1677442136019-21780ecad995?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
  nursing:
    "https://images.unsplash.com/photo-1576091160391-112e8d74d896?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
  travel:
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
  canada:
    "https://images.unsplash.com/photo-1517935706615-2717063c2225?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
  web: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
  provider:
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
  support:
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
  flights:
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
};

/* Full programmes - the original catalogue entries. CPD courses are
   appended below; CATALOG exports the two groups combined. */
const PROGRAMMES: Course[] = [
  {
    slug: "health-insurance-hmo-operations",
    title: "Health Insurance & HMO Operations",
    category: "Health Insurance",
    level: "Beginner",
    priceNgn: 40000,
    priceUsd: 26,
    durationWeeks: 8,
    instructor: "Dr. Adebayo Mensah",
    img: IMG.insurance,
    summary:
      "Understand how Health Maintenance Organisations actually work - from member enrolment through to benefit administration and regulatory compliance.",
    overview:
      "HMOs sit at the centre of Nigeria's private health system, and most new entrants arrive without a clear picture of how they fit together. This programme walks through the entire HMO lifecycle: how members enrol, how benefits are designed, how providers are contracted, and how claims move from submission to settlement. You finish with a working understanding of the operational side of an HMO and the vocabulary used across the industry.",
    expectations: [
      "Follow a real member journey from enrolment to claims settlement",
      "Work through sample claim files and identify common errors",
      "Build a benefit package from scratch using standard structures",
      "Join weekly live sessions with practising HMO professionals",
    ],
    modules: [
      {
        title: "HMO Fundamentals",
        lessons: [
          "What an HMO is and how it differs from other insurers",
          "Types of HMOs: staff, group and primary care",
          "Governance and ownership structures",
          "The Nigerian HMO landscape",
        ],
      },
      {
        title: "Membership & Enrolment",
        lessons: [
          "Individual, group and corporate enrolment",
          "Eligibility verification and documentation",
          "ID cards, biometrics and member records",
          "Waiting periods, suspensions and reinstatement",
        ],
      },
      {
        title: "Benefit Design",
        lessons: [
          "Covered and excluded services",
          "Benefit packages and tiering",
          "Co-payments, deductibles and limits",
          "Designing a cost-effective package",
        ],
      },
      {
        title: "Provider Networks",
        lessons: [
          "Selecting and contracting providers",
          "Capitation versus fee-for-service",
          "Panel management and hospital relationships",
          "Quality and performance monitoring",
        ],
      },
      {
        title: "Claims & Administration",
        lessons: [
          "Encounter submission and coding",
          "Adjudication and settlement",
          "Fraud, waste and abuse detection",
          "Resolving queries and disputes",
        ],
      },
    ],
    outcomes: [
      "Explain how an HMO earns, spends and accounts for its premium",
      "Process member enrolment and manage member records",
      "Support claims administration from submission to settlement",
      "Work confidently with providers, regulators and members",
    ],
    requirements: [
      "No prior HMO experience needed",
      "Basic computer literacy",
      "Suitable for graduates and working professionals",
    ],
    includes: [
      "8 weeks of on-demand lessons",
      "Weekly live Q&A sessions",
      "Downloadable claim and enrolment templates",
      "Certificate of completion",
    ],
  },
  {
    slug: "hospital-administration",
    title: "Hospital Administration & HMO Operation",
    category: "Healthcare Administration",
    level: "Intermediate",
    priceNgn: 30000,
    priceUsd: 19,
    durationWeeks: 10,
    instructor: "Mrs. Ngozi Uchenna",
    img: IMG.hospital,
    summary:
      "Practical training in running a hospital day to day - administration, HMO operations, claims processes, terminology and the real administrative skills the job demands.",
    overview:
      "Hospitals run or fail on their administrative backbone, not their clinical one. This programme covers the operational side of hospital management in depth: patient flow, records, staff coordination, HMO relationships, and the claims processes that determine whether a facility is paid on time. Medical and HMO terminology is taught from first principles so you can hold a professional conversation with clinicians, insurers and regulators.",
    expectations: [
      "Map a real patient journey from reception to discharge",
      "Practise handling patient records and documentation",
      "Process HMO claims and resolve payment delays",
      "Coordinate between clinical and administrative teams",
    ],
    modules: [
      {
        title: "Healthcare Administration Foundations",
        lessons: [
          "Roles in a hospital: clinical, administrative and support",
          "Structure and governance of healthcare facilities",
          "Service departments and how they connect",
          "Quality and patient-safety culture",
        ],
      },
      {
        title: "Medical & HMO Terminology",
        lessons: [
          "Anatomical and directional terms",
          "Common diagnoses and procedures",
          "Pharmacy, laboratory and radiology terms",
          "HMO and insurance terminology",
        ],
      },
      {
        title: "Patient Administration",
        lessons: [
          "Registration and patient identification",
          "Scheduling, appointments and waiting time",
          "Admission, transfer and discharge processes",
          "Handling complaints and difficult situations",
        ],
      },
      {
        title: "Records & Documentation",
        lessons: [
          "The patient record and why it matters",
          "Documentation standards and legal implications",
          "Filing, storage and retrieval",
          "Digital records and health information systems",
        ],
      },
      {
        title: "HMO Operations in a Hospital",
        lessons: [
          "Panel verification at the point of care",
          "Pre-authorisation and referrals",
          "Claim submission and follow-up",
          "Reconciling HMO payments with the facility ledger",
        ],
      },
      {
        title: "Healthcare Claims & Processes",
        lessons: [
          "Understanding claim forms and coding",
          "Tariffs and how they apply",
          "Adjudication, denial and appeal",
          "Common reasons claims are rejected",
        ],
      },
      {
        title: "Practical Administrative Skills",
        lessons: [
          "Professional communication and email etiquette",
          "Meeting minutes and administrative writing",
          "Managing a busy front desk",
          "Working with suppliers and service providers",
        ],
      },
    ],
    outcomes: [
      "Run the administrative side of a hospital confidently",
      "Manage patient records accurately and legally",
      "Process HMO claims and reduce payment rejections",
      "Communicate professionally with clinicians, insurers and patients",
    ],
    requirements: [
      "OND, HND or a relevant degree is an advantage",
      "Basic computer literacy",
      "Prior healthcare or administrative exposure helpful but not required",
    ],
    includes: [
      "10 weeks of on-demand lessons",
      "Weekly live practice sessions",
      "Ready-to-use hospital admin templates",
      "Certificate of completion",
    ],
  },
  {
    slug: "virtual-assistant-ai-automation",
    title: "Virtual Assistant & AI Automation",
    category: "Digital Skills",
    level: "Beginner",
    priceNgn: 35000,
    priceUsd: 23,
    durationWeeks: 6,
    instructor: "Mr. Emeka Okafor",
    img: IMG.ai,
    summary:
      "Practical training for healthcare professionals and complete beginners - virtual assistant skills, remote work habits, and using AI tools to automate the repetitive parts of your week.",
    overview:
      "Remote work is now a realistic career path, and AI has changed what a capable virtual assistant can deliver in a day. This programme starts from absolute zero, covering the practical skills employers look for - email, calendar, communication, organisation - then shows you how to use AI tools to remove busywork rather than adding more of it. Two learning paths run through the material: one for practising healthcare professionals, and one for complete beginners.",
    expectations: [
      "Set up a professional remote working setup",
      "Build a reusable AI workflow for your own admin tasks",
      "Create a portfolio that gets you hired",
      "Find and win your first virtual assistant clients",
    ],
    modules: [
      {
        title: "Virtual Assistant Skills",
        lessons: [
          "What a virtual assistant actually does all day",
          "Email management and inbox zero",
          "Calendar and appointment scheduling",
          "Document handling and cloud storage",
          "Building repeatable checklists and SOPs",
        ],
      },
      {
        title: "Remote Work Skills",
        lessons: [
          "Setting up a professional home workspace",
          "Time zones, availability and boundaries",
          "Written communication that gets results",
          "Working independently and reporting progress",
        ],
      },
      {
        title: "AI Tools & Automation",
        lessons: [
          "A practical tour of current AI assistants",
          "Writing effective prompts",
          "Automating email, scheduling and data entry",
          "Using AI for research, summaries and content",
          "Checking AI output for accuracy and privacy",
        ],
      },
      {
        title: "Healthcare-Specific Applications",
        lessons: [
          "AI tools in a clinical or administrative setting",
          "Patient communication and reminders",
          "Health information handling and confidentiality",
          "Where AI must never be used",
        ],
      },
      {
        title: "For Healthcare Professionals",
        lessons: [
          "Translating clinical knowledge into admin value",
          "Building a healthcare CV and portfolio",
          "Finding healthcare clients and facilities",
        ],
      },
      {
        title: "For Beginners",
        lessons: [
          "Starting from zero with no experience",
          "Your first week as a virtual assistant",
          "Freelance platforms and how to use them",
        ],
      },
    ],
    outcomes: [
      "Work confidently as a remote virtual assistant",
      "Automate repetitive admin tasks with AI tools",
      "Build a portfolio and profile that attract clients",
      "Deliver healthcare admin support with appropriate discretion",
    ],
    requirements: [
      "A computer and reliable internet connection",
      "No prior office experience required",
      "Willingness to practise writing clear instructions",
    ],
    includes: [
      "6 weeks of on-demand lessons",
      "AI prompt library and workflow templates",
      "Portfolio and CV templates",
      "Certificate of completion",
    ],
  },
  {
    slug: "website-development",
    title: "Website Development",
    category: "Digital Skills",
    level: "Beginner",
    priceNgn: 40000,
    priceUsd: 26,
    durationWeeks: 6,
    instructor: "Technical Training Team",
    img: IMG.web,
    summary:
      "Learn to design and build fast, mobile-first websites for clinics, HMOs and health brands - including hosting, domains and ongoing maintenance.",
    overview:
      "A healthcare business without a website is losing patients and referrals. This programme teaches you to build a professional, fast, mobile-first website from scratch without becoming a full-time developer. You will learn structure, design, mobile responsiveness, hosting and domain setup, and the maintenance routine that keeps a site secure and working.",
    expectations: [
      "Build and publish a complete website",
      "Make it look right on every screen size",
      "Set up hosting and a domain",
      "Keep the site secure and up to date",
    ],
    modules: [
      {
        title: "Web Fundamentals",
        lessons: [
          "How the web works: domains, hosting, browsers",
          "Planning a site and its pages",
          "Choosing between builders and custom builds",
        ],
      },
      {
        title: "Design & Structure",
        lessons: [
          "Layout, hierarchy and readable content",
          "Colour, imagery and brand consistency",
          "Writing clear healthcare copy",
        ],
      },
      {
        title: "Building the Site",
        lessons: [
          "Building pages and navigation",
          "Mobile-first responsive design",
          "Forms, booking buttons and contact details",
        ],
      },
      {
        title: "Publishing",
        lessons: [
          "Choosing and connecting a domain",
          "Hosting, SSL and going live",
          "Testing across devices",
        ],
      },
      {
        title: "Maintenance & Growth",
        lessons: [
          "Updates, backups and security basics",
          "Basic SEO so patients can find you",
          "Measuring traffic and improving",
        ],
      },
    ],
    outcomes: [
      "Build and publish a professional website",
      "Design for mobile users first",
      "Set up hosting, domain and SSL",
      "Maintain and update a site confidently",
    ],
    requirements: [
      "A computer with internet access",
      "No coding experience required",
    ],
    includes: [
      "6 weeks of on-demand lessons",
      "Starter website templates",
      "Hosting and domain walkthrough",
      "Certificate of completion",
    ],
  },
  {
    slug: "provider-relationship-manager",
    title: "Provider Relationship Manager",
    category: "Health Insurance",
    level: "Intermediate",
    priceNgn: 25000,
    priceUsd: 16,
    durationWeeks: 8,
    instructor: "Mrs. Chioma Nwosu",
    img: IMG.provider,
    summary:
      "Build and manage the hospital and clinic partnerships that keep an HMO network strong - from provider recruitment to disputes and performance reviews.",
    overview:
      "An HMO is only as strong as its provider network. This programme trains you to source, onboard and manage hospitals and clinics as a relationship manager: negotiating terms, supporting providers day to day, resolving disputes quickly, and monitoring network performance so members always get care where and when they need it.",
    expectations: [
      "Recruit and onboard new hospitals and clinics",
      "Handle provider queries and escalations professionally",
      "Resolve disputes before they affect members",
      "Track network performance and close coverage gaps",
    ],
    modules: [
      {
        title: "The Provider Network",
        lessons: [
          "How HMO networks are structured",
          "Provider categories, tiers and coverage mapping",
          "Why network quality decides member retention",
        ],
      },
      {
        title: "Recruitment & Onboarding",
        lessons: [
          "Sourcing and qualifying hospitals and clinics",
          "Site visits and document checks",
          "Contract terms, tariffs and service-level agreements",
        ],
      },
      {
        title: "Day-to-Day Relationship Management",
        lessons: [
          "Regular provider touchpoints and check-ins",
          "Handling queries, approvals and escalations",
          "Supporting providers with claims workflows",
        ],
      },
      {
        title: "Disputes & Issue Resolution",
        lessons: [
          "Common sources of provider disputes",
          "Investigating complaints with evidence",
          "Escalation paths and closing the loop",
        ],
      },
      {
        title: "Network Performance",
        lessons: [
          "Key metrics: utilisation, claims turnaround, service quality",
          "Identifying and closing coverage gaps",
          "Reporting and renewing provider contracts",
        ],
      },
    ],
    outcomes: [
      "Recruit and onboard providers to standard",
      "Run a professional provider relationship calendar",
      "Resolve disputes quickly and fairly",
      "Measure and improve network performance",
    ],
    requirements: [
      "Experience in HMO, hospital or customer-facing roles helpful",
      "Strong written and verbal communication",
    ],
    includes: [
      "8 weeks of on-demand lessons",
      "Provider recruitment and onboarding templates",
      "Contract and SLA sample library",
      "Certificate of completion",
    ],
  },
  {
    slug: "customer-service-support",
    title: "Customer Service Support",
    category: "Digital Skills",
    level: "Beginner",
    priceNgn: 15000,
    priceUsd: 10,
    durationWeeks: 6,
    instructor: "Kalaro Training Faculty",
    img: IMG.support,
    summary:
      "Handle enquiries, complaints and follow-ups with confidence - the core skills every support agent needs for HMOs, hospitals and remote roles.",
    overview:
      "Customer service is the front line of every healthcare organisation. This programme covers the fundamentals: understanding the customer, writing clear replies, handling complaints calmly, working ticketing and CRM tools, and meeting response-time targets. By the end you will be ready for support roles in HMOs, hospitals and remote customer-service teams.",
    expectations: [
      "Respond to enquiries across chat, email and phone",
      "Turn complaints into resolved issues",
      "Use ticketing and CRM tools correctly",
      "Meet response-time and quality targets",
    ],
    modules: [
      {
        title: "Service Fundamentals",
        lessons: [
          "What good service looks like in healthcare",
          "Understanding enquiry types and priorities",
          "Tone, empathy and professional language",
        ],
      },
      {
        title: "Written Communication",
        lessons: [
          "Clear, concise email and chat replies",
          "Templates, macros and consistency",
          "Writing that builds trust",
        ],
      },
      {
        title: "Handling Complaints",
        lessons: [
          "De-escalating an upset customer",
          "Investigating and documenting issues",
          "When and how to escalate",
        ],
      },
      {
        title: "Tools of the Trade",
        lessons: [
          "Ticketing systems and case lifecycles",
          "CRM basics and logging interactions",
          "Knowledge bases and internal notes",
        ],
      },
      {
        title: "Performance",
        lessons: [
          "Response-time and resolution targets",
          "Quality scoring and self-review",
          "Growing into a team-lead role",
        ],
      },
    ],
    outcomes: [
      "Handle enquiries across email, chat and phone",
      "Resolve complaints without escalation friction",
      "Use ticketing and CRM tools confidently",
      "Work to response-time and quality targets",
    ],
    requirements: [
      "Good written English",
      "A computer or smartphone with internet access",
      "No prior experience required",
    ],
    includes: [
      "6 weeks of on-demand lessons",
      "Reply and complaint-handling templates",
      "Mock ticketing practice exercises",
      "Certificate of completion",
    ],
  },
  {
    slug: "flight-hotel-bookings",
    title: "Flight & Hotel Bookings",
    category: "Digital Skills",
    level: "Beginner",
    priceNgn: 25000,
    priceUsd: 16,
    durationWeeks: 6,
    instructor: "Kalaro Training Faculty",
    img: IMG.flights,
    summary:
      "Learn to search, price and confirm flights and hotel stays for clients - fares, reservations, changes and itinerary handling from start to finish.",
    overview:
      "Travel booking is a practical, in-demand skill for remote and agency work. This programme takes you from searching fares to issuing itineraries: booking tools, fare rules, seat and hotel selections, schedule changes, refunds and client communication. You will practise real bookings end to end so you can work confidently in a travel agency or as a freelance booking assistant.",
    expectations: [
      "Search and compare fares and hotel rates",
      "Create and confirm reservations",
      "Handle changes, cancellations and refunds",
      "Send clear itineraries to clients",
    ],
    modules: [
      {
        title: "Travel Industry Basics",
        lessons: [
          "How flights and fares work",
          "Cabin classes, fare rules and penalties",
          "Hotel categories, rates and inclusions",
        ],
      },
      {
        title: "Searching & Pricing",
        lessons: [
          "Searching flights and building options",
          "Comparing hotels: location, rate and policy",
          "Presenting choices to a client",
        ],
      },
      {
        title: "Making Bookings",
        lessons: [
          "Creating and holding reservations",
          "Passenger details and document checks",
          "Confirmations, tickets and vouchers",
        ],
      },
      {
        title: "Changes & Problem Solving",
        lessons: [
          "Rebooking and schedule changes",
          "Cancellations, refunds and no-shows",
          "Delays, disruptions and client updates",
        ],
      },
      {
        title: "Serving the Client",
        lessons: [
          "Writing clear itineraries",
          "Payment, receipts and record keeping",
          "Building repeat clients and referrals",
        ],
      },
    ],
    outcomes: [
      "Search and price flights and hotels accurately",
      "Confirm bookings and issue itineraries",
      "Manage changes, refunds and disruptions",
      "Run a professional client booking workflow",
    ],
    requirements: [
      "A computer with reliable internet access",
      "Good written English",
      "No prior travel-industry experience required",
    ],
    includes: [
      "6 weeks of on-demand lessons",
      "Fare and hotel comparison worksheets",
      "Itinerary and confirmation templates",
      "Certificate of completion",
    ],
  },
  {
    slug: "project-management",
    title: "Project Management",
    category: "Project Management",
    level: "Intermediate",
    priceNgn: 20000,
    priceUsd: 13,
    durationWeeks: 8,
    instructor: "Kalaro Training Faculty",
    img: IMG.office,
    summary:
      "Plan, schedule and deliver projects on time and on budget - the practical tools, templates and team skills every modern workplace expects.",
    overview:
      "Projects fail when nobody owns the plan. This programme builds a working command of the full project lifecycle: defining scope, building a schedule, managing budget and risk, leading the team, and closing out cleanly. You will use real templates - charter, work breakdown, schedule, risk register, status report - and practise them on a case project from week one, so you finish able to run a small project end to end.",
    expectations: [
      "Write a clear project charter and scope statement",
      "Build a realistic schedule with milestones",
      "Track budget, risks and status professionally",
      "Lead meetings and keep stakeholders aligned",
    ],
    modules: [
      {
        title: "Project Fundamentals",
        lessons: [
          "What a project is (and what it is not)",
          "The project lifecycle and key deliverables",
          "Roles: sponsor, manager, team and stakeholders",
        ],
      },
      {
        title: "Scope & Planning",
        lessons: [
          "Writing objectives and a tight scope statement",
          "Breaking work down into a WBS",
          "Estimating effort, cost and dependencies",
        ],
      },
      {
        title: "Scheduling & Budget",
        lessons: [
          "Building timelines and milestones",
          "Critical path basics",
          "Budgeting, tracking and change control",
        ],
      },
      {
        title: "Risk & Communication",
        lessons: [
          "Identifying and scoring risks",
          "Stakeholder mapping and reporting",
          "Running effective status meetings",
        ],
      },
      {
        title: "Delivery & Closure",
        lessons: [
          "Monitoring progress with RAG status",
          "Handling scope creep and issues",
          "Handover, lessons learned and close-out",
        ],
      },
    ],
    outcomes: [
      "Plan and run a project from charter to close-out",
      "Build schedules, budgets and risk registers that hold up",
      "Report status clearly to sponsors and stakeholders",
      "Use templates you can take into any role",
    ],
    requirements: [
      "No prior project-management experience required",
      "Suitable for coordinators, officers, team leads and business owners",
      "A computer or smartphone with internet access",
    ],
    includes: [
      "8 weeks of on-demand lessons",
      "Charter, schedule, budget and status templates",
      "Weekly live Q&A sessions",
      "Certificate of completion",
    ],
  },
];

/* ── CPD seed list ───────────────────────────────────────────────
   Each seed carries only what varies per course; cpdCourse()
   fills the shared shape (category, ₦5,000 fee, 1-week duration,
   requirements, includes) and appends the knowledge-check quiz as
   the third module, so every CPD course is 2 teaching modules +
   1 quiz. */
type CpdSeed = {
  slug: string;
  title: string;
  level: Course["level"];
  img: string;
  summary: string;
  expectations: string[];
  modules: CourseModule[];
  outcomes: string[];
};

const CPD_REQUIREMENTS = [
  "No prerequisites - open to practising professionals",
  "A phone or computer with internet access",
];

const CPD_INCLUDES = [
  "1 week of on-demand access",
  "Knowledge-check quiz",
  "Certificate of completion",
];

const cpdCourse = (seed: CpdSeed): Course => ({
  slug: seed.slug,
  title: seed.title,
  category: CPD_CATEGORY,
  level: seed.level,
  priceNgn: 5000,
  priceUsd: 3,
  durationWeeks: 1,
  instructor: "Kalaro Training Faculty",
  img: seed.img,
  summary: seed.summary,
  overview: `${seed.summary} Delivered entirely on demand, it condenses the topic into short lessons and a knowledge-check quiz you can finish in a few hours.`,
  expectations: seed.expectations,
  modules: [...seed.modules, { title: "Knowledge Check", lessons: ["Course quiz"] }],
  outcomes: seed.outcomes,
  requirements: CPD_REQUIREMENTS,
  includes: CPD_INCLUDES,
});

const CPD_SEEDS: CpdSeed[] = [
  {
    slug: "patient-safety-medication-error-prevention",
    title: "Patient Safety and Medication Error Prevention",
    level: "Intermediate",
    img: IMG.nursing,
    summary:
      "Build the habits that prevent harm - spot risks early, report near-misses and keep patients safe on every shift.",
    expectations: [
      "Recognise everyday hazards before they reach the patient",
      "Apply the five rights to every medication round",
      "Report and follow up near-misses properly",
    ],
    modules: [
      {
        title: "Foundations of Patient Safety",
        lessons: ["Why patient safety fails", "Risk points in everyday practice", "Building a reporting culture"],
      },
      {
        title: "Preventing Medication Errors",
        lessons: ["The medication use chain", "High-alert drugs and common traps", "Double-checks, timing and escalation"],
      },
    ],
    outcomes: [
      "Prevent the commonest medication errors",
      "Run a proper incident and near-miss report",
      "Champion safety on your unit",
    ],
  },
  {
    slug: "infection-prevention-control-ppe",
    title: "Infection Prevention and Control including Hygiene & PPE",
    level: "Intermediate",
    img: IMG.nursing,
    summary:
      "Stop transmission at its source - hand hygiene, transmission-based precautions and PPE that actually protects.",
    expectations: [
      "Break the chain of infection in your own practice",
      "Use PPE correctly, every time",
      "Apply transmission-based precautions with confidence",
    ],
    modules: [
      {
        title: "How Infection Spreads",
        lessons: ["The chain of infection", "Healthcare-associated infections", "Hand hygiene that works"],
      },
      {
        title: "PPE and Precautions",
        lessons: ["Choosing and donning PPE correctly", "Transmission-based precautions", "Safe waste handling and decontamination"],
      },
    ],
    outcomes: [
      "Cut healthcare-associated infections",
      "Use PPE and precautions correctly",
      "Lead hygiene compliance on your ward",
    ],
  },
  {
    slug: "patient-management-palliative-care",
    title: "Patient Management & Palliative Care",
    level: "Intermediate",
    img: IMG.hospital,
    summary:
      "Coordinate care beyond the cure - symptom control, dignified end-of-life care and real support for families.",
    expectations: [
      "Manage patients across the full care journey",
      "Apply palliative principles for comfort and dignity",
      "Support families through difficult decisions",
    ],
    modules: [
      {
        title: "Coordinating Patient Care",
        lessons: ["Assessment and care planning", "Coordinating teams and referrals", "Escalation and handover"],
      },
      {
        title: "Palliative Care Basics",
        lessons: ["Symptom and pain control", "Communication at end of life", "Family support and bereavement"],
      },
    ],
    outcomes: [
      "Manage complex patients with confidence",
      "Deliver compassionate palliative care",
      "Communicate difficult news well",
    ],
  },
  {
    slug: "maternal-newborn-child-health-update",
    title: "Maternal, Newborn and Child Health Update",
    level: "Intermediate",
    img: IMG.nursing,
    summary:
      "Current guidance across the continuum - antenatal care, safe delivery, postnatal support and newborn essentials.",
    expectations: [
      "Apply updated ANC and postnatal guidance",
      "Recognise danger signs in mother and baby",
      "Support newborn care in the first critical days",
    ],
    modules: [
      {
        title: "Maternal Health Updates",
        lessons: ["Antenatal care contacts", "Warning signs in pregnancy and labour", "Postnatal care and follow-up"],
      },
      {
        title: "Newborn & Child Health",
        lessons: ["Newborn assessment and warmth", "Feeding and immunisation schedule", "Common newborn danger signs"],
      },
    ],
    outcomes: [
      "Deliver up-to-date maternal care",
      "Act fast on maternal danger signs",
      "Give newborns the best start",
    ],
  },
  {
    slug: "leadership-delegation-supervision",
    title: "Leadership, Delegation and Supervision",
    level: "Intermediate",
    img: IMG.office,
    summary:
      "Move from peer to boss - delegate with confidence, supervise performance and lead a team that delivers.",
    expectations: [
      "Delegate tasks to the right person, clearly",
      "Run useful supervision and feedback conversations",
      "Handle underperformance early and fairly",
    ],
    modules: [
      {
        title: "Stepping into Leadership",
        lessons: ["From peer to supervisor", "Styles of leadership that work", "Setting expectations"],
      },
      {
        title: "Delegation & Supervision",
        lessons: ["Delegating without micromanaging", "Supervision meetings that matter", "Giving and receiving feedback"],
      },
    ],
    outcomes: [
      "Delegate work with confidence",
      "Supervise performance proactively",
      "Build a team that delivers",
    ],
  },
  {
    slug: "nurse-wellbeing-stress-management",
    title: "Nurse Wellbeing, Stress Management & Work-Life Balance",
    level: "Beginner",
    img: IMG.nursing,
    summary:
      "Protect your own oxygen first - recognise burnout early, manage stress and build boundaries that last.",
    expectations: [
      "Spot the early signs of burnout",
      "Apply stress-management tools you can use on shift",
      "Build sustainable work-life boundaries",
    ],
    modules: [
      {
        title: "Understanding Stress & Burnout",
        lessons: ["How stress affects the body and mind", "Recognising burnout early", "Compassion fatigue in care work"],
      },
      {
        title: "Sustainable Coping",
        lessons: ["Practical reset techniques", "Boundaries and saying no", "Sleep, rest and recovery"],
      },
    ],
    outcomes: [
      "Manage stress before it manages you",
      "Prevent burnout for yourself and colleagues",
      "Protect a healthy work-life balance",
    ],
  },
  {
    slug: "communication-conflict-resolution",
    title: "Communication, Conflict Resolution and Handling Difficult Families",
    level: "Beginner",
    img: IMG.hospital,
    summary:
      "Say hard things well - de-escalate conflict, deliver difficult news and work with distressed families.",
    expectations: [
      "De-escalate angry patients and relatives",
      "Deliver difficult news with empathy",
      "Use structured conversation frameworks",
    ],
    modules: [
      {
        title: "Communication Foundations",
        lessons: ["Active listening", "Verbal and non-verbal cues", "Documenting conversations"],
      },
      {
        title: "Conflict & Difficult Conversations",
        lessons: ["De-escalation step by step", "Handling complaints and blame", "Working with distressed families"],
      },
    ],
    outcomes: [
      "Defuse conflict before it escalates",
      "Handle complaints professionally",
      "Build trust with difficult families",
    ],
  },
  {
    slug: "document-record-management",
    title: "Document & Record Management",
    level: "Beginner",
    img: IMG.office,
    summary:
      "Keep records accurate, findable and compliant - filing systems, confidentiality and retention done right.",
    expectations: [
      "Apply record-keeping standards consistently",
      "Design filing systems that actually work",
      "Protect confidentiality through the record lifecycle",
    ],
    modules: [
      {
        title: "Records Done Right",
        lessons: ["Principles of good record-keeping", "Accuracy, legibility and timeliness", "Common documentation failures"],
      },
      {
        title: "Systems, Storage & Retention",
        lessons: ["Paper and digital filing systems", "Confidentiality and access control", "Retention, archiving and destruction"],
      },
    ],
    outcomes: [
      "Keep compliant, reliable records",
      "Find any record in seconds",
      "Protect patient and client confidentiality",
    ],
  },
  {
    slug: "nursing-ethics-informed-consent",
    title: "Nursing Ethics, Patient Rights and Informed Consent",
    level: "Intermediate",
    img: IMG.nursing,
    summary:
      "Practise inside the ethical line - autonomy, consent, confidentiality and the duties that define the profession.",
    expectations: [
      "Apply ethical principles to real dilemmas",
      "Confirm valid informed consent",
      "Protect patient rights and confidentiality",
    ],
    modules: [
      {
        title: "Ethics at the Bedside",
        lessons: ["Core ethical principles", "Prioritisation and triage dilemmas", "Professional accountability"],
      },
      {
        title: "Rights, Consent & Confidentiality",
        lessons: ["What informed consent requires", "Capacity and surrogate decisions", "Confidentiality in practice"],
      },
    ],
    outcomes: [
      "Navigate ethical dilemmas with a framework",
      "Obtain and document consent correctly",
      "Safeguard patient rights daily",
    ],
  },
  {
    slug: "calendar-inbox-task-management",
    title: "Calendar Inbox & Task Management",
    level: "Beginner",
    img: IMG.office,
    summary:
      "Run your day instead of reacting to it - calendar blocks, inbox zero and a task system that sticks.",
    expectations: [
      "Structure a realistic weekly calendar",
      "Keep your inbox at zero",
      "Run a task system you actually trust",
    ],
    modules: [
      {
        title: "Calendar & Time Blocking",
        lessons: ["Blocking deep work", "Meetings and buffers", "Planning the week ahead"],
      },
      {
        title: "Inbox and Tasks",
        lessons: ["Processing email to inbox zero", "A task system that sticks", "Reviews and routines"],
      },
    ],
    outcomes: ["Own your schedule", "Clear and keep a zero inbox", "Never drop a commitment again"],
  },
  {
    slug: "client-onboarding-confidentiality-remote-work",
    title: "Client Onboarding and Confidentiality in Remote Work",
    level: "Beginner",
    img: IMG.office,
    summary:
      "Start remote engagements right - onboarding checklists, NDAs and handling client data responsibly.",
    expectations: [
      "Onboard a new client smoothly and professionally",
      "Use NDAs and confidentiality agreements correctly",
      "Handle client data safely in remote settings",
    ],
    modules: [
      {
        title: "Onboarding a New Client",
        lessons: ["The first-call framework", "Scopes, contracts and expectations", "Onboarding checklists that impress"],
      },
      {
        title: "Confidentiality in Remote Work",
        lessons: ["NDAs and data agreements", "Handling files and passwords safely", "What never to share"],
      },
    ],
    outcomes: [
      "Onboard clients like a pro",
      "Protect client data by default",
      "Set boundaries that keep engagements healthy",
    ],
  },
  {
    slug: "portfolio-pricing-invoicing",
    title: "Building a Portfolio, Pricing and Invoicing for Freelancers",
    level: "Beginner",
    img: IMG.office,
    summary:
      "Package your proof, price your worth and get paid cleanly - the business side of freelancing.",
    expectations: [
      "Build a portfolio that wins work",
      "Price your services with confidence",
      "Invoice professionally and chase payments",
    ],
    modules: [
      {
        title: "Building Your Portfolio",
        lessons: ["Case studies over claims", "Where to host your work", "Tailoring your portfolio to a niche"],
      },
      {
        title: "Pricing & Invoicing",
        lessons: ["Rate models and day rates", "Writing a clean invoice", "Deposits, terms and chasing late pay"],
      },
    ],
    outcomes: [
      "Present proof that converts",
      "Price and quote with confidence",
      "Get paid on time",
    ],
  },
  {
    slug: "niche-specialization-support",
    title: "Niche Specialization for Healthcare, Admin and Customer Care Support",
    level: "Beginner",
    img: IMG.ai,
    summary:
      "Pick a lane and own it - choose a profitable niche and position yourself as the go-to specialist.",
    expectations: [
      "Match your strengths to a viable niche",
      "Position yourself as a specialist, not a generalist",
      "Package services your niche will buy",
    ],
    modules: [
      {
        title: "Finding Your Niche",
        lessons: ["Skills, demand and fit", "Sizing the opportunity", "Testing a niche fast"],
      },
      {
        title: "Positioning & Offer Design",
        lessons: ["Your positioning statement", "Building a specialist offer", "Speaking your niche's language"],
      },
    ],
    outcomes: [
      "Choose a profitable niche",
      "Position yourself as the expert",
      "Build an offer your niche wants",
    ],
  },
  {
    slug: "claims-processing-fraud-detection",
    title: "Claims Processing, Vetting and Fraud, Waste and Abuse Detection",
    level: "Intermediate",
    img: IMG.insurance,
    summary:
      "Process claims cleanly and catch what does not add up - vetting rules, red flags and FWA investigations.",
    expectations: [
      "Vet claims against coverage and policy rules",
      "Spot the commonest fraud, waste and abuse red flags",
      "Document and escalate suspicious claims",
    ],
    modules: [
      {
        title: "Claims Processing & Vetting",
        lessons: ["The claims lifecycle", "Vetting rules and documentation", "Denials, queries and appeals"],
      },
      {
        title: "Fraud, Waste & Abuse",
        lessons: ["Types of FWA", "Red flags and patterns", "Investigation and reporting"],
      },
    ],
    outcomes: [
      "Process claims accurately and fast",
      "Detect fraud, waste and abuse",
      "Document defensible claim decisions",
    ],
  },
  {
    slug: "tariff-capitation-fee-for-service",
    title: "Tariff, Capitation and Fee-for-Service Payment Modes",
    level: "Intermediate",
    img: IMG.insurance,
    summary:
      "Understand how healthcare actually gets paid for - tariffs, capitation maths and fee-for-service models.",
    expectations: [
      "Read and apply a tariff schedule",
      "Calculate capitation risk and load",
      "Compare payment models analytically",
    ],
    modules: [
      {
        title: "Payment Models Explained",
        lessons: ["Fee-for-service basics", "Capitation and risk pools", "Bundle and DRG-style models"],
      },
      {
        title: "Tariffs in Practice",
        lessons: ["Reading a tariff schedule", "Prior authorisation and limits", "Reconciling paid vs billed"],
      },
    ],
    outcomes: [
      "Navigate the main payment models",
      "Apply tariffs correctly",
      "Judge when capitation beats fee-for-service",
    ],
  },
  {
    slug: "risk-management-underwriting-basics",
    title: "Risk Management, Underwriting and Actuarial Basics",
    level: "Intermediate",
    img: IMG.insurance,
    summary:
      "See risk before you price it - underwriting fundamentals, risk controls and how actuaries keep the books honest.",
    expectations: [
      "Walk the risk management cycle",
      "Assess applications for underwriting risk",
      "Read basic actuarial outputs",
    ],
    modules: [
      {
        title: "Risk Management Essentials",
        lessons: ["Identifying and scoring risk", "Controls, transfer and retention", "Risk registers in practice"],
      },
      {
        title: "Underwriting & Actuarial Basics",
        lessons: ["Underwriting inputs and decisions", "Pricing and experience rating", "How actuaries price risk"],
      },
    ],
    outcomes: [
      "Run a simple risk assessment",
      "Make sound underwriting calls",
      "Speak the language of pricing and risk",
    ],
  },
];

const CPD_COURSES: Course[] = CPD_SEEDS.map(cpdCourse);

/* The public catalogue: full programmes first (so related-course
   rails prefer them), then the CPD minis. */
export const CATALOG: Course[] = [...PROGRAMMES, ...CPD_COURSES];

/* Self-paced is offered on every full programme; the CPD minis are
   already the short format, so they are full-programme only. */
export const supportsSelfPaced = (course: Course) => course.category !== CPD_CATEGORY;

/** Lookup helpers - the /course/:slug route resolves content by slug. */
export const getCourse = (slug: string) => CATALOG.find((c) => c.slug === slug);

export const totalLessons = (course: Course) =>
  course.modules.reduce((acc, m) => acc + m.lessons.length, 0);



