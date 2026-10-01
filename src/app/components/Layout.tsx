import { useState, useRef, useEffect } from "react";
import { Outlet, NavLink, useNavigate, Link } from "react-router";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { NavSelectionMenu } from "@/app/components/NavDropdown";
import { NAV, FOOTER_GROUPS } from "@/app/data/navigation";
import logo from "@/imports/logo.jpeg";
import {
  Menu, X, Phone, Mail, MapPin, Facebook, Twitter,
  Instagram, Linkedin, Youtube, ChevronDown,
  UserPlus, LogIn,
} from "lucide-react";

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close dropdown on scroll
  useEffect(() => {
    function handler() {
      setOpenDropdown(null);
    }
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white font-[Poppins,sans-serif]">
      {/* ── TOP BAR ──────────────────────────────────────────── */}
      <div className="bg-[#1b5e20] text-white text-xs py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> +234 800 000 0000</span>
            <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> info@kalaroinstitute.com</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-green-200 text-[11px]">Follow us:</span>
            {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="hover:text-green-300 transition-colors">
                <Icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── NAVBAR ───────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white shadow-md" ref={navRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">

            {/* Logo — large & prominent */}
            <NavLink to="/" className="flex items-center gap-3 shrink-0" onClick={() => setOpenDropdown(null)}>
              <ImageWithFallback
                src={logo}
                alt="Kalaro Institute of HMO Operations"
                className="h-[60px] w-auto object-contain"
              />
            </NavLink>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-0.5">
              {NAV.map((item) => (
                <div key={item.label} className="relative"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                >
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                        className={`flex items-center gap-1 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                          openDropdown === item.label
                            ? "text-green-700 bg-green-50"
                            : "text-gray-700 hover:text-green-700 hover:bg-gray-50"
                        }`}
                      >
                        {item.label}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`} />
                      </button>
                      {openDropdown === item.label && (
                        <NavSelectionMenu
                          items={item.dropdown}
                          onClose={() => setOpenDropdown(null)}
                          width={item.mega ? "w-[820px]" : "w-[720px]"}
                          railWidth={item.mega ? "w-[300px]" : "w-[270px]"}
                          showBadge={item.mega}
                          railHeading={item.mega ? "Course Programs" : undefined}
                        />
                      )}
                    </>
                  ) : (
                    <NavLink
                      to={item.to!}
                      end={item.to === "/"}
                      onClick={() => setOpenDropdown(null)}
                      className={({ isActive }) =>
                        `px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors block ${
                          isActive
                            ? "text-green-700 bg-green-50"
                            : "text-gray-700 hover:text-green-700 hover:bg-gray-50"
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  )}
                </div>
              ))}
            </div>

            {/* Auth buttons */}
            <div className="hidden lg:flex items-center gap-2.5">
              <button
                onClick={() => { setOpenDropdown(null); navigate("/login"); }}
                className="flex items-center gap-1.5 text-sm font-bold text-gray-700 border-2 border-gray-200 px-4 py-2 rounded-full hover:border-green-600 hover:text-green-700 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" /> Login
              </button>
              <button
                onClick={() => { setOpenDropdown(null); navigate("/signup"); }}
                className="flex items-center gap-1.5 text-sm font-bold text-white bg-green-700 px-5 py-2 rounded-full hover:bg-green-800 transition-all shadow-md shadow-green-200"
              >
                <UserPlus className="w-3.5 h-3.5" /> Get Started
              </button>
            </div>

            {/* Mobile toggle */}
            <button className="lg:hidden p-2 text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ── MOBILE MENU ──────────────────────────────────── */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-1 shadow-lg max-h-[80vh] overflow-y-auto">
            {NAV.map((item) => (
              <div key={item.label}>
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => setMobileOpen(mobileOpen === item.label ? null : item.label)}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      {item.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${mobileOpen === item.label ? "rotate-180" : ""}`} />
                    </button>
                    {mobileOpen === item.label && (
                      <div className="ml-3 mt-1 border-l-2 border-green-100 pl-3 flex flex-col gap-1">
                        {item.dropdown.map((sub, j) => {
                          const subKey = `${item.label}:${j}`;
                          const isOpen = mobileOpen === subKey;
                          return (
                            <div key={subKey}>
                              <div className="flex items-center gap-1">
                                <Link
                                  to={sub.to}
                                  onClick={() => { setMenuOpen(false); setMobileOpen(null); }}
                                  className="flex-1 flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 hover:text-green-700 rounded-lg hover:bg-green-50"
                                >
                                  <span className="text-green-600">{sub.icon}</span>
                                  <span className="flex-1">{sub.label}</span>
                                </Link>
                                {sub.subItems && sub.subItems.length > 0 && (
                                  <button
                                    onClick={() => setMobileOpen(isOpen ? null : subKey)}
                                    aria-label={`Show ${sub.label} modules`}
                                    className="p-2 text-gray-400 hover:text-green-700"
                                  >
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                                  </button>
                                )}
                              </div>
                              {sub.subItems && isOpen && (
                                <ul className="ml-6 mb-1 border-l border-green-100 pl-3 flex flex-col gap-0.5">
                                  {sub.subItems.map((m, k) => (
                                    <li key={k}>
                                      <Link
                                        to={m.to}
                                        onClick={() => { setMenuOpen(false); setMobileOpen(null); }}
                                        className="block py-1.5 text-xs text-gray-500 hover:text-green-700"
                                      >
                                        {m.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={item.to!}
                    end={item.to === "/"}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-3 py-2.5 text-sm font-semibold rounded-lg ${
                        isActive ? "text-green-700 bg-green-50" : "text-gray-700 hover:bg-gray-50"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                )}
              </div>
            ))}

            {/* Mobile auth */}
            <div className="flex gap-3 pt-3 mt-2 border-t border-gray-100">
              <button
                onClick={() => { setMenuOpen(false); navigate("/login"); }}
                className="flex-1 flex items-center justify-center gap-1.5 text-sm font-bold text-gray-700 border-2 border-gray-200 py-2.5 rounded-full"
              >
                <LogIn className="w-3.5 h-3.5" /> Login
              </button>
              <button
                onClick={() => { setMenuOpen(false); navigate("/signup"); }}
                className="flex-1 flex items-center justify-center gap-1.5 text-sm font-bold text-white bg-green-700 py-2.5 rounded-full"
              >
                <UserPlus className="w-3.5 h-3.5" /> Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="bg-[#071209] text-gray-400">
        {/* CTA strip */}
        <div className="bg-[#1b5e20] py-12">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white text-center md:text-left">
              <h3 className="text-2xl font-bold mb-1">Ready to Start Your HMO Career?</h3>
              <p className="text-green-200 text-sm">Join 500+ professionals who have already transformed their careers.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button onClick={() => navigate("/courses")} className="bg-white text-green-800 font-bold px-6 py-3 rounded-full hover:bg-green-50 transition-colors text-sm">
                Browse Courses
              </button>
              <button onClick={() => navigate("/contact")} className="border-2 border-white text-white font-bold px-6 py-3 rounded-full hover:bg-white/10 transition-colors text-sm">
                Talk to Us
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-14 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            {/* Brand */}
            <div>
              <div className="mb-5 bg-white inline-block rounded-xl p-2">
                <ImageWithFallback src={logo} alt="Kalaro Institute" className="h-14 w-auto object-contain" />
              </div>
              <p className="text-sm leading-relaxed mb-5">
                Nigeria's premier institute for HMO operations training — equipping healthcare professionals with knowledge and skills to thrive.
              </p>
              <div className="flex gap-3">
                {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-700 transition-colors">
                    <Icon className="w-4 h-4 text-white" />
                  </a>
                ))}
              </div>
            </div>

            {/* Courses / NCLEX / Resources — derived from the nav data */}
            {FOOTER_GROUPS.map((group) => (
              <div key={group.heading}>
                <h4 className="text-white font-bold text-sm mb-5 uppercase tracking-wider">
                  {group.heading}
                </h4>
                <ul className="space-y-3 text-sm">
                  {group.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        className="hover:text-green-400 transition-colors flex items-start gap-2"
                      >
                        <span className="w-1 h-1 bg-green-600 rounded-full mt-2 shrink-0" />
                        <span className="hover:underline">{l.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact + newsletter */}
            <div>
              <h4 className="text-white font-bold text-sm mb-5 uppercase tracking-wider">Contact Us</h4>
              <ul className="space-y-4 text-sm mb-6">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                  <span>Plot 14, Abuja Business District, FCT, Nigeria</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-green-400 shrink-0" />
                  <span>+234 800 000 0000</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-green-400 shrink-0" />
                  <span>info@kalaroinstitute.com</span>
                </li>
              </ul>
              <p className="text-white text-xs font-bold mb-2 uppercase tracking-wide">Newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 bg-white/10 border border-white/10 text-white text-xs px-3 py-2.5 rounded-full placeholder-gray-500 outline-none focus:border-green-500 transition-colors"
                />
                <button className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold px-4 py-2.5 rounded-full transition-colors shrink-0">
                  Go
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span>© {new Date().getFullYear()} Kalaro Institute of HMO Operations. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-green-400 transition-colors">Refund Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
