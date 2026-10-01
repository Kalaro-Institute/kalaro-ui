import { Link } from "react-router";
import { ArrowRight, Globe, Plane, Award, FileText } from "lucide-react";
import { PR_SERVICES } from "@/app/data/services";
import ServiceCta from "./ServiceCta";

const ICONS: Record<string, typeof Globe> = {
  globe: Globe,
  plane: Plane,
  award: Award,
  file: FileText,
};

/* Immigration & relocation pathways lead; travel & payments follow. */
const CORE_COUNT = 3;

export default function InternationalPr() {
  const core = PR_SERVICES.slice(0, CORE_COUNT);
  const support = PR_SERVICES.slice(CORE_COUNT);

  return (
    <div className="bg-[#f7faf7] font-[Poppins,sans-serif]">
      {/* Hero */}
      <section className="bg-[#1b5e20] text-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="text-green-300 text-xs font-bold uppercase tracking-widest mb-4">
            International Permanent Residency
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight max-w-3xl">
            Your route to Canada — admission, visa and residency, supported end to end.
          </h1>
          <p className="text-green-100 mt-5 text-lg max-w-2xl leading-relaxed">
            Canada admission, study visa and Express Entry support, plus international
            payments and full support for your Kenya NCLEX trip.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-9">
            <Link
              to="/contact"
              className="bg-white text-green-800 font-bold px-7 py-3.5 rounded-full hover:bg-green-50 transition-colors text-sm"
            >
              Start your application
            </Link>
            <a
              href="#services"
              className="border-2 border-white/70 text-white font-bold px-7 py-3.5 rounded-full hover:bg-white/10 transition-colors text-sm"
            >
              Browse services
            </a>
          </div>
        </div>
      </section>

      <section id="services" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#1a2332] mb-4">
          Canada pathways
        </h2>
        <p className="text-gray-500 mb-8 max-w-2xl">
          Whether you are applying to school, securing a study permit or building an
          Express Entry profile, we guide every step.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {core.map((s) => {
            const Icon = ICONS[s.icon] ?? Globe;
            return <ServiceCard key={s.slug} service={s} Icon={Icon} />;
          })}
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-[#1a2332] mb-4">
          Payments & travel support
        </h2>
        <p className="text-gray-500 mb-8 max-w-2xl">
          Paying in the right currency, and everything you need on the ground in Kenya
          for your NCLEX exam.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {support.map((s) => {
            const Icon = ICONS[s.icon] ?? Globe;
            return <ServiceCard key={s.slug} service={s} Icon={Icon} />;
          })}
        </div>

        <ServiceCta
          title="Not sure which pathway fits you?"
          body="Tell us where you are in the process — studying, registered, or already sitting your exam — and we'll recommend the right support."
        />
      </section>
    </div>
  );
}

function ServiceCard({
  service,
  Icon,
}: {
  service: (typeof PR_SERVICES)[number];
  Icon: typeof Globe;
}) {
  return (
    <Link
      to={`/services/permanent-residency/services/${service.slug}`}
      className="group bg-white border border-gray-100 rounded-2xl p-6 hover:border-green-300 hover:shadow-lg hover:shadow-green-100/50 transition-all"
    >
      <div className="w-11 h-11 bg-green-100 text-green-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-700 group-hover:text-white transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-bold text-[#1a2332] mb-1.5 group-hover:text-green-700 transition-colors">
        {service.title}
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed mb-4">{service.tagline}</p>
      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-green-700">
        Learn more <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}