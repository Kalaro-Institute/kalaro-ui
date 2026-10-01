import {
  BookOpen, Star, GraduationCap, ShieldCheck,
  ClipboardCheck, Plane, Bot, Rss, Video, Library, FileText,
  HelpCircle, Globe, Award, Landmark, FileCheck2, Building2,
  Stethoscope, Users, CreditCard, Monitor,
} from "lucide-react";

export type NavSubItem = {
  label: string;
  to: string;
  desc?: string;
};

export type NavDropdownItem = {
  icon: JSX.Element;
  label: string;
  to: string;
  desc: string;
  /** Short tag rendered next to the label in the left rail of a mega menu */
  badge?: string;
  subItems?: NavSubItem[];
};

export type NavItem = {
  label: string;
  to?: string;
  /** Mega menus render programs in a left rail and only the selected program's modules */
  mega?: boolean;
  dropdown?: NavDropdownItem[];
};

/* â”€â”€ Courses â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Modules are NOT rendered inline. They appear in the right panel
   of the mega menu for whichever program is currently selected. */
export const COURSES: NavDropdownItem[] = [
  {
    icon: <BookOpen className="w-4 h-4" />,
    label: "Health Insurance & HMO Operations",
    to: "/category/patient-verification",
    desc: "Core Program",
    badge: "Core Program",
    subItems: [
      { label: "Patient Verification & Pre-Authorization", to: "/category/patient-verification" },
      { label: "Claims Preparation & Submission", to: "/category/claims-prep" },
      { label: "Billing & Reconciliation", to: "/category/billing" },
      { label: "Utilization Review", to: "/category/utilization-review" },
      { label: "Provider Relationship Management", to: "/category/provider-relations" },
    ],
  },
  {
    icon: <Star className="w-4 h-4" />,
    label: "Hospital Administration",
    to: "/category/hospital-admin",
    desc: "Popular",
    badge: "Popular",
    subItems: [
      { label: "Front Desk Operations", to: "/category/front-desk" },
      { label: "Patient Coordination & Scheduling", to: "/category/patient-coordination" },
      { label: "Medical Documentation", to: "/category/medical-documentation" },
      { label: "Healthcare Communication Systems", to: "/category/healthcare-communication" },
      { label: "Administrative Workflow", to: "/category/admin-workflow" },
    ],
  },
  {
    icon: <GraduationCap className="w-4 h-4" />,
    label: "Billing, Claims & Reconciliation",
    to: "/category/billing-claims",
    desc: "High Demand",
    badge: "High Demand",
    subItems: [
      { label: "Claims Preparation & Submission", to: "/category/claims-prep" },
      { label: "Tariff Understanding", to: "/category/tariff" },
      { label: "Reconciliation Techniques", to: "/category/reconciliation" },
      { label: "Revenue Cycle Basics", to: "/category/revenue-cycle" },
      { label: "Claims Dispute Resolution", to: "/category/claims-dispute" },
    ],
  },
  /* â”€â”€ New programmes from the brochure â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  {
    icon: <Bot className="w-4 h-4" />,
    label: "Virtual Assistant & AI Automation",
    to: "/category/va-ai-automation",
    desc: "Work remotely with modern AI tools",
    subItems: [
      { label: "Virtual Assistant Skills Training", to: "/category/va-skills" },
      { label: "Remote Work Skills", to: "/category/remote-work" },
      { label: "AI Tools & Automation", to: "/category/ai-automation" },
      { label: "Practical Training for Healthcare Professionals", to: "/category/healthcare-professionals" },
      { label: "Practical Training for Beginners", to: "/category/beginners" },
    ],
  },
  {
    icon: <Building2 className="w-4 h-4" />,
    label: "Hospital Administration & HMO Operation",
    to: "/category/hospital-hmo-operation",
    desc: "Run hospitals and HMOs with confidence",
    subItems: [
      { label: "Hospital Administration Training", to: "/category/hospital-administration" },
      { label: "HMO Operation Training", to: "/category/hmo-operation" },
      { label: "Healthcare Claims & Processes", to: "/category/healthcare-claims" },
      { label: "Medical & HMO Terminologies", to: "/category/medical-terminology" },
      { label: "Practical Healthcare Administrative Skills", to: "/category/administrative-skills" },
    ],
  },
  {
    icon: <CreditCard className="w-4 h-4" />,
    label: "International Payments",
    to: "/services/permanent-residency/services/international-payments",
    desc: "Pay in any currency, for any application",
    subItems: [
      { label: "Payments in Different Currencies", to: "/services/permanent-residency/services/international-payments" },
      { label: "International Application Payments", to: "/services/permanent-residency/services/international-payments" },
      { label: "Professional Registration Payments", to: "/services/permanent-residency/services/international-payments" },
    ],
  },
  {
    icon: <Stethoscope className="w-4 h-4" />,
    label: "Nursing Board & NCLEX Support",
    to: "/nclex",
    desc: "Registration through to exam day",
    subItems: [
      { label: "Nursing Board Registration", to: "/nclex/services/nursing-board" },
      { label: "Credential Verification", to: "/nclex/services/credential-evaluation" },
      { label: "Credential Evaluation", to: "/nclex/services/credential-evaluation" },
      { label: "Professional Document Processing", to: "/nclex/services/document-processing" },
      { label: "ATT Application & Support", to: "/nclex/services/ati-support" },
      { label: "NCLEX Registration", to: "/nclex/services/nclex-registration" },
      { label: "NCLEX Exam Booking", to: "/nclex/services/nclex-booking" },
    ],
  },
  {
    icon: <Plane className="w-4 h-4" />,
    label: "Kenya NCLEX & Travel Support",
    to: "/services/permanent-residency/services/kenya-travel-support",
    desc: "Complete support throughout your Kenya stay",
    subItems: [
      { label: "Flight Booking", to: "/services/permanent-residency/services/kenya-travel-support" },
      { label: "Payment Assistance", to: "/services/permanent-residency/services/international-payments" },
      { label: "Yellow Card Assistance", to: "/services/permanent-residency/services/kenya-travel-support" },
      { label: "Passport Registration & Renewal", to: "/services/permanent-residency/services/kenya-travel-support" },
      { label: "Accommodation", to: "/services/permanent-residency/services/kenya-travel-support" },
      { label: "Airport Pickup & Transportation", to: "/services/permanent-residency/services/kenya-travel-support" },
      { label: "NCLEX-Related Support", to: "/nclex" },
    ],
  },
  {
    icon: <FileCheck2 className="w-4 h-4" />,
    label: "Canada Admission Support",
    to: "/services/permanent-residency/services/canada-admission",
    desc: "School selection to submitted application",
    subItems: [
      { label: "School Selection Guidance", to: "/services/permanent-residency/services/canada-admission" },
      { label: "Application for Admission", to: "/services/permanent-residency/services/canada-admission" },
      { label: "Application & Document Support", to: "/services/permanent-residency/services/canada-admission" },
      { label: "Admission Process Guidance", to: "/services/permanent-residency/services/canada-admission" },
    ],
  },
  {
    icon: <Award className="w-4 h-4" />,
    label: "Canada Study Visa Support",
    to: "/services/permanent-residency/services/canada-study-visa",
    desc: "Study permit applications, done properly",
    subItems: [
      { label: "Study Permit Application Support", to: "/services/permanent-residency/services/canada-study-visa" },
      { label: "Document Preparation Guidance", to: "/services/permanent-residency/services/canada-study-visa" },
      { label: "Application Review", to: "/services/permanent-residency/services/canada-study-visa" },
      { label: "Study Visa Application Guidance", to: "/services/permanent-residency/services/canada-study-visa" },
    ],
  },
  {
    icon: <Globe className="w-4 h-4" />,
    label: "Canada Express Entry Support",
    to: "/services/permanent-residency/services/canada-express-entry",
    desc: "A stronger profile, guided end to end",
    subItems: [
      { label: "Express Entry Profile Creation", to: "/services/permanent-residency/services/canada-express-entry" },
      { label: "Profile Guidance", to: "/services/permanent-residency/services/canada-express-entry" },
      { label: "Documentation Support", to: "/services/permanent-residency/services/canada-express-entry" },
      { label: "Guidance Through the Process", to: "/services/permanent-residency/services/canada-express-entry" },
    ],
  },
  {
    icon: <Landmark className="w-4 h-4" />,
    label: "NHIA Registration & Hospital Renewal",
    to: "/category/nhia-registration",
    desc: "Registration and annual renewals handled",
    subItems: [
      { label: "NHIA Registration Support", to: "/category/nhia-registration" },
      { label: "Hospital Registration Assistance", to: "/category/hospital-registration" },
      { label: "Annual Hospital Renewal", to: "/category/hospital-renewal" },
      { label: "Regulatory Documentation Support", to: "/category/regulatory-documentation" },
    ],
  },
  {
    icon: <Users className="w-4 h-4" />,
    label: "HMO Officer Recruitment & Training",
    to: "/category/hmo-officer-training",
    desc: "Build a capable HMO workforce",
    subItems: [
      { label: "HMO Officer Recruitment", to: "/category/hmo-officer-recruitment" },
      { label: "HMO Staff Training", to: "/category/hmo-staff-training" },
      { label: "HMO Operations Training", to: "/category/hmo-operations" },
      { label: "Healthcare Administrative Workforce Development", to: "/category/workforce-development" },
    ],
  },
  {
    icon: <Monitor className="w-4 h-4" />,
    label: "Website Development",
    to: "/category/website-development",
    desc: "Fast, mobile-first sites that convert",
    subItems: [
      { label: "Website Design & Build", to: "/category/website-development" },
      { label: "Mobile-First Development", to: "/category/website-development" },
      { label: "Hosting & Domain Setup", to: "/category/website-development" },
      { label: "Ongoing Maintenance & Support", to: "/category/website-development" },
    ],
  },
];

/* -- NCLEX ------------------------------------------------------ */
export const NCLEX_GROUPS: NavDropdownItem[] = [
  {
    icon: <ClipboardCheck className="w-4 h-4" />,
    label: "Registration & Booking",
    to: "/nclex/services/nclex-registration",
    desc: "Get registered and get your exam date secured",
    subItems: [
      { label: "NCLEX Registration", to: "/nclex/services/nclex-registration" },
      { label: "NCLEX Exam Booking", to: "/nclex/services/nclex-booking" },
      { label: "ATI / TEAS Application Support", to: "/nclex/services/ati-support" },
    ],
  },
  {
    icon: <BookOpen className="w-4 h-4" />,
    label: "Exam Preparation",
    to: "/nclex/services/nclex-prep",
    desc: "Study plan, question bank and CAT practice",
    subItems: [
      { label: "NCLEX Study Plan & Question Bank", to: "/nclex/services/nclex-prep" },
      { label: "Computerized Adaptive Testing Practice", to: "/nclex/services/nclex-prep" },
    ],
  },
  {
    icon: <ShieldCheck className="w-4 h-4" />,
    label: "Credentialing & Documentation",
    to: "/nclex/services/document-processing",
    desc: "Evaluation, verification and attestations",
    subItems: [
      { label: "Nursing Board & Alert Support", to: "/nclex/services/nursing-board" },
      { label: "Credential Evaluation & Verification", to: "/nclex/services/credential-evaluation" },
      { label: "Professional Document Processing", to: "/nclex/services/document-processing" },
    ],
  },
];

/* -- Resources -------------------------------------------------- */
export const RESOURCES: NavDropdownItem[] = [
  { icon: <Rss className="w-4 h-4" />, label: "Blog & Articles", to: "/resources/blog", desc: "Industry insights & career tips" },
  { icon: <Video className="w-4 h-4" />, label: "Webinars", to: "/resources/webinars", desc: "Free recorded & live sessions" },
  { icon: <Library className="w-4 h-4" />, label: "Resource Library", to: "/resources/library", desc: "Templates, guides & policy docs" },
  { icon: <FileText className="w-4 h-4" />, label: "HMO Glossary", to: "/resources/glossary", desc: "Key terms explained simply" },
  {
    icon: <Globe className="w-4 h-4" />,
    label: "International Permanent Residency",
    to: "/services/permanent-residency",
    desc: "Canada admission, study visa & Express Entry",
    subItems: [
      { label: "Canada Admission Support", to: "/services/permanent-residency/services/canada-admission" },
      { label: "Canada Study Visa Support", to: "/services/permanent-residency/services/canada-study-visa" },
      { label: "Canada Express Entry Support", to: "/services/permanent-residency/services/canada-express-entry" },
      { label: "International Payments", to: "/services/permanent-residency/services/international-payments" },
      { label: "Kenya NCLEX & Travel Support", to: "/services/permanent-residency/services/kenya-travel-support" },
    ],
  },
  { icon: <HelpCircle className="w-4 h-4" />, label: "FAQs", to: "/contact#faq", desc: "Common questions answered" },
];

/* -- Nav structure ---------------------------------------------- */
export const NAV: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Courses", to: "/courses", mega: true, dropdown: COURSES },
  { label: "NCLEX", to: "/nclex", dropdown: NCLEX_GROUPS },
  { label: "Resources", dropdown: RESOURCES },
  { label: "Careers", to: "/careers" },
  { label: "Community", to: "/community" },
  { label: "Contact", to: "/contact" },
];

/** Footer link groups, derived from the same data so nothing drifts. */
export const FOOTER_GROUPS = [
  { heading: "Courses", links: COURSES.map((c) => ({ label: c.label, to: c.to })) },
  {
    heading: "NCLEX",
    links: NCLEX_GROUPS.flatMap((g) => g.subItems ?? [{ label: g.label, to: g.to }]).slice(0, 7),
  },
  {
    heading: "Resources",
    links: [
      ...RESOURCES.map((r) => ({ label: r.label, to: r.to })),
      { label: "Live Classes", to: "/live-classes" },
      { label: "Student Portal", to: "/login" },
    ],
  },
];
