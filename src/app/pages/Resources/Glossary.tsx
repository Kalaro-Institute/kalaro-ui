import { useState } from "react";
import { Link } from "react-router";
import { BookOpen, Search, ArrowRight } from "lucide-react";
import { GLOSSARY } from "@/app/data/resources";
import { PageHero, ResourceStrip } from "./Shared";

/* Glossary - every term expandable, plus a live search filter. The
   full definition is one click away so the list stays scannable. */
export default function Glossary() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const terms = GLOSSARY.filter(
    (t) =>
      t.term.toLowerCase().includes(query.toLowerCase()) ||
      t.short.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="bg-[#f7faf7] font-[Poppins,sans-serif]">
      <PageHero
        eyebrow="HMO Glossary"
        title="The terms, explained without the jargon"
        body="Every term a new HMO officer is expected to know, defined plainly - what it means, why it matters, and what it connects to."
      />

      <section className="max-w-4xl mx-auto px-6 py-14">
        <div className="relative mb-10">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search terms - try capitation, panel, NHIA..."
            className="w-full pl-10 pr-4 py-3.5 rounded-full border border-gray-200 bg-white text-sm outline-none focus:border-green-500"
          />
        </div>

        <p className="text-sm text-gray-400 mb-5">
          {terms.length} term{terms.length !== 1 ? "s" : ""}
        </p>

        <div className="space-y-3">
          {terms.map((t) => {
            const isOpen = open === t.term;
            return (
              <div
                key={t.term}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : t.term)}
                  className="w-full text-left p-6 hover:bg-green-50/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="font-extrabold text-[#1a2332] mb-1.5">
                        {t.term}
                      </h2>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {t.short}
                      </p>
                    </div>
                    <span
                      className={`w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0 transition-transform ${
                        isOpen ? "rotate-90" : ""
                      }`}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 -mt-2">
                    <p className="text-[15px] text-gray-700 leading-[1.8] mb-5">
                      {t.full}
                    </p>
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                        See also
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {t.related.map((r) => (
                          <button
                            key={r}
                            onClick={() => setOpen(r)}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-700 hover:text-white transition-colors"
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {terms.length === 0 && (
          <div className="text-center py-14 sm:py-20 text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No terms match your search.</p>
            <p className="text-sm mt-1">Try a broader keyword.</p>
          </div>
        )}

        <div className="mt-14 bg-white border border-gray-100 rounded-2xl p-8 text-center">
          <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-extrabold text-[#1a2332] mb-2">
            Learn these terms properly, not just quickly
          </h2>
          <p className="text-sm text-gray-500 max-w-xl mx-auto mb-6">
            The HMO Operations programme covers all of this in context, with the
            real workflows behind each term.
          </p>
          <Link
            to="/course/health-insurance-hmo-operations"
            className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white text-sm font-bold px-7 py-3 rounded-full transition-colors"
          >
            View the programme <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <ResourceStrip />
    </div>
  );
}

