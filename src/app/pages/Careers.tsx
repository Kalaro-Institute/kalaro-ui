import { useState } from "react";
import { MobileCarousel } from "@/app/components/MobileCarousel";
import { useNavigate } from "react-router";
import {
  Briefcase, MapPin, ArrowRight, Search, CheckCircle,
  TrendingUp, Users, Star, Building2,
} from "lucide-react";

const JOB_CATEGORIES = ["All", "Claims", "Provider Relations", "Customer Service", "Finance", "Compliance", "Management"];

const JOBS = [
  { title: "Claims Processing Officer", company: "UnitedHealth Group", location: "Remote", type: "Full-time", category: "Claims", salary: "$1,200 – $1,600/mo", posted: "2 days ago", logo: "UH", logoColor: "bg-blue-600", tags: ["Entry Level", "Remote"], desc: "Process and adjudicate member claims in line with international guidelines. Review medical reports and ensure timely reimbursement to providers." },
  { title: "Provider Relations Executive", company: "Anthem Inc.", location: "Hybrid", type: "Full-time", category: "Provider Relations", salary: "$1,500 – $2,000/mo", posted: "3 days ago", logo: "AI", logoColor: "bg-green-700", tags: ["Mid Level", "Hybrid"], desc: "Manage relationships with healthcare providers across the network. Negotiate contracts and monitor service quality metrics." },
  { title: "Health Insurance Customer Care Rep", company: "Cigna Healthcare", location: "Remote", type: "Full-time", category: "Customer Service", salary: "$800 – $1,100/mo", posted: "1 day ago", logo: "CH", logoColor: "bg-purple-700", tags: ["Entry Level", "Remote"], desc: "Handle member enquiries, complaints, and service requests. Ensure prompt resolution and high member satisfaction scores." },
  { title: "HMO Finance & Accounts Officer", company: "Aetna", location: "Hybrid", type: "Full-time", category: "Finance", salary: "$1,300 – $1,700/mo", posted: "5 days ago", logo: "AE", logoColor: "bg-amber-700", tags: ["Mid Level", "Hybrid"], desc: "Manage capitation payments, provider reconciliations, and monthly financial reports. Support internal and external audit activities." },
  { title: "Compliance & Regulatory Affairs Manager", company: "Humana", location: "Remote", type: "Full-time", category: "Compliance", salary: "$2,200 – $3,000/mo", posted: "1 week ago", logo: "HU", logoColor: "bg-teal-700", tags: ["Senior Level", "Remote"], desc: "Oversee healthcare compliance, lead audit readiness, and develop internal policy frameworks." },
  { title: "HMO Operations Manager", company: "Kaiser Permanente", location: "Hybrid", type: "Full-time", category: "Management", salary: "$2,800 – $3,800/mo", posted: "4 days ago", logo: "KP", logoColor: "bg-orange-600", tags: ["Senior Level", "Hybrid"], desc: "Lead day-to-day HMO operations including enrolment, claims, provider management and team performance. Report to the COO." },
  { title: "Utilisation Management Nurse", company: "UnitedHealth Group", location: "Remote", type: "Full-time", category: "Claims", salary: "$1,400 – $1,800/mo", posted: "3 days ago", logo: "UH", logoColor: "bg-blue-600", tags: ["Mid Level", "Remote"], desc: "Review pre-authorisation requests and manage concurrent review of inpatient stays. Collaborate with clinical teams." },
  { title: "Network Adequacy Analyst", company: "Anthem Inc.", location: "Remote", type: "Contract", category: "Provider Relations", salary: "$900 – $1,300/mo", posted: "6 days ago", logo: "AI", logoColor: "bg-green-700", tags: ["Entry Level", "Remote"], desc: "Analyse provider network coverage gaps and support recruitment of new facilities. Produce geographic mapping and adequacy reports." },
];

const STATS = [
  { value: "200+", label: "Successful Placements", icon: <CheckCircle className="w-5 h-5" /> },
  { value: "50+", label: "Partner Employers", icon: <Building2 className="w-5 h-5" /> },
  { value: "85%", label: "Hired Within 3 Months", icon: <TrendingUp className="w-5 h-5" /> },
  { value: "$180K+", label: "Avg. Starting Salary", icon: <Star className="w-5 h-5" /> },
];

const EMPLOYERS = ["UnitedHealth Group", "Anthem Inc.", "Cigna Healthcare", "Aetna", "Humana", "Kaiser Permanente", "Blue Cross Blue Shield", "Centene Corporation"];

function JobCard({ job }: { job: typeof JOBS[0] }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5 group flex flex-col h-full">
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-12 h-12 rounded-xl ${job.logoColor} text-white font-extrabold text-sm flex items-center justify-center shrink-0`}>{job.logo}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors text-sm leading-snug">{job.title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{job.company}</p>
        </div>
        <span className="text-[11px] font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full shrink-0">{job.posted}</span>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-1">{job.desc}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {job.tags.map((tag, j) => <span key={j} className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">{tag}</span>)}
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">{job.type}</span>
      </div>
      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="text-xs text-gray-400">
          <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</div>
          <div className="font-semibold text-gray-700 mt-0.5">{job.salary}</div>
        </div>
        <button className="bg-green-700 hover:bg-green-800 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors flex items-center gap-1.5">
          Apply <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

export default function Careers() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = JOBS.filter((j) => {
    const matchCat = activeCategory === "All" || j.category === activeCategory;
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="font-[Poppins,sans-serif]">
      {/* Header — background image */}
      <section
        className="py-14 sm:py-20 lg:py-24 relative overflow-hidden"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1739298061768-41a8a7d8b38f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80)",
          backgroundSize: "cover", backgroundPosition: "center top",
        }}
      >
        <div className="absolute inset-0 bg-[#071a08]/90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-white min-w-0">
            <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-3">Career Corner</p>
             <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 sm:mb-5 leading-tight">Explore Jobs.<br />Grow Your HMO Career.</h1>
             <p className="text-gray-300 text-sm leading-relaxed mb-8 max-w-lg">Exclusive HMO job listings from top healthcare organisations worldwide — visible only to Kalaro graduates and community members.</p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate("/signup")} className="bg-green-500 hover:bg-green-400 text-white font-bold px-7 py-3.5 rounded-full text-sm flex items-center gap-2 transition-all">
                Join to Access Jobs <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => navigate("/contact")} className="border-2 border-green-700 text-green-300 hover:bg-green-900/30 font-bold px-7 py-3.5 rounded-full text-sm transition-all">
                Post a Job
              </button>
            </div>
          </div>

          {/* Mobile carousel for stats */}
          <div className="sm:hidden -mx-4 px-4 overflow-x-clip">
            <MobileCarousel cardWidth="w-[44vw] max-w-[180px]" arrows={false}>
              {STATS.map((s, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm text-white">
                  <div className="text-green-400 mb-2">{s.icon}</div>
                  <div className="text-2xl font-extrabold">{s.value}</div>
                  <div className="text-xs text-gray-400 mt-1">{s.label}</div>
                </div>
              ))}
            </MobileCarousel>
          </div>
          <div className="hidden sm:grid grid-cols-2 gap-4">
            {STATS.map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm text-white">
                <div className="text-green-400 mb-3">{s.icon}</div>
                <div className="text-3xl font-extrabold">{s.value}</div>
                <div className="text-xs text-gray-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Employer strip */}
      <section className="py-6 sm:py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">Our hiring partners</p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            {EMPLOYERS.map((e) => <span key={e} className="text-gray-400 font-bold text-xs tracking-wide hover:text-green-700 transition-colors">{e}</span>)}
          </div>
        </div>
      </section>

      {/* Job board */}
      <section className="py-12 sm:py-16 bg-[#f7faf7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-green-600 font-semibold text-xs uppercase tracking-widest mb-2">Open Positions</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Latest HMO Job Listings</h2>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search jobs or companies..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 text-sm outline-none focus:border-green-500 bg-white" />
            </div>
            <div className="flex flex-wrap gap-2">
              {JOB_CATEGORIES.map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${activeCategory === cat ? "bg-green-700 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-green-400"}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-5">{filtered.length} position{filtered.length !== 1 ? "s" : ""} found</p>

          {/* Mobile carousel */}
          <div className="sm:hidden -mx-4 px-4 overflow-x-clip">
            <MobileCarousel cardWidth="w-[84vw]">
              {filtered.map((job, i) => <JobCard key={i} job={job} />)}
            </MobileCarousel>
          </div>

          {/* Desktop grid */}
          <div className="hidden sm:grid lg:grid-cols-2 gap-5">
            {filtered.map((job, i) => <JobCard key={i} job={job} />)}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No jobs match your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* Career support */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-green-600 font-semibold text-xs uppercase tracking-widest mb-2">Career Support</p>
            <h2 className="text-3xl font-extrabold text-gray-900">We Don't Just Train You. We Place You.</h2>
          </div>

          {/* Mobile carousel */}
          <div className="sm:hidden -mx-4 px-4 overflow-x-clip">
            <MobileCarousel cardWidth="w-[78vw]">
              {[
                { icon: <Users className="w-6 h-6" />, title: "CV Review & Coaching", desc: "Our career advisors review your CV and coach you to present yourself powerfully to HMO hiring managers.", color: "bg-green-700" },
                { icon: <Building2 className="w-6 h-6" />, title: "Employer Introductions", desc: "Direct warm introductions to HR contacts at our 50+ partner HMOs worldwide — no cold applications.", color: "bg-blue-700" },
                { icon: <TrendingUp className="w-6 h-6" />, title: "Interview Preparation", desc: "Mock interviews, common HMO interview questions, and feedback sessions to maximise your success rate.", color: "bg-purple-700" },
              ].map((s, i) => (
                <div key={i} className="bg-[#f7faf7] rounded-2xl p-7 border border-gray-100 h-full flex flex-col">
                  <div className={`w-12 h-12 ${s.color} text-white rounded-xl flex items-center justify-center mb-5`}>{s.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{s.desc}</p>
                </div>
              ))}
            </MobileCarousel>
          </div>
          <div className="hidden sm:grid grid-cols-3 gap-6">
            {[
              { icon: <Users className="w-6 h-6" />, title: "CV Review & Coaching", desc: "Our career advisors review your CV and coach you to present yourself powerfully to HMO hiring managers.", color: "bg-green-700" },
              { icon: <Building2 className="w-6 h-6" />, title: "Employer Introductions", desc: "Direct warm introductions to HR contacts at our 50+ partner HMOs worldwide — no cold applications.", color: "bg-blue-700" },
              { icon: <TrendingUp className="w-6 h-6" />, title: "Interview Preparation", desc: "Mock interviews, common HMO interview questions, and feedback sessions to maximise your success rate.", color: "bg-purple-700" },
            ].map((s, i) => (
              <div key={i} className="bg-[#f7faf7] rounded-2xl p-7 border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${s.color} text-white rounded-xl flex items-center justify-center mb-5`}>{s.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-12 sm:py-14 relative overflow-hidden"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1654762549297-2a145fcb9924?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80)",
          backgroundSize: "cover", backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#1b5e20]/92" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Ready to Land Your HMO Role?</h2>
          <p className="text-green-200 text-sm mb-7">Enrol in a Kalaro course and unlock full access to our job board and career support services.</p>
          <button onClick={() => navigate("/courses")} className="bg-white text-green-800 font-bold px-8 py-3.5 rounded-full hover:bg-green-50 transition-colors text-sm">
            Browse Courses & Get Started
          </button>
        </div>
      </section>
    </div>
  );
}




