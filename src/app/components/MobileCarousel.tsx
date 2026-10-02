import { useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MobileCarouselProps {
  children: React.ReactNode[];
  /** Width of each card as a tailwind/css class. Defaults to 80vw with max-w-sm */
  cardWidth?: string;
  /** Show arrow buttons */
  arrows?: boolean;
}

export function MobileCarousel({
  children,
  cardWidth = "w-[80vw] max-w-sm",
  arrows = true,
}: MobileCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const count = children.length;

  const getCardWidth = () => {
    const container = scrollRef.current;
    if (!container || !container.children[0]) return 1;
    return (container.children[0] as HTMLElement).offsetWidth + 16; // +gap
  };

  const scrollTo = useCallback((index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const cardW = getCardWidth();
    container.scrollTo({ left: index * cardW, behavior: "smooth" });
    setCurrent(index);
  }, []);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    const cardW = getCardWidth();
    const idx = Math.round(container.scrollLeft / cardW);
    setCurrent(Math.max(0, Math.min(count - 1, idx)));
  };

  const prev = () => scrollTo(Math.max(0, current - 1));
  const next = () => scrollTo(Math.min(count - 1, current + 1));

  return (
    <div className="relative">
      {/* Scroll track */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
      >
        {children.map((child, i) => (
          <div key={i} className={`snap-start shrink-0 ${cardWidth} flex flex-col`}>
            {child}
          </div>
        ))}
        {/* Right padding sentinel so last card isn't flush against edge */}
        <div className="shrink-0 w-4" aria-hidden="true" />
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center items-center gap-1.5 mt-2">
        {children.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              current === i
                ? "w-6 h-2 bg-green-700"
                : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Arrow buttons */}
      {arrows && count > 1 && (
        <>
          {/* Arrows sit INSIDE the track bounds. Positioned outside
              (e.g. -translate-x-2) they extended past the carousel, and
              because these carousels are used inside -mx-4 wrappers
              that sit flush with the viewport edge, that pushed the
              document wider than the screen and made mobile browsers
              shrink the page to fit. */}
          <button
            onClick={prev}
            disabled={current === 0}
            aria-label="Previous"
            className="absolute left-1 top-[40%] -translate-y-1/2 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 disabled:opacity-20 hover:bg-gray-50 transition-all z-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            disabled={current === count - 1}
            aria-label="Next"
            className="absolute right-1 top-[40%] -translate-y-1/2 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 disabled:opacity-20 hover:bg-gray-50 transition-all z-10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
}
