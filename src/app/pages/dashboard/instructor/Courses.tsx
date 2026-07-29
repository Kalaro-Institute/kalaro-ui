import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  BookOpen,
  PlusCircle,
  Edit,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";
import { apiRequest } from "@/lib/api-client";
import type { ApiError } from "@/lib/api-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
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
  duration_weeks: number;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    published: "bg-[#e8f5e9] text-[#1b5e20]",
    draft: "bg-gray-100 text-gray-500",
    archived: "bg-red-50 text-red-600",
  };
  return (
    <span
      className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${map[status] ?? "bg-gray-100 text-gray-500"}`}
    >
      {status}
    </span>
  );
}

export default function InstructorCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<InstructorCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [publishingId, setPublishingId] = useState<number | null>(null);

  const fetchCourses = useCallback(() => {
    setIsLoading(true);
    apiRequest<InstructorCourse[]>("/catalog/instructor/courses")
      .then(setCourses)
      .catch(() => {
        setError(true);
        toast.error("Failed to load courses.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handlePublish = async (course: InstructorCourse) => {
    setPublishingId(course.id);
    try {
      await apiRequest(`/catalog/courses/${course.id}/publish`, {
        method: "POST",
      });
      toast.success(`"${course.title}" has been published.`);
      fetchCourses();
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message ?? "Failed to publish course.");
    } finally {
      setPublishingId(null);
    }
  };

  const handleUnpublish = async (course: InstructorCourse) => {
    setPublishingId(course.id);
    try {
      await apiRequest<InstructorCourse>(`/catalog/courses/${course.id}`, {
        method: "PATCH",
        body: { status: "draft" },
      });
      toast.success(`"${course.title}" moved back to draft.`);
      fetchCourses();
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message ?? "Failed to unpublish course.");
    } finally {
      setPublishingId(null);
    }
  };

  return (
    <div className="p-5 sm:p-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-lg font-bold text-[#1a2332]">My courses</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {courses.length} course{courses.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/instructor/courses/new")}
          className="flex items-center gap-2 bg-[#1b5e20] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#145218] transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" /> Create course
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span className="text-sm">Loading courses...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
          <AlertCircle className="w-7 h-7" />
          <p className="text-sm">Failed to load courses. Please refresh.</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-xl px-6 py-16 text-center">
          <BookOpen className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="text-sm font-semibold text-gray-500 mb-1">
            No courses yet
          </p>
          <p className="text-xs text-gray-400 mb-5">
            Create your first course to start teaching.
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
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Course
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide hidden sm:table-cell">
                  Duration
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide hidden sm:table-cell">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr
                  key={course.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors last:border-0"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#e8f5e9] shrink-0 overflow-hidden">
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
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#1a2332] truncate max-w-[200px]">
                          {course.title}
                        </p>
                        <p className="text-xs text-gray-400 truncate max-w-[200px]">
                          {course.summary}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <span className="text-sm text-gray-500">
                      {course.duration_weeks
                        ? `${course.duration_weeks}w`
                        : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <span className="text-sm font-medium text-[#1a2332]">
                      {course.currency} {Number(course.price).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={course.status} />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    {publishingId === course.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400 ml-auto" />
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(
                                `/dashboard/instructor/courses/${course.id}/edit`,
                              )
                            }
                          >
                            <Edit className="w-4 h-4 mr-2" /> Edit course
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {course.status === "published" ? (
                            <DropdownMenuItem
                              onClick={() => handleUnpublish(course)}
                            >
                              <EyeOff className="w-4 h-4 mr-2" /> Move to draft
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handlePublish(course)}
                            >
                              <Eye className="w-4 h-4 mr-2" /> Publish
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
