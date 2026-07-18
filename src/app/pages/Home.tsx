import { useNavigate } from "react-router";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { MobileCarousel } from "@/app/components/MobileCarousel";
import {
  ArrowRight, Play, CheckCircle, Star, Users, BookOpen,
  Award, Clock, Shield, HeartPulse, FileText, BarChart2,
  Layers, Briefcase, TrendingUp, ChevronRight, Quote, Globe,
} from "lucide-react";

/* ── Data ─────────────────────────────────────────────────── */
const PARTNERS = [
  "UnitedHealth Group", "Anthem Inc.", "Cigna Healthcare",
  "Aetna", "Humana", "Kaiser Permanente",
];

const COURSES = [
  {
    title: "Introduction to HMO Operations",
    category: "Beginner",
    duration: "6 Weeks", students: "1,240", rating: 4.9, lessons: 24,
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500&q=80",
    badgeColor: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "HMO Claims Management",
    category: "Intermediate",
    duration: "8 Weeks", students: "980", rating: 4.8, lessons: 32,
    img: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500&q=80",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  {
    title: "Provider Relations & Network Management",
    category: "Intermediate",
    duration: "6 Weeks", students: "760", rating: 4.7, lessons: 20,
    img: "https://images.unsplash.com/photo-1739285388427-d6f85d12a8fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500&q=80",
    badgeColor: "bg-purple-100 text-purple-700",
  },
  {
    title: "Health Insurance Fundamentals",
    category: "Beginner",
    duration: "4 Weeks", students: "1,540", rating: 4.9, lessons: 16,
    img: "https://images.unsplash.com/photo-1513258496099-48168024aec0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500&q=80",
    badgeColor: "bg-amber-100 text-amber-700",
  },
  {
    title: "HMO Financial Management",
    category: "Advanced",
    duration: "10 Weeks", students: "540", rating: 4.8, lessons: 40,
    img: "https://images.unsplash.com/photo-1762341117487-dbc411bcf574?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500&q=80",
    badgeColor: "bg-red-100 text-red-700",
  },
  {
    title: "Healthcare Compliance & Regulation",
    category: "Advanced",
    duration: "8 Weeks", students: "430", rating: 4.6, lessons: 28,
    img: "https://images.unsplash.com/photo-1663549662588-a3c62ff48a3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500&q=80",
    badgeColor: "bg-teal-100 text-teal-700",
  },
];

const STATS = [
  { value: "500+", label: "Students Trained", icon: <Users className="w-6 h-6" /> },
  { value: "50+", label: "Expert-Led Courses", icon: <BookOpen className="w-6 h-6" /> },
  { value: "15+", label: "Industry Instructors", icon: <Award className="w-6 h-6" /> },
  { value: "95%", label: "Completion Rate", icon: <TrendingUp className="w-6 h-6" /> },
  { value: "98%", label: "Student Satisfaction", icon: <Star className="w-6 h-6" /> },
];

const BENEFITS = [
  "Globally-aligned curriculum for healthcare systems worldwide",
  "Practical, scenario-based learning modules",
  "Expert instructors with active HMO experience",
  "Flexible self-paced online learning",
  "Industry-recognised digital certificates",
  "Dedicated job placement and career support",
  "Live virtual classes and recorded replays",
  "Access to exclusive HMO professional community",
];

const JOURNEY = [
  { step: "01", title: "Create Your Account", desc: "Sign up for free in under 2 minutes and access your personalised student dashboard.", icon: <Users className="w-7 h-7" /> },
  { step: "02", title: "Choose a Course", desc: "Browse our curated HMO curriculum and pick the programme that fits your career goals.", icon: <BookOpen className="w-7 h-7" /> },
  { step: "03", title: "Start Learning", desc: "Engage with HD video lessons, quizzes, case studies, and live sessions at your own pace.", icon: <Play className="w-7 h-7" /> },
  { step: "04", title: "Get Certified", desc: "Complete your programme and earn your industry-recognised HMO Operations certificate.", icon: <Award className="w-7 h-7" /> },
];

const TESTIMONIALS = [
  {
    name: "Sarah Johnson", role: "Claims Officer, UnitedHealth", avatar: "SJ", rating: 5,
    text: "Kalaro gave me the practical knowledge I needed to excel in my role. The instructors are seasoned professionals who truly understand the global HMO landscape.",
  },
  {
    name: "Michael Chen", role: "Provider Relations Manager", avatar: "MC", rating: 5,
    text: "I went from knowing nothing about HMO operations to landing a manager role in just 6 months. The curriculum is comprehensive, current, and career-focused.",
  },
  {
    name: "Emily Rodriguez", role: "Health Insurance Analyst", avatar: "ER", rating: 5,
    text: "The flexibility of online learning combined with expert mentorship made all the difference. I highly recommend Kalaro to anyone in healthcare administration.",
  },
];

const BLOG_POSTS = [
  {
    category: "Industry Insight",
    title: "Understanding Global Health Insurance Frameworks: What Every HMO Professional Must Know",
    date: "June 12, 2025", readTime: "5 min read",
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    category: "Career Tips",
    title: "Top 7 Skills That Will Get You Hired at Any HMO Worldwide Right Now",
    date: "May 28, 2025", readTime: "4 min read",
    img: "https://images.unsplash.com/photo-1762341117487-dbc411bcf574?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    category: "Student Story",
    title: "From Nurse to HMO Manager: How Kalaro Changed My Career Trajectory",
    date: "May 10, 2025", readTime: "6 min read",
    img: "https://images.unsplash.com/photo-1758691462878-6edc3d3da1be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
];

/* ── Sub-components ───────────────────────────────────────── */
function CourseCard({ title, category, duration, students, rating, lessons, img, badgeColor, onNavigate }: any) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer border border-gray-100 hover:-translate-y-1 h-full flex flex-col">
      <div className="relative h-44 overflow-hidden shrink-0">
        <ImageWithFallback src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${badgeColor}`}>{category}</span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-3 group-hover:text-green-700 transition-colors flex-1">{title}</h3>
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {duration}</span>
          <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {lessons} lessons</span>
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-bold text-gray-800">{rating}</span>
            <span className="text-xs text-gray-400">({students})</span>
          </div>
          <button onClick={onNavigate} className="text-xs font-bold text-green-700 hover:text-green-800 flex items-center gap-1">
            Enroll <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

function JourneyCard({ step, title, desc, icon }: any) {
  return (
    <div className="flex flex-col items-center text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 relative h-full">
      <div className="absolute -top-3 right-4 bg-green-400 text-green-900 text-xs font-extrabold px-2.5 py-1 rounded-full">{step}</div>
      <div className="w-20 h-20 rounded-full bg-white text-green-700 flex items-center justify-center mb-5 shadow-lg">{icon}</div>
      <h3 className="font-bold text-white text-base mb-2">{title}</h3>
      <p className="text-green-100 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function TestimonialCard({ name, role, avatar, rating, text }: any) {
  return (
    <div className="bg-white rounded-2xl p-7 border border-green-100 relative hover:shadow-md transition-shadow h-full flex flex-col">
      <Quote className="w-8 h-8 text-green-200 absolute top-5 right-5" />
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: rating }).map((_, s) => <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
      </div>
      <p className="text-gray-600 text-sm leading-relaxed mb-6 italic flex-1">"{text}"</p>
      <div className="flex items-center gap-3 border-t border-green-100 pt-4">
        <div className="w-11 h-11 rounded-full bg-green-700 text-white font-bold text-sm flex items-center justify-center shrink-0">{avatar}</div>
        <div>
          <div className="font-bold text-gray-900 text-sm">{name}</div>
          <div className="text-xs text-gray-500">{role}</div>
        </div>
      </div>
    </div>
  );
}

function BlogCard({ category, title, date, readTime, img }: any) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group cursor-pointer border border-gray-100 hover:-translate-y-1 h-full flex flex-col">
      <div className="h-44 overflow-hidden shrink-0">
        <ImageWithFallback src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full self-start">{category}</span>
        <h3 className="font-bold text-gray-900 text-sm mt-3 mb-3 leading-snug group-hover:text-green-700 transition-colors flex-1">{title}</h3>
        <div className="flex items-center gap-3 text-xs text-gray-400 mt-auto">
          <span>{date}</span><span>·</span><span>{readTime}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="font-[Poppins,sans-serif]">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative bg-[#071a08] min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-green-900/30 blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-green-800/20 blur-[100px] translate-x-1/4 translate-y-1/4" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center w-full">
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-green-900/60 border border-green-700/40 text-green-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-7">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shrink-0" />
              Global Healthcare Education & Career Platform
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.12] mb-6">
              Learn. Practice.<br />
              <span className="text-green-400">Get Certified.</span><br />
              Get Hired. Go Global.
            </h1>
            <p className="text-gray-300 text-base sm:text-lg max-w-lg mb-8 leading-relaxed">
              Advance your career with world-class training in HMO Operations, Hospital Administration, Medical Virtual Assistance, AI for Healthcare, and more. Gain hands-on experience with our EMR & HMO Simulation Lab, earn globally recognized certificates, access career support, and connect to opportunities worldwide.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <button onClick={() => navigate("/courses")} className="bg-green-500 hover:bg-green-400 active:scale-95 text-white font-bold px-8 py-3.5 rounded-full transition-all flex items-center gap-2 shadow-lg shadow-green-900/40 text-sm">
                Explore Courses <ArrowRight className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-3 text-white font-medium text-sm group">
                <span className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-colors shrink-0">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </span>
                Watch How It Works
              </button>
            </div>
            <div className="flex flex-wrap gap-5 text-sm text-gray-400 border-t border-white/10 pt-8">
              {["Globally Recognized Certificates", "Industry Certified", "Job Placement Support", "Flexible Learning for All", "Trusted by Learners Worldwide"].map((t) => (
                <span key={t} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 shrink-0" /> {t}
                </span>
              ))}
            </div>
          </div>
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[420px]">
              <div className="absolute -inset-3 rounded-3xl border border-green-700/30 rotate-1" />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1611432579402-7037e3e2c1e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=700&q=80"
                alt="Healthcare professional with tablet"
                className="w-full h-[500px] object-cover object-top rounded-2xl relative z-10"
              />
              
              {/* Stats overlay - top left */}
              <div className="absolute -left-8 top-[15%] z-20 bg-white rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-gray-900 leading-none">500+</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Students Enrolled<br />Worldwide</div>
                </div>
              </div>

              {/* Countries reached - top right */}
              <div className="absolute -right-6 top-[8%] z-20 bg-white rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-gray-900 leading-none">20+</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Countries<br />Reached</div>
                </div>
              </div>

              {/* Expert instructors - middle left */}
              <div className="absolute -left-8 top-[38%] z-20 bg-white rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-gray-900 leading-none">50+</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Expert<br />Instructors</div>
                </div>
              </div>

              {/* Courses & CPD Programs - middle right */}
              <div className="absolute -right-6 top-[35%] z-20 bg-white rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-gray-900 leading-none">100+</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Courses & CPD<br />Programs</div>
                </div>
              </div>

              {/* AI + EMR Simulation Lab - bottom left */}
              <div className="absolute -left-8 bottom-[22%] z-20 bg-white rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-gray-900 leading-none">AI + EMR</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Simulation<br />Lab</div>
                </div>
              </div>

              {/* Rating - bottom right */}
              <div className="absolute -right-6 bottom-[20%] z-20 bg-white rounded-2xl shadow-2xl px-4 py-3">
                <div className="flex items-center gap-1 mb-1">
                  {[1,2,3,4,5].map((i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                </div>
                <div className="text-sm font-extrabold text-gray-900">4.9 / 5 Rating</div>
                <div className="text-[11px] text-gray-500">From 500+ reviews</div>
              </div>

              {/* Industry Certified badge - bottom center */}
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-20 bg-green-600 rounded-2xl shadow-xl px-5 py-3 text-white flex items-center gap-3">
                <Award className="w-8 h-8 text-green-200" />
                <div>
                  <div className="font-bold text-sm">Industry Certified</div>
                  <div className="text-xs text-green-200">Recognised Worldwide</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path d="M0 60L1440 60L1440 20C1080 60 360 0 0 20L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── TRUSTED BY ────────────────────────────────────────── */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-7">
            Trusted by graduates working at leading HMOs worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-14">
            {PARTNERS.map((name) => (
              <span key={name} className="text-gray-400 font-bold text-sm tracking-wide hover:text-green-700 transition-colors cursor-default">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOP COURSES ───────────────────────────────────────── */}
      <section className="py-20 bg-[#f7faf7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-green-600 font-semibold text-xs uppercase tracking-widest mb-2">Our Curriculum</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Explore Our Top Courses</h2>
              <p className="text-gray-500 mt-3 max-w-xl text-sm leading-relaxed">
                Every programme is built around real HMO workflows, international regulatory standards, and the operational challenges faced daily in managed care.
              </p>
            </div>
            <button onClick={() => navigate("/courses")} className="hidden sm:flex items-center gap-2 text-green-700 font-bold text-sm border-2 border-green-700 px-5 py-2.5 rounded-full hover:bg-green-50 transition-colors shrink-0">
              View All Courses <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile carousel */}
          <div className="sm:hidden -mx-4 px-4">
            <MobileCarousel cardWidth="w-[78vw]">
              {COURSES.map((c, i) => (
                <CourseCard key={i} {...c} onNavigate={() => navigate("/courses")} />
              ))}
            </MobileCarousel>
          </div>

          {/* Desktop grid */}
          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSES.map((c, i) => (
              <CourseCard key={i} {...c} onNavigate={() => navigate("/courses")} />
            ))}
          </div>

          <div className="text-center mt-10 sm:hidden">
            <button onClick={() => navigate("/courses")} className="inline-flex items-center gap-2 text-green-700 font-bold text-sm border-2 border-green-700 px-6 py-2.5 rounded-full hover:bg-green-50 transition-colors">
              View All Courses <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS BAND — with background image ────────────────── */}
      <section
        className="py-16 relative overflow-hidden"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1654762549297-2a145fcb9924?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark green overlay */}
        <div className="absolute inset-0 bg-[#1b5e20]/90" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center text-white">
            {STATS.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-green-300 mb-1">{s.icon}</div>
                <span className="text-4xl font-extrabold text-white">{s.value}</span>
                <span className="text-xs text-green-200 font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUALITY EDUCATION ─────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1610484826967-09c5720778c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=700&q=80"
                  alt="Student learning online"
                  className="w-full h-[520px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-green-900/30 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-4 bg-white rounded-2xl shadow-xl p-5 border border-gray-100">
                <div className="text-3xl font-extrabold text-green-700">5+</div>
                <div className="text-xs text-gray-500 font-medium mt-1">Years of Excellence<br />in HMO Training</div>
              </div>
              <div className="absolute -top-4 -left-4 w-28 h-28 opacity-20"
                style={{ backgroundImage: "radial-gradient(circle, #1b5e20 1.5px, transparent 1.5px)", backgroundSize: "10px 10px" }} />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-green-600 font-semibold text-xs uppercase tracking-widest mb-3">Why Choose Kalaro</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">Quality Education.</h2>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-green-700 mb-6 leading-tight">Practical Impact.</h2>
              <p className="text-gray-500 mb-8 leading-relaxed text-sm">
                We don't teach theory in isolation. Every module is built around real HMO workflows, regulatory frameworks, and operational challenges faced daily in healthcare systems worldwide.
              </p>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 mb-10">
                {BENEFITS.map((b, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{b}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate("/about")} className="bg-green-700 hover:bg-green-800 text-white font-bold px-8 py-3.5 rounded-full transition-colors flex items-center gap-2 shadow-md shadow-green-200 text-sm">
                More About Us <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── LEARNING JOURNEY — with background image ──────────── */}
      <section
        className="py-20 relative overflow-hidden"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1580582932707-520aed937b7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#071a08]/88" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-green-400 font-semibold text-xs uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Your Learning Journey, <span className="text-green-400">Simplified</span>
            </h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto text-sm">
              Four simple steps from signup to certification.
            </p>
          </div>

          {/* Mobile carousel */}
          <div className="sm:hidden -mx-4 px-4">
            <MobileCarousel cardWidth="w-[78vw]">
              {JOURNEY.map((s, i) => <JourneyCard key={i} {...s} />)}
            </MobileCarousel>
          </div>

          {/* Desktop grid */}
          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-6">
            {JOURNEY.map((s, i) => <JourneyCard key={i} {...s} />)}
          </div>

          <div className="text-center mt-12">
            <button onClick={() => navigate("/signup")} className="bg-green-500 hover:bg-green-400 text-white font-bold px-10 py-3.5 rounded-full transition-colors text-sm shadow-md">
              Start Your Journey Today
            </button>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS — with background image ──────────────── */}
      <section
        className="py-20 relative overflow-hidden"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1777703304166-d7713ec85de0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-white/95" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-green-600 font-semibold text-xs uppercase tracking-widest mb-3">Success Stories</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">What Our Students Say</h2>
          </div>

          {/* Mobile carousel */}
          <div className="sm:hidden -mx-4 px-4">
            <MobileCarousel cardWidth="w-[82vw]">
              {TESTIMONIALS.map((t, i) => <TestimonialCard key={i} {...t} />)}
            </MobileCarousel>
          </div>

          {/* Desktop grid */}
          <div className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => <TestimonialCard key={i} {...t} />)}
          </div>
        </div>
      </section>

      {/* ── BLOG PREVIEW ──────────────────────────────────────── */}
      <section className="py-20 bg-[#f7faf7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-green-600 font-semibold text-xs uppercase tracking-widest mb-2">Resources</p>
              <h2 className="text-3xl font-extrabold text-gray-900">Latest From Our Blog</h2>
            </div>
            <button className="hidden sm:flex items-center gap-2 text-green-700 font-bold text-sm shrink-0 hover:underline">
              View All Posts <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile carousel */}
          <div className="sm:hidden -mx-4 px-4">
            <MobileCarousel cardWidth="w-[78vw]">
              {BLOG_POSTS.map((p, i) => <BlogCard key={i} {...p} />)}
            </MobileCarousel>
          </div>

          {/* Desktop grid */}
          <div className="hidden sm:grid grid-cols-3 gap-6">
            {BLOG_POSTS.map((p, i) => <BlogCard key={i} {...p} />)}
          </div>
        </div>
      </section>

      {/* ── CAREERS CTA — with background image ───────────────── */}
      <section
        className="py-24 relative overflow-hidden"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1739298061768-41a8a7d8b38f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div className="absolute inset-0 bg-[#071a08]/92" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <p className="text-green-400 font-semibold text-xs uppercase tracking-widest mb-3">Career Corner</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight">Explore Jobs.<br />Grow Your Career.</h2>
              <p className="text-gray-400 mb-8 leading-relaxed text-sm max-w-lg">
                Access exclusive HMO job listings from top healthcare organisations worldwide. Our graduates get priority placement, career coaching, and direct introductions to hiring managers.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
{[
  { v: "200+", l: "Job Placements" },
  { v: "50+", l: "Partner Employers" },
  { v: "85%", l: "Hired Within 3 Months" },
  { v: "$45K+", l: "Avg. Starting Salary" },
].map((s, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="text-2xl font-extrabold text-green-400">{s.v}</div>
                    <div className="text-xs text-gray-400 mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => navigate("/careers")} className="bg-green-500 hover:bg-green-400 text-white font-bold px-7 py-3.5 rounded-full text-sm flex items-center gap-2 transition-all">
                  Browse Job Board <Briefcase className="w-4 h-4" />
                </button>
                <button className="border-2 border-green-700 text-green-300 hover:bg-green-900/30 font-bold px-7 py-3.5 rounded-full text-sm transition-all">
                  Post a Job
                </button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=550&q=80"
                  alt="Professional at desk"
                  className="w-[360px] h-[400px] object-cover rounded-3xl shadow-2xl"
                />
                <div className="absolute -bottom-5 -left-5 bg-green-500 rounded-2xl px-5 py-4 text-white shadow-xl">
                  <div className="text-2xl font-extrabold">200+</div>
                  <div className="text-xs font-medium text-green-100">Successful Placements</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
