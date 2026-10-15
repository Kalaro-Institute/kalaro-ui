import { useState } from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { MobileCarousel } from "@/app/components/MobileCarousel";
import { useNavigate, useSearchParams } from "react-router";
import { useLocationPricing } from "@/app/hooks/useLocationPricing";
import { CATALOG, totalLessons } from "@/app/data/courses";
import {
  Clock, BookOpen, ArrowRight, Search,
  CheckCircle, Shield, GraduationCap, Briefcase, RefreshCw, Monitor, Building2,
  Stethoscope, Calendar, Video, MonitorPlay,
} from "lucide-react";

/* Filter chips come from the real catalogue, so a new course or a new
   category shows up here automatically - no second list to maintain. */
const CATEGORIES = ["All", ...Array.from(new Set(CATALOG.map((c) => c.category)))];

/* Every card comes from the CATALOG and carries its own slug,
   so it always resolves to a real /course/:slug page. */
const ALL_COURSES = CATALOG.map((c) => ({
  title: c.title,
  category: c.category,
  level: c.level,
  duration: c.durationWeeks === 1 ? "1 Week" : `${c.durationWeeks} Weeks`,
  lessons: totalLessons(c),
  priceUsd: c.priceUsd,
  priceNgn: c.priceNgn,
  img: c.img,
  desc: c.summary,
  highlights: c.outcomes.slice(0, 3),
  instructor: c.instructor,
  slug: c.slug,
}));

const SHORTEST = Math.min(...CATALOG.map((c) => c.durationWeeks));
const LONGEST = Math.max(...CATALOG.map((c) => c.durationWeeks));
const TOTAL_LESSONS = ALL_COURSES.reduce((n, c) => n + c.lessons, 0);

/* Category colour coding for the card badge. */
const CATEGORY_BADGE: Record<string, string> = {
  "Health Insurance": "bg-emerald-100 text-emerald-700",
  "Healthcare Administration": "bg-blue-100 text-blue-700",
  "Digital Skills": "bg-purple-100 text-purple-700",
  "Project Management": "bg-amber-100 text-amber-700",
  "Continuous Professional Development": "bg-rose-100 text-rose-700",
};

function CourseCard({ course, slug }: { course: typeof ALL_COURSES[0]; slug: string }) {
  const navigate = useNavigate();
  const { formatCoursePrice } = useLocationPricing();

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer border border-gray-100 hover:-translate-y-1 flex flex-col h-full">
      <div className="relative h-52 overflow-hidden shrink-0">
        <ImageWithFallback src={course.img} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <span
          className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full ${
            CATEGORY_BADGE[course.category] ?? "bg-green-100 text-green-700"
          }`}
        >
          {course.category}
        </span>
        <span className="absolute bottom-3 left-3 text-[11px] font-semibold text-white bg-black/45 backdrop-blur-sm rounded-full px-2.5 py-1">
          {course.level}
        </span>
        <div className="absolute bottom-3 right-3 bg-white/95 rounded-full px-3 py-1 text-xs font-extrabold text-green-800 shadow-sm">
          {formatCoursePrice(course.priceNgn, course.priceUsd)}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors leading-snug">
          {course.title}
        </h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">{course.desc}</p>
        <div className="space-y-1.5 mb-4">
          {course.highlights.map((h, j) => (
            <div key={j} className="flex items-center gap-2 text-xs text-gray-600">
              <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" /> {h}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3 flex-wrap">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
          <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {course.lessons} lessons</span>
        </div>
        <div className="text-xs text-gray-400 mb-4">
          Instructor: <span className="text-gray-700 font-semibold">{course.instructor}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/course/${slug}`);
          }}
          className="mt-auto w-full bg-green-700 hover:bg-green-800 text-white text-xs font-bold px-5 py-3 rounded-full transition-colors flex items-center justify-center gap-1.5"
        >
          View course <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
export default function Courses() {
  /* The selected category lives in the URL (?category=...) so the
     nav's "Continuous Professional Development" link lands on the
     CPD pill - and pill clicks stay shareable. An unknown or
     missing param falls back to All. */
  const [searchParams, setSearchParams] = useSearchParams();
  const paramCategory = searchParams.get("category");
  const active =
    paramCategory && CATEGORIES.includes(paramCategory) ? paramCategory : "All";
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const selectCategory = (cat: string) =>
    setSearchParams(cat === "All" ? {} : { category: cat }, { replace: true });

  /* The catalogue is the only list of courses. */
  const filtered = ALL_COURSES.filter((c) => {
    const matchCat = active === "All" || c.category === active;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="font-[Poppins,sans-serif]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#071209]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1580582932707-520aed937b7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#071209] via-[#071209]/95 to-[#12351b]/80" />
        <div className="absolute -top-24 -right-32 w-96 h-96 rounded-full bg-green-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-14 sm:pt-32 sm:pb-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-green-400 mb-5">
              <span className="w-8 h-px bg-green-400" />
              Course catalogue
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.05] mb-5">
              Skills that get you{" "}
              <span className="text-green-400">hired</span> in HMOs, hospitals and remote teams
            </h1>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl mb-8">
              Practical programmes built around real job responsibilities - learn by doing,
              get certified, and keep lifetime access to every lesson.
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {[
                { v: `${ALL_COURSES.length}`, l: "Programmes" },
                { v: `${TOTAL_LESSONS}+`, l: "On-demand lessons" },
                { v: "100%", l: "Online & self-paced" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="text-2xl font-extrabold text-white leading-none mb-1">{s.v}</p>
                  <p className="text-xs text-green-300/90">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Catalogue */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-2">Explore</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">All courses</h2>
            </div>
            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 text-sm outline-none focus:border-green-500 bg-[#f7faf7] transition-colors"
              />
            </div>
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-2 flex-wrap mb-5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => selectCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                  active === cat
                    ? "bg-green-700 text-white shadow-md shadow-green-900/15"
                    : "bg-[#f7faf7] text-gray-600 border border-gray-200 hover:border-green-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <p className="text-sm text-gray-400 mb-6">
            {filtered.length} course{filtered.length !== 1 ? "s" : ""} found
          </p>
          {/* Mobile carousel */}
          <div className="sm:hidden -mx-4 px-4 overflow-x-clip">
            <MobileCarousel cardWidth="w-[82vw]">
              {filtered.map((course, i) => (
                <div key={i} className="h-full" onClick={() => navigate(`/course/${course.slug}`)}>
                  <CourseCard course={course} slug={course.slug} />
                </div>
              ))}
            </MobileCarousel>
          </div>

          {/* Desktop grid */}
          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course, i) => (
              <div key={i} className="h-full" onClick={() => navigate(`/course/${course.slug}`)}>
                <CourseCard course={course} slug={course.slug} />
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-14 sm:py-20 text-gray-400">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No courses match your search.</p>
              <p className="text-sm mt-1">Try a different keyword or category.</p>
            </div>
          )}
        </div>
      </section>

      {/* At a glance */}
      <section className="py-14 bg-[#071209] relative overflow-hidden">
        <div className="absolute -top-20 left-1/4 w-72 h-72 rounded-full bg-green-500/15 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            {[
              { icon: <Calendar className="w-6 h-6" />, v: `${SHORTEST}-${LONGEST} Weeks`, l: "Training duration per programme" },
              { icon: <Video className="w-6 h-6" />, v: "2× Weekly", l: "Live online classes every week" },
              { icon: <MonitorPlay className="w-6 h-6" />, v: "100% Online", l: "Google Classroom & live sessions" },
            ].map((item) => (
              <div key={item.v} className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500/15 text-green-400 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-green-400/20">
                  {item.icon}
                </div>
                <div className="text-lg sm:text-3xl font-extrabold text-white mb-1">{item.v}</div>
                <div className="text-[11px] sm:text-sm text-green-200/80">{item.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Eligibility */}
      <section className="py-14 bg-[#f7faf7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <p className="text-green-600 font-semibold text-xs uppercase tracking-widest mb-2">Eligibility</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">Who Can Join?</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                No advanced medical background is required for many of our courses. If you are
                motivated to grow, you are welcome here.
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { icon: <Stethoscope className="w-4 h-4" />, label: "Healthcare Professionals" },
                  { icon: <GraduationCap className="w-4 h-4" />, label: "Non-Medical Graduates" },
                  { icon: <Briefcase className="w-4 h-4" />, label: "Job Seekers" },
                  { icon: <RefreshCw className="w-4 h-4" />, label: "Career Switchers" },
                  { icon: <Monitor className="w-4 h-4" />, label: "Remote Work Aspirants" },
                  { icon: <Building2 className="w-4 h-4" />, label: "Hospital Staff" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white rounded-xl p-2.5 border border-gray-100 shadow-sm">
                    <div className="w-8 h-8 bg-green-100 text-green-700 rounded-lg flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <span className="text-xs font-semibold text-gray-700 leading-tight">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 text-lg mb-4">What You Stand to Gain</h3>
              <div className="space-y-2.5">
                {[
                  "Practical, in-demand skills healthcare employers actively look for",
                  "Deep understanding of how health insurance really works",
                  "Knowledge to prevent claim rejections and protect hospital revenue",
                  "Administrative and remote work skills for local and international roles",
                  "Increased employability and access to new career pathways",
                  "Certification and potential internship placement opportunities",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 bg-[#f7faf7] rounded-xl px-3.5 py-3">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-600 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose Kalaro */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-green-600 font-semibold text-xs uppercase tracking-widest mb-2">Why Kalaro</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a2332] mb-3">
              Why Choose Kalaro?
            </h2>
            <p className="text-gray-500 text-sm max-w-2xl mx-auto">
              Four things that set our programmes apart.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: <GraduationCap className="w-6 h-6" />, title: "Training", body: "Practical, hands-on programmes built around real job responsibilities." },
              { icon: <Shield className="w-6 h-6" />, title: "Professional Support", body: "Registration, documentation and licensing support beyond the classroom." },
              { icon: <Building2 className="w-6 h-6" />, title: "Healthcare Administration", body: "Deep expertise in hospital and HMO administration and operations." },
              { icon: <Briefcase className="w-6 h-6" />, title: "International Opportunities", body: "NCLEX, travel and permanent-residency pathways to opportunities abroad." },
            ].map((item) => (
              <div key={item.title} className="bg-[#f7faf7] rounded-3xl p-6 border border-gray-100 hover:border-green-200 hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 bg-green-700 text-white rounded-2xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-[#1a2332] mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA strip */}
      <section
        className="py-14 relative overflow-hidden"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1654762549297-2a145fcb9924?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#1b5e20]/92" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
            Not sure which course to start with?
          </h2>
          <p className="text-green-200 text-sm mb-6">
            Book a free 15-minute career consultation and let our advisors guide you to the
            right programme.
          </p>
          <button
            onClick={() => navigate("/contact")}
            className="bg-white text-green-800 font-bold px-8 py-3 rounded-full hover:bg-green-50 transition-colors text-sm"
          >
            Book a Free Consultation
          </button>
        </div>
      </section>
    </div>
  );
}
