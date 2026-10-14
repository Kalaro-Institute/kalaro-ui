import { Link } from "react-router";
import {
  Video, Calendar, User, ArrowRight, Radio, PlayCircle, CheckCircle,
} from "lucide-react";
import { WEBINARS } from "@/app/data/resources";
import { PageHero, ResourceStrip } from "./Shared";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

/* Webinars - upcoming live sessions separated from the on-demand
   library, because "book a seat" and "watch now" are different asks. */
export default function Webinars() {
  const live = WEBINARS.filter((w) => w.live);
  const onDemand = WEBINARS.filter((w) => !w.live);

  return (
    <div className="bg-[#f7faf7] font-[Poppins,sans-serif]">
      <PageHero
        eyebrow="Webinars"
        title="Live sessions and recordings, free and open to everyone"
        body="Run by the same people who deliver our programmes. Attend live to ask questions, or watch the recording when it suits you."
      />

      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex items-center gap-3 mb-8">
          <Radio className="w-5 h-5 text-green-600" />
          <h2 className="text-2xl font-extrabold text-[#1a2332]">
            Upcoming live sessions
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5 mb-16">
          {live.map((w) => (
            <div
              key={w.slug}
              className="bg-white border border-gray-100 rounded-2xl p-7 hover:border-green-300 hover:shadow-lg transition-all flex flex-col"
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  Live
                </span>
                <span className="text-xs text-gray-400">{w.duration}</span>
              </div>
              <h3 className="text-lg font-extrabold text-[#1a2332] mb-2 leading-snug">
                {w.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5 flex-1">
                {w.summary}
              </p>
              <ul className="space-y-1.5 mb-5">
                {w.topics.map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-2 text-xs text-gray-600"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-4 text-xs text-gray-400 mb-5 pt-5 border-t border-gray-100">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> {formatDate(w.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> {w.speaker}
                </span>
              </div>
              <Link
                to="/contact"
                className="w-full bg-green-700 hover:bg-green-800 text-white text-sm font-bold py-3 rounded-full transition-colors text-center"
              >
                Reserve a free seat
              </Link>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-8">
          <PlayCircle className="w-5 h-5 text-green-600" />
          <h2 className="text-2xl font-extrabold text-[#1a2332]">On demand</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5 mb-16">
          {onDemand.map((w) => (
            <div
              key={w.slug}
              className="bg-white border border-gray-100 rounded-2xl p-7 flex flex-col"
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                  Recording
                </span>
                <span className="text-xs text-gray-400">{w.duration}</span>
              </div>
              <h3 className="text-lg font-extrabold text-[#1a2332] mb-2 leading-snug">
                {w.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5 flex-1">
                {w.summary}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-400 pt-5 border-t border-gray-100">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> {formatDate(w.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> {w.speaker}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
          <Video className="w-8 h-8 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-extrabold text-[#1a2332] mb-2">
            Want a session on a specific topic?
          </h3>
          <p className="text-sm text-gray-500 max-w-xl mx-auto mb-6">
            Tell us what you are trying to solve and we will put it on the schedule.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white text-sm font-bold px-7 py-3 rounded-full transition-colors"
          >
            Request a session <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <ResourceStrip />
    </div>
  );
}
