import { Link, useParams } from "react-router";
import {
  ArrowLeft, ArrowRight, CheckCircle, Mail,
  ClipboardCheck, CalendarCheck, BookOpen, ShieldCheck, Award,
  FileText, Globe, Stethoscope, Bot, Monitor,
  ScanLine, Plane, Landmark, Building2, RefreshCw, HelpCircle,
  CreditCard,
} from "lucide-react";
import type { Service } from "@/app/data/services";
import { NclexLogo } from "./NclexLogo";
import { useLocationPricing } from "@/app/hooks/useLocationPricing";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import {
  NCLEX_SERVICES, PR_SERVICES,
  findNclexService, findPrService,
} from "@/app/data/services";

const ICONS: Record<string, typeof ClipboardCheck> = {
  clipboard: ClipboardCheck,
  calendar: CalendarCheck,
  book: BookOpen,
  shield: ShieldCheck,
  award: Award,
  file: FileText,
  mail: Mail,
  globe: Globe,
  stethoscope: Stethoscope,
  bot: Bot,
  monitor: Monitor,
  scan: ScanLine,
  plane: Plane,
  landmark: Landmark,
  building: Building2,
  refresh: RefreshCw,
};

/* ── Single service detail page (used by both hubs) ───────────── */
export function ServiceDetailPage({
  service,
  siblings,
  basePath,
}: {
  service: Service;
  siblings: Service[];
  basePath: string;
}) {
  const Icon = ICONS[service.icon] ?? FileText;
  const others = siblings.filter((s) => s.slug !== service.slug);
  /* The NCLEX brand mark only appears on NCLEX service pages. */
  const isNclex = basePath === "/nclex";
  const { formatAmount } = useLocationPricing();
  const { addItem, has } = useCart();
  const inCart = has("service", service.slug);

  return (
    <div className="bg-[#f7faf7] font-[Poppins,sans-serif]">
      {/* Hero */}
      <section className="bg-[#1b5e20] text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 flex flex-col md:flex-row md:items-center gap-8">
          <div className="min-w-0 flex-1">
            <Link
              to={basePath}
              className="inline-flex items-center gap-2 text-sm text-green-200 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Back to all services
            </Link>
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                <Icon className="w-7 h-7 text-green-300" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                  {service.title}
                </h1>
                <p className="text-green-200 mt-2 text-lg">{service.tagline}</p>
              </div>
            </div>
          </div>
          {isNclex && (
            <div className="shrink-0 hidden md:block">
              <NclexLogo />
            </div>
          )}
        </div>
      </section>

      {/* Body */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid lg:grid-cols-[1fr_320px] gap-10">
          <div>
            <p className="text-base leading-relaxed text-gray-500 mb-10">
              {service.description}
            </p>

            <h2 className="text-xl font-bold text-[#1a2332] mb-4">What's included</h2>
            <ul className="grid sm:grid-cols-2 gap-3 mb-12">
              {service.includes.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700"
                >
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>

            <h2 className="text-xl font-bold text-[#1a2332] mb-4">How it works</h2>
            <ol className="space-y-4 mb-12">
              {service.process.map((p) => (
                <li key={p.step} className="flex gap-4 bg-white border border-gray-100 rounded-xl p-5">
                  <span className="text-sm font-extrabold text-green-600 shrink-0 w-8">
                    {p.step}
                  </span>
                  <span>
                    <span className="block font-bold text-[#1a2332] mb-1">{p.title}</span>
                    <span className="text-sm text-gray-500">{p.detail}</span>
                  </span>
                </li>
              ))}
            </ol>

            {service.faqs && service.faqs.length > 0 && (
              <>
                <h2 className="text-xl font-bold text-[#1a2332] mb-4">FAQ</h2>
                <div className="space-y-3 mb-12">
                  {service.faqs.map((f) => (
                    <div key={f.q} className="bg-white border border-gray-100 rounded-xl p-5">
                      <p className="font-bold text-[#1a2332] mb-1.5">{f.q}</p>
                      <p className="text-sm text-gray-500">{f.a}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            <h2 className="text-xl font-bold text-[#1a2332] mb-4">Related services</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {others.slice(0, 4).map((s) => (
                <Link
                  key={s.slug}
                  to={`${basePath}/services/${s.slug}`}
                  className="group flex items-center justify-between gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3.5 hover:border-green-300 hover:bg-green-50 transition-colors"
                >
                  <span>
                    <span className="block text-sm font-semibold text-[#1a2332] group-hover:text-green-700">
                      {s.title}
                    </span>
                    <span className="block text-xs text-gray-400 mt-0.5">{s.tagline}</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-green-600 shrink-0" />
                </Link>
              ))}
            </div>
          </div>
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-28 h-fit">
            {/* Fee card. A service is paid for, so its price and the
                route to pay belong on the page - not just a contact form. */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-5">
              <p className="text-sm text-gray-500 mb-1">Service fee</p>
              <p className="text-3xl font-extrabold text-[#1a2332] mb-1">
                {formatAmount(service.priceUsd)}
              </p>
              <p className="text-xs text-gray-500 mb-5">
                One-time fee &middot; {service.turnaround ?? "Delivered by our team"}
              </p>

              <Link
                to={`/checkout/service/${service.slug}`}
                className="block w-full text-center bg-green-700 hover:bg-green-800 text-white text-sm font-bold py-3 rounded-full transition-colors mb-3"
              >
                Pay for this service
              </Link>
              <button
                onClick={() => {
                  addItem({
                    kind: "service",
                    slug: service.slug,
                    title: service.title,
                    priceUsd: service.priceUsd,
                    meta: service.turnaround ?? "Delivered by our team",
                  });
                  toast.success(`${service.title} added to your bag`);
                }}
                className={`block w-full text-center text-sm font-semibold border-2 py-3 rounded-full transition-colors mb-3 ${
                  inCart
                    ? "border-green-600 text-green-700 bg-green-50"
                    : "border-gray-200 hover:border-green-600 text-gray-700 hover:text-green-700"
                }`}
              >
                {inCart ? "In your bag" : "Add to bag"}
              </button>
              <Link
                to="/contact"
                className="block w-full text-center text-sm font-semibold text-gray-700 border-2 border-gray-200 hover:border-green-600 hover:text-green-700 rounded-full py-3 transition-colors mb-3"
              >
                Ask a question first
              </Link>
              <div className="flex items-start gap-2.5 text-xs text-gray-500">
                <CreditCard className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                Card, USSD or bank transfer
              </div>
              <div className="flex items-start gap-2.5 text-xs text-gray-500 mt-2">
                <ShieldCheck className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                Work starts once payment clears
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 mt-5">
              <h3 className="font-bold text-[#1a2332] mb-3 text-sm">All services</h3>
              <ul className="space-y-1.5">
                {siblings.map((s) => (
                  <li key={s.slug}>
                    <Link
                      to={`${basePath}/services/${s.slug}`}
                      className={`block text-xs px-2.5 py-2 rounded-lg transition-colors ${
                        s.slug === service.slug
                          ? "bg-green-50 text-green-700 font-semibold"
                          : "text-gray-500 hover:bg-gray-50 hover:text-green-700"
                      }`}
                    >
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

/* ── Routed wrappers ─────────────────────────────────────────── */
export function NclexServiceRoute() {
  const { slug } = useParams();
  const service = slug ? findNclexService(slug) : undefined;
  if (!service) return <ServiceNotFound />;
  return <ServiceDetailPage service={service} siblings={NCLEX_SERVICES} basePath="/nclex" />;
}

export function PrServiceRoute() {
  const { slug } = useParams();
  const service = slug ? findPrService(slug) : undefined;
  if (!service) return <ServiceNotFound />;
  return (
    <ServiceDetailPage
      service={service}
      siblings={PR_SERVICES}
      basePath="/services/permanent-residency"
    />
  );
}

export function ServiceNotFound() {
  return (
    <div className="min-h-screen bg-[#f7faf7] flex items-center justify-center font-[Poppins,sans-serif] px-6">
      <div className="text-center">
        <HelpCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h1 className="text-2xl font-extrabold text-[#1a2332] mb-2">Service not found</h1>
        <p className="text-gray-500 text-sm mb-6">
          The service you're looking for isn't available or has moved.
        </p>
        <Link
          to="/contact"
          className="inline-block bg-green-700 hover:bg-green-800 text-white text-sm font-bold px-6 py-3 rounded-full transition-colors"
        >
          Contact us
        </Link>
      </div>
    </div>
  );
}
