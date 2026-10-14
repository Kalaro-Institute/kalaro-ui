import { useEffect, useState } from "react";
import { Search, BookOpen, Loader2, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/api-client";
import { CourseCard } from "@/app/components/CourseCard";
import type { CourseCardData } from "@/app/components/CourseCard";
import { toast } from "sonner";
import { CourseDetailModal } from "@/app/components/CourseDetailModal";

export default function BrowseCourses() {
  const [courses, setCourses] = useState<CourseCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  
  const fetchCourses = () => {
    setIsLoading(true);
    apiRequest<CourseCardData[]>("/catalog/courses")
      .then(setCourses)
      .catch(() => {
        setError(true);
        toast.error("Failed to load courses.");
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.summary.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-5 sm:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-[#1a2332]">Browse courses</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {courses.length} programme{courses.length !== 1 ? "s" : ""} available
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#1b5e20] transition-colors bg-white"
        />
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
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-semibold">
            {search
              ? "No courses match your search."
              : "No courses available yet."}
          </p>
        </div>
      ) : (
        // In Browse.tsx, update the grid:
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onClick={() => setSelectedSlug(course.slug)}
            />
          ))}
        </div>
      )}
      {selectedSlug && (
        <CourseDetailModal
          slug={selectedSlug}
          onClose={() => setSelectedSlug(null)}
          locked
          onEnrolled={() => {
            setSelectedSlug(null);
            fetchCourses();
          }}
        />
      )}
    </div>
  );
}
