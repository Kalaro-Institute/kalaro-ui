import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logo from "@/imports/logo.jpeg";
import {
  Eye,
  EyeOff,
  CheckCircle,
  ArrowRight,
  User,
  Mail,
  Lock,
  BookOpen,
  Award,
  Users,
  Loader2,
} from "lucide-react";
import { register, fetchRegistrationOptions } from "@/lib/auth.api";
import type { ApiError } from "@/lib/api-client";
import type { RegistrationOptions } from "@/lib/auth.types";

const PERKS = [
  { icon: <BookOpen className="w-4 h-4" />, text: "Access to 50+ HMO courses" },
  {
    icon: <Award className="w-4 h-4" />,
    text: "Industry-recognised certificates",
  },
  {
    icon: <Users className="w-4 h-4" />,
    text: "Join the global HMO professional community",
  },
  {
    icon: <CheckCircle className="w-4 h-4" />,
    text: "Exclusive job board access",
  },
  {
    icon: <CheckCircle className="w-4 h-4" />,
    text: "Free webinars & live sessions",
  },
  {
    icon: <CheckCircle className="w-4 h-4" />,
    text: "Career support & CV coaching",
  },
];

type Step = 1 | 2 | 3;

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  currentRole: string;
  experienceLevel: string;
  goal: string;
  agreedToTerms: boolean;
}

export default function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [options, setOptions] = useState<RegistrationOptions | null>(null);
  const [optionsError, setOptionsError] = useState(false);

  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    currentRole: "",
    experienceLevel: "",
    goal: "",
    agreedToTerms: false,
  });

  useEffect(() => {
    fetchRegistrationOptions()
      .then(setOptions)
      .catch(() => setOptionsError(true));
  }, []);

  const update = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const fieldError = (key: string): string | undefined => fieldErrors[key]?.[0];

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (step < 3) {
      setStep((s) => (s + 1) as Step);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await register({
        email: form.email.trim(),
        password: form.password,
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        current_role: form.currentRole,
        experience_level: form.experienceLevel,
        goal: form.goal,
        agreed_to_terms: form.agreedToTerms,
      });

      navigate("/verify-email", { state: { email: form.email.trim() } });
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr.fieldErrors) {
        setFieldErrors(apiErr.fieldErrors);
        const step1Fields = ["email", "first_name", "last_name"];
        const step2Fields = ["password", "current_role", "experience_level"];
        if (step1Fields.some((f) => apiErr.fieldErrors?.[f])) {
          setStep(1);
        } else if (step2Fields.some((f) => apiErr.fieldErrors?.[f])) {
          setStep(2);
        }
      }
      setError(apiErr.message ?? "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7faf7] font-[Poppins,sans-serif] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col bg-[#071a08] text-white w-[420px] shrink-0 p-10 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 70%, #4caf50 0%, transparent 60%)",
          }}
        />
        <div className="relative flex-1 flex flex-col">
          <div className="bg-white rounded-xl p-2 inline-block mb-10 self-start">
            <ImageWithFallback
              src={logo}
              alt="Kalaro Institute"
              className="h-12 w-auto object-contain"
            />
          </div>
          <h2 className="text-3xl font-extrabold mb-3 leading-tight">
            Start Your HMO Career Journey Today
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-10">
            Create your free account and join 500+ healthcare professionals
            already building high-impact HMO careers with Kalaro.
          </p>
          <div className="space-y-3 mb-10">
            {PERKS.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-sm text-gray-300"
              >
                <div className="w-7 h-7 bg-green-800/60 rounded-full flex items-center justify-center text-green-400 shrink-0">
                  {p.icon}
                </div>
                {p.text}
              </div>
            ))}
          </div>
          <div className="mt-auto border-t border-white/10 pt-6">
            <p className="text-xs text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-green-400 font-semibold hover:underline"
              >
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-start justify-center p-4 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-lg py-8">
          <div className="lg:hidden mb-8 flex justify-center">
            <ImageWithFallback
              src={logo}
              alt="Kalaro Institute"
              className="h-14 w-auto object-contain"
            />
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {([1, 2, 3] as Step[]).map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s
                      ? "bg-green-700 text-white shadow-md shadow-green-200"
                      : step > s
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                </div>
                <span
                  className={`text-xs font-semibold hidden sm:block ${
                    step === s ? "text-green-700" : "text-gray-400"
                  }`}
                >
                  {s === 1
                    ? "Personal info"
                    : s === 2
                      ? "Account setup"
                      : "Your goals"}
                </span>
                {s < 3 && (
                  <div
                    className={`w-8 h-0.5 ${step > s ? "bg-green-400" : "bg-gray-200"}`}
                  />
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              <span className="shrink-0 mt-0.5">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form
            onSubmit={step < 3 ? handleNext : handleSubmit}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10"
            noValidate
          >
            {/* ── Step 1: Personal info ── */}
            {step === 1 && (
              <>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
                  Create your account
                </h2>
                <p className="text-gray-500 text-sm mb-7">
                  Step 1 of 3 — Personal information
                </p>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-xs font-semibold text-gray-700 mb-1.5"
                      >
                        First name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="firstName"
                          type="text"
                          required
                          autoComplete="given-name"
                          placeholder="First name"
                          value={form.firstName}
                          onChange={(e) => update("firstName", e.target.value)}
                          className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-green-500 transition-colors ${
                            fieldError("first_name")
                              ? "border-red-400"
                              : "border-gray-200"
                          }`}
                        />
                      </div>
                      {fieldError("first_name") && (
                        <p className="text-xs text-red-500 mt-1">
                          {fieldError("first_name")}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-xs font-semibold text-gray-700 mb-1.5"
                      >
                        Last name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="lastName"
                          type="text"
                          required
                          autoComplete="family-name"
                          placeholder="Last name"
                          value={form.lastName}
                          onChange={(e) => update("lastName", e.target.value)}
                          className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-green-500 transition-colors ${
                            fieldError("last_name")
                              ? "border-red-400"
                              : "border-gray-200"
                          }`}
                        />
                      </div>
                      {fieldError("last_name") && (
                        <p className="text-xs text-red-500 mt-1">
                          {fieldError("last_name")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-semibold text-gray-700 mb-1.5"
                    >
                      Email address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-green-500 transition-colors ${
                          fieldError("email")
                            ? "border-red-400"
                            : "border-gray-200"
                        }`}
                      />
                    </div>
                    {fieldError("email") && (
                      <p className="text-xs text-red-500 mt-1">
                        {fieldError("email")}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ── Step 2: Account setup ── */}
            {step === 2 && (
              <>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
                  Set up your password
                </h2>
                <p className="text-gray-500 text-sm mb-7">
                  Step 2 of 3 — Account security
                </p>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-xs font-semibold text-gray-700 mb-1.5"
                    >
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        placeholder="Create a strong password"
                        value={form.password}
                        onChange={(e) => update("password", e.target.value)}
                        className={`w-full border rounded-xl pl-10 pr-11 py-3 text-sm outline-none focus:border-green-500 transition-colors ${
                          fieldError("password")
                            ? "border-red-400"
                            : "border-gray-200"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">
                      Minimum 8 characters with at least one number
                    </p>
                    {fieldError("password") && (
                      <p className="text-xs text-red-500 mt-1">
                        {fieldError("password")}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="currentRole"
                      className="block text-xs font-semibold text-gray-700 mb-1.5"
                    >
                      Your current role *
                    </label>
                    {optionsError ? (
                      <p className="text-xs text-red-500">
                        Could not load options. Please refresh the page.
                      </p>
                    ) : !options ? (
                      <div className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-400 flex items-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />{" "}
                        Loading...
                      </div>
                    ) : (
                      <select
                        id="currentRole"
                        required
                        value={form.currentRole}
                        onChange={(e) => update("currentRole", e.target.value)}
                        className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 transition-colors bg-white text-gray-700 ${
                          fieldError("current_role")
                            ? "border-red-400"
                            : "border-gray-200"
                        }`}
                      >
                        <option value="">Select your current role</option>
                        {Object.entries(options.current_roles).map(
                          ([key, label]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          ),
                        )}
                      </select>
                    )}
                    {fieldError("current_role") && (
                      <p className="text-xs text-red-500 mt-1">
                        {fieldError("current_role")}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="experienceLevel"
                      className="block text-xs font-semibold text-gray-700 mb-1.5"
                    >
                      Years of healthcare experience *
                    </label>
                    {optionsError ? (
                      <p className="text-xs text-red-500">
                        Could not load options. Please refresh the page.
                      </p>
                    ) : !options ? (
                      <div className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-400 flex items-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />{" "}
                        Loading...
                      </div>
                    ) : (
                      <select
                        id="experienceLevel"
                        required
                        value={form.experienceLevel}
                        onChange={(e) =>
                          update("experienceLevel", e.target.value)
                        }
                        className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 transition-colors bg-white text-gray-700 ${
                          fieldError("experience_level")
                            ? "border-red-400"
                            : "border-gray-200"
                        }`}
                      >
                        <option value="">Select experience level</option>
                        {Object.entries(options.experience_levels).map(
                          ([key, label]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          ),
                        )}
                      </select>
                    )}
                    {fieldError("experience_level") && (
                      <p className="text-xs text-red-500 mt-1">
                        {fieldError("experience_level")}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ── Step 3: Goals ── */}
            {step === 3 && (
              <>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
                  What's your goal?
                </h2>
                <p className="text-gray-500 text-sm mb-7">
                  Step 3 of 3 — Help us personalise your experience
                </p>

                {!options ? (
                  <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading
                    options...
                  </div>
                ) : (
                  <div className="space-y-3 mb-6">
                    {Object.entries(options.goals).map(([key, label]) => (
                      <label
                        key={key}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          form.goal === key
                            ? "border-green-600 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="goal"
                          value={key}
                          checked={form.goal === key}
                          onChange={(e) => update("goal", e.target.value)}
                          className="accent-green-700"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                <div className="flex items-start gap-2 text-xs text-gray-400">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    checked={form.agreedToTerms}
                    onChange={(e) => update("agreedToTerms", e.target.checked)}
                    className="mt-0.5 accent-green-700"
                  />
                  <label htmlFor="terms">
                    I agree to Kalaro's{" "}
                    <a href="/terms" className="text-green-600 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      className="text-green-600 hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </>
            )}

            <div className="mt-7 flex items-center gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setStep((s) => (s - 1) as Step);
                  }}
                  className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-3.5 rounded-full text-sm hover:border-gray-300 transition-colors"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting || (step === 3 && !form.goal)}
                className="flex-1 bg-green-700 hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-full text-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-green-200"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Creating
                    account...
                  </>
                ) : (
                  <>
                    {step < 3 ? "Continue" : "Create my account"}{" "}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {step === 1 && (
              <p className="text-center text-xs text-gray-400 mt-5">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-green-600 font-semibold hover:underline"
                >
                  Log in
                </Link>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
