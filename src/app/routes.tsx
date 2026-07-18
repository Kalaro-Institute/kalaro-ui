import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import About from "./pages/About";
import Community from "./pages/Community";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import LiveClasses from "./pages/LiveClasses";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

// Placeholder for resource sub-pages
function ResourcePage({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-[#f7faf7] flex items-center justify-center font-[Poppins,sans-serif]">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📚</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-500 text-sm">Coming soon — check back shortly.</p>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  // Pages with full navbar + footer layout
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "courses", Component: Courses },
      { path: "about", Component: About },
      { path: "community", Component: Community },
      { path: "contact", Component: Contact },
      { path: "careers", Component: Careers },
      { path: "live-classes", Component: LiveClasses },
      // Resources sub-pages
      { path: "resources/blog", Component: () => <ResourcePage title="Blog & Articles" /> },
      { path: "resources/webinars", Component: () => <ResourcePage title="Webinars" /> },
      { path: "resources/library", Component: () => <ResourcePage title="Resource Library" /> },
      { path: "resources/glossary", Component: () => <ResourcePage title="HMO Glossary" /> },
    ],
  },
  // Auth pages — full-screen, no navbar/footer
  { path: "/signup", Component: SignUp },
  { path: "/login", Component: Login },
]);
