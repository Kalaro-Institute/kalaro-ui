import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import CourseCategory from "./pages/CourseCategory";
import About from "./pages/About";
import Community from "./pages/Community";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import LiveClasses from "./pages/LiveClasses";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import StudentLayout from "./layouts/StudentLayout";
import StudentOverview from "./pages/dashboard/student/Overview";
import AdminLayout from "./layouts/AdminLayout";
import AdminOverview from "./pages/dashboard/admin/Overview";
import AdminUsers from "./pages/dashboard/admin/Users";

function ResourcePage({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-[#f7faf7] flex items-center justify-center font-[Poppins,sans-serif]">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📚</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-500 text-sm">
          Coming soon — check back shortly.
        </p>
      </div>
    </div>
  );
}

function DashboardStub({ label }: { label: string }) {
  return (
    <div className="min-h-screen bg-[#f7faf7] flex items-center justify-center font-[Poppins,sans-serif]">
      <p className="text-gray-500 text-sm">{label} — coming next.</p>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "courses", Component: Courses },
      { path: "course/:slug", Component: CourseDetail },
      { path: "category/:category", Component: CourseCategory },
      { path: "about", Component: About },
      { path: "community", Component: Community },
      { path: "contact", Component: Contact },
      { path: "careers", Component: Careers },
      { path: "live-classes", Component: LiveClasses },
      {
        path: "resources/blog",
        Component: () => <ResourcePage title="Blog & Articles" />,
      },
      {
        path: "resources/webinars",
        Component: () => <ResourcePage title="Webinars" />,
      },
      {
        path: "resources/library",
        Component: () => <ResourcePage title="Resource Library" />,
      },
      {
        path: "resources/glossary",
        Component: () => <ResourcePage title="HMO Glossary" />,
      },
    ],
  },

  { path: "/login", Component: Login },
  { path: "/signup", Component: SignUp },
  { path: "/verify-email", Component: VerifyEmail },
  {
    path: "/forgot-password",
    Component: () => <DashboardStub label="Forgot password" />,
  },
  {
    path: "/invite/accept",
    Component: () => <DashboardStub label="Invite acceptance" />,
  },

  {
    path: "/dashboard/student",
    element: <ProtectedRoute allowedRoles={["student"]} />,
    children: [
      {
        Component: StudentLayout,
        children: [
          { index: true, Component: StudentOverview },
          {
            path: "courses",
            Component: () => <DashboardStub label="My courses" />,
          },
          {
            path: "browse",
            Component: () => <DashboardStub label="Browse courses" />,
          },
          {
            path: "live-classes",
            Component: () => <DashboardStub label="Live classes" />,
          },
          {
            path: "assessments",
            Component: () => <DashboardStub label="Assessments" />,
          },
          {
            path: "certificates",
            Component: () => <DashboardStub label="Certificates" />,
          },
          {
            path: "payments",
            Component: () => <DashboardStub label="Payments" />,
          },
          {
            path: "settings",
            Component: () => <DashboardStub label="Settings" />,
          },
        ],
      },
    ],
  },

  {
    path: "/dashboard/instructor",
    element: <ProtectedRoute allowedRoles={["instructor"]} />,
    children: [
      {
        index: true,
        Component: () => <DashboardStub label="Instructor overview" />,
      },
    ],
  },

  {
    path: "/dashboard/admin",
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [
      {
        Component: AdminLayout,
        children: [
          { index: true, Component: AdminOverview },
          { path: "users", Component: AdminUsers },
          {
            path: "courses",
            Component: () => <DashboardStub label="Admin courses" />,
          },
          {
            path: "payments",
            Component: () => <DashboardStub label="Payments" />,
          },
          {
            path: "certificates",
            Component: () => <DashboardStub label="Certificates" />,
          },
          {
            path: "careers",
            Component: () => <DashboardStub label="Careers" />,
          },
          { path: "cms", Component: () => <DashboardStub label="CMS" /> },
          {
            path: "analytics",
            Component: () => <DashboardStub label="Analytics" />,
          },
          {
            path: "settings",
            Component: () => <DashboardStub label="Settings" />,
          },
        ],
      },
    ],
  },
]);
