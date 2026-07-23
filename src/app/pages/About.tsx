import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { MobileCarousel } from "@/app/components/MobileCarousel";
import { useNavigate } from "react-router";
import { Target, Eye, Heart, Award, Users,  } from "lucide-react";

const TEAM = [
  { name: "Dr. Adebayo Mensah", role: "Founder & Lead Instructor", bio: "15+ years in HMO operations. Former Director at Hygeia HMO. Certified Health Insurance Professional.", avatar: "AM", color: "bg-green-700" },
  { name: "Mrs. Ngozi Uchenna", role: "Head of Curriculum", bio: "Ex-Claims Director with Avon HMO. Specialist in healthcare policy and compliance.", avatar: "NU", color: "bg-blue-700" },
  { name: "Mr. Emeka Okafor", role: "Provider Relations Expert", bio: "12 years managing provider networks across West Africa. Certified Health Insurance Professional.", avatar: "EO", color: "bg-purple-700" },
  { name: "Barrister Funke Adeyemi", role: "Legal & Compliance Advisor", bio: "Healthcare law specialist. Advises multiple HMOs on international healthcare regulatory matters.", avatar: "FA", color: "bg-amber-700" },
];

const VALUES = [
  { icon: <Target className="w-6 h-6" />, title: "Practical Focus", desc: "Every lesson is grounded in real HMO operational scenarios, not just theory." },
  { icon: <Award className="w-6 h-6" />, title: "Excellence", desc: "We hold ourselves and our students to the highest professional standards." },
  { icon: <Heart className="w-6 h-6" />, title: "Impact", desc: "Better-trained HMO professionals mean better healthcare outcomes for communities worldwide." },
  { icon: <Users className="w-6 h-6" />, title: "Community", desc: "Our alumni network creates lasting professional connections across the industry." },
];

const MILESTONES = [
  { year: "2019", event: "Kalaro Institute founded" },
  { year: "2020", event: "First cohort of 40 students — 100% employment rate" },
  { year: "2021", event: "Online platform launched; enrolled 200+ students" },
  { year: "2022", event: "Partnered with 10+ leading HMOs globally for job placement" },
  { year: "2023", event: "500+ graduates; expanded curriculum to 8 specialist courses" },
  { year: "2025", event: "Recognised as a leading global HMO training institute" },
];

function TeamCard({ member }: { member: typeof TEAM[0] }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow text-center h-full flex flex-col">
      <div className={`w-20 h-20 rounded-full ${member.color} text-white font-extrabold text-xl flex items-center justify-center mx-auto mb-4`}>{member.avatar}</div>
      <h4 className="font-bold text-gray-900 mb-1">{member.name}</h4>
      <p className="text-green-600 text-xs font-semibold mb-3">{member.role}</p>
      <p className="text-gray-500 text-xs leading-relaxed flex-1">{member.bio}</p>
    </div>
  );
}

function ValueCard({ v }: { v: typeof VALUES[0] }) {
  return (
    <div className="bg-[#f7faf7] rounded-2xl p-6 border border-green-100 text-center hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="w-14 h-14 bg-green-700 rounded-full flex items-center justify-center text-white mx-auto mb-4">{v.icon}</div>
      <h4 className="font-bold text-gray-900 mb-2">{v.title}</h4>
      <p className="text-gray-500 text-sm leading-relaxed flex-1">{v.desc}</p>
    </div>
  );
}

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="font-[Poppins,sans-serif]">
      {/* Header — background image */}
      <section
        className="py-24 relative overflow-hidden"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1739298061768-41a8a7d8b38f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80)",
          backgroundSize: "cover", backgroundPosition: "center top",
        }}
      >
        <div className="absolute inset-0 bg-[#071a08]/88" />
        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-3">About Us</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-5 leading-tight">Training the Next Generation of Global HMO Leaders</h1>
            <p className="text-gray-300 text-sm leading-relaxed mb-7">
              Kalaro Institute of HMO Operations was founded with a single mission: to close the skills gap in the global healthcare sector by providing world-class, practical training that translates directly into career results.
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              {[{ v: "500+", l: "Graduates" }, { v: "5+", l: "Years Training" }, { v: "50+", l: "HMO Partners" }].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-extrabold text-green-400">{s.v}</div>
                  <div className="text-gray-400 text-xs mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80"
              alt="Kalaro training session"
              className="w-full h-72 object-cover rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-green-50 border border-green-100 rounded-2xl p-8">
              <div className="w-12 h-12 bg-green-700 rounded-xl flex items-center justify-center text-white mb-5"><Target className="w-6 h-6" /></div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-3">Our Mission</h3>
              <p className="text-gray-600 text-sm leading-relaxed">To equip healthcare professionals worldwide with the specialised knowledge, practical skills, and professional network needed to excel in HMO operations and advance global managed care.</p>
            </div>
            <div className="bg-[#071a08] rounded-2xl p-8 text-white">
              <div className="w-12 h-12 bg-green-700 rounded-xl flex items-center justify-center mb-5"><Eye className="w-6 h-6" /></div>
              <h3 className="text-xl font-extrabold mb-3">Our Vision</h3>
              <p className="text-green-200 text-sm leading-relaxed">To become the world's leading institute for managed care education — producing a generation of HMO professionals who drive quality, efficiency, and access in healthcare globally.</p>
            </div>
          </div>

          {/* Values */}
          <div className="text-center mb-12">
            <p className="text-green-600 font-semibold text-xs uppercase tracking-widest mb-2">What We Stand For</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Our Core Values</h2>
          </div>

          {/* Mobile carousel */}
          <div className="sm:hidden -mx-4 px-4">
            <MobileCarousel cardWidth="w-[72vw]">
              {VALUES.map((v, i) => <ValueCard key={i} v={v} />)}
            </MobileCarousel>
          </div>
          {/* Desktop grid */}
          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => <ValueCard key={i} v={v} />)}
          </div>
        </div>
      </section>

      {/* Team — background image */}
      <section
        className="py-20 relative overflow-hidden"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1777703304166-d7713ec85de0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80)",
          backgroundSize: "cover", backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-white/95" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-green-600 font-semibold text-xs uppercase tracking-widest mb-2">The Experts</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Meet Our Instructors</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm">Every instructor is a working professional with real HMO experience — not just academics.</p>
          </div>

          {/* Mobile carousel */}
          <div className="sm:hidden -mx-4 px-4">
            <MobileCarousel cardWidth="w-[72vw]">
              {TEAM.map((member, i) => <TeamCard key={i} member={member} />)}
            </MobileCarousel>
          </div>
          {/* Desktop grid */}
          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member, i) => <TeamCard key={i} member={member} />)}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-green-600 font-semibold text-xs uppercase tracking-widest mb-2">Our Story</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Our Journey So Far</h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-green-100" />
            <div className="space-y-8">
              {MILESTONES.map((m, i) => (
                <div key={i} className="flex gap-6 pl-14 relative">
                  <div className="absolute left-3.5 top-1 w-5 h-5 rounded-full bg-green-700 border-4 border-green-100 shrink-0" />
                  <div>
                    <span className="text-xs font-extrabold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">{m.year}</span>
                    <p className="text-gray-700 text-sm font-medium mt-2">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-14 relative overflow-hidden"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1654762549297-2a145fcb9924?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80)",
          backgroundSize: "cover", backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#1b5e20]/92" />
        <div className="relative max-w-3xl mx-auto px-6 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Join the Kalaro Community</h2>
          <p className="text-green-200 text-sm mb-7">Become part of the world's most connected HMO professional network.</p>
          <button onClick={() => navigate("/courses")} className="bg-white text-green-800 font-bold px-8 py-3.5 rounded-full hover:bg-green-50 transition-colors text-sm">
            Browse Courses
          </button>
        </div>
      </section>
    </div>
  );
}
