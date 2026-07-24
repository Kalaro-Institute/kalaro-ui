import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/lib/auth.types";

interface Props {
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: Props) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7faf7]">
        <div className="w-8 h-8 border-2 border-[#1b5e20] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const fallback =
      user.role === "admin"
        ? "/dashboard/admin"
        : user.role === "instructor"
          ? "/dashboard/instructor"
          : "/dashboard/student";
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}
