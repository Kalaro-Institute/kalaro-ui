import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { MobileCarousel } from "@/app/components/MobileCarousel";
import { useNavigate } from "react-router";
import { Target, Eye, Heart, Award, Users } from "lucide-react";

/* ── Faculty ────────────────────────────────────────────────────
   The people who teach at Kalaro. Bios are kept accurate to each
   person's real role and background. Photos are optional: when an
   `img` is supplied it is shown, otherwise the card falls back to
   a branded gradient monogram so the section still reads well. */

type Faculty = {
  name: string;
  role: string;
  /** Two-letter monogram used by the no-photo fallback. */
  initials: string;
  /** Gradient used for the fallback / photo frame accent. */
  tone: string;
  /** Optional portrait; add a file to src/imports and set this to use it. */
  img?: string;
  bio: string[];
  tags: string[];
};

const FACULTY: Faculty[] = [
  {
    name: "Aro Adebusayo Loveth",
    role: "Lead Trainer & Founder",
    initials: "AL",
    tone: "from-green-700 to-green-900",
    bio: [
      "Aro Adebusayo Loveth is a Registered Nurse Anaesthetist, Healthcare Administrator, Health Insurance (HMO) Operations Specialist, and Medical Virtual Assistant with over 7 years of experience in healthcare and 5 years working within hospital health insurance operations and administration.",
      "She is the founder of a healthcare training initiative focused on bridging the knowledge gap in health insurance operations, hospital billing, claims management, and healthcare administration. Through her training programs, she equips healthcare professionals and non-medical graduates with practical skills to work in hospitals, health insurance companies, and remote healthcare support roles.",
      "Her mission is to help individuals discover new career opportunities within healthcare beyond bedside practice, while also helping hospitals improve documentation, claims processing, and revenue management.",
    ],
    tags: ["HMO Operations", "Hospital Billing", "Claims Management", "Medical VA"],
  },
  {
    name: "Ms. Olajumoke Oladunni",
    role: "Medical VA · Senior Executive, Reliance Health",
    initials: "OO",
    tone: "from-emerald-600 to-teal-800",
    bio: [
      "Ms. Olajumoke Oladunni is a healthcare professional, writer, and health-tech leader passionate about solving global healthcare challenges through innovation. With a background in clinical nursing, she transitioned into roles that blend healthcare with technology to promote accessible and affordable care.",
      "She is a Senior Executive at Reliance Health, where she leads claims operations and automation using data-driven processes. She also serves as a strategic advisor for two growing startups, Nexus Health (focused on telehealth) and Healthbrew Africa, which trains healthcare practitioners to acquire digital skills and transform their expertise into impactful solutions.",
      "Olajumoke is the author of Nurses, AI, and Other Big Choices and regularly speaks on health-tech in managed care, scaling clinical skills into entrepreneurship, and advancing healthcare solutions in Africa.",
    ],
    tags: ["Health-Tech", "Claims Automation", "Managed Care", "Author"],
  },
  {
    name: "Dr. L.O Okunowo",
    role: "CEO, Lantos Hospital",
    initials: "LO",
    tone: "from-teal-700 to-green-900",
    bio: [
      "Dr. L.O Okunowo is a Fellow of the Medical College of Pathology with a subspecialty in Immunology, and a Doctor of Medicine.",
      "He is a lecturer and trainer of medical students in the Chemical Pathology Department at Lagos State University College of Medicine, bringing deep clinical and academic rigor to Kalaro's healthcare curriculum.",
    ],
    tags: ["Pathology", "Immunology", "Medical Education"],
  },
  {
    name: "Odiviya Daniel",
    role: "Health Insurance & Managed Care Specialist",
    initials: "OD",
    tone: "from-green-800 to-[#071a08]",
    bio: [
      "Odiviya Daniel has over eight years of experience in hospital claims, medical billing, healthcare management, and hospital administration, building a strong reputation in Nigeria's health insurance and managed care sector. His professional expertise spans provider management, medical audit, provider onboarding, and the coordination of capacity-building training for healthcare stakeholders.",
      "Throughout his career he has completed training including Seamless Access to Healthcare, Leadership Training, Workplace Occupational Health and Safety, Reducing Healthcare Costs through the Prevention of Medical Fraud and Abuse, and Forensic Medical Investigations — equipping him to combat fraud and improve healthcare accountability.",
      "He is a Fellow of the Institute for Health Insurance and Managed Care of Nigeria (IHIMN) and is currently developing a digital platform to expand access to telemedicine services. Academically, he is a doctoral student at Lead City University, Ibadan, pursuing a PhD in Public Administration with a focus on Hospital Management, and works with one of Nigeria's leading Health Maintenance Organizations.",
    ],
    tags: ["Claims", "Medical Audit", "Fraud Prevention", "Telemedicine"],
  },
  {
    name: "Ola Vincent",
    role: "Remote Work · VA Tutor · Program Coordinator",
    initials: "OV",
    tone: "from-emerald-700 to-green-900",
    bio: [
      "Ola Vincent is a results-driven Lead Upwork and LinkedIn Remote Work recruiter and an experienced HR recruiter with over 6 years of hands-on talent acquisition expertise. Known for helping professionals break into the global remote workforce, he has coached job seekers and freelancers to build profitable careers on platforms like Upwork and LinkedIn.",
      "Through strategic positioning, profile optimization, and high-converting proposal frameworks, Ola has helped individuals and businesses unlock international opportunities and collectively secure over $100,000 in remote earnings. His recruiting background gives him a unique advantage — he understands exactly what employers look for and how candidates can position themselves to win competitive roles.",
      "Passionate about talent development, remote work, and career transformation, Ola is committed to bridging global opportunities with African talent, empowering professionals to move from local limitations to global impact.",
    ],
    tags: ["Remote Work", "Talent Acquisition", "Upwork & LinkedIn", "Career Coaching"],
  },
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

/* Editorial profile row: portrait on one side, details on the other.
   Alternates left/right per index so the section reads like a magazine
   feature and gives each longer bio room to breathe. */
function FacultyProfile({ member, flip }: { member: Faculty; flip: boolean }) {
  return (
    <article
      className={`grid md:grid-cols-[minmax(0,320px)_1fr] gap-6 md:gap-10 items-center ${
        flip ? "md:[&>figure]:order-2" : ""
      }`}
    >
      <figure className="relative">
        <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-xl ring-1 ring-black/5">
          {member.img ? (
            <ImageWithFallback
              src={member.img}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${member.tone} flex items-center justify-center`}
            >
              <span className="text-white text-6xl font-extrabold tracking-tight drop-shadow-sm">
                {member.initials}
              </span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />
        </div>
        {/* Decorative accent block behind the portrait */}
        <div
          className={`absolute -z-10 rounded-3xl bg-green-100 w-full h-full top-4 ${
            flip ? "left-4" : "right-4"
          } hidden md:block`}
          aria-hidden="true"
        />
      </figure>

      <div>
        <h3 className="text-2xl font-extrabold text-gray-900 leading-tight">{member.name}</h3>
        <p className="text-green-700 font-semibold text-sm mt-1 mb-4">{member.role}</p>
        <div className="space-y-3">
          {member.bio.map((para, i) => (
            <p key={i} className="text-gray-600 text-sm leading-relaxed">
              {para}
            </p>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-5">
          {member.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold text-green-800 bg-green-50 border border-green-100 rounded-full px-3 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
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
        className="py-14 sm:py-20 lg:py-24 relative overflow-hidden"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1739298061768-41a8a7d8b38f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80)",
          backgroundSize: "cover", backgroundPosition: "center top",
        }}
      >
        <div className="absolute inset-0 bg-[#071a08]/88" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-3">About Us</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 sm:mb-5 leading-tight">Training the Next Generation of Global HMO Leaders</h1>
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
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
          <div className="sm:hidden -mx-4 px-4 overflow-x-clip">
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

      {/* Faculty — editorial profiles */}
      <section className="py-14 sm:py-20 bg-[#f7faf7]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-green-600 font-semibold text-xs uppercase tracking-widest mb-2">The Experts</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Meet Our Instructors</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm">
              Every instructor is a working professional with real HMO and healthcare experience — not just academics.
            </p>
          </div>

          {/* Mobile carousel — one profile per swipe */}
          <div className="sm:hidden -mx-4 px-4 overflow-x-clip">
            <MobileCarousel cardWidth="w-[82vw]">
              {FACULTY.map((member, i) => <FacultyProfile key={i} member={member} flip={false} />)}
            </MobileCarousel>
          </div>

          {/* Desktop editorial rows */}
          <div className="hidden sm:flex flex-col gap-14 sm:gap-16">
            {FACULTY.map((member, i) => (
              <FacultyProfile key={i} member={member} flip={i % 2 === 1} />
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
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
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center text-white">
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

