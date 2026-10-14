import { createBrowserRouter, useParams } from "react-router";
import Layout from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CoursePage from "./pages/CoursePage";
import CourseCheckout from "./pages/CourseCheckout";
import ServiceCheckout from "./pages/ServiceCheckout";
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
import Nclex from "./pages/Services/Nclex";
import InternationalPr from "./pages/Services/InternationalPr";
import { NclexServiceRoute, PrServiceRoute } from "./pages/Services/ServiceDetail";
import { BlogIndex, BlogPost } from "./pages/Resources/Blog";
import Webinars from "./pages/Resources/Webinars";
import ResourceLibrary from "./pages/Resources/Library";
import Glossary from "./pages/Resources/Glossary";
import Shop from "./pages/Shop";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/Cart";

/* Resolve the article body by slug; the page handles a missing post. */
function BlogPostRoute() {
  const { slug } = useParams<{ slug: string }>();
  return <BlogPost slug={slug ?? ""} />;
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
      { path: "course/:slug", Component: CoursePage },
      { path: "checkout/:slug", Component: CourseCheckout },
      { path: "checkout/service/:slug", Component: ServiceCheckout },
      { path: "category/:category", Component: CourseCategory },
      { path: "about", Component: About },
      { path: "community", Component: Community },
      { path: "contact", Component: Contact },
      { path: "careers", Component: Careers },
      { path: "live-classes", Component: LiveClasses },

      /* NCLEX hub + individual services */
      { path: "nclex", Component: Nclex },
      { path: "nclex/services/:slug", Component: NclexServiceRoute },

      /* International permanent residency hub */
      { path: "services/permanent-residency", Component: InternationalPr },
      { path: "services/permanent-residency/services/:slug", Component: PrServiceRoute },

      /* Resources - real content pages, one per dropdown entry */
      { path: "resources/blog", Component: BlogIndex },
      { path: "resources/blog/:slug", Component: BlogPostRoute },
      { path: "resources/webinars", Component: Webinars },
      { path: "resources/library", Component: ResourceLibrary },
      { path: "resources/glossary", Component: Glossary },

      /* Shop + cart */
      { path: "shop", Component: Shop },
      { path: "shop/:slug", Component: ProductPage },
      { path: "cart", Component: Cart },
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
