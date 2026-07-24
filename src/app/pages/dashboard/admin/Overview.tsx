import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Users,
  BookOpen,
  CreditCard,
  Award,
  TrendingUp,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { apiRequest } from "@/lib/api-client";

interface AdminUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  email_verified: boolean;
}

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

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
  onClick?: () => void;
}

function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
  onClick,
}: MetricCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white border rounded-xl p-5 transition-all ${
        onClick
          ? "cursor-pointer hover:border-[#1b5e20]/30 hover:shadow-sm"
          : ""
      } ${accent ? "border-amber-200 bg-amber-50" : "border-gray-100"}`}
    >
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
          accent ? "bg-amber-100" : "bg-[#e8f5e9]"
        }`}
      >
        <Icon
          className={`w-4 h-4 ${accent ? "text-amber-600" : "text-[#1b5e20]"}`}
        />
      </div>
      <div className="text-2xl font-bold text-[#1a2332] leading-none mb-1">
        {value}
      </div>
      <div className="text-xs text-gray-500">{label}</div>
      {sub && (
        <div
          className={`text-xs mt-1 font-medium ${accent ? "text-amber-600" : "text-[#1b5e20]"}`}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-[#1a2332]">{value}</span>
    </div>
  );
}

export default function AdminOverview() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      apiRequest<AdminUser[]>("/auth/admin/users"),
      apiRequest<Course[]>("/catalog/admin/courses"),
    ])
      .then(([u, c]) => {
        setUsers(u);
        setCourses(c);
      })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, []);

  const students = users.filter((u) => u.role === "student");
  const instructors = users.filter((u) => u.role === "instructor");
  const publishedCourses = courses.filter((c) => c.status === "published");
  const draftCourses = courses.filter((c) => c.status === "draft");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span className="text-sm">Loading overview...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400 gap-3">
        <AlertCircle className="w-8 h-8" />
        <p className="text-sm">Failed to load data. Please refresh.</p>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-lg font-bold text-[#1a2332]">Admin overview</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Platform summary and quick actions.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <MetricCard
          icon={Users}
          label="Total students"
          value={students.length}
          sub="Active learners"
          onClick={() => navigate("/dashboard/admin/users")}
        />
        <MetricCard
          icon={TrendingUp}
          label="Instructors"
          value={instructors.length}
          sub="Teaching staff"
          onClick={() => navigate("/dashboard/admin/users")}
        />
        <MetricCard
          icon={BookOpen}
          label="Published courses"
          value={publishedCourses.length}
          sub={`${draftCourses.length} in draft`}
          onClick={() => navigate("/dashboard/admin/courses")}
        />
        <MetricCard
          icon={CreditCard}
          label="Pending payments"
          value="—"
          sub="Awaiting verification"
          accent
          onClick={() => navigate("/dashboard/admin/payments")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#1a2332]">
              Recent courses
            </h2>
            <button
              onClick={() => navigate("/dashboard/admin/courses")}
              className="text-xs text-[#1b5e20] font-semibold hover:underline flex items-center gap-1"
            >
              Manage <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {courses.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-xl px-5 py-10 text-center text-gray-400">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No courses yet.</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
              {courses.slice(0, 5).map((course, i) => (
                <div
                  key={course.id}
                  className={`flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer ${
                    i < courses.slice(0, 5).length - 1
                      ? "border-b border-gray-50"
                      : ""
                  }`}
                  onClick={() => navigate("/dashboard/admin/courses")}
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
                  <span
                    className={`text-[10px] font-semibold px-2 py-1 rounded-full shrink-0 ${
                      course.status === "published"
                        ? "bg-[#e8f5e9] text-[#1b5e20]"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {course.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-[#1a2332] mb-3">
              User breakdown
            </h2>
            <div className="bg-white border border-gray-100 rounded-xl px-5 py-1">
              <StatRow label="Students" value={students.length} />
              <StatRow label="Instructors" value={instructors.length} />
              <StatRow
                label="Unverified emails"
                value={users.filter((u) => !u.email_verified).length}
              />
              <StatRow label="Total users" value={users.length} />
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[#1a2332] mb-3">
              Quick actions
            </h2>
            <div className="space-y-2">
              {[
                {
                  label: "Manage users",
                  desc: "Invite or create instructors and students",
                  to: "/dashboard/admin/users",
                  icon: Users,
                },
                {
                  label: "Manage courses",
                  desc: "Publish, edit, or review courses",
                  to: "/dashboard/admin/courses",
                  icon: BookOpen,
                },
                {
                  label: "Verify payments",
                  desc: "Approve pending bank transfers",
                  to: "/dashboard/admin/payments",
                  icon: CreditCard,
                },
                {
                  label: "Certificates",
                  desc: "View and manage issued certificates",
                  to: "/dashboard/admin/certificates",
                  icon: Award,
                },
              ].map((action) => (
                <button
                  key={action.to}
                  onClick={() => navigate(action.to)}
                  className="w-full flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 hover:border-[#1b5e20]/20 hover:bg-[#f7faf7] transition-colors text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#e8f5e9] flex items-center justify-center shrink-0 group-hover:bg-[#1b5e20] transition-colors">
                    <action.icon className="w-4 h-4 text-[#1b5e20] group-hover:text-white transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#1a2332]">
                      {action.label}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate">
                      {action.desc}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-300 ml-auto shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
