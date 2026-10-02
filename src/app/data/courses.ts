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
};

export const CATALOG: Course[] = [
  {
    slug: "health-insurance-hmo-operations",
    title: "Health Insurance & HMO Operations",
    category: "Health Insurance",
    level: "Beginner",
    priceUsd: 350,
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
    priceUsd: 450,
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
    priceUsd: 300,
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
    slug: "canada-admission-support",
    title: "Canada Admission Support",
    category: "International",
    level: "Intermediate",
    priceUsd: 400,
    durationWeeks: 6,
    instructor: "International Admissions Team",
    img: IMG.canada,
    summary:
      "School selection guidance, applications to Canadian schools, full document support and step-by-step guidance through the admission process.",
    overview:
      "Applying to study in Canada means choosing the right schools, meeting their specific requirements and submitting a convincing application on time. We help you shortlist institutions that genuinely match your academic background, prepare and submit your applications, organise every supporting document, and track the process through to a decision.",
    expectations: [
      "Shortlist schools that fit your profile and budget",
      "Prepare a strong, complete application",
      "Track submissions and respond to admissions queries",
      "Understand each stage of the admission process",
    ],
    modules: [
      {
        title: "Profile & School Selection",
        lessons: [
          "Assessing your academic profile",
          "How Canadian admission works",
          "Building a realistic shortlist",
        ],
      },
      {
        title: "Application Preparation",
        lessons: [
          "Required documents for each application",
          "Transcripts, language tests and prerequisites",
          "Writing a convincing statement of purpose",
        ],
      },
      {
        title: "Submission & Follow-Up",
        lessons: [
          "Submitting applications correctly",
          "Tracking application status",
          "Responding to admissions queries",
        ],
      },
    ],
    outcomes: [
      "Apply to schools that genuinely match your profile",
      "Submit complete, competitive applications",
      "Track every application through to decision",
      "Navigate the Canadian admission process confidently",
    ],
    requirements: [
      "Secondary school certificate or equivalent",
      "Language test results where required",
      "Academic transcripts",
    ],
    includes: [
      "School selection strategy session",
      "Application preparation and review",
      "Document organisation and submission",
      "Ongoing admissions guidance",
    ],
  },
  {
    slug: "hmo-officer-recruitment-training",
    title: "HMO Officer Recruitment & Training",
    category: "Healthcare Administration",
    level: "Intermediate",
    priceUsd: 400,
    durationWeeks: 8,
    instructor: "Mrs. Chioma Nwosu",
    img: IMG.office,
    summary:
      "Recruit, train and develop HMO officers and staff - covering recruitment, HMO operations training and building a capable healthcare administrative workforce.",
    overview:
      "An HMO only performs as well as the people running it day to day. This programme covers the full workforce cycle: writing and running a recruitment process, onboarding new officers, training them on HMO operations, and developing the administrative team over time. It is aimed at supervisors, HR staff and owners responsible for building an HMO team.",
    expectations: [
      "Design and run a fair recruitment process",
      "Onboard new officers effectively",
      "Train staff on HMO operations",
      "Build a team that performs consistently",
    ],
    modules: [
      {
        title: "Workforce Planning",
        lessons: [
          "Identifying the roles your HMO needs",
          "Writing clear, unbiased job descriptions",
          "Competency frameworks for healthcare administrators",
        ],
      },
      {
        title: "Recruitment",
        lessons: [
          "Sourcing candidates",
          "Structured interviews and assessment",
          "Reference and background checks",
        ],
      },
      {
        title: "Onboarding",
        lessons: [
          "First-day and first-week structure",
          "Orientation to HMO operations",
          "Systems access, policies and compliance",
        ],
      },
      {
        title: "HMO Operations Training",
        lessons: [
          "Core HMO functions every officer must know",
          "Enrolment, claims and member services operations",
          "Quality standards and error checking",
        ],
      },
      {
        title: "Workforce Development",
        lessons: [
          "Performance reviews and feedback",
          "Closing competency gaps",
          "Retention and progression",
        ],
      },
    ],
    outcomes: [
      "Recruit strong administrative staff",
      "Onboard new hires to a professional standard",
      "Train officers on HMO operations",
      "Build a team that performs consistently",
    ],
    requirements: [
      "Experience in HR, supervision or administration",
      "Ownership or management role helpful",
    ],
    includes: [
      "Recruitment templates and interview guides",
      "Training manuals for new officers",
      "Performance review frameworks",
      "Certificate of completion",
    ],
  },
  {
    slug: "website-development",
    title: "Website Development",
    category: "Digital Skills",
    level: "Beginner",
    priceUsd: 350,
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
];

/** Lookup helpers - the /course/:slug route resolves content by slug. */
export const getCourse = (slug: string) => CATALOG.find((c) => c.slug === slug);

export const totalLessons = (course: Course) =>
  course.modules.reduce((acc, m) => acc + m.lessons.length, 0);


