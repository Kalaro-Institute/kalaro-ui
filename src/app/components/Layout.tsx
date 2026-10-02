import { useState, useRef, useEffect } from "react";
import { Outlet, NavLink, useNavigate, Link, useLocation } from "react-router";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { NavFlatMenu } from "@/app/components/NavDropdown";
import { NAV, FOOTER_GROUPS } from "@/app/data/navigation";
import { useCart } from "@/context/CartContext";
import logo from "@/imports/logo.jpeg";
import {
  Menu, X, Phone, Mail, MapPin, Facebook, Twitter,
  Instagram, Linkedin, Youtube, ChevronDown,
  UserPlus, LogIn, ShoppingBag,
} from "lucide-react";

export default function Layout() {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  /* Reset scroll on every route change. Without this, navigating from
     the footer (or any scrolled page) lands you mid-page and it looks
     like nothing happened. Hash links still scroll to their anchor. */
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname, location.hash]);

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
    setMobileOpen(null);
  }, [location.pathname]);

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
      {/* â”€â”€ TOP BAR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
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

      {/* â”€â”€ NAVBAR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <nav className="sticky top-0 z-50 bg-white shadow-md" ref={navRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* h-16 on phones, h-20 from lg up. The logo scales with it so
              the bag + hamburger always have room without overflowing. */}
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo â€” large & prominent, scaled down on phones */}
            <NavLink to="/" className="flex items-center gap-3 shrink-0 min-w-0" onClick={() => setOpenDropdown(null)}>
              <ImageWithFallback
                src={logo}
                alt="Kalaro Institute of HMO Operations"
                className="h-9 sm:h-12 lg:h-[60px] w-auto object-contain"
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
                        <NavFlatMenu
                          items={item.dropdown}
                          onClose={() => setOpenDropdown(null)}
                          width={item.flat ? "w-[720px]" : "w-[680px]"}
                          heading={item.flat ? "Our Courses" : item.label}
                          footer={
                            item.flat
                              ? { label: "View all courses", to: "/courses" }
                              : undefined
                          }
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

            {/* Cart - desktop placement, beside the auth buttons.
                The mobile bag further down serves small screens, so
                this must be hidden below lg or it renders twice. */}
            <Link
              to="/cart"
              aria-label={`Bag, ${count} item${count !== 1 ? "s" : ""}`}
              className="hidden lg:block relative p-2.5 rounded-full text-gray-700 hover:text-green-700 hover:bg-green-50 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-green-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>

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

            {/* Mobile actions - bag and hamburger grouped so they sit
                together at the right edge instead of being spread apart
                by justify-between. */}
            <div className="lg:hidden flex items-center gap-0.5 -mr-2">
              <Link
                to="/cart"
                aria-label={`Bag, ${count} item${count !== 1 ? "s" : ""}`}
                className="relative p-2 rounded-full text-gray-700 hover:text-green-700 transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                {count > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] px-1 bg-green-700 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                className="p-2 rounded-full text-gray-700 hover:text-green-700 transition-colors"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* â”€â”€ MOBILE MENU â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
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

            {/* Mobile bag row - reinforces the header icon and shows
                the running total without opening the bag. */}
            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-gray-700 rounded-lg hover:bg-green-50 mt-1"
            >
              <span className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-green-600" />
                Your bag
              </span>
              {count > 0 && (
                <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                  {count} item{count !== 1 ? "s" : ""}
                </span>
              )}
            </Link>

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


      {/* -- FOOTER ---------------------------------------------- */}
      <footer className="bg-[#071209] text-gray-400">
        {/* CTA band */}
        <div className="bg-[#1b5e20]">
          <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Ready to Start Your HMO Career?</h3>
              <p className="text-green-200 text-sm">Join 500+ professionals who have already transformed their careers.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => navigate("/courses")}
                className="bg-white text-green-800 font-bold px-6 py-3 rounded-full hover:bg-green-50 transition-colors text-sm"
              >
                Browse Courses
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="border-2 border-white text-white font-bold px-6 py-3 rounded-full hover:bg-white/10 transition-colors text-sm"
              >
                Talk to Us
              </button>
            </div>
          </div>
        </div>

        {/* Top tier: brand + contact + newsletter */}
        <div className="max-w-7xl mx-auto px-6 pt-14">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 pb-12">
            {/* Brand */}
            <div className="lg:col-span-4">
              <div className="mb-5 bg-white inline-block rounded-xl p-2">
                <ImageWithFallback src={logo} alt="Kalaro Institute" className="h-14 w-auto object-contain" />
              </div>
              <p className="text-sm leading-relaxed mb-6 max-w-sm">
                Nigeria&apos;s premier institute for HMO operations training — equipping healthcare
                professionals with knowledge and skills to thrive.
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                  <span>Plot 14, Abuja Business District, FCT, Nigeria</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-green-400 shrink-0" />
                  <a href="tel:+2348000000000" className="hover:text-green-400 transition-colors">+234 800 000 0000</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-green-400 shrink-0" />
                  <a href="mailto:info@kalaroinstitute.com" className="hover:text-green-400 transition-colors">info@kalaroinstitute.com</a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="lg:col-span-4 lg:col-start-9">
              <h4 className="text-white font-bold text-xs mb-4 uppercase tracking-wider">Stay Updated</h4>
              <p className="text-sm mb-5 max-w-sm">
                Get new course launches, NCLEX updates and career tips in your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-2 max-w-sm" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="footer-email" className="sr-only">Email address</label>
                <input
                  id="footer-email"
                  type="email"
                  required
                  placeholder="Your email address"
                  className="flex-1 min-w-0 bg-white/10 border border-white/15 text-white text-sm px-4 py-3 rounded-full placeholder-gray-500 outline-none focus:border-green-500 transition-colors"
                />
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-500 text-white text-sm font-bold px-6 py-3 rounded-full transition-colors shrink-0"
                >
                  Subscribe
                </button>
              </form>
              <div className="flex gap-2.5 mt-7">
                {[
                  { Icon: Facebook, label: "Facebook" },
                  { Icon: Twitter, label: "Twitter" },
                  { Icon: Instagram, label: "Instagram" },
                  { Icon: Linkedin, label: "LinkedIn" },
                  { Icon: Youtube, label: "YouTube" },
                ].map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-400 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Link columns, divided from the tier above */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-10 py-12 border-t border-white/10">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.heading}>
                <h4 className="text-white font-bold text-xs mb-4 uppercase tracking-wider">
                  {group.heading}
                </h4>
                <ul className="space-y-2.5 text-sm">
                  {group.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to} className="hover:text-green-400 transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                  {group.viewAll && (
                    <li className="pt-1">
                      <Link
                        to={group.viewAll.to}
                        className="inline-flex items-center gap-1 text-green-400 font-semibold hover:text-green-300 transition-colors"
                      >
                        {group.viewAll.label}
                        <ChevronDown className="w-3 h-3 -rotate-90" />
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Legal bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span>&copy; {new Date().getFullYear()} Kalaro Institute of HMO Operations. All rights reserved.</span>
            <div className="flex gap-5">
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
