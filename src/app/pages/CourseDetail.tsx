import { useParams, useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useLocationPricing } from "@/app/hooks/useLocationPricing";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import {
  ArrowLeft, Star, Clock, Users, BookOpen, CheckCircle,
  Play, Award, Share2, Bookmark, ChevronRight, Globe,
  Shield, HeartPulse, FileText, BarChart2, Layers,
  Stethoscope, GraduationCap, Briefcase, RefreshCw, Monitor, Building2,
  Calendar, Video, MonitorPlay,
} from "lucide-react";

const ALL_COURSES: Record<string, any> = {
  "introduction-to-hmo-operations": {
    title: "Introduction to HMO Operations",
    category: "Beginner", duration: "6 Weeks", students: "1,240", rating: 4.9,
    lessons: 24,
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    badgeColor: "bg-emerald-100 text-emerald-700",
    desc: "Get a solid foundation in how Health Maintenance Organisations work, from enrolment to benefit administration and regulatory compliance.",
    highlights: ["HMO structure & governance", "Enrolment processes", "Member services", "Healthcare fundamentals"],
    instructor: "Dr. Adebayo Mensah",
    fullDescription: "This comprehensive course provides a deep dive into the world of Health Maintenance Organisations (HMOs). You'll learn about the fundamental structures that govern HMOs, understand enrolment workflows, explore member services best practices, and gain insights into healthcare fundamentals that every HMO professional needs to know.",
    curriculum: [
      { week: "Week 1-2", title: "HMO Fundamentals", topics: ["Introduction to managed care", "HMO types and structures", "Governance models", "Regulatory framework"] },
      { week: "Week 3-4", title: "Enrolment & Membership", topics: ["Enrolment processes", "Eligibility criteria", "Member onboarding", "ID card management"] },
      { week: "Week 5-6", title: "Operations & Compliance", topics: ["Benefit administration", "Claims overview", "Quality assurance", "Compliance requirements"] },
    ],
    requirements: ["Basic understanding of healthcare systems", "Interest in health insurance", "Computer literacy", "English proficiency"],
    outcomes: ["Understand HMO operations end-to-end", "Manage enrolments effectively", "Apply regulatory compliance", "Handle member services professionally"],
  },
  "hmo-claims-management": {
    title: "HMO Claims Management",
    category: "Intermediate", duration: "8 Weeks", students: "980", rating: 4.8,
    lessons: 32,
    img: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    badgeColor: "bg-blue-100 text-blue-700",
    desc: "Master the end-to-end claims processing workflow — from submission and adjudication to fraud detection and appeals management.",
    highlights: ["Claims adjudication", "Fraud detection", "ICD-10 coding basics", "Appeals & disputes"],
    instructor: "Mrs. Ngozi Uchenna",
    fullDescription: "Become an expert in claims management with this comprehensive course covering the entire claims lifecycle. Learn to process claims efficiently, detect fraudulent activities, understand coding standards, and manage appeals and disputes professionally.",
    curriculum: [
      { week: "Week 1-2", title: "Claims Fundamentals", topics: ["Claims workflow overview", "Documentation requirements", "Submission processes", "Timelines and SLAs"] },
      { week: "Week 3-4", title: "Adjudication & Coding", topics: ["Adjudication principles", "ICD-10 basics", "CPT coding introduction", "Reimbursement models"] },
      { week: "Week 5-6", title: "Fraud Detection", topics: ["Fraud indicators", "Investigation techniques", "Prevention strategies", "Case studies"] },
      { week: "Week 7-8", title: "Appeals Management", topics: ["Appeals process", "Dispute resolution", "Legal considerations", "Best practices"] },
    ],
    requirements: ["Basic HMO knowledge", "Attention to detail", "Analytical skills", "Healthcare background preferred"],
    outcomes: ["Process claims efficiently", "Detect and prevent fraud", "Manage appeals professionally", "Ensure compliance with regulations"],
  },
  "provider-relations-network-management": {
    title: "Provider Relations & Network Management",
    category: "Intermediate", duration: "6 Weeks", students: "760", rating: 4.7,
    lessons: 20,
    img: "https://images.unsplash.com/photo-1739285388427-d6f85d12a8fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    badgeColor: "bg-purple-100 text-purple-700",
    desc: "Learn how to build, manage and negotiate with provider networks. Understand capitation models and performance monitoring.",
    highlights: ["Provider contracting", "Capitation models", "Network adequacy", "Performance metrics"],
    instructor: "Mr. Emeka Okafor",
    fullDescription: "Master the art of provider relations and network management. This course covers everything from contracting with healthcare providers to managing network adequacy and monitoring performance metrics.",
    curriculum: [
      { week: "Week 1-2", title: "Network Development", topics: ["Network planning", "Provider recruitment", "Credentialing process", "Contract negotiation"] },
      { week: "Week 3-4", title: "Contract Management", topics: ["Contract types", "Fee schedules", "Capitation models", "Reimbursement structures"] },
      { week: "Week 5-6", title: "Performance & Quality", topics: ["Network adequacy", "Performance metrics", "Quality monitoring", "Provider satisfaction"] },
    ],
    requirements: ["Understanding of healthcare systems", "Negotiation skills", "Analytical mindset", "Communication skills"],
    outcomes: ["Build effective provider networks", "Negotiate contracts successfully", "Monitor provider performance", "Ensure network adequacy"],
  },
  "health-insurance-fundamentals": {
    title: "Health Insurance Fundamentals",
    category: "Beginner", duration: "4 Weeks", students: "1,540", rating: 4.9,
    lessons: 16,
    img: "https://images.unsplash.com/photo-1513258496099-48168024aec0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    badgeColor: "bg-amber-100 text-amber-700",
    desc: "Understand the principles of health insurance — risk pooling, premium calculation, benefit design, and international regulatory frameworks.",
    highlights: ["Insurance principles", "Risk management", "Premium design", "Regulatory compliance"],
    instructor: "Dr. Aisha Musa",
    fullDescription: "Gain a solid understanding of health insurance principles and how they apply globally. Learn about risk pooling, premium calculations, benefit design, and the regulatory frameworks that govern health insurance worldwide.",
    curriculum: [
      { week: "Week 1", title: "Insurance Principles", topics: ["Risk pooling concepts", "Insurance types", "Underwriting basics", "Actuarial fundamentals"] },
      { week: "Week 2", title: "Premium & Benefits", topics: ["Premium calculation", "Benefit design", "Deductibles and co-pays", "Coverage options"] },
      { week: "Week 3", title: "Regulatory Framework", topics: ["International regulations", "Compliance requirements", "Market conduct", "Consumer protection"] },
      { week: "Week 4", title: "Global Perspectives", topics: ["International systems", "Comparative analysis", "Best practices", "Future trends"] },
    ],
    requirements: ["No prior insurance knowledge required", "Basic mathematics", "Interest in finance", "English proficiency"],
    outcomes: ["Understand insurance fundamentals", "Calculate premiums", "Design benefit plans", "Navigate regulatory requirements"],
  },
  "hmo-financial-management": {
    title: "HMO Financial Management",
    category: "Advanced", duration: "10 Weeks", students: "540", rating: 4.8,
    lessons: 40,
    img: "https://images.unsplash.com/photo-1762341117487-dbc411bcf574?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    badgeColor: "bg-red-100 text-red-700",
    desc: "Advanced financial operations for HMO professionals — budgeting, actuarial basics, reserve management, and financial reporting.",
    highlights: ["Actuarial basics", "Reserve management", "Financial reporting", "Cost control strategies"],
    instructor: "Mr. Tunde Afolabi",
    fullDescription: "Take your financial management skills to the next level with this advanced course covering budgeting, actuarial principles, reserve management, and comprehensive financial reporting for HMOs.",
    curriculum: [
      { week: "Week 1-2", title: "Financial Planning", topics: ["Budgeting processes", "Financial forecasting", "Revenue cycle management", "Cost allocation"] },
      { week: "Week 3-4", title: "Actuarial Fundamentals", topics: ["Actuarial principles", "Risk assessment", "Premium rating", "Reserve calculations"] },
      { week: "Week 5-6", title: "Reserve Management", topics: ["Reserve requirements", "Regulatory standards", "Investment strategies", "Liquidity management"] },
      { week: "Week 7-8", title: "Financial Reporting", topics: ["Financial statements", "Regulatory reporting", "Performance metrics", "Audit preparation"] },
      { week: "Week 9-10", title: "Cost Control", topics: ["Cost analysis", "Efficiency improvement", "Vendor management", "Strategic planning"] },
    ],
    requirements: ["Financial management experience", "HMO operations knowledge", "Analytical skills", "Excel proficiency"],
    outcomes: ["Create comprehensive budgets", "Apply actuarial principles", "Manage reserves effectively", "Prepare financial reports"],
  },
  "healthcare-compliance-regulation": {
    title: "Healthcare Compliance & Regulation",
    category: "Advanced", duration: "8 Weeks", students: "430", rating: 4.6,
    lessons: 28,
    img: "https://images.unsplash.com/photo-1663549662588-a3c62ff48a3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    badgeColor: "bg-teal-100 text-teal-700",
    desc: "Navigate the complex regulatory environment governing HMOs globally — international healthcare regulations, data protection laws, and compliance standards.",
    highlights: ["International regulations", "Healthcare compliance", "Data protection", "Audit readiness"],
    instructor: "Barrister Funke Adeyemi",
    fullDescription: "Master the complex world of healthcare compliance and regulation. This course covers international healthcare regulations, data protection laws, compliance standards, and audit preparation for HMOs.",
    curriculum: [
      { week: "Week 1-2", title: "Regulatory Framework", topics: ["International regulations", "National compliance", "Accreditation standards", "Legal requirements"] },
      { week: "Week 3-4", title: "Data Protection", topics: ["HIPAA compliance", "GDPR requirements", "Data security", "Privacy laws"] },
      { week: "Week 5-6", title: "Compliance Management", topics: ["Compliance programs", "Risk assessment", "Policy development", "Training programs"] },
      { week: "Week 7-8", title: "Audit & Monitoring", topics: ["Audit preparation", "Monitoring processes", "Corrective actions", "Documentation requirements"] },
    ],
    requirements: ["Legal or compliance background", "Attention to detail", "Research skills", "Experience in healthcare"],
    outcomes: ["Navigate regulatory requirements", "Implement compliance programs", "Prepare for audits", "Manage data protection"],
  },
  "hmo-customer-service-excellence": {
    title: "HMO Customer Service Excellence",
    category: "Beginner", duration: "3 Weeks", students: "890", rating: 4.7,
    lessons: 12,
    img: "https://images.unsplash.com/photo-1758691462878-6edc3d3da1be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    badgeColor: "bg-pink-100 text-pink-700",
    desc: "Deliver exceptional member experiences. Learn complaint handling, service quality standards, and communication best practices in managed care.",
    highlights: ["Member experience design", "Complaint resolution", "SLA management", "Communication skills"],
    instructor: "Mrs. Blessing Okonkwo",
    fullDescription: "Learn to deliver exceptional customer service in HMO settings. This course covers member experience design, complaint resolution, service level agreement management, and professional communication skills.",
    curriculum: [
      { week: "Week 1", title: "Customer Service Fundamentals", topics: ["Service excellence principles", "Member expectations", "Communication skills", "Professional etiquette"] },
      { week: "Week 2", title: "Complaint Management", topics: ["Complaint handling process", "Resolution techniques", "Escalation procedures", "Documentation"] },
      { week: "Week 3", title: "Service Quality", topics: ["SLA management", "Quality metrics", "Continuous improvement", "Best practices"] },
    ],
    requirements: ["Customer service experience", "Communication skills", "Problem-solving ability", "Empathy and patience"],
    outcomes: ["Deliver excellent service", "Handle complaints effectively", "Manage SLAs", "Improve member satisfaction"],
  },
  "utilization-management-care-coordination": {
    title: "Utilization Management & Care Coordination",
    category: "Advanced", duration: "8 Weeks", students: "320", rating: 4.8,
    lessons: 30,
    img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    badgeColor: "bg-indigo-100 text-indigo-700",
    desc: "Master utilisation review, pre-authorisation, and care management strategies that balance quality outcomes with cost efficiency.",
    highlights: ["Pre-authorisation", "Utilisation review", "Case management", "Disease management"],
    instructor: "Dr. Chike Nwosu",
    fullDescription: "Develop expertise in utilization management and care coordination. Learn to conduct utilization reviews, manage pre-authorizations, and implement care management strategies that optimize both quality and cost.",
    curriculum: [
      { week: "Week 1-2", title: "Utilization Review", topics: ["UR principles", "Review criteria", "Clinical guidelines", "Decision-making processes"] },
      { week: "Week 3-4", title: "Pre-Authorization", topics: ["Authorization process", "Clinical criteria", "Documentation requirements", "Appeals process"] },
      { week: "Week 5-6", title: "Case Management", topics: ["Case management models", "Care planning", "Coordination strategies", "Outcome tracking"] },
      { week: "Week 7-8", title: "Disease Management", topics: ["Chronic care programs", "Population health", "Quality metrics", "Cost optimization"] },
    ],
    requirements: ["Clinical background preferred", "Case management experience", "Analytical skills", "Healthcare certification"],
    outcomes: ["Conduct utilization reviews", "Manage authorizations", "Coordinate patient care", "Implement disease management programs"],
  },
};

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { formatPrice, loading } = useLocationPricing();
  const [activeTab, setActiveTab] = useState("overview");
  const [isBookmarked, setIsBookmarked] = useState(false);

  const course = slug ? ALL_COURSES[slug] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-8">The course you're looking for doesn't exist.</p>
          <button onClick={() => navigate("/courses")} className="bg-green-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-800">
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  const relatedCourses = Object.values(ALL_COURSES)
    .filter(c => c.title !== course.title && c.category === course.category)
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="font-[Poppins,sans-serif]"
    >
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback src={course.img} alt={course.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-end pb-16">
          <div className="text-white max-w-3xl">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-green-300 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-semibold">Back to Courses</span>
            </button>
            
            <span className={`inline-block text-xs font-bold px-3 py-1.5 rounded-full ${course.badgeColor} bg-white/90 text-gray-800 mb-4`}>
              {course.category}
            </span>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
              {course.title}
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-200 mb-6 leading-relaxed">
              {course.desc}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="font-bold">{course.rating}</span>
                <span className="text-gray-300">({course.students} students)</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="w-4 h-4" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <BookOpen className="w-4 h-4" />
                <span>{course.lessons} lessons</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Users className="w-4 h-4" />
                <span>{course.students} enrolled</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Course Info */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="flex gap-2 mb-8 border-b border-gray-200">
                {["overview", "curriculum", "requirements", "outcomes"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 text-sm font-semibold capitalize transition-colors relative ${
                      activeTab === tab
                        ? "text-green-700"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-700"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === "overview" && (
                  <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-6">About This Course</h2>
                    <p className="text-gray-600 leading-relaxed mb-8 text-base">
                      {course.fullDescription}
                    </p>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Instructor</h3>
                    <div className="flex items-start gap-4 bg-gray-50 p-6 rounded-2xl mb-8">
                      <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0">
                        {course.instructor.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{course.instructor}</h4>
                        <p className="text-gray-600 text-sm mt-1">Expert Instructor</p>
                        <p className="text-gray-500 text-sm mt-2">Industry professional with extensive experience in HMO operations and healthcare management.</p>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-4">Key Highlights</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {course.highlights.map((highlight: string, i: number) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "curriculum" && (
                  <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Course Curriculum</h2>
                    <div className="space-y-6">
                      {course.curriculum.map((module: any, i: number) => (
                        <div key={i} className="border border-gray-200 rounded-2xl p-6 hover:border-green-300 transition-colors">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
                              {i + 1}
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-green-700 font-semibold mb-1">{module.week}</div>
                              <h3 className="text-lg font-bold text-gray-900 mb-3">{module.title}</h3>
                              <ul className="space-y-2">
                                {module.topics.map((topic: string, j: number) => (
                                  <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                                    <Play className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                                    <span>{topic}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "requirements" && (
                  <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Requirements</h2>
                    <p className="text-gray-600 mb-6">To get the most out of this course, we recommend having the following:</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {course.requirements.map((req: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
                          <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "outcomes" && (
                  <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-6">What You'll Learn</h2>
                    <p className="text-gray-600 mb-6">By the end of this course, you will be able to:</p>
                    <div className="space-y-4">
                      {course.outcomes.map((outcome: string, i: number) => (
                        <div key={i} className="flex items-start gap-4 bg-green-50 p-5 rounded-xl border border-green-100">
                          <div className="w-8 h-8 bg-green-700 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                            {i + 1}
                          </div>
                          <span className="text-gray-800 font-medium">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Column - Sticky Enrollment Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Price Card */}
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg">
                  <div className="text-center mb-6">
                    <div className="text-sm text-gray-500 mb-2">Course Price</div>
                    <div className="text-4xl font-extrabold text-gray-900 mb-2">
                      {loading ? "..." : formatPrice(course.title)}
                    </div>
                    <div className="text-xs text-gray-500">One-time payment • Lifetime access</div>
                  </div>

                  <button className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-full transition-colors mb-3 flex items-center justify-center gap-2">
                    Enroll Now <ArrowRight className="w-5 h-5" />
                  </button>

                  <button className="w-full border-2 border-gray-200 hover:border-green-700 text-gray-700 font-semibold py-3 rounded-full transition-colors mb-6">
                    Try Free Preview
                  </button>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-gray-600">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                      <span>Full lifetime access</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                      <span>{course.lessons} lessons on-demand</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                      <span>Access on mobile and desktop</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full border-2 transition-colors ${
                      isBookmarked
                        ? "bg-green-50 border-green-700 text-green-700"
                        : "border-gray-200 text-gray-700 hover:border-green-700"
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
                    <span className="text-sm font-semibold">Save</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full border-2 border-gray-200 text-gray-700 hover:border-green-700 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm font-semibold">Share</span>
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-green-700" />
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">Secure Payment</div>
                      <div className="text-xs text-gray-500">SSL encrypted checkout</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-green-700" />
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">Industry Recognized</div>
                      <div className="text-xs text-gray-500">Globally accepted certificate</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-6 h-6 text-green-700" />
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">Global Access</div>
                      <div className="text-xs text-gray-500">Learn from anywhere</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Courses */}
      {relatedCourses.length > 0 && (
        <section className="py-16 bg-[#f7faf7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Related Courses</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedCourses.map((relatedCourse, i) => (
                <Link
                  key={i}
                  to={`/course/${Object.keys(ALL_COURSES).find(key => ALL_COURSES[key].title === relatedCourse.title)}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-gray-100 hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback src={relatedCourse.img} alt={relatedCourse.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${relatedCourse.badgeColor}`}>
                      {relatedCourse.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                      {relatedCourse.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{relatedCourse.desc}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-bold text-gray-800">{relatedCourse.rating}</span>
                      </div>
                      <span className="text-green-700 font-semibold text-sm flex items-center gap-1">
                        View Course <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </motion.div>
  );
}