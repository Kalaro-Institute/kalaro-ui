/* Content for the Resources section: blog, webinars, downloadable
   library items and the HMO glossary.

   Each collection is a real list rather than a placeholder, so the
   /resources/* routes render actual content. */

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: "HMO Operations" | "Claims & Billing" | "Career" | "Regulation" | "Technology";
  readMinutes: number;
  date: string;
  author: string;
  /** Paragraphs of the article body, in order. */
  body: string[];
};

export type Webinar = {
  slug: string;
  title: string;
  summary: string;
  speaker: string;
  role: string;
  date: string;
  duration: string;
  live: boolean;
  topics: string[];
};

export type LibraryItem = {
  slug: string;
  title: string;
  description: string;
  format: string;
  pages: number;
  category: "Templates" | "Guides" | "Policy" | "Checklists";
  free: boolean;
};

export type GlossaryTerm = {
  term: string;
  short: string;
  full: string;
  related: string[];
};

/* ── Blog ─────────────────────────────────────────────────────── */
export const POSTS: Post[] = [
  {
    slug: "capitation-vs-fee-for-service",
    title: "Capitation vs Fee-for-Service: Which Model Should an HMO Run?",
    excerpt:
      "The two payment models shape everything downstream - provider behaviour, member satisfaction and your claims workload. Here is how to choose.",
    category: "HMO Operations",
    readMinutes: 8,
    date: "2026-08-18",
    author: "Dr. Adebayo Mensah",
    body: [
      "Almost every HMO in Nigeria eventually faces the same fork in the road: capitation or fee-for-service. The decision looks financial but it is really operational, because it determines what your providers do, what your members expect, and how much claims work lands on your desk.",
      "Under capitation, you pay a provider a fixed sum per enrolled member per month, regardless of how much care that member actually uses. The provider carries the risk. Their incentive is to keep members healthy and to reduce unnecessary visits, because the money is already committed. Your claims volume drops sharply because there are no per-encounter claims to adjudicate.",
      "Fee-for-service works the opposite way. You pay for each service delivered. Utilisation rises, claims volume rises with it, and your cost forecasting becomes much harder because your spend is now hostage to morbidity patterns you do not control.",
      "The mistake most new HMOs make is choosing fee-for-service because it feels safer. It feels safer only until the claims department becomes a bottleneck. You need people adjudicating thousands of claims a month, and every one of them is an opportunity for error, fraud and delay.",
      "In practice, a blended model works well for early years. Capitate your primary care and chronic disease management, where you want cost predictability and preventive focus. Retain fee-for-service for specialist procedures and high-cost episodes, where you genuinely want volume controlled by clinical need rather than by a fixed budget.",
      "Whichever direction you choose, the operational requirement is the same: a provider network you can actually monitor, contracts that define what is covered, and member service capacity to handle the disputes that will inevitably follow. Capitation does not remove those needs, it just changes their shape.",
    ],
  },
  {
    slug: "first-90-days-new-hmo-officer",
    title: "Your First 90 Days as a New HMO Officer",
    excerpt:
      "A week-by-week onboarding plan for officers joining an HMO for the first time - what to learn, who to meet, and what not to touch yet.",
    category: "Career",
    readMinutes: 6,
    date: "2026-08-04",
    author: "Mrs. Ngozi Uchenna",
    body: [
      "The first three months in a new HMO decide whether you become useful or whether you become a liability. Most new officers make the same mistake: they try to understand everything at once, get tired in week three, and end up knowing a little about a lot of nothing.",
      "Weeks one and two are for people, not process. Learn who does what. Sit with the claims officer, the member service desk and the provider relations team for at least a day each. Most operational problems are actually communication problems between these three groups, and you cannot solve what you do not understand.",
      "Weeks three to six are for process. Get a real claim file - a genuine one, with its rejections and corrections - and follow it end to end, from submission through to settlement. Doing this once, slowly, teaches you more than a month of reading policy documents.",
      "Weeks seven to twelve are for judgement. Now that you know how the system works, you can start asking why. Why does this provider submit late? Why does this claim type get rejected most often? These questions are where your value begins, because they are what nobody else is asking.",
      "One warning. Do not change a template, a workflow or a fee schedule in your first month. You do not yet know which of those are load-bearing. Change something small and reversible, watch what happens, and write down what you expected versus what happened.",
    ],
  },
  {
    slug: "top-claim-rejection-reasons",
    title: "The Five Claim Rejection Reasons That Cause Most Delays",
    excerpt:
      "Across the claim files we have reviewed, a small number of reasons account for most rejections. Fix these and your turnaround time drops sharply.",
    category: "Claims & Billing",
    readMinutes: 7,
    date: "2026-07-22",
    author: "Mr. Emeka Okafor",
    body: [
      "We have reviewed enough rejected claim files to be confident that rejections are not evenly distributed. A handful of reasons cause most of them, and most of those are preventable by the provider before submission rather than caught by the HMO after.",
      "The first is missing or expired provider information. A provider number that has lapsed, or a bank account that no longer matches, will reject a claim no matter how clinically sound the encounter was. This is an administrative failure with a clinical cost.",
      "The second is diagnosis and procedure mismatch. Codes that do not support each other, or a procedure billed under a diagnosis that cannot justify it, get flagged automatically. This usually points to genuine documentation gaps rather than coding error.",
      "The third is duplicate submission. Frequently it is not fraud - it is a provider with two billing staff and no shared submission log, so the same encounter goes in twice.",
      "The fourth is exceeding benefit limits without an accompanying authorization. The service was covered, the member simply had not used enough of that benefit yet. Without a pre-authorization reference on the claim, it reads as a benefit breach.",
      "The fifth is the one people forget: wrong benefit period dates. If a member's enrolment has lapsed or the claim falls outside the coverage window, nothing about the clinical content will save it.",
      "The practical takeaway for providers is that a pre-submission checklist addressing these five points eliminates a large majority of rejections. The takeaway for an HMO is that rejection reasons should be tracked as structured data, not filed away - because the pattern across providers is a training opportunity, and the pattern across benefit types is a design flaw in your product.",
    ],
  },
  {
    slug: "nhia-registration-process-explained",
    title: "NHIA Registration Explained: What Facilities Actually Need",
    excerpt:
      "A plain-language walkthrough of hospital registration and annual renewal, the documents involved, and the mistakes that cause rejections.",
    category: "Regulation",
    readMinutes: 9,
    date: "2026-07-09",
    author: "Dr. Aisha Musa",
    body: [
      "NHIA registration is one of those administrative tasks that looks simple until you have done it twice and been rejected both times. The underlying process is not difficult, but it is unforgiving about detail.",
      "Registration falls into two categories. Initial registration is for a facility that has never been registered before, and it is more demanding because the inspector is confirming that your physical setup, staffing and equipment actually match what you are claiming. Renewal, by contrast, is largely a confirmation that your circumstances have not materially changed since last year.",
      "For initial registration, expect to provide incorporation documents, evidence of your premises, staffing certificates, and a detailed list of your equipment and service capability. The facility's physical address is checked against your documents, and inconsistencies here are a common cause of rejection.",
      "The mistake that costs people the most time is submitting a document set that is internally inconsistent. A name that differs between your certificate of incorporation and your bank account, or an address formatted differently on two documents, will be flagged.",
      "Renewal is shorter but has its own trap. If your facility has moved, changed ownership, changed its service scope, or replaced key equipment, you cannot simply renew as though nothing happened. Undisclosed material changes are a common reason for penalties rather than simple renewal.",
      "Plan for renewal as a dated process rather than a response to a reminder. Registration lapses are disruptive: they interrupt claims, they unsettle patients, and they consume senior staff time at exactly the moment the organisation is busiest.",
    ],
  },
  {
    slug: "ai-tools-for-hmo-administrators",
    title: "Practical AI Tools for HMO Administration (Without the Hype)",
    excerpt:
      "Where AI genuinely saves time in HMO administration, where it does not, and how to introduce it without damaging accuracy.",
    category: "Technology",
    readMinutes: 6,
    date: "2026-06-25",
    author: "Technical Training Team",
    body: [
      "Most writing about AI in healthcare administration is either breathless or dismissive. Both are unhelpful. The honest position is that AI is genuinely useful for a small number of specific tasks in an HMO, and genuinely risky for others.",
      "Where it works well is volume-bound text work with a checkable output. Summarising a long claim narrative so an adjudicator can triage faster. Extracting structured fields from a free-text document. Drafting member communications that then get reviewed by a human. First-pass categorisation of incoming support tickets so the right person picks them up.",
      "Where it is dangerous is anything where an error has legal or financial consequences and the output is not independently verifiable. Final adjudication decisions. Anything touching clinical judgement. Anything that will be represented to a regulator as the organisation's own determination.",
      "The failure mode to watch for is not the AI being wrong in an obvious way. It is the AI being confidently wrong in a way that a tired human does not catch, because the output reads fluently and the reviewer is looking for obvious errors rather than subtle ones.",
      "Introduction should follow one rule: keep a human accountable for every output, and require review to be a real step rather than a rubber stamp. If nobody is responsible for what the system says, you have not saved time - you have moved the risk somewhere it is harder to find.",
    ],
  },
  {
    slug: "member-experience-drives-retention",
    title: "Why Members Leave HMO Schemes - and What Actually Retains Them",
    excerpt:
      "Price is rarely the real reason members leave. A look at what drives churn, and the operational fixes that cost almost nothing.",
    category: "HMO Operations",
    readMinutes: 7,
    date: "2026-06-11",
    author: "Mrs. Ngozi Uchenna",
    body: [
      "When members leave a scheme, the exit interview usually produces a price complaint. Price is rarely the real reason, but it is the reason people are comfortable giving.",
      "The real driver is almost always an unresolved bad experience. A claim that stalled for weeks without an explanation. A referral that was refused at a provider without anyone explaining why. A phone call that was answered four times before reaching a human.",
      "This is uncomfortable for HMOs because the fix is operational rather than promotional. You cannot market your way out of a claims backlog. You have to actually resolve the queue.",
      "The cheapest high-impact intervention is proactive status communication. If a claim is taking longer than usual, telling the member before they ask prevents what would otherwise become a complaint. Most members do not object to a delay; they object to the silence around it.",
      "The second is closing the loop on refusals. When a referral or claim is declined, the member should be told what was declined, why, and what they can do next. In our experience, a large share of members who receive a clear explanation accept the outcome - including outcomes they did not want.",
      "The third is measuring the right things. Average claim turnaround is a blunt measure that can be improved by declining hard cases. The more useful measure is how often a member has to chase before they get an answer, because that is what they actually remember.",
    ],
  },
];
/* ── Webinars ─────────────────────────────────────────────────── */
export const WEBINARS: Webinar[] = [
  {
    slug: "claims-adjudication-masterclass",
    title: "Claims Adjudication Masterclass: Reading a Claim File Properly",
    summary:
      "A live walkthrough of a real claim file from submission to settlement, showing where adjudication actually goes wrong.",
    speaker: "Mr. Emeka Okafor",
    role: "Head of Claims Operations",
    date: "2026-09-12",
    duration: "90 minutes",
    live: true,
    topics: ["Reading a claim file", "Common rejection reasons", "Provider query handling"],
  },
  {
    slug: "hmo-financing-explained",
    title: "Financing an HMO: Capital, Reinsurance and Surviving Year One",
    summary:
      "What it actually costs to start, where the money comes from, and the mistakes that close schemes before year two.",
    speaker: "Dr. Adebayo Mensah",
    role: "Director, Institute of HMO Operations",
    date: "2026-08-30",
    duration: "75 minutes",
    live: true,
    topics: ["Startup capital", "Reinsurance", "Year-one survival"],
  },
  {
    slug: "nursing-board-registration-kenya",
    title: "Nursing Registration in Kenya: Documents, Timelines and Pitfalls",
    summary:
      "Everything a nurse outside Kenya needs to know before starting a registration application, in the right order.",
    speaker: "Travel & Exam Support Team",
    role: "Kalaro NCLEX Kenya",
    date: "2026-08-16",
    duration: "60 minutes",
    live: false,
    topics: ["Document checklist", "Registration sequence", "Common delays"],
  },
  {
    slug: "building-your-clinic-website",
    title: "The Clinic Website That Actually Brings In Patients",
    summary:
      "Structure, speed and the handful of pages a healthcare business needs - shown on real examples.",
    speaker: "Technical Training Team",
    role: "Kalaro Institute",
    date: "2026-07-26",
    duration: "60 minutes",
    live: false,
    topics: ["Page structure", "Mobile-first design", "Local SEO basics"],
  },
];

/* ── Library ─────────────────────────────────────────────────── */
export const LIBRARY: LibraryItem[] = [
  {
    slug: "hmo-launch-checklist",
    title: "HMO Launch Checklist",
    description:
      "The 60-item checklist covering incorporation, licensing, provider recruitment and system setup, with owners and sequencing.",
    format: "PDF",
    pages: 12,
    category: "Checklists",
    free: true,
  },
  {
    slug: "provider-contract-template",
    title: "Provider Contract Template",
    description:
      "A ready-to-adapt service agreement covering panel terms, payment cycles, notice periods and dispute resolution.",
    format: "DOCX",
    pages: 18,
    category: "Templates",
    free: true,
  },
  {
    slug: "claim-form-template",
    title: "Standard Claim Form Template",
    description:
      "A structured claim submission template that reduces rejections, with field-level guidance for providers.",
    format: "PDF",
    pages: 4,
    category: "Templates",
    free: true,
  },
  {
    slug: "hmo-operations-handbook",
    title: "HMO Operations Handbook",
    description:
      "End-to-end operational reference covering enrolment, benefits design, provider management, claims and member service.",
    format: "PDF",
    pages: 96,
    category: "Guides",
    free: false,
  },
  {
    slug: "tpa-claims-policy",
    title: "Understanding TPA Claims Policy",
    description:
      "How third-party administrators handle claims, what is typically excluded, and how to challenge a denial.",
    format: "PDF",
    pages: 22,
    category: "Policy",
    free: false,
  },
  {
    slug: "nhia-registration-pack",
    title: "NHIA Registration Document Pack",
    description:
      "The document set needed for hospital registration and renewal, with a preparation guide for each item.",
    format: "PDF",
    pages: 16,
    category: "Checklists",
    free: true,
  },
  {
    slug: "member-sla-framework",
    title: "Member Service Level Framework",
    description:
      "A service-level agreement template defining response times, escalation paths and reporting for member-facing operations.",
    format: "DOCX",
    pages: 14,
    category: "Templates",
    free: false,
  },
];
/* ── Glossary ────────────────────────────────────────────────── */
export const GLOSSARY: GlossaryTerm[] = [
  {
    term: "Capitation",
    short: "Fixed monthly payment to a provider per enrolled member.",
    full: "A payment model where an HMO pays a provider a fixed sum per member per month, regardless of how much care that member actually uses. The provider carries the financial risk, which creates an incentive to keep members healthy and reduce unnecessary visits. In return, the HMO's claims volume falls sharply because there are no per-encounter claims to adjudicate.",
    related: ["Fee-for-Service", "Risk Pool", "Empanelment"],
  },
  {
    term: "Fee-for-Service",
    short: "Payment per individual service delivered, with no fixed allocation.",
    full: "A payment model where the payer pays for each service as it is delivered. Utilisation therefore drives cost, and claims volume rises in proportion. It offers more immediate cash flow to providers but transfers utilisation risk to the payer, requiring an efficient claims function to manage the volume, and cost predictability becomes significantly harder.",
    related: ["Capitation", "Claims Adjudication", "Community Rating"],
  },
  {
    term: "Pre-Authorisation",
    short: "Approval obtained before a service is provided or claimed.",
    full: "A prior approval obtained from the HMO before a covered service is delivered, confirming the service is within the member's benefits and the provider is authorised to deliver it. Claims submitted without a valid pre-authorisation reference are frequently rejected as a benefit breach, even when the service itself was covered.",
    related: ["Referral", "Claims Adjudication", "Community Rating"],
  },
  {
    term: "Risk Pool",
    short: "A shared pool of funds that absorbs high-cost claims.",
    full: "An arrangement where a group of members' contributions are pooled so the cost of a small number of high-cost claims is spread across the whole group. This is the underlying principle of community rating, and the reason pooled arrangements can cover catastrophic care that individual pricing could not sustain.",
    related: ["Capitation", "Reinsurance", "Community Rating"],
  },
  {
    term: "Panel",
    short: "The contracted providers a member may access under their scheme.",
    full: "The network of healthcare providers an HMO has contracted with and agreed terms of service with, which members may access under their scheme. Panel adequacy - whether there are enough accessible providers of the right specialty nearby - is a regulatory and commercial concern in most markets, and a common source of member dissatisfaction when it fails.",
    related: ["Empanelment", "NHIA", "Referral"],
  },
  {
    term: "Claims Adjudication",
    short: "The process of reviewing a claim and deciding what is payable.",
    full: "The review process through which a submitted claim is checked for clinical appropriateness, benefit eligibility, coding accuracy and documentation completeness, resulting in a decision to pay, pay in part, or decline. It is the operational heart of a fee-for-service payer, and its efficiency determines both turnaround times and cost leakage.",
    related: ["Fee-for-Service", "Pre-Authorisation", "Third-Party Administrator"],
  },
  {
    term: "Reinsurance",
    short: "Insurance a payer takes out to cover unusually large claims.",
    full: "An arrangement where a payer transfers part of its risk to a reinsurer in exchange for a premium. It protects the payer's solvency against a small number of very high-cost claims that would otherwise distort a year's results. Reinsurance is one of the primary tools for making community-rated products sustainable.",
    related: ["Risk Pool", "Community Rating", "Capitation"],
  },
  {
    term: "Empanelment",
    short: "The process of bringing a provider onto the HMO's panel.",
    full: "The due-diligence and contracting process through which a healthcare provider is assessed and formally added to an HMO's panel. It typically covers licensing verification, capability and equipment review, service scope agreement, fee negotiation, and execution of a contract defining payment terms and obligations on both sides.",
    related: ["Panel", "NHIA", "Referral"],
  },
  {
    term: "NHIA",
    short: "Nigeria's national health insurance regulator.",
    full: "The National Health Insurance Authority, the body responsible for regulating health insurance in Nigeria, including scheme registration, annual renewal of registered healthcare providers, and oversight of contributors, providers and health maintenance organisations operating in the market.",
    related: ["Empanelment", "Panel", "Community Rating"],
  },
  {
    term: "Community Rating",
    short: "Pricing where everyone pays the same, regardless of risk.",
    full: "An approach to premium calculation in which all members of a scheme pay the same rate regardless of their individual risk profile, age or expected utilisation. The principle behind it is solidarity: a young healthy member's contribution subsidises an older or sicker member's care, which is what makes comprehensive benefit cover affordable at population scale.",
    related: ["Risk Pool", "Capitation", "Reinsurance"],
  },
  {
    term: "Third-Party Administrator",
    short: "An organisation that processes claims on a payer's behalf.",
    full: "An organisation contracted by a payer or scheme to administer claims processing, member services and sometimes provider payment on its behalf. TPAs bring specialist operational capability and scale to organisations that lack it, but they also introduce a layer between the payer and the provider, which is where most disputes originate.",
    related: ["Claims Adjudication", "Pre-Authorisation", "Panel"],
  },
  {
    term: "Referral",
    short: "A formal direction from one provider to another for further care.",
    full: "A formal direction from a primary care provider to a specialist or another provider, authorising a patient to receive care beyond the referring provider's scope. Referrals are a control mechanism as much as a clinical one: they gate access to higher-cost services, so referral appropriateness is a major driver of both cost and clinical outcome.",
    related: ["Pre-Authorisation", "Panel", "Empanelment"],
  },
];

/** Lookup helpers - the resource routes resolve content by slug. */
export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);
export const getWebinar = (slug: string) => WEBINARS.find((w) => w.slug === slug);
export const getLibraryItem = (slug: string) => LIBRARY.find((l) => l.slug === slug);






