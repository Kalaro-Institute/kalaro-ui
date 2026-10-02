import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import {
  ArrowLeft, CreditCard, Landmark, CheckCircle, Copy, Check,
  ShieldCheck, Clock, AlertCircle, Loader2, FileText,
} from "lucide-react";
import { toast } from "sonner";
import { getCourse, totalLessons } from "@/app/data/courses";
import { useLocationPricing } from "@/app/hooks/useLocationPricing";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

type Method = "card" | "transfer";

/* Bank details are placeholders - replace with the institute's real
   account details before going live. */
const BANK = {
  bank: "Access Bank",
  accountName: "Kalaro Institute of HMO Operations",
  accountNumber: "0123456789",
};

export default function CourseCheckout() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { formatAmount } = useLocationPricing();
  const [method, setMethod] = useState<Method>("card");
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const course = slug ? getCourse(slug) : undefined;

  if (!course) {
    return (
      <div className="min-h-screen bg-[#f7faf7] flex items-center justify-center px-6 font-[Poppins,sans-serif]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-extrabold text-[#1a2332] mb-2">Course not found</h1>
          <Link
            to="/courses"
            className="inline-block bg-green-700 hover:bg-green-800 text-white text-sm font-bold px-6 py-3 rounded-full transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText(BANK.accountNumber);
      setCopied(true);
      toast.success("Account number copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy. Please copy manually.");
    }
  };

  /**
   * Card payments are handled by Paystack Checkout. We send the
   * browser to the hosted page, which supports cards, bank transfer,
   * USSD and mobile money. The API call needs a numeric course id from
   * the backend catalog; until the course exists there, the helper
   * below is a no-op and we point the user at the contact route.
   */
  const payByCard = async () => {
    setSubmitting(true);
    try {
      const { apiRequest } = await import("@/lib/api-client");
      const data = await apiRequest<{ authorization_url: string }>(
        "/payments/paystack/initialize",
        {
          method: "POST",
          body: { course_slug: course.slug },
        },
      );
      window.location.href = data.authorization_url;
    } catch {
      toast.error(
        "Online payment is unavailable right now. Please use bank transfer or contact us.",
      );
      setSubmitting(false);
    }
  };

  const confirmTransfer = () => {
    toast.success("Transfer noted. We will confirm once the payment clears.");
    navigate("/dashboard/student");
  };

  return (
    <div className="bg-[#f7faf7] min-h-screen font-[Poppins,sans-serif]">
      {/* Header */}
      <div className="bg-[#1b5e20] text-white">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate(`/course/${course.slug}`)}
            className="inline-flex items-center gap-2 text-sm text-green-200 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to course
          </button>
          <h1 className="text-2xl md:text-3xl font-extrabold">Checkout</h1>
          <p className="text-green-100 text-sm mt-1">Choose how you would like to pay.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
          {/* Payment method */}
          <div>
            <h2 className="text-lg font-bold text-[#1a2332] mb-4">Payment method</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => setMethod("card")}
                className={`text-left p-5 rounded-2xl border-2 transition-all ${
                  method === "card"
                    ? "border-green-600 bg-white shadow-md"
                    : "border-gray-200 bg-white/60 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-11 h-11 bg-green-100 text-green-700 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  {method === "card" && <CheckCircle className="w-5 h-5 text-green-600" />}
                </div>
                <h3 className="font-bold text-[#1a2332] text-sm mb-1">Card payment</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Pay securely by card, USSD or mobile money. Instant confirmation.
                </p>
              </button>

              <button
                onClick={() => setMethod("transfer")}
                className={`text-left p-5 rounded-2xl border-2 transition-all ${
                  method === "transfer"
                    ? "border-green-600 bg-white shadow-md"
                    : "border-gray-200 bg-white/60 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-11 h-11 bg-green-100 text-green-700 rounded-xl flex items-center justify-center">
                    <Landmark className="w-5 h-5" />
                  </div>
                  {method === "transfer" && <CheckCircle className="w-5 h-5 text-green-600" />}
                </div>
                <h3 className="font-bold text-[#1a2332] text-sm mb-1">Bank transfer</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Transfer directly to our account. We confirm once it clears.
                </p>
              </button>
            </div>

            {/* Card panel */}
            {method === "card" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-bold text-[#1a2332] mb-2">Pay by card</h3>
                <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                  You will be redirected to our secure payment page to complete your
                  transaction. We accept Visa, Mastercard, Verve, USSD and mobile money.
                </p>
                <div className="bg-[#f7faf7] rounded-xl p-4 text-xs text-gray-500 leading-relaxed mb-5">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span>
                      Card details are entered on the payment provider&apos;s secure page
                      and are never stored on this site.
                    </span>
                  </div>
                </div>
                <button
                  onClick={payByCard}
                  disabled={submitting}
                  className="w-full bg-[#1b5e20] hover:bg-[#145218] disabled:opacity-60 text-white text-sm font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Starting payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" /> Pay now
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Bank transfer panel */}
            {method === "transfer" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-bold text-[#1a2332] mb-2">Transfer to our account</h3>
                <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                  Send the full amount using the details below, then confirm. We will
                  verify the payment and enrol you.
                </p>

                <div className="bg-[#f7faf7] rounded-xl p-5 mb-5 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Bank</span>
                    <span className="font-bold text-[#1a2332]">{BANK.bank}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Account name</span>
                    <span className="font-bold text-[#1a2332] text-right">
                      {BANK.accountName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-gray-500">Account number</span>
                    <button
                      onClick={copyAccount}
                      className="inline-flex items-center gap-2 font-bold text-[#1a2332] hover:text-green-700 transition-colors"
                    >
                      {BANK.accountNumber}
                      {copied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Amount</span>
                    <span className="font-bold text-green-700">
                      {formatAmount(course.priceUsd)}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Bank transfers can take a few hours to reflect. Your place is
                    confirmed once the payment clears - we will email you.
                  </p>
                </div>

                <button
                  onClick={confirmTransfer}
                  className="w-full bg-[#1b5e20] hover:bg-[#145218] text-white text-sm font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" /> I have made the transfer
                </button>
                <p className="text-[11px] text-gray-400 text-center mt-3">
                  After transferring, send your receipt to info@kalaroinstitute.com
                  quoting your name and the course title.
                </p>
              </div>
            )}
          </div>

          {/* Order summary */}
          <aside className="lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="relative h-32">
                <ImageWithFallback
                  src={course.img}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-white font-bold text-sm leading-tight">
                    {course.title}
                  </h3>
                </div>
              </div>
              <div className="p-5">
                <dl className="space-y-2.5 text-sm mb-5">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Duration</dt>
                    <dd className="font-semibold text-[#1a2332]">{course.durationWeeks} weeks</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Lessons</dt>
                    <dd className="font-semibold text-[#1a2332]">{totalLessons(course)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Level</dt>
                    <dd className="font-semibold text-[#1a2332]">{course.level}</dd>
                  </div>
                </dl>
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-gray-500">Total</span>
                    <span className="text-2xl font-extrabold text-[#1a2332]">
                      {formatAmount(course.priceUsd)}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 text-right">One-time payment</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

