import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  BookOpen,
  ClipboardList,
  PlusCircle,
  ArrowRight,
  Loader2,
  AlertCircle,
  Eye,
  Edit,
} from "lucide-react";
import { apiRequest } from "@/lib/api-client";
import { toast } from "sonner";

interface InstructorCourse {
  id: number;
  title: string;
  slug: string;
  summary: string;
  price: number;
  currency: string;
  status: string;
  cover_image: string;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    published: "bg-[#e8f5e9] text-[#1b5e20]",
    draft: "bg-gray-100 text-gray-500",
    archived: "bg-red-50 text-red-600",
  };
  return (
    <span
      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${map[status] ?? "bg-gray-100 text-gray-500"}`}
    >
      {status}
    </span>
  );
}

export default function InstructorOverview() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<InstructorCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiRequest<InstructorCourse[]>("/catalog/instructor/courses")
      .then(setCourses)
      .catch(() => {
        setError(true);
        toast.error("Failed to load courses.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const published = courses.filter((c) => c.status === "published");
  const drafts = courses.filter((c) => c.status === "draft");

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="p-5 sm:p-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-lg font-bold text-[#1a2332]">{greeting} 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Here is a summary of your teaching activity.
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/instructor/courses/new")}
          className="flex items-center gap-2 bg-[#1b5e20] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#145218] transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" /> Create course
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {[
          { icon: BookOpen, label: "Total courses", value: courses.length },
          { icon: Eye, label: "Published", value: published.length },
          { icon: ClipboardList, label: "Drafts", value: drafts.length },
        ].map((m) => (
          <div
            key={m.label}
            className="bg-white border border-gray-100 rounded-xl p-4"
          >
            <div className="w-8 h-8 rounded-lg bg-[#e8f5e9] flex items-center justify-center mb-3">
              <m.icon className="w-4 h-4 text-[#1b5e20]" />
            </div>
            <div className="text-2xl font-bold text-[#1a2332] leading-none mb-1">
              {isLoading ? "—" : m.value}
            </div>
            <div className="text-xs text-gray-500">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Course list */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-[#1a2332]">My courses</h2>
        <button
          onClick={() => navigate("/dashboard/instructor/courses")}
          className="text-xs text-[#1b5e20] font-semibold hover:underline flex items-center gap-1"
        >
          See all <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span className="text-sm">Loading courses...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
          <AlertCircle className="w-7 h-7" />
          <p className="text-sm">Could not load courses. Please refresh.</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-xl px-6 py-12 text-center">
          <BookOpen className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="text-sm font-semibold text-gray-500 mb-1">
            No courses yet
          </p>
          <p className="text-xs text-gray-400 mb-5">
            Create your first course to get started.
          </p>
          <button
            onClick={() => navigate("/dashboard/instructor/courses/new")}
            className="bg-[#1b5e20] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#145218] transition-colors"
          >
            Create course
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          {courses.slice(0, 6).map((course, i) => (
            <div
              key={course.id}
              className={`flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors ${
                i < courses.slice(0, 6).length - 1
                  ? "border-b border-gray-50"
                  : ""
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-[#e8f5e9] shrink-0 overflow-hidden">
                {course.cover_image ? (
                  <img
                    src={course.cover_image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-[#1b5e20]" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1a2332] truncate">
                  {course.title}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {course.summary}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge status={course.status} />
                <button
                  onClick={() =>
                    navigate(`/dashboard/instructor/courses/${course.id}/edit`)
                  }
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-[#1b5e20]"
                  aria-label="Edit course"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
