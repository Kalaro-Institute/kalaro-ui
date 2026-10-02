import { useState } from "react";
import { useParams, Link } from "react-router";
import {
  ArrowLeft, CreditCard, Landmark, CheckCircle, Copy, Check,
  ShieldCheck, Clock, AlertCircle, Loader2, FileText,
} from "lucide-react";
import { toast } from "sonner";
import { findNclexService, findPrService } from "@/app/data/services";
import { useLocationPricing } from "@/app/hooks/useLocationPricing";

type Method = "card" | "transfer";

/* Bank details are placeholders - replace with the institute's real
   account details before going live. */
const BANK = {
  bank: "Access Bank",
  accountName: "Kalaro Institute of HMO Operations",
  accountNumber: "0123456789",
};

/* Checkout for a PAID SERVICE, not a course.

   A service is work the institute performs for a fee, so there is no
   duration, no lesson count and no level. The summary shows the
   turnaround instead, and paying for it buys the work rather than a
   course seat. Mirrors CourseCheckout so both buying flows feel
   identical. */
export default function ServiceCheckout() {
  const { slug } = useParams<{ slug: string }>();
  const { formatAmount } = useLocationPricing();
  const [method, setMethod] = useState<Method>("card");
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const nclex = slug ? findNclexService(slug) : undefined;
  const service = nclex ?? (slug ? findPrService(slug) : undefined);
  /* Send the client back to whichever hub owns the service. */
  const hub = nclex
    ? "/nclex"
    : "/services/permanent-residency";

  if (!service) {
    return (
      <div className="min-h-screen bg-[#f7faf7] flex items-center justify-center px-6 font-[Poppins,sans-serif]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-extrabold text-[#1a2332] mb-2">
            Service not found
          </h1>
          <Link
            to="/nclex"
            className="inline-block bg-green-700 hover:bg-green-800 text-white text-sm font-bold px-6 py-3 rounded-full transition-colors"
          >
            Browse services
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
   * Card payments run through Paystack Checkout, which supports
   * cards, bank transfer, USSD and mobile money. The API call needs
   * the service slug recognised by the backend catalog; until it is,
   * the catch below points the client at transfer or contact.
   */
  const payByCard = async () => {
    setSubmitting(true);
    try {
      const { apiRequest } = await import("@/lib/api-client");
      const data = await apiRequest<{ authorization_url: string }>(
        "/payments/paystack/initialize",
        {
          method: "POST",
          body: { service_slug: service.slug },
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
    toast.success(
      "Transfer noted. We will confirm and begin once the payment clears.",
    );
  };

  return (
    <div className="bg-[#f7faf7] min-h-screen font-[Poppins,sans-serif]">
      {/* Header */}
      <div className="bg-[#1b5e20] text-white">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Link
            to={`${hub}/services/${service.slug}`}
            className="inline-flex items-center gap-2 text-sm text-green-200 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to service
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold">Service checkout</h1>
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
                  verify the payment and begin work on your service.
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
                      {formatAmount(service.priceUsd)}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Bank transfers can take a few hours to reflect. Your service is
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
                  quoting your name and the service title.
                </p>
              </div>
            )}
          </div>

          {/* Order summary */}
          <aside className="lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-green-700 p-5">
                <p className="text-green-200 text-xs font-bold uppercase tracking-wider mb-1">
                  Service
                </p>
                <h3 className="text-white font-bold text-sm leading-tight">
                  {service.title}
                </h3>
              </div>
              <div className="p-5">
                <dl className="space-y-2.5 text-sm mb-5">
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">Turnaround</dt>
                    <dd className="font-semibold text-[#1a2332] text-right">
                      {service.turnaround ?? "Confirmed on enquiry"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">Type</dt>
                    <dd className="font-semibold text-[#1a2332]">Fee-based service</dd>
                  </div>
                </dl>
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-gray-500">Total</span>
                    <span className="text-2xl font-extrabold text-[#1a2332]">
                      {formatAmount(service.priceUsd)}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 text-right">One-time fee</p>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 mt-4 leading-relaxed px-1">
              Fees cover the service as described on its page. Exams, government
              charges and third-party fees payable to Pearson VUE, immigration
              authorities or airlines are not included and are billed at cost.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}


