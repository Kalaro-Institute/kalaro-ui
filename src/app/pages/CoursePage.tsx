import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import {
  Clock, BookOpen, Play, Check, CheckCircle, AlertCircle,
  GraduationCap, Award, ShieldCheck, CreditCard, Banknote,
  ShoppingBag, ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  getCourse, totalLessons, CATALOG,
  SELF_PACED, supportsSelfPaced, weeksLabel,
} from "@/app/data/courses";
import { useLocationPricing } from "@/app/hooks/useLocationPricing";
import { useCart } from "@/context/CartContext";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

/* Public course detail page. Resolves from the CATALOG so programme
   content lives in one place. "Enrol" routes to /checkout/:slug,
   where the learner picks card or bank transfer. */
export default function CoursePage() {
  const { slug } = useParams<{ slug: string }>();
  const { formatCoursePrice } = useLocationPricing();
  const { addItem, has } = useCart();

  /* Selected track per slug so navigating between programmes never
     bleeds one course's choice onto another. CPD courses never set
     it - they have no self-paced option. */
  const [tracks, setTracks] = useState<Record<string, "full" | "self">>({});
  const track = (slug && tracks[slug]) || "full";
  const selectTrack = (t: "full" | "self") => {
    if (slug) setTracks((prev) => ({ ...prev, [slug]: t }));
  };

  const course = slug ? getCourse(slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!course) {
    return (
      <div className="min-h-screen bg-[#f7faf7] flex items-center justify-center px-6 font-[Poppins,sans-serif]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-extrabold text-[#1a2332] mb-2">Course not found</h1>
          <p className="text-gray-500 text-sm mb-6">
            The course you are looking for is not available.
          </p>
          <Link
            to="/courses"
            className="inline-block bg-green-700 hover:bg-green-800 text-white text-sm font-bold px-6 py-3 rounded-full transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  /* Track-aware facts: the self-paced track swaps price, modules,
     includes, expectations and outcomes for its fixed format. */
  const canSelfPace = supportsSelfPaced(course);
  const self = canSelfPace && track === "self";
  const priceNgn = self ? SELF_PACED.priceNgn : course.priceNgn;
  const priceUsd = self ? SELF_PACED.priceUsd : course.priceUsd;
  const modules = self ? SELF_PACED.modules : course.modules;
  const includes = self ? SELF_PACED.includes : course.includes;
  const expectations = self ? SELF_PACED.expectations : course.expectations;
  const outcomes = self
    ? [
        `Understand the core ideas behind ${course.title}`,
        "Replay the two recordings whenever you need a refresher",
        "Confirm your understanding with the knowledge-check quiz",
      ]
    : course.outcomes;
  const lessons = modules.reduce((n, m) => n + m.lessons.length, 0);
  const inCart = has("course", course.slug, self ? "self-paced" : undefined);
  const checkoutHref = self
    ? `/checkout/${course.slug}?track=self-paced`
    : `/checkout/${course.slug}`;

  /* Segmented track picker, rendered in both enrol cards. */
  const trackToggle = canSelfPace ? (
    <div className="flex gap-1.5 p-1.5 bg-gray-100 rounded-full mb-4">
      {([["full", "Full programme"], ["self", "Self-paced"]] as const).map(
        ([t, label]) => (
          <button
            key={t}
            type="button"
            onClick={() => selectTrack(t)}
            className={`flex-1 text-xs font-bold py-2 rounded-full transition-colors ${
              track === t
                ? "bg-[#1b5e20] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
          </button>
        ),
      )}
    </div>
  ) : null;

  /* Related programmes: same category first, then the rest. */
  const related = [
    ...CATALOG.filter((c) => c.category === course.category && c.slug !== course.slug),
    ...CATALOG.filter((c) => c.category !== course.category && c.slug !== course.slug),
  ].slice(0, 3);

  /* "Dr. Adebayo Mensah" -> "AM" for the instructor avatar. */
  const initials = course.instructor
    .replace(/^(Dr|Mrs|Mr|Prof)\.?\s+/i, "")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <div className="bg-[#f7faf7] font-[Poppins,sans-serif] pb-24 lg:pb-0">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback src={course.img} alt={course.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#071209] via-[#071209]/92 to-[#0e2a15]/70" />
          <div className="absolute -top-24 -right-32 w-96 h-96 rounded-full bg-green-500/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-24 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-14">
          <div className="flex flex-col md:flex-row md:items-end gap-8">
            <div className="min-w-0 flex-1">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-green-300/90 mb-5 flex-wrap">
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                <span className="text-green-500/60">/</span>
                <Link to="/courses" className="hover:text-white transition-colors">Courses</Link>
                <span className="text-green-500/60">/</span>
                <span className="text-green-100 truncate">{course.title}</span>
              </nav>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-green-500 text-white shadow-sm shadow-green-900/40">
                  {course.category}
                </span>
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 text-green-200 border border-white/15">
                  {course.level} level
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-[1.1] max-w-3xl mb-4">
                {course.title}
              </h1>
              <p className="text-green-100/90 text-lg max-w-2xl leading-relaxed mb-6">
                {course.summary}
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-200">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-green-400" /> {self ? "Self-paced" : weeksLabel(course.durationWeeks)}</span>
                <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-green-400" /> {lessons} lessons</span>
                <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4 text-green-400" /> {course.level}</span>
                <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-green-400" /> {course.instructor}</span>
              </div>
            </div>

            {/* Hero enrol card */}
            <div className="w-full md:w-80 shrink-0 bg-white rounded-3xl p-6 shadow-2xl border border-white/60">
              {trackToggle}
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                {self ? SELF_PACED.label : "Full programme"}
              </p>
              <p className="text-4xl font-extrabold text-[#1a2332] mb-1">
                {formatCoursePrice(priceNgn, priceUsd)}
              </p>
              <p className="text-xs text-gray-500 mb-5">
                One-time payment &middot; {self ? "No certificate" : "Lifetime access"}
              </p>
              <Link
                to={checkoutHref}
                className="w-full bg-[#1b5e20] hover:bg-[#145218] text-white text-sm font-bold py-3.5 rounded-full transition-colors flex items-center justify-center gap-2 mb-3"
              >
                Enrol now <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => {
                  addItem({
                    kind: "course",
                    slug: course.slug,
                    variant: self ? "self-paced" : undefined,
                    title: self ? `${course.title} (Self-paced)` : course.title,
                    priceUsd,
                    priceNgn,
                    image: course.img,
                    meta: self
                      ? "Self-paced · 2 video recordings + quiz"
                      : `${weeksLabel(course.durationWeeks)} · ${lessons} lessons`,
                  });
                  toast.success(
                    `${course.title}${self ? " (Self-paced)" : ""} added to your bag`,
                  );
                }}
                className={`w-full border-2 font-semibold text-sm py-3 rounded-full transition-colors flex items-center justify-center gap-2 ${
                  inCart
                    ? "border-green-600 text-green-700 bg-green-50"
                    : "border-gray-200 hover:border-green-600 text-gray-700 hover:text-green-700"
                }`}
              >
                {inCart ? (
                  <>
                    <Check className="w-4 h-4" /> In your bag
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to bag
                  </>
                )}
              </button>
              <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <ShieldCheck className="w-4 h-4 text-green-600 mx-auto mb-1" />
                  <p className="text-[10px] font-semibold text-gray-500">Secure checkout</p>
                </div>
                <div className="text-center">
                  {self ? (
                    <AlertCircle className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                  ) : (
                    <Award className="w-4 h-4 text-green-600 mx-auto mb-1" />
                  )}
                  <p className="text-[10px] font-semibold text-gray-500">
                    {self ? "No certificate" : "Certificate"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid lg:grid-cols-[1fr_360px] gap-10 items-start">
          {/* Content */}
          <div className="min-w-0">
            <section className="mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-2">Overview</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a2332] mb-4">About this course</h2>
              <div className="w-12 h-1 bg-green-600 rounded-full mb-5" />
              <p className="text-gray-600 leading-relaxed">{course.overview}</p>
            </section>

            <section className="mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-2">Week to week</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a2332] mb-4">What to expect</h2>
              <div className="w-12 h-1 bg-green-600 rounded-full mb-5" />
              <p className="text-gray-500 text-sm mb-5">
                {self
                  ? "Your track in three steps - two recordings, then the quiz."
                  : "Concretely, here is what you will be doing as you work through the programme."}
              </p>
              <ul className="grid sm:grid-cols-2 gap-3">
                {expectations.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 bg-white border border-gray-100 rounded-2xl px-4 py-3.5 text-sm text-gray-700 shadow-sm hover:border-green-200 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-2">Curriculum</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a2332] mb-4">Course outline</h2>
              <div className="w-12 h-1 bg-green-600 rounded-full mb-5" />
              <p className="text-gray-500 text-sm mb-6">
                {self
                  ? `${modules.length} modules: two video recordings and a knowledge-check quiz - stream only, downloads disabled.`
                  : `${modules.length} modules covering everything you need to practise the work.`}
              </p>
              <div className="space-y-4">
                {modules.map((m, i) => (
                  <div
                    key={m.title}
                    className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 bg-gradient-to-br from-green-600 to-green-800 text-white rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <h3 className="text-lg font-bold text-[#1a2332]">{m.title}</h3>
                          <span className="text-[11px] font-semibold text-gray-400 shrink-0">
                            {m.lessons.length} lessons
                          </span>
                        </div>
                        <ul className="space-y-2">
                          {m.lessons.map((lesson) => (
                            <li key={lesson} className="flex items-start gap-2 text-sm text-gray-600">
                              <Play className="w-3.5 h-3.5 text-green-600 shrink-0 mt-1" />
                              {lesson}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-2">Outcomes</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a2332] mb-4">What you will learn</h2>
              <div className="w-12 h-1 bg-green-600 rounded-full mb-5" />
              <ul className="grid sm:grid-cols-2 gap-3">
                {outcomes.map((o, i) => (
                  <li
                    key={o}
                    className="flex items-start gap-3 bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-2xl px-5 py-4"
                  >
                    <span className="w-6 h-6 bg-green-700 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-800">{o}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-2">Before you start</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a2332] mb-4">Requirements</h2>
              <div className="w-12 h-1 bg-green-600 rounded-full mb-5" />
              <p className="text-gray-500 text-sm mb-5">To get the most from this programme, we recommend:</p>
              <ul className="grid sm:grid-cols-2 gap-3">
                {course.requirements.map((r) => (
                  <li key={r} className="flex items-start gap-2.5 bg-white border border-gray-100 rounded-2xl px-4 py-3.5 text-sm text-gray-700 shadow-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    {r}
                  </li>
                ))}
              </ul>
            </section>
          </div>
            {/* Enrol card */}
            <aside className="lg:sticky lg:top-24 space-y-5">
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-lg">
                {trackToggle}
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  {self ? SELF_PACED.label : "Full programme"}
                </p>
                <p className="text-3xl font-extrabold text-[#1a2332] mb-1">
                  {formatCoursePrice(priceNgn, priceUsd)}
                </p>
                <p className="text-xs text-gray-500 mb-5">
                  One-time payment &middot; {self ? "No certificate" : "Lifetime access"}
                </p>
                <Link
                  to={checkoutHref}
                  className="w-full bg-[#1b5e20] hover:bg-[#145218] text-white text-sm font-bold py-3.5 rounded-full transition-colors flex items-center justify-center gap-2 mb-3"
                >
                  Enrol now
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => {
                    addItem({
                      kind: "course",
                      slug: course.slug,
                      variant: self ? "self-paced" : undefined,
                      title: self ? `${course.title} (Self-paced)` : course.title,
                      priceUsd,
                      priceNgn,
                      image: course.img,
                      meta: self
                        ? "Self-paced · 2 video recordings + quiz"
                        : `${weeksLabel(course.durationWeeks)} · ${lessons} lessons`,
                    });
                    toast.success(
                      `${course.title}${self ? " (Self-paced)" : ""} added to your bag`,
                    );
                  }}
                  className={`w-full border-2 font-semibold text-sm py-3 rounded-full transition-colors flex items-center justify-center gap-2 mb-3 ${
                    inCart
                      ? "border-green-600 text-green-700 bg-green-50"
                      : "border-gray-200 hover:border-green-600 text-gray-700 hover:text-green-700"
                  }`}
                >
                  {inCart ? (
                    <>
                      <Check className="w-4 h-4" /> In your bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add to bag
                    </>
                  )}
                </button>
                <Link
                  to="/contact"
                  className="w-full border-2 border-gray-200 hover:border-green-600 text-gray-700 font-semibold text-sm py-3 rounded-full transition-colors flex items-center justify-center gap-2"
                >
                  Ask a question
                </Link>
              </div>

              {/* What's included */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                  What&apos;s included
                </p>
                <ul className="space-y-3">
                  {includes.map((inc) => (
                    <li key={inc} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      {inc}
                    </li>
                  ))}
                </ul>
                {self && (
                  <p className="mt-3 flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-px" />
                    No certificate is issued on the self-paced track.
                  </p>
                )}
              </div>

              {/* Pay your way */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                  Pay your way
                </p>
                <div className="flex items-start gap-2.5 text-sm text-gray-600 mb-3">
                  <CreditCard className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  Card, USSD or mobile money
                </div>
                <div className="flex items-start gap-2.5 text-sm text-gray-600 mb-3">
                  <Banknote className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  Direct bank transfer
                </div>
                <div className="flex items-start gap-2.5 text-sm text-gray-600">
                  <ShieldCheck className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  Secure, with support at every step
                </div>
              </div>

              {/* Instructor */}
              <div className="bg-gradient-to-br from-[#071209] to-[#14401f] rounded-3xl p-6 shadow-sm text-white">
                <p className="text-[11px] font-bold uppercase tracking-widest text-green-400 mb-4">
                  Your instructor
                </p>
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-400/40 flex items-center justify-center font-bold text-green-200 shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm leading-tight">{course.instructor}</p>
                    <p className="text-xs text-green-300/90 mt-0.5">Kalaro Training Faculty</p>
                  </div>
                </div>
                <p className="text-xs text-green-100/70 mt-4 leading-relaxed">
                  {self
                    ? "Lifetime access to your recordings and quiz - study on your own schedule."
                    : "Weekly live Q&amp;A sessions plus lifetime access to every lesson and template."}
                </p>
              </div>
            </aside>
          </div>
        {/* Related programmes */}
        <section className="mt-16 pt-12 border-t border-gray-200">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-2">Keep going</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a2332]">Related programmes</h2>
            </div>
            <Link
              to="/courses"
              className="text-sm font-bold text-green-700 hover:text-green-800 flex items-center gap-1.5 shrink-0"
            >
              All courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((r) => (
              <Link
                key={r.slug}
                to={`/course/${r.slug}`}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col"
              >
                <div className="relative h-36 overflow-hidden">
                  <ImageWithFallback src={r.img} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/90 text-gray-800">
                    {r.category}
                  </span>
                  <span className="absolute bottom-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-500 text-white">
                    {formatCoursePrice(r.priceNgn, r.priceUsd)}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-[#1a2332] mb-2 group-hover:text-green-700 transition-colors leading-snug">
                    {r.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {r.durationWeeks} weeks</span>
                    <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {totalLessons(r)} lessons</span>
                  </div>
                  <span className="mt-auto text-xs font-bold text-green-700 flex items-center gap-1.5">
                    View course
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Mobile sticky enrol bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between gap-4 shadow-[0_-6px_24px_rgba(0,0,0,0.08)]">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {self ? SELF_PACED.label : "Full programme"}
          </p>
          <p className="text-lg font-extrabold text-[#1a2332] leading-tight truncate">
            {formatCoursePrice(priceNgn, priceUsd)}
          </p>
        </div>
        <Link
          to={checkoutHref}
          className="shrink-0 bg-[#1b5e20] hover:bg-[#145218] text-white text-sm font-bold px-6 py-3 rounded-full transition-colors flex items-center gap-2"
        >
          Enrol now <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
