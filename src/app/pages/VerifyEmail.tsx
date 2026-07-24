import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logo from "@/imports/logo.jpeg";
import { Loader2, MailCheck, ArrowRight, RotateCcw } from "lucide-react";
import { verifyEmail, resendCode,  } from "@/lib/auth.api";
import type { ApiError } from "@/lib/api-client";

const CODE_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  

  const email = (location.state as { email?: string } | null)?.email ?? "";

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!email) {
      navigate("/signup", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    setError(null);

    if (digit && index < CODE_LENGTH - 1) {
      focusInput(index + 1);
    }

    if (digit && next.every((d) => d !== "")) {
      void submitCode(next.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      } else if (index > 0) {
        focusInput(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      focusInput(index - 1);
    } else if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH);
    if (!pasted) return;

    const next = [...digits];
    for (let i = 0; i < CODE_LENGTH; i++) {
      next[i] = pasted[i] ?? "";
    }
    setDigits(next);

    const nextEmpty = next.findIndex((d) => d === "");
    focusInput(nextEmpty === -1 ? CODE_LENGTH - 1 : nextEmpty);

    if (pasted.length === CODE_LENGTH) {
      void submitCode(pasted);
    }
  };

  const submitCode = useCallback(
    async (code: string) => {
      if (isVerifying) return;
      setError(null);
      setIsVerifying(true);

      try {
        await verifyEmail({ email, code });

        navigate("/login", {
          state: { verified: true },
          replace: true,
        });
      } catch (err) {
        const apiErr = err as ApiError;
        setError(apiErr.message ?? "Invalid code. Please try again.");
        setDigits(Array(CODE_LENGTH).fill(""));
        focusInput(0);
      } finally {
        setIsVerifying(false);
      }
    },
    [email, isVerifying, navigate],
  );

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    setError(null);
    setSuccessMessage(null);
    setIsResending(true);

    try {
      await resendCode({ email });
      setSuccessMessage("A new code has been sent to your email.");
      setCooldown(RESEND_COOLDOWN);
      setDigits(Array(CODE_LENGTH).fill(""));
      focusInput(0);
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message ?? "Could not resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length === CODE_LENGTH) {
      void submitCode(code);
    }
  };

  if (!email) return null;

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
          <div className="w-16 h-16 bg-green-800/40 rounded-2xl flex items-center justify-center mb-8">
            <MailCheck className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-3xl font-extrabold mb-3 leading-tight">
            Check your inbox
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            We sent a {CODE_LENGTH}-digit verification code to:
          </p>
          <div className="bg-green-900/40 border border-green-800/50 rounded-xl px-4 py-3 mb-8">
            <p className="text-green-300 text-sm font-semibold break-all">
              {email}
            </p>
          </div>
          <p className="text-gray-500 text-xs leading-relaxed">
            The code expires in 10 minutes. Check your spam folder if you do not
            see it.
          </p>
          <div className="mt-auto border-t border-white/10 pt-6">
            <p className="text-xs text-gray-500">
              Wrong email?{" "}
              <Link
                to="/signup"
                className="text-green-400 font-semibold hover:underline"
              >
                Go back and change it
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
            {/* Mobile-only email display */}
            <div className="lg:hidden mb-6 flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
              <MailCheck className="w-5 h-5 text-green-600 shrink-0" />
              <p className="text-xs text-green-800 font-medium break-all">
                {email}
              </p>
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
              Enter verification code
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              Enter the {CODE_LENGTH}-digit code we sent to your email to
              activate your account.
            </p>

            {error && (
              <div className="mb-5 flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                <span className="shrink-0 mt-0.5">⚠</span>
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-5 flex items-start gap-2.5 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
                <span className="shrink-0 mt-0.5">✓</span>
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleManualSubmit} noValidate>
              <div
                className="flex items-center gap-3 justify-center mb-8"
                onPaste={handlePaste}
              >
                {digits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onFocus={(e) => e.target.select()}
                    disabled={isVerifying}
                    aria-label={`Digit ${i + 1} of ${CODE_LENGTH}`}
                    className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl outline-none transition-all disabled:opacity-50 ${
                      digit
                        ? "border-green-500 bg-green-50 text-green-800"
                        : "border-gray-200 text-gray-900 focus:border-green-500"
                    }`}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={digits.some((d) => d === "") || isVerifying}
                className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-full text-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-green-200"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    Verify account <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400 mb-3">
                Did not receive a code?
              </p>
              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0 || isResending}
                className="inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isResending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RotateCcw className="w-3.5 h-3.5" />
                )}
                {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
