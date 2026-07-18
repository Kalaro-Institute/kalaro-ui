import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logo from "@/imports/logo.jpeg";
import {
  Eye, EyeOff, CheckCircle, ArrowRight, User,
  Mail, Phone, Lock, BookOpen, Award, Users,
} from "lucide-react";

const PERKS = [
  { icon: <BookOpen className="w-4 h-4" />, text: "Access to 50+ HMO courses" },
  { icon: <Award className="w-4 h-4" />, text: "Industry-recognised certificates" },
  { icon: <Users className="w-4 h-4" />, text: "Join Nigeria's HMO professional community" },
  { icon: <CheckCircle className="w-4 h-4" />, text: "Exclusive job board access" },
  { icon: <CheckCircle className="w-4 h-4" />, text: "Free webinars & live sessions" },
  { icon: <CheckCircle className="w-4 h-4" />, text: "Career support & CV coaching" },
];

type Step = 1 | 2 | 3;

export default function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    password: "", role: "", experience: "", goal: "",
  });

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) { setStep((s) => (s + 1) as Step); return; }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f7faf7] flex items-center justify-center px-4 font-[Poppins,sans-serif]">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Welcome to Kalaro!</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Your account has been created. Check your email for a confirmation link, then log in to start learning.
          </p>
          <button onClick={() => navigate("/courses")} className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 rounded-full transition-colors text-sm flex items-center justify-center gap-2">
            Explore Courses <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={() => navigate("/login")} className="w-full mt-3 text-sm text-gray-500 hover:text-green-700 transition-colors">
            Already have an account? Log in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7faf7] font-[Poppins,sans-serif] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col bg-[#071a08] text-white w-[420px] shrink-0 p-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 30% 70%, #4caf50 0%, transparent 60%)" }} />
        <div className="relative flex-1 flex flex-col">
          {/* Logo */}
          <div className="bg-white rounded-xl p-2 inline-block mb-10 self-start">
            <ImageWithFallback src={logo} alt="Kalaro Institute" className="h-12 w-auto object-contain" />
          </div>

          <h2 className="text-3xl font-extrabold mb-3 leading-tight">
            Start Your HMO Career Journey Today
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-10">
            Create your free account and join 500+ healthcare professionals already building high-impact HMO careers with Kalaro.
          </p>

          <div className="space-y-3 mb-10">
            {PERKS.map((p, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-7 h-7 bg-green-800/60 rounded-full flex items-center justify-center text-green-400 shrink-0">{p.icon}</div>
                {p.text}
              </div>
            ))}
          </div>

          <div className="mt-auto border-t border-white/10 pt-6">
            <p className="text-xs text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-green-400 font-semibold hover:underline">Log in here</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-start justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-lg py-8">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <ImageWithFallback src={logo} alt="Kalaro Institute" className="h-14 w-auto object-contain" />
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s ? "bg-green-700 text-white shadow-md shadow-green-200"
                  : step > s ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
                }`}>
                  {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                </div>
                <span className={`text-xs font-semibold hidden sm:block ${step === s ? "text-green-700" : "text-gray-400"}`}>
                  {s === 1 ? "Personal Info" : s === 2 ? "Account Setup" : "Your Goals"}
                </span>
                {s < 3 && <div className={`w-8 h-0.5 ${step > s ? "bg-green-400" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10">
            {step === 1 && (
              <>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Create Your Account</h2>
                <p className="text-gray-500 text-sm mb-7">Step 1 of 3 — Personal Information</p>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">First Name *</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input required type="text" placeholder="First name" value={form.firstName}
                          onChange={(e) => update("firstName", e.target.value)}
                          className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-green-500 transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Last Name *</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input required type="text" placeholder="Last name" value={form.lastName}
                          onChange={(e) => update("lastName", e.target.value)}
                          className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-green-500 transition-colors" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input required type="email" placeholder="you@example.com" value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-green-500 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone Number *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input required type="tel" placeholder="+234 800 000 0000" value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-green-500 transition-colors" />
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Set Up Your Password</h2>
                <p className="text-gray-500 text-sm mb-7">Step 2 of 3 — Account Security</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input required type={showPassword ? "text" : "password"} placeholder="Create a strong password"
                        value={form.password} onChange={(e) => update("password", e.target.value)}
                        className="w-full border border-gray-200 rounded-xl pl-10 pr-11 py-3 text-sm outline-none focus:border-green-500 transition-colors" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">Minimum 8 characters with at least one number</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Your Current Role *</label>
                    <select required value={form.role} onChange={(e) => update("role", e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 transition-colors bg-white text-gray-700">
                      <option value="">Select your current role</option>
                      <option>Student / Graduate</option>
                      <option>HMO Staff</option>
                      <option>Healthcare Provider</option>
                      <option>Hospital / Clinic Administrator</option>
                      <option>Insurance Professional</option>
                      <option>Career Changer</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Years of Healthcare Experience *</label>
                    <select required value={form.experience} onChange={(e) => update("experience", e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 transition-colors bg-white text-gray-700">
                      <option value="">Select experience level</option>
                      <option>No experience (0 years)</option>
                      <option>1 – 2 years</option>
                      <option>3 – 5 years</option>
                      <option>6 – 10 years</option>
                      <option>10+ years</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">What's Your Goal?</h2>
                <p className="text-gray-500 text-sm mb-7">Step 3 of 3 — Help us personalise your experience</p>
                <div className="space-y-3 mb-6">
                  {[
                    "Get a job in an HMO",
                    "Advance in my current HMO role",
                    "Transition from another healthcare role",
                    "Improve my team's HMO knowledge",
                    "Earn a professional certification",
                    "General knowledge & learning",
                  ].map((goal) => (
                    <label key={goal} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      form.goal === goal ? "border-green-600 bg-green-50" : "border-gray-200 hover:border-gray-300"
                    }`}>
                      <input type="radio" name="goal" value={goal} checked={form.goal === goal}
                        onChange={(e) => update("goal", e.target.value)} className="accent-green-700" />
                      <span className="text-sm font-medium text-gray-700">{goal}</span>
                    </label>
                  ))}
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-400">
                  <input type="checkbox" required className="mt-0.5 accent-green-700" />
                  <span>I agree to Kalaro's <a href="#" className="text-green-600 hover:underline">Terms of Service</a> and <a href="#" className="text-green-600 hover:underline">Privacy Policy</a></span>
                </div>
              </>
            )}

            <div className="mt-7 flex items-center gap-3">
              {step > 1 && (
                <button type="button" onClick={() => setStep((s) => (s - 1) as Step)}
                  className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-3.5 rounded-full text-sm hover:border-gray-300 transition-colors">
                  Back
                </button>
              )}
              <button type="submit"
                className="flex-1 bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 rounded-full text-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-green-200">
                {step < 3 ? "Continue" : "Create My Account"} <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {step === 1 && (
              <p className="text-center text-xs text-gray-400 mt-5">
                Already have an account?{" "}
                <Link to="/login" className="text-green-600 font-semibold hover:underline">Log in</Link>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
