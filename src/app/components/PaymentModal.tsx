import { useState } from "react";
import {
  X,
  CreditCard,
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { apiRequest, apiUpload } from "@/lib/api-client";
import type { ApiError } from "@/lib/api-client";

interface Course {
  id: number;
  title: string;
  price: number;
  currency: string;
}

interface Props {
  course: Course;
  onClose: () => void;
  onSuccess: () => void;
}

type Tab = "paystack" | "manual";
type PaystackStatus =
  | "idle"
  | "initializing"
  | "redirected"
  | "polling"
  | "success"
  | "failed";

export function PaymentModal({ course, onClose }: Props) {
  const [tab, setTab] = useState<Tab>("paystack");

  // Paystack state
  const [paystackStatus, setPaystackStatus] = useState<PaystackStatus>("idle");
  const [reference, setReference] = useState<string | null>(null);

  // Manual payment state
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);
  const [manualSubmitted, setManualSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePaystack = async () => {
    setError(null);
    setPaystackStatus("initializing");

    try {
      const data = await apiRequest<{
        authorization_url: string;
        reference: string;
        access_code: string;
      }>("/payments/paystack/initialize", {
        method: "POST",
        body: { course_id: course.id },
      });

      setReference(data.reference);
      setPaystackStatus("redirected");

      window.location.href = data.authorization_url;

    } catch (err) {
      const apiErr = err as ApiError;
      setError(
        apiErr.message ?? "Failed to initialize payment. Please try again.",
      );
      setPaystackStatus("idle");
    }
  };

  

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofFile) {
      setError("Please upload your payment proof.");
      return;
    }
    setError(null);
    setIsSubmittingManual(true);

    try {
      const formData = new FormData();
      formData.append("proof", proofFile);
      await apiUpload(`/payments/manual/${course.id}/submit`, formData);
      setManualSubmitted(true);
    } catch (err) {
      const apiErr = err as ApiError;
      setError(
        apiErr.message ?? "Failed to submit payment proof. Please try again.",
      );
    } finally {
      setIsSubmittingManual(false);
    }
  };

  const isFree = Number(course.price) === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden font-[Poppins,sans-serif]">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="min-w-0 pr-4">
            <h2 className="text-base font-bold text-[#1a2332]">
              Enrol in course
            </h2>
            <p className="text-sm text-gray-500 truncate mt-0.5">
              {course.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {/* Price */}
          <div className="flex items-center justify-between mb-5">
            <span className="text-sm text-gray-500">Course fee</span>
            <span className="text-2xl font-bold text-[#1a2332]">
              {isFree
                ? "Free"
                : `${course.currency} ${Number(course.price).toLocaleString()}`}
            </span>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2.5 rounded-xl">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* Paystack polling state */}
          {paystackStatus === "polling" && (
            <div className="text-center py-6">
              <Loader2 className="w-8 h-8 animate-spin text-[#1b5e20] mx-auto mb-3" />
              <p className="text-sm font-semibold text-[#1a2332] mb-1">
                Waiting for payment confirmation
              </p>
              <p className="text-xs text-gray-400">
                Complete your payment in the Paystack tab. This will update
                automatically.
              </p>
              {reference && (
                <p className="text-[11px] text-gray-400 mt-3">
                  Reference: <span className="font-mono">{reference}</span>
                </p>
              )}
            </div>
          )}

          {/* Paystack success */}
          {/* {paystackStatus === "success" && (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-[#e8f5e9] rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-7 h-7 text-[#1b5e20]" />
              </div>
              <p className="text-sm font-semibold text-[#1a2332]">
                Payment confirmed!
              </p>
              <p className="text-xs text-gray-400 mt-1">
                You are now enrolled. Redirecting...
              </p>
            </div>
          )} */}

          {/* Manual submitted */}
          {manualSubmitted && (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-[#e8f5e9] rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-7 h-7 text-[#1b5e20]" />
              </div>
              <p className="text-sm font-semibold text-[#1a2332] mb-1">
                Proof of payment submitted
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Our team will verify your payment within 24 hours. You will be
                enrolled once approved.
              </p>
              <button
                onClick={onClose}
                className="mt-5 w-full bg-[#1b5e20] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#145218] transition-colors"
              >
                Done
              </button>
            </div>
          )}

          {/* Normal tabs — only show when not in a terminal state */}
          {paystackStatus !== "polling" &&
            paystackStatus !== "success" &&
            !manualSubmitted && (
              <>
                {/* Tab switcher */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 mb-5">
                  <button
                    onClick={() => {
                      setTab("paystack");
                      setError(null);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-colors ${
                      tab === "paystack"
                        ? "bg-white text-[#1b5e20] shadow-sm"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    Pay online
                  </button>
                  <button
                    onClick={() => {
                      setTab("manual");
                      setError(null);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-colors ${
                      tab === "manual"
                        ? "bg-white text-[#1b5e20] shadow-sm"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Bank transfer
                  </button>
                </div>

                {/* Paystack tab */}
                {tab === "paystack" && (
                  <div className="space-y-4">
                    <div className="bg-[#f7faf7] rounded-xl p-4 text-xs text-gray-500 leading-relaxed">
                      You will be redirected to Paystack to complete your
                      payment securely. Supported: cards, bank transfer, USSD,
                      and mobile money.
                    </div>
                    <button
                      onClick={handlePaystack}
                      disabled={paystackStatus === "initializing"}
                      className="w-full bg-[#1b5e20] text-white text-sm font-bold py-3.5 rounded-xl hover:bg-[#145218] disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {paystackStatus === "initializing" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />{" "}
                          Initializing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" /> Pay{" "}
                          {isFree
                            ? "now (free)"
                            : `${course.currency} ${Number(course.price).toLocaleString()}`}
                        </>
                      )}
                    </button>
                    {paystackStatus === "failed" && (
                      <button
                        onClick={() => {
                          setPaystackStatus("idle");
                          setError(null);
                          setReference(null);
                        }}
                        className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        Try again
                      </button>
                    )}
                  </div>
                )}

                {/* Manual / bank transfer tab */}
                {tab === "manual" && (
                  <form
                    onSubmit={handleManualSubmit}
                    noValidate
                    className="space-y-4"
                  >
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-700 leading-relaxed">
                      <p className="font-semibold mb-1">
                        Bank transfer details
                      </p>
                      <p>
                        Bank:{" "}
                        <span className="font-semibold">
                          First Bank Nigeria
                        </span>
                      </p>
                      <p>
                        Account number:{" "}
                        <span className="font-semibold">3012345678</span>
                      </p>
                      <p>
                        Account name:{" "}
                        <span className="font-semibold">
                          Kalaro Institute Ltd
                        </span>
                      </p>
                      <p className="mt-2">
                        After transfer, upload your proof of payment below.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Upload proof of payment *
                      </label>
                      {proofFile ? (
                        <div className="flex items-center gap-3 bg-[#e8f5e9] border border-[#1b5e20]/20 rounded-xl px-4 py-3">
                          <FileText className="w-4 h-4 text-[#1b5e20] shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-[#1b5e20] truncate">
                              {proofFile.name}
                            </p>
                            <p className="text-[11px] text-[#1b5e20]/60">
                              {(proofFile.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setProofFile(null)}
                            className="text-[#1b5e20]/50 hover:text-red-500 transition-colors"
                            aria-label="Remove file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl px-4 py-6 cursor-pointer hover:border-[#1b5e20]/40 hover:bg-[#f7faf7] transition-colors">
                          <Upload className="w-6 h-6 text-gray-300" />
                          <span className="text-xs text-gray-400 text-center">
                            Click to upload receipt or screenshot
                          </span>
                          <span className="text-[11px] text-gray-300">
                            JPG, PNG or PDF
                          </span>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) setProofFile(file);
                              e.target.value = "";
                            }}
                          />
                        </label>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingManual || !proofFile}
                      className="w-full bg-[#1b5e20] text-white text-sm font-bold py-3.5 rounded-xl hover:bg-[#145218] disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {isSubmittingManual ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />{" "}
                          Submitting...
                        </>
                      ) : (
                        "Submit payment proof"
                      )}
                    </button>
                  </form>
                )}
              </>
            )}
        </div>
      </div>
    </div>
  );
}
