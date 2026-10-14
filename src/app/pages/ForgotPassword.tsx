import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logo from "@/imports/logo.jpeg";
import {
  Mail,
  ArrowRight,
  Loader2,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import { requestPasswordReset, confirmPasswordReset } from "@/lib/auth.api";
import type { ApiError } from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";


export default function ForgotPassword() {
  const navigate = useNavigate();

  const rawParams = new URLSearchParams(
    window.location.search.replace(/\+/g, "%2B"),
  );
  const urlEmail = rawParams.get("email") ?? "";
  const urlCode = rawParams.get("code") ?? "";
  const isResetMode = Boolean(urlEmail && urlCode);
  const { logout } = useAuth();

  // Email request state
  const [email, setEmail] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  // Password reset state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestError(null);
    setIsRequesting(true);
    try {
      await requestPasswordReset({ email: email.trim() });
      setRequestSent(true);
    } catch (err) {
      const apiErr = err as ApiError;
      setRequestError(
        apiErr.message ?? "Failed to send reset link. Please try again.",
      );
    } finally {
      setIsRequesting(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);

    if (newPassword.length < 8) {
      setResetError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match.");
      return;
    }

    setIsResetting(true);
    try {
      await confirmPasswordReset({
        email: urlEmail,
        code: urlCode,
        new_password: newPassword,
      });
      logout();
      navigate("/login", { state: { passwordReset: true }, replace: true });
    } catch (err) {
      const apiErr = err as ApiError;
      setResetError(
        apiErr.message ?? "Reset failed. The link may have expired.",
      );
    } finally {
      setIsResetting(false);
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
            <KeyRound className="w-7 h-7 text-green-400" />
          </div>
          <h2 className="text-3xl font-extrabold mb-3 leading-tight">
            {isResetMode ? "Set a new password" : "Reset your password"}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            {isResetMode
              ? "Choose a strong password you have not used before. It must be at least 8 characters."
              : "Enter your email address and we will send you a link to reset your password."}
          </p>
          {isResetMode && (
            <div className="bg-green-900/40 border border-green-800/50 rounded-xl px-4 py-3">
              <p className="text-[11px] text-green-400/70 uppercase tracking-widest mb-1">
                Resetting for
              </p>
              <p className="text-green-300 text-sm font-semibold break-all">
                {urlEmail}
              </p>
            </div>
          )}
          <div className="mt-auto border-t border-white/10 pt-6">
            <p className="text-xs text-gray-500">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-green-400 font-semibold hover:underline"
              >
                Back to login
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
            {/* ── Email request screen ── */}
            {!isResetMode && !requestSent && (
              <>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
                  Forgot your password?
                </h2>
                <p className="text-gray-500 text-sm mb-8">
                  Enter your email and we will send you a reset link.
                </p>

                {requestError && (
                  <div className="mb-5 flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                    <span className="shrink-0 mt-0.5">⚠</span>
                    <span>{requestError}</span>
                  </div>
                )}

                <form onSubmit={handleRequest} noValidate className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-semibold text-gray-700 mb-1.5"
                    >
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-[#1b5e20] transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isRequesting || !email.trim()}
                    className="w-full bg-[#1b5e20] hover:bg-[#145218] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-full text-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-green-200"
                  >
                    {isRequesting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Sending
                        link...
                      </>
                    ) : (
                      <>
                        Send reset link <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-center text-xs text-gray-400 mt-6">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    className="text-[#1b5e20] font-semibold hover:underline"
                  >
                    Back to login
                  </Link>
                </p>
              </>
            )}

            {/* ── Link sent confirmation ── */}
            {!isResetMode && requestSent && (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-[#e8f5e9] rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle className="w-8 h-8 text-[#1b5e20]" />
                </div>
                <h2 className="text-xl font-extrabold text-gray-900 mb-2">
                  Check your email
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-2">
                  We sent a reset link to
                </p>
                <p className="text-sm font-semibold text-[#1a2332] mb-6 break-all">
                  {email}
                </p>
                <p className="text-xs text-gray-400 mb-6">
                  Click the link in the email to set a new password. It expires
                  in 10 minutes. Check your spam folder if you do not see it.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#1b5e20] hover:underline"
                >
                  Back to login
                </Link>
              </div>
            )}

            {/* ── New password screen (came from email link) ── */}
            {isResetMode && (
              <>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
                  Set new password
                </h2>
                <p className="text-gray-500 text-sm mb-8">
                  Choose a strong password for your account.
                </p>

                {resetError && (
                  <div className="mb-5 flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                    <span className="shrink-0 mt-0.5">⚠</span>
                    <span>{resetError}</span>
                  </div>
                )}

                <form onSubmit={handleReset} noValidate className="space-y-4">
                  <div>
                    <label
                      htmlFor="new-password"
                      className="block text-xs font-semibold text-gray-700 mb-1.5"
                    >
                      New password
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="new-password"
                        type={showNew ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        placeholder="Minimum 8 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl pl-10 pr-11 py-3 text-sm outline-none focus:border-[#1b5e20] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew((v) => !v)}
                        aria-label={showNew ? "Hide password" : "Show password"}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600"
                      >
                        {showNew ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">
                      Minimum 8 characters with at least one number.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="block text-xs font-semibold text-gray-700 mb-1.5"
                    >
                      Confirm new password
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="confirm-password"
                        type={showConfirm ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        placeholder="Re-enter your new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full border rounded-xl pl-10 pr-11 py-3 text-sm outline-none focus:border-[#1b5e20] transition-colors ${
                          confirmPassword && confirmPassword !== newPassword
                            ? "border-red-400"
                            : "border-gray-200"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        aria-label={
                          showConfirm ? "Hide password" : "Show password"
                        }
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600"
                      >
                        {showConfirm ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {confirmPassword && confirmPassword !== newPassword && (
                      <p className="text-xs text-red-500 mt-1">
                        Passwords do not match.
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={
                      isResetting ||
                      newPassword.length < 8 ||
                      newPassword !== confirmPassword
                    }
                    className="w-full bg-[#1b5e20] hover:bg-[#145218] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-full text-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-green-200 mt-2"
                  >
                    {isResetting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Resetting
                        password...
                      </>
                    ) : (
                      <>
                        Reset password <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
