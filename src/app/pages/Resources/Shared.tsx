import { Link } from "react-router";
import { HelpCircle } from "lucide-react";

/* Chrome shared by all four Resources pages, so the section reads as
   one place rather than four unrelated landing pages. */
export function PageHero({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <section className="bg-[#1b5e20] text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <p className="text-green-300 text-xs font-bold uppercase tracking-widest mb-4">
          {eyebrow}
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight max-w-3xl">
          {title}
        </h1>
        <p className="text-green-100 mt-4 text-lg max-w-2xl leading-relaxed">
          {body}
        </p>
      </div>
    </section>
  );
}

export function NotFound({ label }: { label: string }) {
  return (
    <div className="min-h-screen bg-[#f7faf7] flex items-center justify-center px-6 font-[Poppins,sans-serif]">
      <div className="text-center">
        <HelpCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h1 className="text-2xl font-extrabold text-[#1a2332] mb-2">
          {label} not found
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          The page you are looking for isn't available or has moved.
        </p>
        <Link
          to="/resources/blog"
          className="inline-block bg-green-700 hover:bg-green-800 text-white text-sm font-bold px-6 py-3 rounded-full transition-colors"
        >
          Back to resources
        </Link>
      </div>
    </div>
  );
}

/** Cross-links so a visitor can move between the four resources. */
export const RESOURCE_LINKS = [
  { label: "Blog & Articles", to: "/resources/blog" },
  { label: "Webinars", to: "/resources/webinars" },
  { label: "Resource Library", to: "/resources/library" },
  { label: "HMO Glossary", to: "/resources/glossary" },
];

export function ResourceStrip() {
  return (
    <div className="bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-gray-500">Explore the rest of our resources</p>
        <div className="flex flex-wrap gap-2">
          {RESOURCE_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-4 py-2 rounded-full text-sm font-semibold bg-green-50 text-green-700 hover:bg-green-700 hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
