import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logo from "@/imports/logo.jpeg";
import { Eye, EyeOff, ArrowRight, Mail, Lock, CheckCircle, BookOpen, Award, Users } from "lucide-react";

const BENEFITS = [
  { icon: <BookOpen className="w-4 h-4" />, text: "Continue your enrolled courses" },
  { icon: <Award className="w-4 h-4" />, text: "Access your certificates" },
  { icon: <Users className="w-4 h-4" />, text: "Community forums & mentors" },
  { icon: <CheckCircle className="w-4 h-4" />, text: "Exclusive job board" },
];

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/courses");
  };

  return (
    <div className="min-h-screen bg-[#f7faf7] font-[Poppins,sans-serif] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col bg-[#071a08] text-white w-[420px] shrink-0 p-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 30% 70%, #4caf50 0%, transparent 60%)" }} />
        <div className="relative flex-1 flex flex-col">
          <div className="bg-white rounded-xl p-2 inline-block mb-10 self-start">
            <ImageWithFallback src={logo} alt="Kalaro Institute" className="h-12 w-auto object-contain" />
          </div>
          <h2 className="text-3xl font-extrabold mb-3 leading-tight">Welcome Back to Kalaro</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-10">
            Log back in to continue your HMO learning journey, access your courses, and connect with the world's leading managed care community.
          </p>
          <div className="space-y-3 mb-10">
            {BENEFITS.map((b, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-7 h-7 bg-green-800/60 rounded-full flex items-center justify-center text-green-400 shrink-0">{b.icon}</div>
                {b.text}
              </div>
            ))}
          </div>
          <div className="mt-auto border-t border-white/10 pt-6">
            <p className="text-xs text-gray-500">
              New to Kalaro?{" "}
              <Link to="/signup" className="text-green-400 font-semibold hover:underline">Create a free account</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center">
            <ImageWithFallback src={logo} alt="Kalaro Institute" className="h-14 w-auto object-contain" />
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Log In to Your Account</h2>
            <p className="text-gray-500 text-sm mb-8">Enter your credentials to access your student dashboard.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email" required placeholder="you@example.com"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-green-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-700">Password</label>
                  <a href="#" className="text-xs text-green-600 font-semibold hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"} required placeholder="Your password"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-11 py-3 text-sm outline-none focus:border-green-500 transition-colors"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <input type="checkbox" className="accent-green-700" id="remember" />
                <label htmlFor="remember">Remember me on this device</label>
              </div>

              <button type="submit"
                className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 rounded-full text-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-green-200 mt-2">
                Log In <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
              <div className="relative flex justify-center text-xs text-gray-400 bg-white px-3">or continue with</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-6">
              Don't have an account?{" "}
              <Link to="/signup" className="text-green-600 font-semibold hover:underline">Sign up for free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
