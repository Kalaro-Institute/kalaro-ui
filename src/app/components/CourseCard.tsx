import { BookOpen, Clock, ArrowRight } from "lucide-react";


export interface CourseCardData {
  id: number;
  title: string;
  slug: string;
  summary: string;
  price: number;
  currency: string;
  status: string;
  cover_image: string | null;
  duration_weeks?: number;
  instructor_id?: number;
}

interface Props {
  course: CourseCardData;
  progress?: number;
  isEnrolled?: boolean;
  onClick?: () => void;
}

export function CourseCard({ course, progress, isEnrolled, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col transition-all ${
        onClick
          ? "cursor-pointer hover:border-[#1b5e20]/30 hover:shadow-md"
          : ""
      }`}
    >
      {/* Cover image */}
      <div className="relative h-40 bg-[#e8f5e9] shrink-0 overflow-hidden">
        {course.cover_image ? (
          <img
            src={course.cover_image}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-[#1b5e20]/30" />
          </div>
        )}

        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#1a2332] text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
          {Number(course.price) === 0
            ? "Free"
            : `${course.currency} ${Number(course.price).toLocaleString()}`}
        </div>

        {/* Enrolled badge */}
        {isEnrolled && (
          <div className="absolute top-3 left-3 bg-[#1b5e20] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
            Enrolled
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-[#1a2332] mb-1.5 leading-snug line-clamp-2">
          {course.title}
        </h3>
        <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2 flex-1">
          {course.summary}
        </p>

        {/* Duration */}
        {course.duration_weeks && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            {course.duration_weeks} week{course.duration_weeks !== 1 ? "s" : ""}
          </div>
        )}

        {/* Progress bar if enrolled */}
        {isEnrolled && typeof progress === "number" && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-gray-400">Progress</span>
              <span className="text-[11px] font-semibold text-[#1b5e20]">
                {progress}%
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1b5e20] rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          className="w-full bg-[#1b5e20] text-white text-xs font-bold py-2.5 rounded-xl hover:bg-[#145218] transition-colors flex items-center justify-center gap-1.5"
        >
          {isEnrolled ? (
            <>
              {(progress ?? 0) > 0 ? "Continue" : "Start learning"}{" "}
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              View course <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
