import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  FileText,
  Video,
  Download,
  Loader2,
  AlertCircle,
  PlayCircle,
} from "lucide-react";
import { apiRequest, mediaUrl } from "@/lib/api-client";
import type { ApiError } from "@/lib/api-client";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────

interface Resource {
  id: number;
  title: string;
  file_url: string;
  size_bytes: number;
}

interface Lesson {
  id: number;
  title: string;
  order: number;
  content_type: string;
  duration_seconds: number;
}

interface Module {
  id: number;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: number;
  title: string;
  slug: string;
  summary: string;
  description: string;
  objectives: string[];
  cover_image: string | null;
  duration_weeks: number;
  modules: Module[];
}

interface Progress {
  percent: number;
  completed_at: string | null;
}

// ─── Helpers ─────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDuration(seconds: number): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

// ─── Sidebar module ───────────────────────────────────────────
// NOTE: per-lesson completion isn't available from the backend yet
// (the progress endpoint only returns an overall percent, no list of
// completed lesson ids). Until that endpoint exists, every lesson
// renders as not-done — no false checkmarks, just nothing lit up yet.

function SidebarModule({
  module,
  activeLesson,
  onSelectLesson,
}: {
  module: Module;
  activeLesson: Lesson | null;
  onSelectLesson: (lesson: Lesson) => void;
}) {
  const [open, setOpen] = useState(
    module.lessons.some((l) => l.id === activeLesson?.id) || true,
  );

  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white/90 truncate">
            {module.title}
          </p>
          <p className="text-[10px] text-green-300/50 mt-0.5">
            {module.lessons.length} lesson
            {module.lessons.length !== 1 ? "s" : ""}
          </p>
        </div>
        {open ? (
          <ChevronUp className="w-3.5 h-3.5 text-white/40 shrink-0" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-white/40 shrink-0" />
        )}
      </button>

      {open && (
        <div className="pb-1">
          {module.lessons.map((lesson) => {
            const isActive = activeLesson?.id === lesson.id;
            const Icon = lesson.content_type === "video" ? Video : FileText;

            return (
              <button
                key={lesson.id}
                onClick={() => onSelectLesson(lesson)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  isActive
                    ? "bg-[#1b5e20] text-white"
                    : "hover:bg-white/5 text-white/60 hover:text-white/90"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    isActive ? "bg-white/20" : "bg-white/10"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                </div>
                <span className="text-xs truncate flex-1">{lesson.title}</span>
                {lesson.duration_seconds > 0 && (
                  <span className="text-[10px] shrink-0 opacity-60">
                    {formatDuration(lesson.duration_seconds)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────

export default function CoursePlayer() {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<Progress>({
    percent: 0,
    completed_at: null,
  });
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [isMarkingDone, setIsMarkingDone] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Flat ordered list of all lessons across modules
  const allLessons: Lesson[] =
    course?.modules
      .slice()
      .sort((a, b) => a.order - b.order)
      .flatMap((m) => m.lessons.slice().sort((a, b) => a.order - b.order)) ??
    [];

  const activeLessonIndex = allLessons.findIndex(
    (l) => l.id === activeLesson?.id,
  );
  const prevLesson =
    activeLessonIndex > 0 ? allLessons[activeLessonIndex - 1] : null;
  const nextLesson =
    activeLessonIndex < allLessons.length - 1
      ? allLessons[activeLessonIndex + 1]
      : null;

  const isCurrentDone = false;

  useEffect(() => {
    if (!courseSlug) return;

    apiRequest<Course>(`/catalog/courses/${courseSlug}`)
      .then(async (courseData) => {
        setCourse(courseData);

        const progressData = await apiRequest<Progress>(
          `/catalog/courses/${courseData.id}/progress`,
        );
        setProgress(progressData);

        const flat = courseData.modules
          .slice()
          .sort((a, b) => a.order - b.order)
          .flatMap((m) => m.lessons.slice().sort((a, b) => a.order - b.order));

        setActiveLesson(flat[0] ?? null);
      })
      .catch((err) => {
        console.error("CoursePlayer load failed:", err);
        setError(true);
      })
      .finally(() => setIsLoading(false));
  }, [courseSlug]);

  useEffect(() => {
    if (!activeLesson) return;
    setResources([]);
    setIsLoadingResources(true);
    apiRequest<Resource[]>(`/catalog/lessons/${activeLesson.id}/resources`)
      .then(setResources)
      .catch(() => setResources([]))
      .finally(() => setIsLoadingResources(false));
  }, [activeLesson?.id]);

  const handleMarkComplete = async () => {
    if (!course || !activeLesson) return;

    setIsMarkingDone(true);
    try {
      await apiRequest(`/catalog/lessons/${activeLesson.id}/complete`, {
        method: "POST",
      });

      const freshProgress = await apiRequest<Progress>(
        `/catalog/courses/${course.id}/progress`,
      );
      setProgress(freshProgress);
      toast.success("Lesson marked as complete.");
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message ?? "Failed to mark lesson complete.");
    } finally {
      setIsMarkingDone(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f7faf7] flex items-center justify-center font-[Poppins,sans-serif]">
        <Loader2 className="w-6 h-6 animate-spin text-[#1b5e20] mr-2" />
        <span className="text-sm text-gray-500">Loading course...</span>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-[#f7faf7] flex flex-col items-center justify-center gap-3 font-[Poppins,sans-serif]">
        <AlertCircle className="w-8 h-8 text-gray-400" />
        <p className="text-sm text-gray-500">Failed to load course.</p>
        <button
          onClick={() => navigate("/dashboard/student/courses")}
          className="text-sm text-[#1b5e20] font-semibold hover:underline"
        >
          Back to my courses
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen font-[Poppins,sans-serif] bg-[#0d1a0e] overflow-hidden">
      {/* ── Sidebar ── */}
      <div
        className={`flex-shrink-0 bg-[#071a08] border-r border-white/5 flex flex-col transition-all duration-200 ${
          sidebarOpen ? "w-72" : "w-0 overflow-hidden"
        }`}
      >
        {/* Sidebar header */}
        <div className="px-4 py-4 border-b border-white/5 shrink-0">
          <button
            onClick={() => navigate("/dashboard/student/courses")}
            className="flex items-center gap-2 text-green-300/60 hover:text-green-300 transition-colors text-xs mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            My courses
          </button>
          <h2 className="text-white text-sm font-bold leading-tight line-clamp-2">
            {course.title}
          </h2>
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-green-300/50">Progress</span>
              <span className="text-[10px] text-green-400 font-semibold">
                {progress.percent}%
              </span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Module list */}
        <div className="flex-1 overflow-y-auto">
          {course.modules
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((module) => (
              <SidebarModule
                key={module.id}
                module={module}
                activeLesson={activeLesson}
                onSelectLesson={setActiveLesson}
              />
            ))}
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <div className="bg-[#071a08] border-b border-white/5 px-4 h-12 flex items-center justify-between shrink-0">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="text-white/60 hover:text-white transition-colors p-1"
            aria-label="Toggle sidebar"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {activeLesson && (
            <span className="text-white/70 text-xs truncate mx-4 flex-1">
              {activeLesson.title}
            </span>
          )}

          <span className="text-green-400/70 text-xs shrink-0">
            {progress.percent}% complete
          </span>
        </div>

        {/* Lesson content area */}
        <div className="flex-1 overflow-y-auto bg-[#f7faf7]">
          {!activeLesson ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <BookOpen className="w-12 h-12 opacity-30" />
              <p className="text-sm">
                Select a lesson from the sidebar to begin.
              </p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-5 py-8">
              {/* Lesson header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  {activeLesson.content_type === "video" ? (
                    <span className="flex items-center gap-1.5 text-[10px] font-semibold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
                      <Video className="w-3 h-3" /> Video
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[10px] font-semibold bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                      <FileText className="w-3 h-3" /> Reading
                    </span>
                  )}
                  {isCurrentDone && (
                    <span className="flex items-center gap-1.5 text-[10px] font-semibold bg-[#e8f5e9] text-[#1b5e20] px-2.5 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3" /> Completed
                    </span>
                  )}
                </div>
                <h1 className="text-xl font-bold text-[#1a2332]">
                  {activeLesson.title}
                </h1>
              </div>

              {/* Video placeholder */}
              {activeLesson.content_type === "video" && (
                <div className="bg-[#071a08] rounded-2xl aspect-video flex flex-col items-center justify-center mb-6 border border-white/5">
                  <PlayCircle className="w-16 h-16 text-white/20 mb-3" />
                  <p className="text-white/40 text-sm">
                    Video playback coming soon
                  </p>
                  <p className="text-white/20 text-xs mt-1">
                    Download resources below while you wait
                  </p>
                </div>
              )}

              {/* Text content */}
              {activeLesson.content_type === "text" && (
                <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 min-h-48">
                  <p className="text-gray-400 text-sm italic">
                    Text content will appear here.
                  </p>
                </div>
              )}

              {/* Resources */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-[#1a2332] mb-3">
                  Lesson resources
                </h3>
                {isLoadingResources ? (
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading resources...
                  </div>
                ) : resources.length === 0 ? (
                  <div className="bg-white border border-gray-100 rounded-xl px-4 py-5 text-center text-gray-400">
                    <p className="text-xs">
                      No resources attached to this lesson.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {resources.map((resource) => (
                      <a
                        key={resource.id}
                        href={mediaUrl(resource.file_url)}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 hover:border-[#1b5e20]/30 hover:bg-[#f7faf7] transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#e8f5e9] flex items-center justify-center shrink-0 group-hover:bg-[#1b5e20] transition-colors">
                          <Download className="w-4 h-4 text-[#1b5e20] group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#1a2332] truncate">
                            {resource.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatBytes(resource.size_bytes)}
                          </p>
                        </div>
                        <span className="text-xs text-[#1b5e20] font-semibold shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          Download
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation + mark complete */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100">
                {/* Previous */}
                <button
                  onClick={() => prevLesson && setActiveLesson(prevLesson)}
                  disabled={!prevLesson}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#1b5e20] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>

                {/* Mark complete — only triggers POST */}
                <button
                  onClick={handleMarkComplete}
                  disabled={isMarkingDone}
                  className="flex items-center gap-2 bg-[#1b5e20] text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-[#145218] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {isMarkingDone ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Marking...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" /> Mark as complete
                    </>
                  )}
                </button>

                {/* Next — just navigates, never POSTs */}
                <button
                  onClick={() => nextLesson && setActiveLesson(nextLesson)}
                  disabled={!nextLesson}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#1b5e20] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
