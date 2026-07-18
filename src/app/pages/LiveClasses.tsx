import { useState } from "react";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import {
  Video, Calendar, Clock, Users, ArrowRight, Play,
  CheckCircle, Mic, MonitorPlay, Star, Bell, Lock,
} from "lucide-react";

const UPCOMING = [
  {
    date: "Jul 25, 2025",
    day: "Fri",
    time: "3:00 PM EST",
    title: "HMO Claims Masterclass: Reducing Rejection Rates by 40%",
    instructor: "Mrs. Ngozi Uchenna",
    role: "Head of Curriculum, Kalaro Institute",
    level: "Intermediate",
    enrolled: 142,
    spots: 48,
    duration: "90 mins",
    tags: ["Claims", "Adjudication", "Best Practices"],
    free: false,
  },
  {
    date: "Aug 5, 2025",
    day: "Tue",
    time: "11:00 AM EST",
    title: "Global Healthcare Regulatory Updates 2025 — What Every HMO Professional Must Know",
    instructor: "Sarah Mitchell",
    role: "International Healthcare Law Expert",
    level: "All Levels",
    enrolled: 218,
    spots: 32,
    duration: "60 mins",
    tags: ["Compliance", "Regulation"],
    free: true,
  },
  {
    date: "Aug 12, 2025",
    day: "Tue",
    time: "2:00 PM EST",
    title: "Provider Network Management: Contracting, Capitation & KPIs",
    instructor: "Dr. James Okonkwo",
    role: "Provider Relations Expert",
    level: "Intermediate",
    enrolled: 89,
    spots: 61,
    duration: "90 mins",
    tags: ["Provider Relations", "Network", "Contracts"],
    free: false,
  },
  {
    date: "Aug 20, 2025",
    day: "Wed",
    time: "5:00 PM EST",
    title: "Career Night: Meet HMO Hiring Managers Live",
    instructor: "Multiple Speakers",
    role: "HR Directors from Top HMOs",
    level: "All Levels",
    enrolled: 305,
    spots: 75,
    duration: "120 mins",
    tags: ["Careers", "Networking", "Job Search"],
    free: true,
  },
  {
    date: "Sep 3, 2025",
    day: "Wed",
    time: "10:00 AM EST",
    title: "HMO Financial Modelling: Capitation Budgets & Reserve Analysis",
    instructor: "Dr. Aisha Patel",
    role: "HMO Finance Specialist",
    level: "Advanced",
    enrolled: 64,
    spots: 86,
    duration: "120 mins",
    tags: ["Finance", "Actuarial", "Budgeting"],
    free: false,
  },
  {
    date: "Sep 10, 2025",
    day: "Wed",
    time: "3:00 PM EST",
    title: "Delivering Exceptional Member Experience in Managed Care",
    instructor: "Dr. Emily Rodriguez",
    role: "Customer Experience Trainer",
    level: "Beginner",
    enrolled: 176,
    spots: 74,
    duration: "60 mins",
    tags: ["Customer Service", "Member Experience"],
    free: false,
  },
];

const PAST = [
  {
    title: "Introduction to HMO Operations: A Beginner's Deep-Dive",
    instructor: "Dr. Adebayo Mensah",
    date: "Jul 10, 2025",
    duration: "90 mins",
    views: "1,240",
    img: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    title: "Understanding Pre-Authorisation in Global HMOs",
    instructor: "Mrs. Ngozi Uchenna",
    date: "Jun 28, 2025",
    duration: "75 mins",
    views: "890",
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    title: "Breaking Into HMO: A Career Q&A Session",
    instructor: "Multiple Speakers",
    date: "Jun 15, 2025",
    duration: "60 mins",
    views: "2,100",
    img: "https://images.unsplash.com/photo-1513258496099-48168024aec0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
];

const FEATURES = [
  { icon: <Mic className="w-5 h-5" />, title: "Live Q&A", desc: "Ask questions directly to industry experts during every session." },
  { icon: <MonitorPlay className="w-5 h-5" />, title: "Replays Included", desc: "Can't make it live? Every session is recorded and available to enrolled students." },
  { icon: <Star className="w-5 h-5" />, title: "Expert Instructors", desc: "All sessions are led by active HMO professionals — not just academics." },
  { icon: <CheckCircle className="w-5 h-5" />, title: "Certificate of Attendance", desc: "Receive a verified digital certificate for every live class you complete." },
];

const LEVEL_COLORS: Record<string, string> = {
  "Beginner": "bg-emerald-100 text-emerald-700",
  "Intermediate": "bg-blue-100 text-blue-700",
  "Advanced": "bg-red-100 text-red-700",
  "All Levels": "bg-purple-100 text-purple-700",
};

export default function LiveClasses() {
  const navigate = useNavigate();

  return (
    <div className="font-[Poppins,sans-serif]">
      {/* Header */}
      <section className="bg-[#071a08] py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 60%, #4caf50 0%, transparent 50%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-bold px-4 py-1.5 rounded-full mb-5">
            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" /> LIVE Sessions Available
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Live Classes & Webinars</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm leading-relaxed mb-8">
            Real-time learning with the world's foremost HMO professionals. Join live, ask questions, and get recorded replays — all included with your Kalaro enrolment.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { v: "50+", l: "Sessions Hosted" },
              { v: "5,000+", l: "Total Attendees" },
              { v: "Monthly", l: "New Sessions" },
              { v: "Free", l: "Select Sessions" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-extrabold text-green-400">{s.v}</div>
                <div className="text-gray-400 text-xs mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why live classes */}
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-[#f7faf7] rounded-2xl border border-gray-100">
                <div className="w-10 h-10 bg-green-700 text-white rounded-xl flex items-center justify-center shrink-0">{f.icon}</div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{f.title}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming sessions */}
      <section className="py-20 bg-[#f7faf7]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-green-600 font-semibold text-xs uppercase tracking-widest mb-2">Schedule</p>
              <h2 className="text-3xl font-extrabold text-gray-900">Upcoming Live Sessions</h2>
            </div>
            <button className="hidden sm:flex items-center gap-1 text-green-700 font-bold text-sm border-2 border-green-700 px-4 py-2 rounded-full hover:bg-green-50 transition-colors">
              <Bell className="w-3.5 h-3.5" /> Get Notified
            </button>
          </div>

          <div className="space-y-5">
            {UPCOMING.map((session, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all p-6 flex flex-col lg:flex-row lg:items-center gap-5">
                {/* Date block */}
                <div className="bg-green-700 text-white rounded-xl p-4 text-center shrink-0 w-20">
                  <div className="text-xs font-bold uppercase opacity-80">{session.day}</div>
                  <div className="text-2xl font-extrabold leading-none my-1">{session.date.split(" ")[1].replace(",", "")}</div>
                  <div className="text-xs opacity-80">{session.date.split(" ")[0]}</div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${LEVEL_COLORS[session.level]}`}>{session.level}</span>
                    {session.free && (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700">FREE</span>
                    )}
                    {session.tags.map((tag, j) => (
                      <span key={j} className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 leading-snug">{session.title}</h3>
                  <p className="text-xs text-gray-500 mb-3">
                    <span className="font-semibold text-gray-700">{session.instructor}</span> · {session.role}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {session.time} · {session.duration}</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {session.enrolled} enrolled · <span className="text-amber-600 font-semibold">{session.spots} spots left</span></span>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-green-700 hover:bg-green-800 text-white font-bold px-6 py-3 rounded-full text-sm flex items-center gap-2 transition-colors shrink-0"
                >
                  {session.free ? "Register Free" : "Reserve Spot"} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past recordings */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-green-600 font-semibold text-xs uppercase tracking-widest mb-2">On-Demand</p>
              <h2 className="text-3xl font-extrabold text-gray-900">Watch Past Sessions</h2>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded-full">
              <Lock className="w-3 h-3" /> Full access for enrolled students
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {PAST.map((rec, i) => (
              <div key={i} className="bg-[#f7faf7] rounded-2xl overflow-hidden border border-gray-100 group cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="relative h-44 overflow-hidden">
                  <ImageWithFallback
                    src={rec.img}
                    alt={rec.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-green-700 fill-green-700 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2.5 py-1 rounded-full">{rec.duration}</div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 group-hover:text-green-700 transition-colors">{rec.title}</h3>
                  <p className="text-xs text-gray-500 mb-3">{rec.instructor}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{rec.date}</span>
                    <span>{rec.views} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-[#f7faf7] rounded-2xl border border-green-100 p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="w-14 h-14 bg-green-700 rounded-full flex items-center justify-center text-white shrink-0 mx-auto sm:mx-0">
              <Lock className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">Unlock All Recordings</h3>
              <p className="text-sm text-gray-500">All past sessions are available to Kalaro students. Enrol in any course to gain full access to the library.</p>
            </div>
            <button onClick={() => navigate("/courses")} className="bg-green-700 hover:bg-green-800 text-white font-bold px-7 py-3 rounded-full text-sm transition-colors shrink-0">
              Enrol Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
