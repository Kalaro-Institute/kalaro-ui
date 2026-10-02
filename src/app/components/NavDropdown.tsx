import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import type { NavDropdownItem } from "@/app/data/navigation";

type Props = {
  items: NavDropdownItem[];
  onClose: () => void;
  /** Panel width, e.g. "w-[720px]" */
  width?: string;
  /** Optional heading above the grid */
  heading?: string;
  /** Footer link, e.g. "View all courses" */
  footer?: { label: string; to: string };
};

/* ── Flat menu ─────────────────────────────────────────────────
   A simple, scannable list: every entry visible at once, each one
   an icon, the course name and a single line saying what it covers.

   Deliberately no module lists, outlines, prices or badges here.
   That detail belongs on the course page (/course/<slug>), which a
   visitor reaches by clicking any row. Keeping the nav light is what
   stops it from duplicating the course page.                     */
export function NavFlatMenu({
  items,
  onClose,
  width = "w-[720px]",
  heading,
  footer,
}: Props) {
  return (
    <div
      className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 ${width} max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 animate-in`}
    >
      {/* Arrow */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100" />

      {heading && (
        <p className="px-6 pt-5 pb-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
          {heading}
        </p>
      )}

      <div className="p-3 grid sm:grid-cols-2 gap-1 max-h-[480px] overflow-y-auto">
        {items.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            onClick={onClose}
            className="group flex items-start gap-3 p-3 rounded-xl hover:bg-green-50 transition-colors"
          >
            <span className="w-9 h-9 rounded-lg bg-green-100 text-green-700 flex items-center justify-center shrink-0 group-hover:bg-green-700 group-hover:text-white transition-colors">
              {item.icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-gray-800 leading-tight group-hover:text-green-700 transition-colors">
                {item.label}
              </span>
              <span className="block text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                {item.desc}
              </span>
            </span>
            <ArrowRight className="w-4 h-4 text-gray-300 shrink-0 mt-1 opacity-0 group-hover:opacity-100 group-hover:text-green-600 transition-all" />
          </Link>
        ))}
      </div>

      {footer && (
        <div className="border-t border-gray-100 px-6 py-4">
          <Link
            to={footer.to}
            onClick={onClose}
            className="inline-flex items-center gap-2 text-sm font-bold text-green-700 hover:gap-3 transition-all"
          >
            {footer.label} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}