import { Link } from "react-router";
import {
  ArrowRight, CheckCircle, ClipboardCheck, CalendarCheck, BookOpen,
  ShieldCheck, Award, FileText, Mail, Plane, Sparkles,
} from "lucide-react";
import { NCLEX_SERVICES } from "@/app/data/services";
import { NCLEX_GROUPS } from "@/app/data/navigation";
import ServiceCta from "./ServiceCta";

const ICONS: Record<string, typeof ClipboardCheck> = {
  clipboard: ClipboardCheck,
  calendar: CalendarCheck,
  book: BookOpen,
  shield: ShieldCheck,
  award: Award,
  file: FileText,
  mail: Mail,
  plane: Plane,
};

const PILLARS = [
  {
    title: "NCLEX Booking & Registration",
    detail: "Registration, Pearson VUE test-centre booking, rescheduling and fee handling.",
  },
  {
    title: "Professional Document Processing",
    detail: "Notarised documents, transcripts, attestations and apostille-ready paperwork.",
  },
  {
    title: "Credential Evaluation & Verification",
    detail: "Foreign credentials evaluated and verified for boards, employers and immigration.",
  },
  {
    title: "Nursing Board & Alert Support",
    detail: "State board applications, additional alerts and licence verification.",
  },
];

export default function Nclex() {
  return (
    <div className="bg-[#f7faf7] font-[Poppins,sans-serif]">
      {/* Hero */}
      <section className="bg-[#1b5e20] text-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="text-green-300 text-xs font-bold uppercase tracking-widest mb-4">
            NCLEX Support
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight max-w-3xl">
            Everything you need to sit the NCLEX — handled end to end.
          </h1>
          <p className="text-green-100 mt-5 text-lg max-w-2xl leading-relaxed">
            Registration, booking, credentialing, documentation and travel — coordinated by
            one team, so nothing stalls your application or your exam date.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-9">
            <Link
              to="/contact"
              className="bg-white text-green-800 font-bold px-7 py-3.5 rounded-full hover:bg-green-50 transition-colors text-sm"
            >
              Start your NCLEX journey
            </Link>
            <Link
              to="/nclex/services/nclex-registration"
              className="border-2 border-white/70 text-white font-bold px-7 py-3.5 rounded-full hover:bg-white/10 transition-colors text-sm"
            >
              See registration support
            </Link>
          </div>
        </div>
      </section>
      {/* Pillars */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#1a2332] mb-10">
          What we handle
        </h2>
        <div className="grid md:grid-cols-2 gap-5 mb-16">
          {PILLARS.map((p, i) => (
            <div key={p.title} className="bg-white border border-gray-100 rounded-2xl p-7">
              <div className="w-10 h-10 bg-green-100 text-green-700 rounded-xl flex items-center justify-center mb-4 font-extrabold text-sm">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="font-bold text-[#1a2332] text-lg mb-2">{p.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{p.detail}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-[#1a2332] mb-4">
          Explore our NCLEX services
        </h2>
        <p className="text-gray-500 mb-8 max-w-2xl">
          Pick a service to see exactly what is included and how it works.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {NCLEX_SERVICES.map((s) => {
            const Icon = ICONS[s.icon] ?? ClipboardCheck;
            return (
              <Link
                key={s.slug}
                to={`/nclex/services/${s.slug}`}
                className="group bg-white border border-gray-100 rounded-2xl p-6 hover:border-green-300 hover:shadow-lg hover:shadow-green-100/50 transition-all"
              >
                <div className="w-11 h-11 bg-green-100 text-green-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-700 group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#1a2332] mb-1.5 group-hover:text-green-700 transition-colors">
                  {s.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{s.tagline}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-green-700">
                  Learn more <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>

        {/* Categories */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 mb-16">
          <h3 className="font-bold text-[#1a2332] mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-green-600" /> Browse by need
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {NCLEX_GROUPS.map((g) => (
              <div key={g.label}>
                <p className="font-bold text-[#1a2332] text-sm mb-3">{g.label}</p>
                <ul className="space-y-2">
                  {(g.subItems ?? []).map((s) => (
                    <li key={s.label} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <Link to={s.to} className="hover:text-green-700 transition-colors">
                        {s.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <ServiceCta
          title="Not sure which service you need?"
          body="Tell us where you are in the process and we'll map the exact steps for you."
        />
      </section>
    </div>
  );
}