import { useState, useEffect, useCallback } from "react";
import {
  Video,
  Plus,
  Calendar,
  Clock,
  Copy,
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import { apiRequest } from "@/lib/api-client";
import type { ApiError } from "@/lib/api-client";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────
// Best-guess shapes based on the POST .../sessions schema. GET .../sessions
// has not been confirmed live — if the real response differs, errors will
// surface in the console/toast and we adjust from there.

interface Course {
  id: number;
  title: string;
}

interface LiveSession {
  id: number;
  title: string;
  scheduled_at: string;
  duration_minutes: number;
  meet_link: string;
  status: string;
}

// ─── Helpers ─────────────────────────────────────────────────

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    scheduled: "bg-[#e8f5e9] text-[#1b5e20]",
    completed: "bg-gray-100 text-gray-500",
    cancelled: "bg-red-50 text-red-500",
  };
  return map[status.toLowerCase()] ?? "bg-gray-100 text-gray-500";
}

// ─── Schedule session modal ────────────────────────────────────

function ScheduleSessionModal({
  courseId,
  onClose,
  onScheduled,
}: {
  courseId: number;
  onClose: () => void;
  onScheduled: (session: LiveSession) => void;
}) {
  const [title, setTitle] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("60");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !scheduledAt) return;

    setError(null);
    setIsSubmitting(true);
    try {
      const session = await apiRequest<LiveSession>(
        `/live/courses/${courseId}/sessions`,
        {
          method: "POST",
          body: {
            title: title.trim(),
            scheduled_at: new Date(scheduledAt).toISOString(),
            duration_minutes: Number(durationMinutes),
          },
        },
      );
      toast.success("Live class scheduled.");
      onScheduled(session);
      onClose();
    } catch (err) {
      const apiErr = err as ApiError;
      // Surface the raw error so we can diagnose exactly what the backend
      // is rejecting (e.g. Google not connected, bad field, etc.)
      setError(apiErr.message ?? "Failed to schedule class.");
      console.error("Schedule session failed:", apiErr);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden font-[Poppins,sans-serif]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-[#1a2332]">
            Schedule a live class
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Session title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Week 1 Live Q&A"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1b5e20] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Date and time *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-gray-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="datetime-local"
                required
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-3 text-sm outline-none focus:border-[#1b5e20] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Duration (minutes)
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-gray-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="number"
                min={15}
                step={15}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-3 text-sm outline-none focus:border-[#1b5e20] transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-700 text-sm font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !scheduledAt}
              className="flex-1 bg-[#1b5e20] text-white text-sm font-semibold py-3 rounded-xl hover:bg-[#145218] disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Scheduling...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" /> Schedule
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Session row ────────────────────────────────────────────

function SessionRow({ session }: { session: LiveSession }) {
  const copyLink = () => {
    navigator.clipboard.writeText(session.meet_link).then(
      () => toast.success("Meet link copied."),
      () => toast.error("Could not copy link."),
    );
  };

  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0">
      <div className="w-10 h-10 rounded-lg bg-[#e8f5e9] flex items-center justify-center shrink-0">
        <Video className="w-4 h-4 text-[#1b5e20]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#1a2332] truncate">
          {session.title}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {formatDateTime(session.scheduled_at)} · {session.duration_minutes}{" "}
          min
        </p>
      </div>
      <span
        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${statusBadge(
          session.status,
        )}`}
      >
        {session.status}
      </span>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={copyLink}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-[#1b5e20]"
          aria-label="Copy Meet link"
          title="Copy Meet link"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
        <a
          href={session.meet_link}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-[#1b5e20]"
          aria-label="Open Meet link"
          title="Open in Google Meet"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────

export default function InstructorLiveClasses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [sessionsError, setSessionsError] = useState<string | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);

  useEffect(() => {
    apiRequest<Course[]>("/catalog/instructor/courses")
      .then((data) => {
        setCourses(data);
        if (data.length > 0) setSelectedCourseId(data[0].id);
      })
      .catch(() => toast.error("Failed to load your courses."))
      .finally(() => setIsLoadingCourses(false));
  }, []);

  const loadSessions = useCallback((courseId: number) => {
    setIsLoadingSessions(true);
    setSessionsError(null);
    apiRequest<LiveSession[]>(`/live/courses/${courseId}/sessions`)
      .then(setSessions)
      .catch((err) => {
        const apiErr = err as ApiError;
        setSessionsError(apiErr.message ?? "Failed to load sessions.");
        console.error("Load sessions failed:", apiErr);
      })
      .finally(() => setIsLoadingSessions(false));
  }, []);

  useEffect(() => {
    if (selectedCourseId !== null) loadSessions(selectedCourseId);
  }, [selectedCourseId, loadSessions]);

  const handleConnectGoogle = async () => {
    setIsConnectingGoogle(true);
    try {
      const data = await apiRequest<{ authorization_url: string }>(
        "/live/google/connect",
      );
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        console.error("Unexpected /live/google/connect response:", data);
        toast.error(
          "Could not start Google connection — unexpected response. Check the console.",
        );
      }
    } catch (err) {
      const apiErr = err as ApiError;
      console.error("Google connect failed:", apiErr);
      toast.error(apiErr.message ?? "Could not connect Google Calendar.");
    } finally {
      setIsConnectingGoogle(false);
    }
  };

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  return (
    <div className="p-5 sm:p-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-lg font-bold text-[#1a2332]">Live classes</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Schedule and manage live sessions for your courses.
          </p>
        </div>
        {selectedCourseId !== null && (
          <button
            onClick={() => setShowScheduleModal(true)}
            className="flex items-center gap-2 bg-[#1b5e20] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#145218] transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" /> Schedule class
          </button>
        )}
      </div>

      {/* Google connect banner — shown always for now since we have no
          reliable way yet to check connection status ahead of time. */}
      <div className="flex items-center gap-3 bg-[#f7faf7] border border-gray-100 rounded-xl px-4 py-3 mb-6">
        <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
        <p className="text-xs text-gray-500 flex-1">
          Live classes use Google Meet. If scheduling fails below, you likely
          need to connect your Google Calendar first.
        </p>
        <button
          onClick={handleConnectGoogle}
          disabled={isConnectingGoogle}
          className="text-xs font-semibold text-[#1b5e20] hover:underline disabled:opacity-60 shrink-0 flex items-center gap-1.5"
        >
          {isConnectingGoogle ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : null}
          Connect Google Calendar
        </button>
      </div>

      {isLoadingCourses ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span className="text-sm">Loading courses...</span>
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-xl px-6 py-16 text-center">
          <Video className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="text-sm font-semibold text-gray-500">No courses yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Create a course first to schedule live classes for it.
          </p>
        </div>
      ) : (
        <>
          {/* Course selector */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Course
            </label>
            <select
              value={selectedCourseId ?? ""}
              onChange={(e) => setSelectedCourseId(Number(e.target.value))}
              className="w-full sm:w-80 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1b5e20] transition-colors bg-white"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Sessions list */}
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
            {isLoadingSessions ? (
              <div className="flex items-center justify-center py-16 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span className="text-sm">Loading sessions...</span>
              </div>
            ) : sessionsError ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2 px-6 text-center">
                <AlertCircle className="w-7 h-7" />
                <p className="text-sm text-red-500 font-semibold">
                  {sessionsError}
                </p>
                <p className="text-xs text-gray-400">
                  Check the browser console for the full error details.
                </p>
              </div>
            ) : sessions.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <Video className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-semibold text-gray-500 mb-1">
                  No live classes scheduled
                </p>
                <p className="text-xs text-gray-400">
                  Schedule your first session for{" "}
                  {selectedCourse?.title ?? "this course"}.
                </p>
              </div>
            ) : (
              sessions.map((s) => <SessionRow key={s.id} session={s} />)
            )}
          </div>
        </>
      )}

      {showScheduleModal && selectedCourseId !== null && (
        <ScheduleSessionModal
          courseId={selectedCourseId}
          onClose={() => setShowScheduleModal(false)}
          onScheduled={(session) => setSessions((prev) => [...prev, session])}
        />
      )}
    </div>
  );
}
