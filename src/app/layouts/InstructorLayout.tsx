import { NavLink, Outlet, useNavigate } from "react-router";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Video,
  ClipboardList,
  LogOut,
  Bell,
  ChevronDown,
  Search,
  PlusCircle,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/app/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import logo from "@/imports/logo.jpeg";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

const MAIN_NAV = [
  {
    label: "Overview",
    to: "/dashboard/instructor",
    icon: LayoutDashboard,
    end: true,
  },
  { label: "My courses", to: "/dashboard/instructor/courses", icon: BookOpen },
  {
    label: "Create course",
    to: "/dashboard/instructor/courses/new",
    icon: PlusCircle,
  },
  { label: "Students", to: "/dashboard/instructor/students", icon: Users },
  {
    label: "Live classes",
    to: "/dashboard/instructor/live-classes",
    icon: Video,
  },
  {
    label: "Grading",
    to: "/dashboard/instructor/grading",
    icon: ClipboardList,
  },
];

export default function InstructorLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user
    ? `${user.first_name?.[0] ?? "I"}${user.last_name?.[0] ?? ""}`.toUpperCase()
    : "I";

  const fullName =
    user?.first_name || user?.last_name
      ? `${user.first_name} ${user.last_name}`.trim()
      : "Instructor";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#f7faf7] font-[Poppins,sans-serif]">
        <Sidebar collapsible="offcanvas" className="border-none">
          <SidebarHeader className="px-4 py-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
                <ImageWithFallback
                  src={logo}
                  alt="Kalaro"
                  className="h-6 w-auto object-contain"
                />
              </div>
              <div>
                <span className="text-white text-sm font-semibold tracking-tight block">
                  Kalaro
                </span>
                <span className="text-green-400/60 text-[10px] uppercase tracking-widest">
                  Instructor
                </span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2">
            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-green-800/60 px-2 mb-1">
                Teaching
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {MAIN_NAV.map((item) => (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton asChild size="default">
                        <NavLink
                          to={item.to}
                          end={item.end}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                              isActive
                                ? "bg-[#1b5e20] text-white font-semibold"
                                : "text-green-200/70 hover:text-white hover:bg-white/5"
                            }`
                          }
                        >
                          <item.icon className="w-4 h-4 shrink-0" />
                          <span>{item.label}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="px-3 py-4 border-t border-white/5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 w-full px-2 py-2 rounded-lg hover:bg-white/5 transition-colors text-left">
                  <div className="w-8 h-8 rounded-full bg-[#1b5e20] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold truncate">
                      {fullName}
                    </p>
                    <p className="text-green-300/60 text-[11px] truncate">
                      {user?.email}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-green-300/40 shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-52 mb-1"
              >
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col min-w-0">
          <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-5 h-14 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-gray-500 hover:text-gray-800 -ml-1" />
              <div className="hidden sm:block w-px h-5 bg-gray-200" />
              <div className="hidden sm:flex items-center w-52 h-8 rounded-lg border border-gray-200 bg-gray-50 px-3 gap-2 text-gray-400 text-xs">
                <Search className="w-3.5 h-3.5 shrink-0" />
                Search
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                aria-label="Notifications"
                className="relative text-gray-500 hover:text-gray-800 transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
              </button>
              <div className="w-8 h-8 rounded-full bg-[#e8f5e9] flex items-center justify-center text-[#1b5e20] text-xs font-semibold">
                {initials}
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
