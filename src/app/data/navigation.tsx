import {
  BookOpen, Star, ShieldCheck,
  ClipboardCheck, Bot, Rss, Video, Library, FileText,
  HelpCircle, Globe, Landmark,
  Users, Monitor,
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
  /** Short tag rendered next to the label, e.g. "Popular" */
  badge?: string;
  subItems?: NavSubItem[];
};
export type NavItem = {
  label: string;
  to?: string;
  /** Flat menus (Courses) list every entry at once. Grouped menus
      (NCLEX, Resources) reveal the sub-entries of the hovered item. */
  flat?: boolean;
  dropdown?: NavDropdownItem[];
};
/* ── Courses ───────────────────────────────────────────────────
   The Courses menu lists PROGRAMMES ONLY - no modules, no outline,
   no badges. A visitor reads the course name and one line about
   what it covers, then clicks through to /course/<slug> for the
   full breakdown: modules, price, duration and outcomes.

   Every entry resolves to a real CATALOG slug, so the menu can
   never drift from the course pages.

   Paid SERVICES the institute performs - NCLEX registration, exam
   booking, credential evaluation, travel and visa support - are
   deliberately NOT listed here. They are not courses.            */
export const COURSES: NavDropdownItem[] = [
  {
    icon: <BookOpen className="w-4 h-4" />,
    label: "Health Insurance & HMO Operations",
    to: "/course/health-insurance-hmo-operations",
    desc: "How HMOs work, from member enrolment to claims settlement.",
  },
  {
    icon: <Star className="w-4 h-4" />,
    label: "Hospital Administration",
    to: "/course/hospital-administration",
    desc: "Run the front desk, records and day-to-day hospital operations.",
  },
  {
    icon: <Bot className="w-4 h-4" />,
    label: "Virtual Assistant & AI Automation",
    to: "/course/virtual-assistant-ai-automation",
    desc: "Work remotely using modern AI tools and VA workflows.",
  },
  {
    icon: <Users className="w-4 h-4" />,
    label: "HMO Officer Recruitment & Training",
    to: "/course/hmo-officer-recruitment-training",
    desc: "Recruit, onboard and train a capable HMO workforce.",
  },
  {
    icon: <Monitor className="w-4 h-4" />,
    label: "Website Development",
    to: "/course/website-development",
    desc: "Build fast, mobile-first websites that bring in patients.",
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
  {
    icon: <Landmark className="w-4 h-4" />,
    label: "NHIA Registration & Renewal",
    to: "/category/nhia-registration",
    desc: "Hospital registration, annual renewal and documentation",
  },
  { icon: <HelpCircle className="w-4 h-4" />, label: "FAQs", to: "/contact#faq", desc: "Common questions answered" },
];
/* -- Nav structure ---------------------------------------------- */
export const NAV: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Courses", to: "/courses", flat: true, dropdown: COURSES },
  { label: "Shop", to: "/shop" },
  { label: "NCLEX", to: "/nclex", dropdown: NCLEX_GROUPS },
  { label: "Resources", dropdown: RESOURCES },
  { label: "Careers", to: "/careers" },
  { label: "Community", to: "/community" },
  { label: "Contact", to: "/contact" },
];
/* -- Footer ------------------------------------------------------
   Deliberately curated rather than dumped from NAV: a footer with
   16 course links in one column is unreadable. Each group is capped
   and ends in a "View all" link to the full page.                 */
export type FooterLink = { label: string; to: string };
export const FOOTER_GROUPS: { heading: string; links: FooterLink[]; viewAll?: FooterLink }[] = [
  {
    heading: "Popular Courses",
    links: [
      { label: "Health Insurance & HMO Operations", to: "/course/health-insurance-hmo-operations" },
      { label: "Hospital Administration", to: "/course/hospital-administration" },
      { label: "Virtual Assistant & AI Automation", to: "/course/virtual-assistant-ai-automation" },
      { label: "Website Development", to: "/course/website-development" },
      { label: "HMO Officer Recruitment & Training", to: "/course/hmo-officer-recruitment-training" },
    ],
    viewAll: { label: "All Courses", to: "/courses" },
  },
  {
    heading: "NCLEX & Registration",
    links: [
      { label: "NCLEX Registration", to: "/nclex/services/nclex-registration" },
      { label: "NCLEX Exam Booking", to: "/nclex/services/nclex-booking" },
      { label: "Nursing Board Support", to: "/nclex/services/nursing-board" },
      { label: "Credential Evaluation", to: "/nclex/services/credential-evaluation" },
      { label: "Document Processing", to: "/nclex/services/document-processing" },
    ],
    viewAll: { label: "All NCLEX Services", to: "/nclex" },
  },
  {
    heading: "International",
    links: [
      { label: "Canada Admission Support", to: "/services/permanent-residency/services/canada-admission" },
      { label: "Canada Study Visa Support", to: "/services/permanent-residency/services/canada-study-visa" },
      { label: "Canada Express Entry", to: "/services/permanent-residency/services/canada-express-entry" },
      { label: "Kenya NCLEX & Travel", to: "/services/permanent-residency/services/kenya-travel-support" },
      { label: "International Payments", to: "/services/permanent-residency/services/international-payments" },
    ],
    viewAll: { label: "All Services", to: "/services/permanent-residency" },
  },
  {
    heading: "Resources",
    links: [
      { label: "Blog & Articles", to: "/resources/blog" },
      { label: "Webinars", to: "/resources/webinars" },
      { label: "Resource Library", to: "/resources/library" },
      { label: "HMO Glossary", to: "/resources/glossary" },
      { label: "Live Classes", to: "/live-classes" },
    ],
    viewAll: { label: "Student Portal", to: "/login" },
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Contact Us", to: "/contact" },
      { label: "Careers", to: "/careers" },
      { label: "Community", to: "/community" },
    ],
  },
];

