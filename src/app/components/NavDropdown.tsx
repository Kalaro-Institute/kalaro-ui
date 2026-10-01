import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ChevronRight, ArrowRight } from "lucide-react";
import type { NavDropdownItem } from "@/app/data/navigation";

type Props = {
  items: NavDropdownItem[];
  onClose: () => void;
  /** Panel width, e.g. "w-[860px]" for Courses, "w-[760px]" for others */
  width?: string;
  /** Width of the left rail that lists the programs */
  railWidth?: string;
  /** Show the program badge + "View full program" link */
  showBadge?: boolean;
  railHeading?: string;
};

/* ── Selection dropdown ────────────────────────────────────────
   Left rail  → all programs visible at a glance.
   Right panel → the modules of the SELECTED program only, so the
   menu never expands every module at once. Selection follows the
   pointer and falls back to click for keyboard/touch users.     */
export function NavSelectionMenu({
  items,
  onClose,
  width = "w-[860px]",
  railWidth = "w-[290px]",
  showBadge = false,
  railHeading,
}: Props) {
  const [active, setActive] = useState(0);

  // Reset selection whenever the menu is re-opened
  useEffect(() => {
    setActive(0);
  }, [items]);

  const selected = items[active] ?? items[0];
  const modules = selected?.subItems ?? [];

  return (
    <div
      className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 ${width} bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 animate-in`}
    >
      {/* Arrow */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100" />

      <div className="grid grid-cols-[auto_1fr]">
        {/* ── Left rail: programs ── */}
        <div className={`${railWidth} border-r border-gray-100 p-3 max-h-[460px] overflow-y-auto`}>
          {railHeading && (
            <p className="px-3 pt-1 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              {railHeading}
            </p>
          )}
          {items.map((item, i) => {
            const isActive = i === active;
            return (
              <button
                key={item.label}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                  isActive ? "bg-green-50" : "hover:bg-gray-50"
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive ? "bg-green-700 text-white" : "bg-green-100 text-green-700"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="flex-1 min-w-0">
                  <span
                    className={`block text-sm font-semibold leading-tight ${
                      isActive ? "text-green-800" : "text-gray-800"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span className="block text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                    {item.desc}
                  </span>
                </span>
                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition-all ${
                    isActive ? "text-green-600" : "text-gray-300"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* ── Right panel: modules of the selected program only ── */}
        <div className="p-6 min-h-[320px] flex flex-col">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="min-w-0">
              <h3 className="text-base font-bold text-gray-900 leading-tight">
                {selected?.label}
              </h3>
              {selected?.desc && (
                <p className="text-xs text-gray-500 mt-1">{selected.desc}</p>
              )}
            </div>
            {showBadge && selected?.badge && (
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                {selected.badge}
              </span>
            )}
          </div>

          {modules.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 flex-1">
              {modules.map((sub) => (
                <Link
                  key={sub.label}
                  to={sub.to}
                  onClick={onClose}
                  className="group flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-green-700 hover:bg-green-50 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-300 group-hover:bg-green-600 shrink-0" />
                  <span className="flex-1">{sub.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:text-green-600 transition-all" />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 flex-1">
              Explore everything covered in this program.
            </p>
          )}

          {selected?.to && (
            <Link
              to={selected.to}
              onClick={onClose}
              className="mt-5 inline-flex items-center gap-2 self-start text-sm font-bold text-green-700 hover:gap-3 transition-all"
            >
              View full program <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}