import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import nclexLogo from "@/imports/nclex-kenya.jpg";

/* The Kalaro NCLEX Kenya brand mark: exam, travel and support.

   Used as the hero image on the NCLEX hub, as a brand mark in the
   hero of every NCLEX service page, and in the mid-page band of
   NCLEX content - so the same artwork signals "NCLEX" wherever a
   visitor lands on the topic.

   variant="card"  small rounded badge that sits beside hero text
   variant="hero"  large framed image, for a page's main hero
   variant="band"  wide decorative presentation, for inner sections */
export function NclexLogo({
  variant = "card",
  className,
  alt = "Kalaro NCLEX Kenya - exam, travel and support",
}: {
  variant?: "card" | "hero" | "band";
  className?: string;
  alt?: string;
}) {
  const frame =
    variant === "hero"
      ? "bg-white rounded-3xl p-4 sm:p-6 shadow-2xl ring-1 ring-black/5"
      : variant === "band"
        ? "bg-white rounded-2xl p-3 shadow-lg ring-1 ring-black/5"
        : "bg-white rounded-2xl p-2.5 shadow-sm ring-1 ring-black/5";

  const img =
    variant === "hero"
      ? "w-full h-auto object-contain"
      : variant === "band"
        ? "h-40 sm:h-48 w-auto object-contain mx-auto"
        : "h-28 w-auto object-contain";

  return (
    <div className={`${frame} ${className ?? ""}`}>
      <ImageWithFallback src={nclexLogo} alt={alt} className={img} />
    </div>
  );
}
