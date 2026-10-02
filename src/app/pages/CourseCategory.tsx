import { useParams, useNavigate } from "react-router";
import { motion } from "motion/react";
import { useEffect } from "react";
import {
  Users, Stethoscope, FileText, BarChart2, Monitor, Layers,
} from "lucide-react";

/* Programme landing pages that don't have a bespoke CATEGORY_CONTENT
   entry yet. Without this the nav would dead-end on "Category Not
   Found". Titles are hand-written so acronyms (AI, HMO, NHIA, VA)
   render correctly rather than as "Hmo" / "Ai".                     */
const PROGRAM_META: Record<string, { title: string; description: string }> = {
  /* Hospital administration */
  "hospital-admin": { title: "Hospital Administration", description: "Operational training for the people who run day-to-day hospital administration." },
  "front-desk": { title: "Front Desk Operations", description: "Patient reception, records handling and first-contact care coordination." },
  "patient-coordination": { title: "Patient Coordination & Scheduling", description: "Keeping appointments, referrals and patient flow running smoothly." },
  "medical-documentation": { title: "Medical Documentation", description: "Accurate records, correct filing and compliant patient documentation." },
  "healthcare-communication": { title: "Healthcare Communication Systems", description: "Professional communication across departments, patients and providers." },
  "admin-workflow": { title: "Administrative Workflow", description: "Structured processes that keep healthcare administration moving." },
  "hospital-administration": { title: "Hospital Administration Training", description: "Comprehensive hospital administration training for healthcare professionals and beginners." },

  /* Billing & claims */
  "billing-claims": { title: "Billing, Claims & Reconciliation", description: "High-demand training in healthcare billing, claims and account reconciliation." },
  "tariff": { title: "Tariff Understanding", description: "Reading and applying healthcare tariffs correctly in practice." },
  "reconciliation": { title: "Reconciliation Techniques", description: "Match payments to claims and resolve discrepancies efficiently." },
  "revenue-cycle": { title: "Revenue Cycle Basics", description: "How revenue moves from encounter to payment across the cycle." },
  "claims-dispute": { title: "Claims Dispute Resolution", description: "Investigating, appealing and resolving rejected or disputed claims." },

  /* Virtual assistant & AI */
  "va-ai-automation": { title: "Virtual Assistant & AI Automation", description: "Practical training combining virtual assistant skills with modern AI tools and automation." },
  "va-skills": { title: "Virtual Assistant Skills Training", description: "Core virtual assistant skills for remote work in a professional setting." },
  "remote-work": { title: "Remote Work Skills", description: "Work habits, communication and tooling for productive remote work." },
  "ai-automation": { title: "AI Tools & Automation", description: "Use AI tools to automate repetitive work and move faster with less effort." },
  "ai-tools": { title: "Healthcare AI Tools", description: "Applying AI tools within a healthcare administrative context." },
  "healthcare-professionals": { title: "Practical Training for Healthcare Professionals", description: "Remote work and AI skills designed for practising healthcare professionals." },
  "beginners": { title: "Practical Training for Beginners", description: "A practical starting point for people new to virtual assistant and remote work." },
  "professional-communication": { title: "Professional Communication", description: "Clear, professional communication in remote and client-facing roles." },
  "email-admin": { title: "Email & Admin Support", description: "Managing email and routine administrative support professionally." },
  "portfolio": { title: "Portfolio Creation", description: "Build a portfolio that gets you hired for remote and VA roles." },
  "virtual-assistant": { title: "Medical Virtual Assistant", description: "Healthcare-trained virtual assistant support for clinics and practitioners." },
  "appointment-management": { title: "Appointment & Calendar Management", description: "Scheduling, reminders and calendar control that reduce no-shows." },

  /* HMO operation */
  "hospital-hmo-operation": { title: "Hospital Administration & HMO Operation", description: "Run hospitals and HMOs with confidence — administration, operations, claims and terminology." },
  "hmo-operation": { title: "HMO Operation Training", description: "Practical HMO operations training, from enrolment to member services." },
  "hmo-operations": { title: "HMO Operations Training", description: "Operational HMO training for staff and officers." },
  "healthcare-claims": { title: "Healthcare Claims & Processes", description: "Healthcare claims handling and the processes that support it." },
  "medical-terminology": { title: "Medical & HMO Terminologies", description: "The language of medicine and health insurance, explained clearly." },
  "administrative-skills": { title: "Practical Healthcare Administrative Skills", description: "Hands-on administrative skills for healthcare settings." },

  /* NHIA & regulatory */
  "nhia-registration": { title: "NHIA Registration Support", description: "NHIA registration support for healthcare facilities and providers." },
  "hospital-registration": { title: "Hospital Registration Assistance", description: "Assistance registering healthcare facilities with the right authorities." },
  "hospital-renewal": { title: "Annual Hospital Renewal", description: "Keep your facility's registration current, every year." },
  "regulatory-documentation": { title: "Regulatory Documentation Support", description: "Paperwork that satisfies every healthcare authority." },

  /* HMO workforce */
  "hmo-officer-training": { title: "HMO Officer Recruitment & Training", description: "Recruit, train and develop a capable HMO administrative workforce." },
  "hmo-officer-recruitment": { title: "HMO Officer Recruitment", description: "Finding and onboarding the right HMO officers for your organisation." },
  "hmo-staff-training": { title: "HMO Staff Training", description: "Practical training for HMO staff across core functions." },
  "workforce-development": { title: "Healthcare Administrative Workforce Development", description: "Build a healthcare administrative workforce that performs." },

  /* Web */
  "website-development": { title: "Website Development", description: "Fast, mobile-first websites for clinics and health brands." },
};

interface Course {
  title: string;
  slug: string;
  category: string;
  duration: string;
  students: string;
  rating: number;
  lessons: number;
  price: string;
  img: string;
  badgeColor: string;
  desc: string;
  highlights: string[];
  instructor: string;
  fullDescription: string;
  curriculum: { week: string; title: string; topics: string[] }[];
  requirements: string[];
  outcomes: string[];
}

const CATEGORY_CONTENT: Record<string, {
  title: string;
  description: string;
  icon: any;
  color: string;
  courses: Course[];
}> = {
  "patient-verification": {
    title: "Patient Verification & Pre-Authorization",
    description: "Master the critical processes of verifying patient eligibility and obtaining pre-authorizations for medical procedures and treatments.",
    icon: <Stethoscope className="w-6 h-6" />,
    color: "emerald",
    courses: [
      {
        title: "Patient Verification Fundamentals",
        slug: "patient-verification-fundamentals",
        category: "Beginner",
        duration: "4 Weeks",
        students: "650",
        rating: 4.8,
        lessons: 16,
        price: "$250",
        img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        badgeColor: "bg-emerald-100 text-emerald-700",
        desc: "Learn essential patient verification processes including eligibility checks, insurance validation, and data entry best practices.",
        highlights: ["Eligibility verification", "Insurance validation", "Data entry accuracy", "Patient communication"],
        instructor: "Mrs. Chioma Nwosu",
        fullDescription: "This foundational course teaches you how to verify patient information, check insurance eligibility, and ensure all required documentation is in place before patient appointments.",
        curriculum: [
          { week: "Week 1-2", title: "Verification Fundamentals", topics: ["Patient data collection", "Insurance card verification", "Eligibility checking", "Common verification errors"] },
          { week: "Week 3-4", title: "Advanced Verification", topics: ["Pre-authorization requirements", "Referral validation", "Benefit verification", "Documentation standards"] },
        ],
        requirements: ["Basic computer skills", "Attention to detail", "Healthcare background helpful", "English proficiency"],
        outcomes: ["Perform accurate patient verification", "Navigate insurance systems", "Identify authorization requirements", "Maintain compliance standards"],
      },
    ],
  },
  "claims-prep": {
    title: "Claims Preparation & Submission",
    description: "Learn to prepare, submit, and track medical claims accurately to ensure timely reimbursement.",
    icon: <FileText className="w-6 h-6" />,
    color: "blue",
    courses: [
      {
        title: "Medical Billing Fundamentals",
        slug: "medical-billing-fundamentals",
        category: "Beginner",
        duration: "5 Weeks",
        students: "890",
        rating: 4.7,
        lessons: 20,
        price: "$300",
        img: "https://images.unsplash.com/photo-1513258496099-48168024aec0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        badgeColor: "bg-amber-100 text-amber-700",
        desc: "Master the fundamentals of medical billing including coding basics, claim forms, and submission procedures.",
        highlights: ["CPT/ICD coding", "Claim forms", "Submission procedures", "Payment posting"],
        instructor: "Mrs. Ngozi Uchenna",
        fullDescription: "This course provides a solid foundation in medical billing processes. You'll learn to assign appropriate codes, complete claim forms accurately, and submit claims to insurance companies.",
        curriculum: [
          { week: "Week 1-2", title: "Coding Basics", topics: ["CPT codes", "ICD-10 codes", "Modifiers", "Code selection"] },
          { week: "Week 3-4", title: "Claim Preparation", topics: ["CMS-1500 forms", "UB-04 forms", "Required fields", "Documentation"] },
          { week: "Week 5", title: "Submission & Follow-up", topics: ["Electronic submission", "Paper claims", "Claim tracking", "Follow-up procedures"] },
        ],
        requirements: ["Basic medical terminology", "Computer proficiency", "Attention to detail", "No prior billing experience required"],
        outcomes: ["Assign accurate medical codes", "Complete claim forms correctly", "Submit claims electronically", "Track claim status"],
      },
    ],
  },
  "billing": {
    title: "Billing & Reconciliation",
    description: "Comprehensive training in medical billing processes, payment posting, and account reconciliation.",
    icon: <BarChart2 className="w-6 h-6" />,
    color: "purple",
    courses: [
      {
        title: "Healthcare Accounting & Reconciliation",
        slug: "healthcare-accounting-reconciliation",
        category: "Intermediate",
        duration: "6 Weeks",
        students: "560",
        rating: 4.8,
        lessons: 24,
        price: "$420",
        img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        badgeColor: "bg-purple-100 text-purple-700",
        desc: "Learn to manage healthcare accounting processes, reconcile payments, and maintain accurate financial records.",
        highlights: ["Payment posting", "Reconciliation", "Financial reporting", "Audit trails"],
        instructor: "Mr. Tunde Afolabi",
        fullDescription: "This course covers the financial aspects of healthcare management including payment posting, reconciliation procedures, and financial reporting.",
        curriculum: [
          { week: "Week 1-2", title: "Payment Processing", topics: ["Payment posting", "Adjustment entries", "Denial tracking", "Patient statements"] },
          { week: "Week 3-4", title: "Reconciliation", topics: ["Bank reconciliation", "Payer reconciliation", "Account balancing", "Error resolution"] },
          { week: "Week 5-6", title: "Financial Management", topics: ["Financial reports", "KPIs", "Audit preparation", "Process improvement"] },
        ],
        requirements: ["Basic accounting knowledge", "Billing experience", "Excel proficiency", "Attention to detail"],
        outcomes: ["Post payments accurately", "Reconcile accounts monthly", "Generate financial reports", "Prepare for audits"],
      },
    ],
  },
  "utilization-review": {
    title: "Utilization Review",
    description: "Master utilization review processes, clinical criteria evaluation, and care coordination.",
    icon: <Monitor className="w-6 h-6" />,
    color: "indigo",
    courses: [
      {
        title: "Utilization Review Specialist",
        slug: "utilization-review-specialist",
        category: "Advanced",
        duration: "8 Weeks",
        students: "280",
        rating: 4.9,
        lessons: 32,
        price: "$600",
        img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        badgeColor: "bg-indigo-100 text-indigo-700",
        desc: "Advanced training in utilization review methodologies, clinical criteria application, and quality assurance.",
        highlights: ["UR methodologies", "Clinical criteria", "Quality assurance", "Documentation"],
        instructor: "Dr. Chike Nwosu",
        fullDescription: "This advanced course prepares you for a career in utilization review. You'll learn to evaluate medical necessity, apply clinical criteria, and coordinate care.",
        curriculum: [
          { week: "Week 1-2", title: "UR Fundamentals", topics: ["UR principles", "Review types", "Clinical guidelines", "Decision-making"] },
          { week: "Week 3-4", title: "Clinical Review", topics: ["Medical necessity", "Level of care", "Clinical criteria", "Documentation"] },
          { week: "Week 5-6", title: "Care Coordination", topics: ["Case management", "Discharge planning", "Continuity of care", "Resource management"] },
          { week: "Week 7-8", title: "Quality & Compliance", topics: ["Quality metrics", "Compliance", "Appeals process", "Best practices"] },
        ],
        requirements: ["Clinical background", "Nursing experience preferred", "Strong analytical skills", "Healthcare certification"],
        outcomes: ["Conduct UR reviews independently", "Apply clinical criteria accurately", "Coordinate patient care", "Ensure quality outcomes"],
      },
    ],
  },
  "provider-relations": {
    title: "Provider Relationship Management",
    description: "Build and maintain effective relationships with healthcare providers and manage provider networks.",
    icon: <Users className="w-6 h-6" />,
    color: "teal",
    courses: [
      {
        title: "Provider Network Management",
        slug: "provider-network-management",
        category: "Intermediate",
        duration: "6 Weeks",
        students: "380",
        rating: 4.7,
        lessons: 22,
        price: "$380",
        img: "https://images.unsplash.com/photo-1739285388427-d6f85d12a8fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        badgeColor: "bg-teal-100 text-teal-700",
        desc: "Learn to build, manage, and optimize provider networks for optimal patient access and care quality.",
        highlights: ["Network development", "Contract negotiation", "Performance monitoring", "Provider engagement"],
        instructor: "Mr. Emeka Okafor",
        fullDescription: "This course covers the essentials of provider network management including recruitment, contracting, credentialing, and ongoing performance evaluation.",
        curriculum: [
          { week: "Week 1-2", title: "Network Development", topics: ["Network planning", "Provider recruitment", "Credentialing", "Contracting basics"] },
          { week: "Week 3-4", title: "Contract Management", topics: ["Fee schedules", "Contract terms", "Negotiation", "Legal considerations"] },
          { week: "Week 5-6", title: "Performance Management", topics: ["Quality metrics", "Provider scoring", "Network reports", "Improvement plans"] },
        ],
        requirements: ["Healthcare experience", "Negotiation skills", "Understanding of insurance", "Communication skills"],
        outcomes: ["Build effective provider networks", "Negotiate contracts", "Monitor provider performance", "Ensure network adequacy"],
      },
    ],
  },
};

export default function CourseCategory() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();

  const categoryData = category ? CATEGORY_CONTENT[category] : null;
  /* Programmes without a bespoke entry still get a real landing page
     built from PROGRAM_META, rather than a "Category Not Found" dead end. */
  const programMeta = category ? PROGRAM_META[category] : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category]);

  if (!categoryData && !programMeta) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <button onClick={() => navigate("/courses")} className="bg-green-700 text-white px-6 py-3 rounded-full font-semibold">
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-[Poppins,sans-serif]"
    >
      {/* Hero Section */}
      <section
        className="py-20 relative overflow-hidden"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1580582932707-520aed937b7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#071a08]/90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center text-white">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-700 rounded-xl flex items-center justify-center text-white">
              {categoryData?.icon ?? <Layers className="w-6 h-6" />}
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            {categoryData?.title ?? programMeta?.title}
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm">
            {categoryData?.description ?? programMeta?.description}
          </p>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-center text-gray-400">Courses coming soon...</p>
        </div>
      </section>
    </motion.div>
  );
}