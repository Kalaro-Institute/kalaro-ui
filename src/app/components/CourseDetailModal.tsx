import { useEffect, useState } from "react";
import {
  X,
  BookOpen,
  Clock,
  ChevronDown,
  ChevronUp,
  Video,
  FileText,
  Lock,
  Loader2,
  AlertCircle,
  Globe,
  CheckCircle,
} from "lucide-react";
import { apiRequest } from "@/lib/api-client";
import { PaymentModal } from "./PaymentModal";



interface LessonDetail {
  id: number;
  title: string;
  order: number;
  content_type: string;
  duration_seconds: number;
}

interface ModuleDetail {
  id: number;
  title: string;
  order: number;
  lessons: LessonDetail[];
}

interface CourseDetail {
  id: number;
  title: string;
  slug: string;
  summary: string;
  price: number;
  currency: string;
  status: string;
  cover_image: string | null;
  description: string;
  objectives: string[];
  duration_weeks: number;
  instructor_id: number;
  modules: ModuleDetail[];
}

function formatDuration(seconds: number): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

function ModuleAccordion({
  module,
  locked,
}: {
  module: ModuleDetail;
  locked: boolean;
}) {
  const [open, setOpen] = useState(true);

  const totalDuration = module.lessons.reduce(
    (acc, l) => acc + (l.duration_seconds ?? 0),
    0,
  );

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3.5 bg-[#f7faf7] hover:bg-gray-100 transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#1a2332] truncate">
            {module.title}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {module.lessons.length} lesson
            {module.lessons.length !== 1 ? "s" : ""}
            {totalDuration > 0 && ` · ${formatDuration(totalDuration)}`}
          </p>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
        )}
      </button>

      {open && (
        <div className="divide-y divide-gray-50">
          {module.lessons.length === 0 ? (
            <p className="px-4 py-3 text-xs text-gray-400">No lessons yet.</p>
          ) : (
            module.lessons.map((lesson) => {
              const Icon = lesson.content_type === "video" ? Video : FileText;
              return (
                <div
                  key={lesson.id}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                      lesson.content_type === "video"
                        ? "bg-blue-50"
                        : "bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 ${
                        lesson.content_type === "video"
                          ? "text-blue-500"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                  <span className="text-sm text-gray-700 flex-1 truncate">
                    {lesson.title}
                  </span>
                  {lesson.duration_seconds > 0 && (
                    <span className="text-xs text-gray-400 shrink-0">
                      {formatDuration(lesson.duration_seconds)}
                    </span>
                  )}
                  {locked && (
                    <Lock className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}



interface Props {
  slug: string;
  onClose: () => void;
  locked?: boolean;
  onEnrolled?: () => void;
  isEnrolled?: boolean; 
}

export function CourseDetailModal({
  slug,
  onClose,
  locked = false,
  onEnrolled,
  isEnrolled = false,
}: Props) {
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    apiRequest<CourseDetail>(`/catalog/courses/${slug}`)
      .then(setCourse)
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, [slug]);

  const totalLessons =
    course?.modules.reduce((acc, m) => acc + m.lessons.length, 0) ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-gray-100 transition-colors text-gray-500"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {isLoading ? (
          <div className="flex items-center justify-center py-24 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span className="text-sm">Loading course...</span>
          </div>
        ) : error || !course ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
            <AlertCircle className="w-8 h-8" />
            <p className="text-sm">Failed to load course details.</p>
          </div>
        ) : (
          <>
            {/* Cover image / header */}
            <div className="relative h-48 bg-[#071a08] shrink-0">
              {course.cover_image ? (
                <img
                  src={course.cover_image}
                  alt={course.title}
                  className="w-full h-full object-cover opacity-60"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-white/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#071a08]/80 to-transparent" />
              <div className="absolute bottom-4 left-5 right-12">
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full mb-2 inline-block ${
                    course.status === "published"
                      ? "bg-[#e8f5e9] text-[#1b5e20]"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {course.status}
                </span>
                <h2 className="text-white text-xl font-bold leading-tight">
                  {course.title}
                </h2>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 p-5 space-y-5">
              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                {course.duration_weeks > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {course.duration_weeks} week
                    {course.duration_weeks !== 1 ? "s" : ""}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  {course.modules.length} module
                  {course.modules.length !== 1 ? "s" : ""} · {totalLessons}{" "}
                  lesson{totalLessons !== 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  Online
                </span>
              </div>

              {/* Price + enroll (student locked view) */}
              {locked && !isEnrolled && onEnrolled && (
                <div className="flex items-center justify-between bg-[#f7faf7] border border-[#1b5e20]/20 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Course fee</p>
                    <p className="text-xl font-bold text-[#1a2332]">
                      {Number(course.price) === 0
                        ? "Free"
                        : `${course.currency} ${Number(course.price).toLocaleString()}`}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPayment(true)}
                    className="bg-[#1b5e20] text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-[#145218] transition-colors"
                  >
                    Enrol now
                  </button>
                </div>
              )}

              {/* Summary */}
              {course.summary && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {course.summary}
                </p>
              )}

              {/* Description */}
              {course.description && (
                <div>
                  <h3 className="text-sm font-bold text-[#1a2332] mb-2">
                    About this course
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {course.description}
                  </p>
                </div>
              )}

              {/* Objectives */}
              {course.objectives?.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-[#1a2332] mb-2">
                    What you will learn
                  </h3>
                  <div className="space-y-2">
                    {course.objectives.map((obj, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-[#1b5e20] shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modules */}
              {course.modules.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-[#1a2332]">
                      Course content
                    </h3>
                    {locked && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Lock className="w-3 h-3" /> Enrol to access
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {course.modules.map((mod) => (
                      <ModuleAccordion
                        key={mod.id}
                        module={mod}
                        locked={locked && !isEnrolled}
                      />
                    ))}
                  </div>
                </div>
              )}

              {course.modules.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No modules added yet.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      {showPayment && course && (
        <PaymentModal
          course={course}
          onClose={() => setShowPayment(false)}
          onSuccess={() => {
            onEnrolled?.();
            onClose();
          }}
        />
      )}
    </div>
  );
}
