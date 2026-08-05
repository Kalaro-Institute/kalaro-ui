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
import InstructorLayout from "./layouts/InstructorLayout";
import InstructorOverview from "./pages/dashboard/instructor/Overview";
import InstructorCourses from "./pages/dashboard/instructor/Courses";
import CourseBuilder from "./pages/dashboard/instructor/CourseBuilder";
import BrowseCourses from "./pages/dashboard/student/Browse";
import ForgotPassword from "./pages/ForgotPassword";
import AcceptInvite from "./pages/AcceptInvite";
import AdminPayments from "./pages/dashboard/admin/Payment";
import PaystackCallback from "./pages/PaystackCallback";
import MyCourses from "./pages/dashboard/student/MyCourses";
import CoursePlayer from "./pages/dashboard/student/CoursePlayer";

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
  { path: "/forgot-password", Component: ForgotPassword },
  { path: "/accept-invite", Component: AcceptInvite },
  { path: "/payment/callback", Component: PaystackCallback },

  {
    path: "/dashboard/student",
    element: <ProtectedRoute allowedRoles={["student"]} />,

    children: [
      { path: "courses/:courseSlug/learn", Component: CoursePlayer },
      {
        Component: StudentLayout,
        children: [
          { index: true, Component: StudentOverview },
          { path: "courses", Component: MyCourses },
          { path: "browse", Component: BrowseCourses },
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
        Component: InstructorLayout,
        children: [
          { index: true, Component: InstructorOverview },
          { path: "courses", Component: InstructorCourses },

          { path: "courses/new", Component: CourseBuilder },
          { path: "courses/:courseId/edit", Component: CourseBuilder },
          {
            path: "students",
            Component: () => <DashboardStub label="Students" />,
          },
          {
            path: "live-classes",
            Component: () => <DashboardStub label="Live classes" />,
          },
          {
            path: "grading",
            Component: () => <DashboardStub label="Grading" />,
          },
        ],
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
          { path: "payments", Component: AdminPayments },
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
