import { useParams, useNavigate, Link } from "react-router";
import {
  ArrowLeft, Clock, BookOpen, Play, Check, CheckCircle, AlertCircle,
  GraduationCap, Award, ShieldCheck, CreditCard, Banknote,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import { getCourse, totalLessons } from "@/app/data/courses";
import { useLocationPricing } from "@/app/hooks/useLocationPricing";
import { useCart } from "@/context/CartContext";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

/* Public course detail page. Resolves from the CATALOG so programme
   content lives in one place. "Enrol" routes to /checkout/:slug,
   where the learner picks card or bank transfer. */
export default function CoursePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { formatAmount } = useLocationPricing();
  const { addItem, has } = useCart();

  const course = slug ? getCourse(slug) : undefined;
  const inCart = course ? has("course", course.slug) : false;

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

  const lessons = totalLessons(course);

  return (
    <div className="bg-[#f7faf7] font-[Poppins,sans-serif]">
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0">
          <ImageWithFallback src={course.img} alt={course.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/40" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-14">
          <div className="flex flex-col md:flex-row md:items-end gap-8">
            <div className="min-w-0 flex-1">
              <button
                onClick={() => navigate(-1)}
                className="flex w-fit items-center gap-2 text-sm text-green-300 hover:text-white transition-colors mb-5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <span className="block w-fit text-xs font-bold px-3 py-1.5 rounded-full bg-white/90 text-gray-800 mb-4">
                {course.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight max-w-3xl mb-4">
                {course.title}
              </h1>
              <p className="text-green-100 text-lg max-w-2xl leading-relaxed mb-6">
                {course.summary}
              </p>
              <div className="flex flex-wrap items-center gap-5 text-sm text-gray-200">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {course.durationWeeks} weeks</span>
                <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> {lessons} lessons</span>
                <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4" /> {course.level}</span>
                <span className="flex items-center gap-1.5"><Award className="w-4 h-4" /> {course.instructor}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid lg:grid-cols-[1fr_340px] gap-10 items-start">
          {/* Content */}
          <div>
            <h2 className="text-2xl font-extrabold text-[#1a2332] mb-3">About this course</h2>
            <p className="text-gray-600 leading-relaxed mb-10">{course.overview}</p>

            <h2 className="text-2xl font-extrabold text-[#1a2332] mb-3">What to expect</h2>
            <p className="text-gray-500 text-sm mb-5">
              Concretely, here is what you will be doing as you work through the programme.
            </p>
            <ul className="grid sm:grid-cols-2 gap-3 mb-12">
              {course.expectations.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700"
                >
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-extrabold text-[#1a2332] mb-3">Course outline</h2>
            <p className="text-gray-500 text-sm mb-6">
              {course.modules.length} modules covering everything you need to practise the work.
            </p>
            <div className="space-y-4 mb-12">
              {course.modules.map((m, i) => (
                <div key={m.title} className="bg-white border border-gray-100 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 text-green-700 rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#1a2332] mb-3">{m.title}</h3>
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

            <h2 className="text-2xl font-extrabold text-[#1a2332] mb-3">What you will learn</h2>
            <ul className="space-y-3 mb-12">
              {course.outcomes.map((o, i) => (
                <li key={o} className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl px-5 py-4">
                  <span className="w-6 h-6 bg-green-700 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-gray-800">{o}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-extrabold text-[#1a2332] mb-3">Requirements</h2>
            <p className="text-gray-500 text-sm mb-5">To get the most from this programme, we recommend:</p>
            <ul className="grid sm:grid-cols-2 gap-3 mb-12">
              {course.requirements.map((r) => (
                <li key={r} className="flex items-start gap-2.5 bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Enrol card */}
          <aside className="lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-7 shadow-lg">
              <p className="text-sm text-gray-500 mb-1">Full programme</p>
              <p className="text-3xl font-extrabold text-[#1a2332] mb-1">
                {formatAmount(course.priceUsd)}
              </p>
              <p className="text-xs text-gray-500 mb-5">One-time payment &middot; Lifetime access</p>

              <Link
                to={`/checkout/${course.slug}`}
                className="w-full bg-[#1b5e20] hover:bg-[#145218] text-white text-sm font-bold py-3.5 rounded-full transition-colors flex items-center justify-center gap-2 mb-3"
              >
                Enrol now
              </Link>

              <button
                onClick={() => {
                  addItem({
                    kind: "course",
                    slug: course.slug,
                    title: course.title,
                    priceUsd: course.priceUsd,
                    image: course.img,
                    meta: `${course.durationWeeks} weeks &middot; ${lessons} lessons`,
                  });
                  toast.success(`${course.title} added to your bag`);
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

              <div className="mt-6 pt-5 border-t border-gray-100">
                <p className="text-xs font-bold text-[#1a2332] uppercase tracking-wide mb-3">
                  What&apos;s included
                </p>
                <ul className="space-y-2.5">
                  {course.includes.map((inc) => (
                    <li key={inc} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      {inc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-5">
              <p className="text-xs font-bold text-[#1a2332] uppercase tracking-wide mb-3">
                Pay your way
              </p>
              <div className="flex items-start gap-2.5 text-sm text-gray-600 mb-3">
                <CreditCard className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                Card, USSD or mobile money
              </div>
              <div className="flex items-start gap-2.5 text-sm text-gray-600 mb-4">
                <Banknote className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                Direct bank transfer
              </div>
              <div className="flex items-start gap-2.5 text-sm text-gray-600">
                <ShieldCheck className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                Secure, with support at every step
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

