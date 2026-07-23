import { MobileCarousel } from "@/app/components/MobileCarousel";
import { useNavigate } from "react-router";
import {
   MessageSquare, Briefcase, ArrowRight,
  Globe, Calendar, Award, ChevronRight,
   Library,  Quote,
} from "lucide-react";

const FEATURES = [
  { icon: <MessageSquare className="w-6 h-6" />, title: "Discussion Forums", desc: "Ask questions, share insights, and connect with peers and instructors across all HMO operations topics.", color: "bg-blue-50 text-blue-700" },
  { icon: <Briefcase className="w-6 h-6" />, title: "Job Board", desc: "Exclusive HMO job listings posted daily by our partner employers — visible only to Kalaro community members.", color: "bg-green-50 text-green-700" },
  { icon: <Globe className="w-6 h-6" />, title: "Alumni Network", desc: "500+ graduates across leading HMOs worldwide. Connect, collaborate, and open doors for each other.", color: "bg-purple-50 text-purple-700" },
  { icon: <Calendar className="w-6 h-6" />, title: "Live Events & Webinars", desc: "Monthly industry webinars, live Q&A sessions with HMO executives, and virtual networking events.", color: "bg-amber-50 text-amber-700" },
  { icon: <Library className="w-6 h-6" />, title: "Resource Library", desc: "Exclusive access to templates, policy documents, case studies, and industry reports curated by our experts.", color: "bg-rose-50 text-rose-700" },
  { icon: <Award className="w-6 h-6" />, title: "Mentorship Programme", desc: "Get matched with a senior HMO professional who will guide your career growth for 3 months.", color: "bg-teal-50 text-teal-700" },
];

const UPCOMING_EVENTS = [
  { date: "Jul 25, 2025", day: "Fri", title: "HMO Claims Masterclass: Reducing Rejection Rates by 40%", type: "Webinar", speaker: "Mrs. Ngozi Uchenna", spots: "48 spots left" },
  { date: "Aug 5, 2025", day: "Tue", title: "Global Healthcare Regulatory Updates — What Every HMO Professional Must Know", type: "Live Session", speaker: "Barrister Funke Adeyemi", spots: "32 spots left" },
  { date: "Aug 20, 2025", day: "Wed", title: "Career Night: Meet HMO Hiring Managers Live", type: "Networking", speaker: "Multiple Speakers", spots: "75 spots left" },
];

const MEMBERS = [
  { name: "Sarah J.", role: "Claims Officer, UnitedHealth", avatar: "SJ", color: "bg-green-700" },
  { name: "Michael C.", role: "Provider Relations Mgr", avatar: "MC", color: "bg-blue-700" },
  { name: "Emily R.", role: "Health Insurance Analyst", avatar: "ER", color: "bg-purple-700" },
  { name: "David T.", role: "HMO Finance Officer", avatar: "DT", color: "bg-amber-700" },
  { name: "Lisa N.", role: "Compliance Manager", avatar: "LN", color: "bg-rose-700" },
  { name: "James O.", role: "Network Manager", avatar: "JO", color: "bg-teal-700" },
];

const TESTIMONIALS = [
  { name: "Sarah Johnson", role: "Claims Officer", avatar: "SJ", text: "The community has been as valuable as the course itself. I found my current job through the Kalaro job board within 2 weeks of graduating." },
  { name: "Michael Chen", role: "Provider Relations Manager", avatar: "MC", text: "The mentorship programme connected me with a seasoned professional who helped me navigate my career transition into HMO management." },
  { name: "Emily Rodriguez", role: "Health Insurance Analyst", avatar: "ER", text: "Monthly webinars keep me updated on industry changes. It feels like having a professional association membership included in the course fee." },
];

function FeatureCard({ f }: { f: typeof FEATURES[0] }) {
  return (
    <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 h-full flex flex-col">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 shrink-0 ${f.color}`}>{f.icon}</div>
      <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed flex-1">{f.desc}</p>
    </div>
  );
}

function TestimonialCard({ t }: { t: typeof TESTIMONIALS[0] }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 h-full flex flex-col">
      <Quote className="w-7 h-7 text-green-400 mb-4 shrink-0" />
      <p className="text-green-100 text-sm leading-relaxed italic flex-1">"{t.text}"</p>
      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/10">
        <div className="w-10 h-10 rounded-full bg-green-600 text-white font-bold text-xs flex items-center justify-center shrink-0">{t.avatar}</div>
        <div>
          <p className="font-bold text-white text-sm">{t.name}</p>
          <p className="text-green-300 text-xs">{t.role}</p>
        </div>
      </div>
    </div>
  );
}

function MemberCard({ m }: { m: typeof MEMBERS[0] }) {
  return (
    <div className="bg-white rounded-2xl p-5 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col items-center justify-center">
      <div className={`w-14 h-14 rounded-full ${m.color} text-white font-extrabold text-sm flex items-center justify-center mb-3`}>{m.avatar}</div>
      <p className="font-bold text-gray-900 text-xs">{m.name}</p>
      <p className="text-gray-400 text-[11px] mt-1">{m.role}</p>
    </div>
  );
}

export default function Community() {
  const navigate = useNavigate();

  return (
    <div className="font-[Poppins,sans-serif]">
      {/* Header — background image */}
      <section
        className="py-24 relative overflow-hidden"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1524178232363-1fb2b075b655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80)",
          backgroundSize: "cover", backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#071a08]/90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center text-white">
          <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-3">Community</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Global HMO Professional Hub</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm leading-relaxed mb-10">
            More than a course platform — Kalaro is a community of ambitious HMO professionals helping each other grow, connect, and get hired.
          </p>
          <div className="flex flex-wrap justify-center gap-10">
            {[
              { v: "500+", l: "Active Members" },
              { v: "200+", l: "Job Placements" },
              { v: "50+", l: "Monthly Events" },
              { v: "30+", l: "Mentors Available" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-extrabold text-green-400">{s.v}</div>
                <div className="text-gray-400 text-xs mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-[#f7faf7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-green-600 font-semibold text-xs uppercase tracking-widest mb-2">What You Get</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Everything in One Community</h2>
          </div>

          {/* Mobile carousel */}
          <div className="sm:hidden -mx-4 px-4">
            <MobileCarousel cardWidth="w-[78vw]">
              {FEATURES.map((f, i) => <FeatureCard key={i} f={f} />)}
            </MobileCarousel>
          </div>
          {/* Desktop grid */}
          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => <FeatureCard key={i} f={f} />)}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-green-600 font-semibold text-xs uppercase tracking-widest mb-2">Events</p>
              <h2 className="text-3xl font-extrabold text-gray-900">Upcoming Events</h2>
            </div>
            <button className="hidden sm:flex items-center gap-1 text-green-700 font-bold text-sm hover:underline">
              See All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile carousel for events */}
          <div className="sm:hidden -mx-4 px-4 mb-4">
            <MobileCarousel cardWidth="w-[84vw]">
              {UPCOMING_EVENTS.map((event, i) => (
                <div key={i} className="bg-[#f7faf7] rounded-2xl p-5 border border-green-100 flex gap-4 h-full">
                  <div className="bg-green-700 text-white rounded-xl p-3 text-center shrink-0 w-16">
                    <div className="text-[10px] font-bold uppercase opacity-80">{event.day}</div>
                    <div className="text-xl font-extrabold leading-none my-1">{event.date.split(" ")[1].replace(",", "")}</div>
                    <div className="text-[10px] opacity-80">{event.date.split(" ")[0]}</div>
                  </div>
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap gap-1.5 mb-1.5">
                        <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{event.type}</span>
                        <span className="text-[11px] text-amber-600 font-semibold">{event.spots}</span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-xs leading-snug mb-1">{event.title}</h4>
                      <p className="text-[11px] text-gray-500">{event.speaker}</p>
                    </div>
                    <button className="mt-3 bg-green-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-full self-start">
                      Reserve
                    </button>
                  </div>
                </div>
              ))}
            </MobileCarousel>
          </div>

          {/* Desktop list */}
          <div className="hidden sm:flex flex-col gap-4">
            {UPCOMING_EVENTS.map((event, i) => (
              <div key={i} className="bg-[#f7faf7] rounded-2xl p-6 border border-green-100 flex flex-col sm:flex-row items-start sm:items-center gap-5 hover:shadow-md transition-shadow">
                <div className="bg-green-700 text-white rounded-xl p-4 text-center shrink-0 w-20">
                  <div className="text-xs font-bold uppercase">{event.day}</div>
                  <div className="text-2xl font-extrabold leading-none">{event.date.split(" ")[1].replace(",", "")}</div>
                  <div className="text-xs opacity-80">{event.date.split(" ")[0]}</div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">{event.type}</span>
                    <span className="text-xs text-amber-600 font-semibold">{event.spots}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">{event.title}</h4>
                  <p className="text-xs text-gray-500">Speaker: {event.speaker}</p>
                </div>
                <button className="bg-green-700 hover:bg-green-800 text-white text-xs font-bold px-5 py-2.5 rounded-full transition-colors shrink-0">
                  Reserve Spot
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials — background image */}
      <section
        className="py-20 relative overflow-hidden"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1777703304166-d7713ec85de0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80)",
          backgroundSize: "cover", backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#071a08]/90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-green-400 font-semibold text-xs uppercase tracking-widest mb-2">Member Voices</p>
            <h2 className="text-3xl font-extrabold text-white">What Members Are Saying</h2>
          </div>

          {/* Mobile carousel */}
          <div className="sm:hidden -mx-4 px-4">
            <MobileCarousel cardWidth="w-[82vw]">
              {TESTIMONIALS.map((t, i) => <TestimonialCard key={i} t={t} />)}
            </MobileCarousel>
          </div>
          {/* Desktop grid */}
          <div className="hidden sm:grid grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => <TestimonialCard key={i} t={t} />)}
          </div>
        </div>
      </section>

      {/* Member spotlight */}
      <section className="py-20 bg-[#f7faf7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-green-600 font-semibold text-xs uppercase tracking-widest mb-2">Our Members</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Community Members</h2>
             <p className="text-gray-500 mt-3 text-sm max-w-lg mx-auto">
               Professionals from across the global HMO industry, all connected through Kalaro.
             </p>
          </div>

          {/* Mobile carousel */}
          <div className="sm:hidden -mx-4 px-4">
            <MobileCarousel cardWidth="w-[40vw]" arrows={false}>
              {MEMBERS.map((m, i) => <MemberCard key={i} m={m} />)}
            </MobileCarousel>
          </div>
          {/* Desktop grid */}
          <div className="hidden sm:grid grid-cols-3 lg:grid-cols-6 gap-4">
            {MEMBERS.map((m, i) => <MemberCard key={i} m={m} />)}
          </div>

          <p className="text-center text-sm text-gray-400 mt-6">+ 490 more members worldwide</p>
        </div>
      </section>

      {/* Join CTA — background image */}
      <section
        className="py-20 relative overflow-hidden"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1654762549297-2a145fcb9924?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80)",
          backgroundSize: "cover", backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#071a08]/92" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center text-white">
          <h2 className="text-3xl font-extrabold mb-4">Join the Community Today</h2>
          <p className="text-gray-300 text-sm mb-8 leading-relaxed">
            Enrol in any Kalaro course and automatically become a lifetime member of the world's premier HMO professional network.
          </p>
          <button
            onClick={() => navigate("/courses")}
            className="bg-green-500 hover:bg-green-400 text-white font-bold px-10 py-4 rounded-full transition-all text-sm inline-flex items-center gap-2"
          >
            Enrol & Join the Community <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
