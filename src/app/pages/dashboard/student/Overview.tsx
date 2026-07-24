import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  BookOpen,
  BarChart2,
  ClipboardList,
  Award,
  Clock,
  Video,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api-client";

interface Course {
  id: number;
  title: string;
  slug: string;
  summary: string;
  price: number;
  currency: string;
  status: string;
  cover_image: string;
}

function MetricCard({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: string | number;
  label: string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <div className="w-8 h-8 rounded-lg bg-[#e8f5e9] flex items-center justify-center mb-3">
        <Icon className="w-4 h-4 text-[#1b5e20]" />
      </div>
      <div className="text-2xl font-bold text-[#1a2332] leading-none mb-1">
        {value}
      </div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-[#1b5e20] rounded-full transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export default function StudentOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiRequest<Course[]>("/catalog/courses")
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setIsLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="p-5 sm:p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-[#1a2332]">
          {greeting}, {user?.first_name} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Here is what is happening with your learning today.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <MetricCard
          icon={BookOpen}
          value={courses.length}
          label="Available courses"
        />
        <MetricCard icon={BarChart2} value="—" label="Avg progress" />
        <MetricCard icon={ClipboardList} value="—" label="Due this week" />
        <MetricCard icon={Award} value="—" label="Certificates" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
        {/* Left: courses */}
        <div className="min-w-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#1a2332]">
              Browse available courses
            </h2>
            <button
              onClick={() => navigate("/dashboard/student/browse")}
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
          ) : courses.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No courses available yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {courses.slice(0, 4).map((course) => (
                <div
                  key={course.id}
                  className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 group cursor-pointer hover:border-[#1b5e20]/20 transition-colors"
                  onClick={() => navigate(`/dashboard/student/browse`)}
                >
                  <div className="w-14 h-14 rounded-lg bg-[#e8f5e9] shrink-0 overflow-hidden">
                    {course.cover_image ? (
                      <img
                        src={course.cover_image}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-[#1b5e20]" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1a2332] truncate mb-1 group-hover:text-[#1b5e20] transition-colors">
                      {course.title}
                    </p>
                    <p className="text-xs text-gray-400 line-clamp-1 mb-2">
                      {course.summary}
                    </p>
                    <ProgressBar value={0} />
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-[#1a2332]">
                      {course.currency} {Number(course.price).toLocaleString()}
                    </p>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${
                        course.status === "published"
                          ? "bg-[#e8f5e9] text-[#1b5e20]"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {course.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-[#1a2332] mb-3">
              Next live class
            </h2>
            <div className="bg-[#071a08] rounded-xl p-4">
              <div className="inline-flex items-center gap-1.5 bg-red-500/20 text-red-300 text-[10px] font-semibold px-2.5 py-1 rounded-full mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                No sessions scheduled
              </div>
              <p className="text-white text-sm font-semibold leading-snug mb-1">
                Live classes will appear here
              </p>
              <p className="text-green-300/60 text-xs mb-4">
                Check back soon for upcoming sessions
              </p>
              <button
                onClick={() => navigate("/dashboard/student/live-classes")}
                className="w-full bg-[#4caf50] text-[#0d2a0e] text-xs font-bold py-2.5 rounded-lg transition-opacity hover:opacity-90"
              >
                View all sessions
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[#1a2332] mb-3">
              Upcoming deadlines
            </h2>
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
              <div className="px-4 py-8 text-center text-gray-400">
                <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">No pending deadlines</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[#1a2332] mb-3">
              Quick actions
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  label: "Browse courses",
                  icon: BookOpen,
                  to: "/dashboard/student/browse",
                },
                {
                  label: "Live classes",
                  icon: Video,
                  to: "/dashboard/student/live-classes",
                },
                {
                  label: "Assessments",
                  icon: ClipboardList,
                  to: "/dashboard/student/assessments",
                },
                {
                  label: "Certificates",
                  icon: Award,
                  to: "/dashboard/student/certificates",
                },
              ].map((action) => (
                <button
                  key={action.to}
                  onClick={() => navigate(action.to)}
                  className="bg-white border border-gray-100 rounded-xl p-3 flex flex-col items-center gap-2 hover:border-[#1b5e20]/30 hover:bg-[#f7faf7] transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#e8f5e9] flex items-center justify-center group-hover:bg-[#1b5e20] transition-colors">
                    <action.icon className="w-4 h-4 text-[#1b5e20] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-xs text-gray-600 font-medium text-center leading-tight">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
