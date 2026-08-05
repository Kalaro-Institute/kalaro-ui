import { useEffect, useState, useCallback } from "react";
import {
  CreditCard, Loader2, AlertCircle, CheckCircle,
  XCircle, Eye, Clock,
} from "lucide-react";
import { apiRequest } from "@/lib/api-client";
import type { ApiError } from "@/lib/api-client";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/app/components/ui/dialog";

interface ManualPayment {
  id: number;
  order_id: number;
  student_name: string;
  student_email: string;
  course_title: string;
  amount: number;
  currency: string;
  proof_url: string;
  submitted_at: string;
}

function ReviewModal({
  payment,
  onClose,
  onReviewed,
}: {
  payment: ManualPayment;
  onClose: () => void;
  onReviewed: () => void;
}) {
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReview = async (approve: boolean) => {
    setIsSubmitting(true);
    try {
      await apiRequest(
        `/payments/admin/manual-payments/${payment.order_id}/review`,
        {
          method: "POST",
          body: { approve, note: note.trim() },
        },
      );
      toast.success(
        approve
          ? `Payment approved. ${payment.student_name} is now enrolled.`
          : "Payment rejected.",
      );
      onReviewed();
      onClose();
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message ?? "Failed to process review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-lg font-[Poppins,sans-serif]">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-[#1a2332]">
            Review payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-[#f7faf7] rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Student</span>
              <span className="font-semibold text-[#1a2332]">{payment.student_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="font-medium text-[#1a2332] text-xs">{payment.student_email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Course</span>
              <span className="font-semibold text-[#1a2332] text-right max-w-[200px]">{payment.course_title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Amount</span>
              <span className="font-bold text-[#1a2332]">
                {payment.currency} {Number(payment.amount).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Proof of payment */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Proof of payment</p>
            <a
              href={payment.proof_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-[#1b5e20] font-semibold hover:underline"
            >
              <Eye className="w-3.5 h-3.5" /> View uploaded proof
            </a>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Note (optional)
            </label>
            <textarea
              rows={2}
              placeholder="Add a note to the student..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1b5e20] transition-colors resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={() => handleReview(false)}
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-red-50 disabled:opacity-60 transition-colors"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
            Reject
          </button>
          <button
            onClick={() => handleReview(true)}
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 bg-[#1b5e20] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#145218] disabled:opacity-60 transition-colors"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            Approve
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<ManualPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reviewing, setReviewing] = useState<ManualPayment | null>(null);

  const fetchPayments = useCallback(() => {
    setIsLoading(true);
    apiRequest<ManualPayment[]>("/payments/admin/manual-payments/pending")
      .then(setPayments)
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  return (
    <div className="p-5 sm:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-[#1a2332]">Payments</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {payments.length} pending manual payment{payments.length !== 1 ? "s" : ""} awaiting review
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span className="text-sm">Loading payments...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
          <AlertCircle className="w-7 h-7" />
          <p className="text-sm">Failed to load payments. Please refresh.</p>
        </div>
      ) : payments.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl px-6 py-16 text-center">
          <CreditCard className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="text-sm font-semibold text-gray-500 mb-1">
            No pending payments
          </p>
          <p className="text-xs text-gray-400">
            Manual payment submissions will appear here for review.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Student
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide hidden sm:table-cell">
                  Course
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide hidden sm:table-cell">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">
                  Submitted
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors last:border-0"
                >
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-[#1a2332]">
                      {payment.student_name}
                    </p>
                    <p className="text-xs text-gray-400">{payment.student_email}</p>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <p className="text-sm text-gray-700 max-w-[180px] truncate">
                      {payment.course_title}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <span className="text-sm font-semibold text-[#1a2332]">
                      {payment.currency} {Number(payment.amount).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(payment.submitted_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => setReviewing(payment)}
                      className="text-xs font-semibold text-[#1b5e20] hover:underline"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {reviewing && (
        <ReviewModal
          payment={reviewing}
          onClose={() => setReviewing(null)}
          onReviewed={fetchPayments}
        />
      )}
    </div>
  );
}