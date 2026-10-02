import { useState } from "react";
import { Link } from "react-router";
import { Library as LibraryIcon, FileText, Download, Lock, ArrowRight } from "lucide-react";
import { LIBRARY, type LibraryItem } from "@/app/data/resources";
import { PageHero, ResourceStrip } from "./Shared";

const CATEGORIES = ["All", "Templates", "Guides", "Policy", "Checklists"] as const;

/* Resource library - templates, guides and checklists, split by
   category and separating free downloads from member-only items. */
export default function Library() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");

  const items = LIBRARY.filter(
    (i) => category === "All" || i.category === category,
  );
  const freeCount = LIBRARY.filter((i) => i.free).length;

  return (
    <div className="bg-[#f7faf7] font-[Poppins,sans-serif]">
      <PageHero
        eyebrow="Resource Library"
        title="Templates, checklists and guides you can use immediately"
        body={`Built from the documents we use ourselves. ${freeCount} of the ${LIBRARY.length} items are free to download - no sign-up required.`}
      />

      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                category === c
                  ? "bg-green-700 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-green-400"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {items.map((item) => (
            <ItemCard key={item.slug} item={item} />
          ))}
        </div>

        <div className="bg-[#1b5e20] rounded-3xl px-8 py-12 text-white text-center">
          <LibraryIcon className="w-8 h-8 mx-auto mb-4 text-green-300" />
          <h2 className="text-2xl font-extrabold mb-3">
            Need something that isn't here?
          </h2>
          <p className="text-green-100 mb-7 max-w-xl mx-auto text-sm">
            Member-only items are included with enrolment. If you need a document
            we don't publish, ask us - we will point you to it.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-green-800 font-bold px-7 py-3.5 rounded-full hover:bg-green-50 transition-colors text-sm"
          >
            Ask for a document <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <ResourceStrip />
    </div>
  );
}

function ItemCard({ item }: { item: LibraryItem }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col hover:border-green-300 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="w-11 h-11 bg-green-100 text-green-700 rounded-xl flex items-center justify-center">
          <FileText className="w-5 h-5" />
        </div>
        {item.free ? (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
            Free
          </span>
        ) : (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
            <Lock className="w-3 h-3" /> Members
          </span>
        )}
      </div>
      <h3 className="font-bold text-[#1a2332] mb-1.5 leading-snug">{item.title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed mb-5 flex-1">
        {item.description}
      </p>
      <div className="flex items-center gap-3 text-xs text-gray-400 pt-4 border-t border-gray-100 mb-4">
        <span className="font-semibold text-gray-600">{item.category}</span>
        <span>{item.format}</span>
        <span>{item.pages} pages</span>
      </div>
      {item.free ? (
        <button className="w-full inline-flex items-center justify-center gap-2 border-2 border-green-600 text-green-700 hover:bg-green-700 hover:text-white text-sm font-bold py-2.5 rounded-full transition-colors">
          <Download className="w-4 h-4" /> Download
        </button>
      ) : (
        <Link
          to="/courses"
          className="w-full inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold py-2.5 rounded-full transition-colors"
        >
          Enrol to unlock
        </Link>
      )}
    </div>
  );
}
