import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logo from "@/imports/logo.jpeg";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { acceptInvite } from "@/lib/auth.api";
import type { ApiError } from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";

export default function AcceptInvite() {
  const navigate = useNavigate();

  // Read token from URL — same + sign fix as forgot password
  const rawParams = new URLSearchParams(
    window.location.search.replace(/\+/g, "%2B"),
  );
  const token = rawParams.get("token") ?? "";

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { logout } = useAuth();

  const update = (field: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // If no token in URL, the link is broken or expired
  if (!token) {
    return (
      <div className="min-h-screen bg-[#f7faf7] font-[Poppins,sans-serif] flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-2">
            Invalid invite link
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            This invitation link is missing or invalid. Please check your email
            for the correct link or contact an admin.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1b5e20] hover:underline"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (form.password.length < 8) {
      setFieldErrors({ password: "Password must be at least 8 characters." });
      return;
    }
    if (form.password !== form.confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match." });
      return;
    }

    setIsSubmitting(true);
    try {
      await acceptInvite({
        token,
        password: form.password,
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
      });
      logout(); // clear any stale session first
      navigate("/login", { state: { inviteAccepted: true }, replace: true });
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr.fieldErrors) {
        const flat: Record<string, string> = {};
        for (const [key, msgs] of Object.entries(apiErr.fieldErrors)) {
          flat[key] = msgs[0] ?? "";
        }
        setFieldErrors(flat);
      }
      setError(
        apiErr.message ??
          "Failed to set up account. The invite may have expired.",
      );
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

          <div className="w-14 h-14 bg-green-800/40 rounded-2xl flex items-center justify-center mb-8">
            <CheckCircle className="w-7 h-7 text-green-400" />
          </div>

          <h2 className="text-3xl font-extrabold mb-3 leading-tight">
            You have been invited as an instructor
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            Set up your Kalaro instructor account by entering your name and
            choosing a password. You will be able to start building courses
            immediately.
          </p>

          <div className="space-y-3">
            {[
              "Create and publish courses",
              "Manage modules and lessons",
              "Upload videos and resources",
              "Track student progress",
              "Schedule live classes",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-sm text-gray-300"
              >
                <div className="w-5 h-5 rounded-full bg-green-800/60 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                </div>
                {item}
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
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center">
            <ImageWithFallback
              src={logo}
              alt="Kalaro Institute"
              className="h-14 w-auto object-contain"
            />
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
              Set up your account
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              Enter your details to activate your instructor account.
            </p>

            {error && (
              <div className="mb-5 flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-xs font-semibold text-gray-700 mb-1.5"
                  >
                    First name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="first-name"
                      type="text"
                      required
                      autoComplete="given-name"
                      placeholder="First name"
                      value={form.first_name}
                      onChange={(e) => update("first_name", e.target.value)}
                      className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-[#1b5e20] transition-colors ${
                        fieldErrors.first_name
                          ? "border-red-400"
                          : "border-gray-200"
                      }`}
                    />
                  </div>
                  {fieldErrors.first_name && (
                    <p className="text-xs text-red-500 mt-1">
                      {fieldErrors.first_name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-xs font-semibold text-gray-700 mb-1.5"
                  >
                    Last name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="last-name"
                      type="text"
                      required
                      autoComplete="family-name"
                      placeholder="Last name"
                      value={form.last_name}
                      onChange={(e) => update("last_name", e.target.value)}
                      className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-[#1b5e20] transition-colors ${
                        fieldErrors.last_name
                          ? "border-red-400"
                          : "border-gray-200"
                      }`}
                    />
                  </div>
                  {fieldErrors.last_name && (
                    <p className="text-xs text-red-500 mt-1">
                      {fieldErrors.last_name}
                    </p>
                  )}
                </div>
              </div>

              {/* Password */}
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
                    placeholder="Minimum 8 characters"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    className={`w-full border rounded-xl pl-10 pr-11 py-3 text-sm outline-none focus:border-[#1b5e20] transition-colors ${
                      fieldErrors.password
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
                {fieldErrors.password ? (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldErrors.password}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 mt-1.5">
                    Minimum 8 characters with at least one number.
                  </p>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-xs font-semibold text-gray-700 mb-1.5"
                >
                  Confirm password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="confirm-password"
                    type={showConfirm ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    value={form.confirmPassword}
                    onChange={(e) => update("confirmPassword", e.target.value)}
                    className={`w-full border rounded-xl pl-10 pr-11 py-3 text-sm outline-none focus:border-[#1b5e20] transition-colors ${
                      fieldErrors.confirmPassword ||
                      (form.confirmPassword &&
                        form.confirmPassword !== form.password)
                        ? "border-red-400"
                        : "border-gray-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600"
                  >
                    {showConfirm ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
                {!fieldErrors.confirmPassword &&
                  form.confirmPassword &&
                  form.confirmPassword !== form.password && (
                    <p className="text-xs text-red-500 mt-1">
                      Passwords do not match.
                    </p>
                  )}
              </div>

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !form.first_name.trim() ||
                  !form.last_name.trim() ||
                  form.password.length < 8 ||
                  form.password !== form.confirmPassword
                }
                className="w-full bg-[#1b5e20] hover:bg-[#145218] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-full text-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-green-200 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Setting up
                    account...
                  </>
                ) : (
                  <>
                    Activate account <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
