import { useState } from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { MobileCarousel } from "@/app/components/MobileCarousel";
import { useNavigate } from "react-router";
import { useLocationPricing } from "@/app/hooks/useLocationPricing";
import {
  Star, Clock, Users, BookOpen, ArrowRight, Search,
  CheckCircle, Shield, HeartPulse, FileText, BarChart2, Layers,
  Stethoscope, GraduationCap, Briefcase, RefreshCw, Monitor, Building2,
  Calendar, Video, MonitorPlay,
} from "lucide-react";

const CATEGORIES = ["All", "Beginner", "Intermediate", "Advanced"];

const ALL_COURSES = [
  {
    title: "Introduction to HMO Operations",
    category: "Beginner", duration: "6 Weeks", students: "1,240", rating: 4.9,
    lessons: 24, price: "$350",
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500&q=80",
    badgeColor: "bg-emerald-100 text-emerald-700",
    desc: "Get a solid foundation in how Health Maintenance Organisations work, from enrolment to benefit administration and regulatory compliance.",
    highlights: ["HMO structure & governance", "Enrolment processes", "Member services", "Healthcare fundamentals"],
    instructor: "Dr. Adebayo Mensah",
  },
  {
    title: "HMO Claims Management",
    category: "Intermediate", duration: "8 Weeks", students: "980", rating: 4.8,
    lessons: 32, price: "$450",
    img: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500&q=80",
    badgeColor: "bg-blue-100 text-blue-700",
    desc: "Master the end-to-end claims processing workflow — from submission and adjudication to fraud detection and appeals management.",
    highlights: ["Claims adjudication", "Fraud detection", "ICD-10 coding basics", "Appeals & disputes"],
    instructor: "Mrs. Ngozi Uchenna",
  },
  {
    title: "Provider Relations & Network Management",
    category: "Intermediate", duration: "6 Weeks", students: "760", rating: 4.7,
    lessons: 20, price: "$400",
    img: "https://images.unsplash.com/photo-1739285388427-d6f85d12a8fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500&q=80",
    badgeColor: "bg-purple-100 text-purple-700",
    desc: "Learn how to build, manage and negotiate with provider networks. Understand capitation models and performance monitoring.",
    highlights: ["Provider contracting", "Capitation models", "Network adequacy", "Performance metrics"],
    instructor: "Mr. Emeka Okafor",
  },
  {
    title: "Health Insurance Fundamentals",
    category: "Beginner", duration: "4 Weeks", students: "1,540", rating: 4.9,
    lessons: 16, price: "$250",
    img: "https://images.unsplash.com/photo-1513258496099-48168024aec0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500&q=80",
    badgeColor: "bg-amber-100 text-amber-700",
    desc: "Understand the principles of health insurance — risk pooling, premium calculation, benefit design, and international regulatory frameworks.",
    highlights: ["Insurance principles", "Risk management", "Premium design", "Regulatory compliance"],
    instructor: "Dr. Aisha Musa",
  },
  {
    title: "HMO Financial Management",
    category: "Advanced", duration: "10 Weeks", students: "540", rating: 4.8,
    lessons: 40, price: "$600",
    img: "https://images.unsplash.com/photo-1762341117487-dbc411bcf574?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500&q=80",
    badgeColor: "bg-red-100 text-red-700",
    desc: "Advanced financial operations for HMO professionals — budgeting, actuarial basics, reserve management, and financial reporting.",
    highlights: ["Actuarial basics", "Reserve management", "Financial reporting", "Cost control strategies"],
    instructor: "Mr. Tunde Afolabi",
  },
  {
    title: "Healthcare Compliance & Regulation",
    category: "Advanced", duration: "8 Weeks", students: "430", rating: 4.6,
    lessons: 28, price: "$500",
    img: "https://images.unsplash.com/photo-1663549662588-a3c62ff48a3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500&q=80",
    badgeColor: "bg-teal-100 text-teal-700",
    desc: "Navigate the complex regulatory environment governing HMOs globally — international healthcare regulations, data protection laws, and compliance standards.",
    highlights: ["International regulations", "Healthcare compliance", "Data protection", "Audit readiness"],
    instructor: "Barrister Funke Adeyemi",
  },
  {
    title: "HMO Customer Service Excellence",
    category: "Beginner", duration: "3 Weeks", students: "890", rating: 4.7,
    lessons: 12, price: "$200",
    img: "https://images.unsplash.com/photo-1758691462878-6edc3d3da1be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500&q=80",
    badgeColor: "bg-pink-100 text-pink-700",
    desc: "Deliver exceptional member experiences. Learn complaint handling, service quality standards, and communication best practices in managed care.",
    highlights: ["Member experience design", "Complaint resolution", "SLA management", "Communication skills"],
    instructor: "Mrs. Blessing Okonkwo",
  },
  {
    title: "Utilization Management & Care Coordination",
    category: "Advanced", duration: "8 Weeks", students: "320", rating: 4.8,
    lessons: 30, price: "$550",
    img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500&q=80",
    badgeColor: "bg-indigo-100 text-indigo-700",
    desc: "Master utilisation review, pre-authorisation, and care management strategies that balance quality outcomes with cost efficiency.",
    highlights: ["Pre-authorisation", "Utilisation review", "Case management", "Disease management"],
    instructor: "Dr. Chike Nwosu",
  },
];

function CourseCard({ course, slug }: { course: typeof ALL_COURSES[0]; slug: string }) {
  const navigate = useNavigate();
  const { formatPrice, loading } = useLocationPricing();
  
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer border border-gray-100 hover:-translate-y-1 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden shrink-0">
        <ImageWithFallback src={course.img} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${course.badgeColor}`}>{course.category}</span>
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-green-800">{loading ? "..." : formatPrice(course.title)}</div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors leading-snug">{course.title}</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4 flex-1">{course.desc}</p>
        <div className="space-y-1.5 mb-5">
          {course.highlights.map((h, j) => (
            <div key={j} className="flex items-center gap-2 text-xs text-gray-600">
              <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" /> {h}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3 flex-wrap">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
          <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {course.lessons} lessons</span>
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.students}</span>
        </div>
        <div className="text-xs text-gray-400 mb-4">Instructor: <span className="text-gray-700 font-semibold">{course.instructor}</span></div>
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-bold text-gray-800">{course.rating}</span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/course/${slug}`);
            }}
            className="bg-green-700 hover:bg-green-800 text-white text-xs font-bold px-5 py-2 rounded-full transition-colors flex items-center gap-1.5"
          >
            Enroll Now <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Courses() {
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const courseSlugs: Record<string, string> = {
    "Introduction to HMO Operations": "introduction-to-hmo-operations",
    "HMO Claims Management": "hmo-claims-management",
    "Provider Relations & Network Management": "provider-relations-network-management",
    "Health Insurance Fundamentals": "health-insurance-fundamentals",
    "HMO Financial Management": "hmo-financial-management",
    "Healthcare Compliance & Regulation": "healthcare-compliance-regulation",
    "HMO Customer Service Excellence": "hmo-customer-service-excellence",
    "Utilization Management & Care Coordination": "utilization-management-care-coordination",
  };

  const filtered = ALL_COURSES.filter((c) => {
    const matchCat = active === "All" || c.category === c.category;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="font-[Poppins,sans-serif]">
      {/* Header — with background image */}
      <section
        className="py-24 relative overflow-hidden"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1580582932707-520aed937b7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#071a08]/90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center text-white">
          <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-3">Our Curriculum</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">All Courses</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm leading-relaxed">
            Every programme is designed with real HMO workflows in mind — practical, current, and aligned with international healthcare standards.
          </p>
        </div>
      </section>

      {/* Training Programs Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-green-600 font-semibold text-xs uppercase tracking-widest mb-2">Training Programs</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Comprehensive Curriculum</h2>
            <p className="text-gray-500 text-sm max-w-2xl mx-auto">Choose from our specialized training programs designed to equip you with practical, in-demand healthcare management skills.</p>
          </div>

          {/* Mobile carousel */}
          <div className="sm:hidden -mx-4 px-4">
            <MobileCarousel cardWidth="w-[85vw]">
              {[
                {
                  icon: <Stethoscope className="w-6 h-6" />,
                  title: "Health Insurance & HMO Operations",
                  badge: "Core Program",
                  badgeColor: "bg-green-50 text-green-600",
                  desc: "Understand how health insurance works within hospitals and insurance companies — both hospital-side and insurer-side HMO operations.",
                  items: ["Patient Verification & Pre-Authorization", "Claims Preparation & Submission", "Billing & Reconciliation", "Utilization Review", "Provider Relationship Management"]
                },
                {
                  icon: <FileText className="w-6 h-6" />,
                  title: "Hospital Administration",
                  badge: "Popular",
                  badgeColor: "bg-amber-50 text-amber-600",
                  desc: "Learn the administrative systems and workflow of healthcare organizations.",
                  items: ["Front Desk Operations", "Patient Coordination & Scheduling", "Medical Documentation", "Healthcare Communication Systems", "Administrative Workflow"]
                },
                {
                  icon: <BarChart2 className="w-6 h-6" />,
                  title: "Billing, Claims & Reconciliation",
                  badge: "High Demand",
                  badgeColor: "bg-red-50 text-red-600",
                  desc: "Master the financial and operational processes in healthcare billing and claims management.",
                  items: ["Claims Preparation & Submission", "Tariff Understanding", "Reconciliation Techniques", "Revenue Cycle Basics", "Claims Dispute Resolution"]
                },
                {
                  icon: <Monitor className="w-6 h-6" />,
                  title: "Medical Virtual Assistant",
                  badge: "Remote Work",
                  badgeColor: "bg-purple-50 text-purple-600",
                  desc: "Equip yourself to work remotely in healthcare support roles with organizations worldwide.",
                  items: ["Appointment & Calendar Management", "Professional Communication", "Email & Admin Support", "Portfolio Creation", "Remote Healthcare Support"]
                },
                {
                  icon: <Layers className="w-6 h-6" />,
                  title: "EMR / EHR Training",
                  badge: "Digital Skills",
                  badgeColor: "bg-teal-50 text-teal-600",
                  desc: "Get introduced to Electronic Medical Record systems used in modern healthcare facilities.",
                  items: ["Digital Patient Documentation", "Healthcare Data Management", "Electronic Records Workflow", "Data Protection & Confidentiality"]
                }
              ].map((program, i) => (
                <div key={i} className="bg-[#f7faf7] rounded-2xl p-6 border border-gray-100 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-700 text-white rounded-xl flex items-center justify-center shrink-0">
                      {program.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base leading-tight">{program.title}</h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${program.badgeColor}`}>{program.badge}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-4 leading-relaxed">{program.desc}</p>
                  <div className="space-y-2">
                    {program.items.map((item, j) => (
                      <div key={j} className="flex items-start gap-2 text-xs text-gray-600">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </MobileCarousel>
          </div>

          {/* Desktop grid */}
          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Stethoscope className="w-6 h-6" />,
                title: "Health Insurance & HMO Operations",
                badge: "Core Program",
                badgeColor: "bg-green-50 text-green-600",
                desc: "Understand how health insurance works within hospitals and insurance companies — both hospital-side and insurer-side HMO operations.",
                items: ["Patient Verification & Pre-Authorization", "Claims Preparation & Submission", "Billing & Reconciliation", "Utilization Review", "Provider Relationship Management"]
              },
              {
                icon: <FileText className="w-6 h-6" />,
                title: "Hospital Administration",
                badge: "Popular",
                badgeColor: "bg-amber-50 text-amber-600",
                desc: "Learn the administrative systems and workflow of healthcare organizations.",
                items: ["Front Desk Operations", "Patient Coordination & Scheduling", "Medical Documentation", "Healthcare Communication Systems", "Administrative Workflow"]
              },
              {
                icon: <BarChart2 className="w-6 h-6" />,
                title: "Billing, Claims & Reconciliation",
                badge: "High Demand",
                badgeColor: "bg-red-50 text-red-600",
                desc: "Master the financial and operational processes in healthcare billing and claims management.",
                items: ["Claims Preparation & Submission", "Tariff Understanding", "Reconciliation Techniques", "Revenue Cycle Basics", "Claims Dispute Resolution"]
              },
              {
                icon: <Monitor className="w-6 h-6" />,
                title: "Medical Virtual Assistant",
                badge: "Remote Work",
                badgeColor: "bg-purple-50 text-purple-600",
                desc: "Equip yourself to work remotely in healthcare support roles with organizations worldwide.",
                items: ["Appointment & Calendar Management", "Professional Communication", "Email & Admin Support", "Portfolio Creation", "Remote Healthcare Support"]
              },
              {
                icon: <Layers className="w-6 h-6" />,
                title: "EMR / EHR Training",
                badge: "Digital Skills",
                badgeColor: "bg-teal-50 text-teal-600",
                desc: "Get introduced to Electronic Medical Record systems used in modern healthcare facilities.",
                items: ["Digital Patient Documentation", "Healthcare Data Management", "Electronic Records Workflow", "Data Protection & Confidentiality"]
              }
            ].map((program, i) => (
              <div key={i} className="bg-[#f7faf7] rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-700 text-white rounded-xl flex items-center justify-center shrink-0">
                    {program.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base leading-tight">{program.title}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${program.badgeColor}`}>{program.badge}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">{program.desc}</p>
                <div className="space-y-2">
                  {program.items.map((item, j) => (
                    <div key={j} className="flex items-start gap-2 text-xs text-gray-600">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Our Training Works */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <p className="text-green-600 font-semibold text-xs uppercase tracking-widest mb-2">How It Works</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">How Our Training Works</h2>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div className="text-xl sm:text-3xl font-extrabold text-gray-900 mb-1">3 Months</div>
              <div className="text-xs sm:text-sm text-gray-500">Training duration per program</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <Video className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div className="text-xl sm:text-3xl font-extrabold text-gray-900 mb-1">2× Weekly</div>
              <div className="text-xs sm:text-sm text-gray-500">Live online classes every week</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <MonitorPlay className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div className="text-xl sm:text-3xl font-extrabold text-gray-900 mb-1">100% Online</div>
              <div className="text-xs sm:text-sm text-gray-500">Google Classroom & live sessions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility Section */}
      <section className="py-10 bg-[#f7faf7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <p className="text-green-600 font-semibold text-xs uppercase tracking-widest mb-2">Eligibility</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">Who Can Join?</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">No advanced medical background is required for many of our courses. If you are motivated to grow, you are welcome here.</p>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { icon: <Stethoscope className="w-4 h-4" />, label: "Healthcare Professionals" },
                  { icon: <GraduationCap className="w-4 h-4" />, label: "Non-Medical Graduates" },
                  { icon: <Briefcase className="w-4 h-4" />, label: "Job Seekers" },
                  { icon: <RefreshCw className="w-4 h-4" />, label: "Career Switchers" },
                  { icon: <Monitor className="w-4 h-4" />, label: "Remote Work Aspirants" },
                  { icon: <Building2 className="w-4 h-4" />, label: "Hospital Staff" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white rounded-lg p-2.5 border border-gray-100">
                    <div className="w-8 h-8 bg-green-100 text-green-700 rounded-lg flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <span className="text-xs font-semibold text-gray-700 leading-tight">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 text-lg mb-3">What You Stand to Gain</h3>
              <div className="space-y-2.5">
                {[
                  "Practical, in-demand skills healthcare employers actively look for",
                  "Deep understanding of how health insurance really works",
                  "Knowledge to prevent claim rejections and protect hospital revenue",
                  "Administrative and remote work skills for local and international roles",
                  "Increased employability and access to new career pathways",
                  "Certification and potential internship placement opportunities",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-600 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-[#f7faf7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Filter bar */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search courses..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 text-sm outline-none focus:border-green-500 bg-white" />
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {CATEGORIES.map((cat) => (
                <button key={cat} onClick={() => setActive(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${active === cat ? "bg-green-700 text-white shadow-md" : "bg-white text-gray-600 border border-gray-200 hover:border-green-400"}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-gray-400 mb-6">{filtered.length} course{filtered.length !== 1 ? "s" : ""} found</p>

          {/* Mobile carousel */}
          <div className="sm:hidden -mx-4 px-4">
            <MobileCarousel cardWidth="w-[82vw]">
              {filtered.map((course, i) => (
                <div key={i} onClick={() => navigate(`/course/${courseSlugs[course.title]}`)}>
                  <CourseCard course={course} slug={courseSlugs[course.title]} />
                </div>
              ))}
            </MobileCarousel>
          </div>

          {/* Desktop carousel */}
          <div className="hidden sm:block">
            <MobileCarousel cardWidth="w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
              {filtered.map((course, i) => (
                <div key={i} onClick={() => navigate(`/course/${courseSlugs[course.title]}`)}>
                  <CourseCard course={course} slug={courseSlugs[course.title]} />
                </div>
              ))}
            </MobileCarousel>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No courses match your search.</p>
              <p className="text-sm mt-1">Try a different keyword or category.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA strip — background image */}
      <section
        className="py-12 relative overflow-hidden"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1654762549297-2a145fcb9924?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80)",
          backgroundSize: "cover", backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#1b5e20]/92" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Not sure which course to start with?</h2>
          <p className="text-green-200 text-sm mb-6">Book a free 15-minute career consultation and let our advisors guide you to the right programme.</p>
          <button onClick={() => navigate("/contact")} className="bg-white text-green-800 font-bold px-8 py-3 rounded-full hover:bg-green-50 transition-colors text-sm">
            Book a Free Consultation
          </button>
        </div>
      </section>
    </div>
  );
}
