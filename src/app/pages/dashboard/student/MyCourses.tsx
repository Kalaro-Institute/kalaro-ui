import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  BookOpen,
  Loader2,
  AlertCircle,
  ArrowRight,
  Clock,
} from "lucide-react";
import { apiRequest } from "@/lib/api-client";
import { CourseDetailModal } from "@/app/components/CourseDetailModal";
import type { CourseCardData } from "@/app/components/CourseCard";

interface Enrollment {
  id: number;
  course_id: number;
  status: string;
  source: string;
  enrolled_at: string;
}

interface EnrolledCourse extends CourseCardData {
  enrolled_at: string;
  enrollment_status: string;
}

export default function MyCourses() {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [enrollments, catalog] = await Promise.all([
          apiRequest<Enrollment[]>("/payments/my-enrollments"),
          apiRequest<CourseCardData[]>("/catalog/courses"),
        ]);

        const matched = enrollments.reduce<EnrolledCourse[]>(
          (acc, enrollment) => {
            const course = catalog.find(
              (c) => Number(c.id) === Number(enrollment.course_id),
            );
            if (!course) return acc;
            acc.push({
              id: course.id,
              title: course.title,
              slug: course.slug,
              summary: course.summary,
              price: course.price,
              currency: course.currency,
              status: course.status,
              cover_image: course.cover_image,
              duration_weeks: course.duration_weeks,
              instructor_id: course.instructor_id,
              enrolled_at: enrollment.enrolled_at,
              enrollment_status: enrollment.status,
            });
            return acc;
          },
          [],
        );

        console.log("final matched:", matched);
        setEnrolledCourses(matched);
      } catch (err) {
        console.error("load error:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <div className="p-5 sm:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-[#1a2332]">My courses</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {enrolledCourses.length} course
          {enrolledCourses.length !== 1 ? "s" : ""} enrolled
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span className="text-sm">Loading your courses...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
          <AlertCircle className="w-7 h-7" />
          <p className="text-sm">Failed to load courses. Please refresh.</p>
        </div>
      ) : enrolledCourses.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl px-6 py-16 text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm font-semibold text-gray-500 mb-1">
            No courses yet
          </p>
          <p className="text-xs text-gray-400 mb-6">
            Browse available courses and enrol to start learning.
          </p>
          <button
            onClick={() => navigate("/dashboard/student/browse")}
            className="bg-[#1b5e20] text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-[#145218] transition-colors"
          >
            Browse courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {enrolledCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => setSelectedSlug(course.slug)}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:border-[#1b5e20]/30 hover:shadow-md transition-all group"
            >
              {/* Cover */}
              <div className="h-40 bg-[#e8f5e9] overflow-hidden relative">
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
                <div className="absolute top-3 left-3 bg-[#1b5e20] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  Enrolled
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-sm font-bold text-[#1a2332] mb-1 leading-snug line-clamp-2 group-hover:text-[#1b5e20] transition-colors">
                  {course.title}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                  {course.summary}
                </p>

                {course.duration_weeks && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    {course.duration_weeks} week
                    {course.duration_weeks !== 1 ? "s" : ""}
                  </div>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/dashboard/student/courses/${course.slug}/learn`);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 bg-[#1b5e20] text-white text-xs font-bold py-2.5 rounded-xl hover:bg-[#145218] transition-colors"
                >
                  Start learning
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedSlug && (
        <CourseDetailModal
          slug={selectedSlug}
          onClose={() => setSelectedSlug(null)}
          isEnrolled
        />
      )}
    </div>
  );
}
