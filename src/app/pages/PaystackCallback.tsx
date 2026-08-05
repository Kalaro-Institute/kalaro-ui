import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { apiRequest } from "@/lib/api-client";
import { getRefreshToken, setAccessToken } from "@/lib/api-client";

const SUCCESS_STATUSES = ["paid", "success", "completed"];
const FAILED_STATUSES = ["failed", "cancelled", "abandoned"];

export default function PaystackCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reference =
    searchParams.get("reference") ?? searchParams.get("trxref") ?? "";

  const [status, setStatus] = useState<
    "waiting" | "checking" | "success" | "failed"
  >("waiting");
  const [message, setMessage] = useState("Restoring your session...");
  const [displayRef, setDisplayRef] = useState("");
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  useEffect(() => {
    if (!reference) {
      setStatus("failed");
      setMessage("No payment reference found. Please contact support.");
      return;
    }

    setDisplayRef(reference);

    // Step 1: restore the access token first so polls are authenticated
    const restoreAndPoll = async () => {
      const refresh = getRefreshToken();
      if (refresh) {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL as string}/token/refresh`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refresh }),
            },
          );
          if (res.ok) {
            const data = (await res.json()) as { access: string };
            setAccessToken(data.access);
          }
        } catch {
          // Continue anyway, the apiRequest will handle 401
        }
      }

      if (!mountedRef.current) return;
      setStatus("checking");
      setMessage("Confirming your payment...");
      startPolling();
    };

    void restoreAndPoll();
  }, [reference]);

  const checkStatus = async (): Promise<boolean> => {
    try {
      const data = await apiRequest<{
        status: string;
        enrolled: boolean;
        reference: string;
        amount: number;
        currency: string;
        course_id: number;
      }>(`/payments/orders/${reference}/status`);

      if (data.enrolled || SUCCESS_STATUSES.includes(data.status)) {
        return true;
      }

      if (FAILED_STATUSES.includes(data.status)) {
        if (mountedRef.current) {
          setStatus("failed");
          setMessage("Payment was not successful. Please try again.");
        }
        return false;
      }
    } catch (err) {
      // 401 means not authenticated yet — keep polling
      // other errors — keep polling
    }
    return false;
  };

  const startPolling = () => {
    // Check immediately first
    checkStatus().then((success) => {
      if (!mountedRef.current) return;
      if (success) {
        handleSuccess();
        return;
      }
    });

    let attempts = 0;
    const maxAttempts = 24; // 2 minutes at 5s intervals

    pollingRef.current = setInterval(async () => {
      if (!mountedRef.current) return;
      attempts++;

      const success = await checkStatus();
      if (!mountedRef.current) return;

      if (success) {
        if (pollingRef.current) clearInterval(pollingRef.current);
        handleSuccess();
        return;
      }

      if (attempts >= maxAttempts) {
        if (pollingRef.current) clearInterval(pollingRef.current);
        setStatus("failed");
        setMessage(
          `We could not confirm your payment automatically. If you were charged, please contact support with reference: ${reference}`,
        );
      }
    }, 5000);
  };

  const handleSuccess = () => {
    setStatus("success");
    setMessage("Payment confirmed. You are now enrolled.");
    setTimeout(() => {
      if (mountedRef.current) {
        navigate("/dashboard/student/courses", { replace: true });
      }
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#f7faf7] font-[Poppins,sans-serif] flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center max-w-md w-full">
        {(status === "waiting" || status === "checking") && (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-[#1b5e20] mx-auto mb-5" />
            <h2 className="text-xl font-bold text-[#1a2332] mb-2">
              {status === "waiting"
                ? "Restoring your session"
                : "Confirming payment"}
            </h2>
            <p className="text-sm text-gray-500">{message}</p>
            {displayRef && status === "checking" && (
              <p className="text-xs text-gray-400 mt-4 font-mono break-all">
                Ref: {displayRef}
              </p>
            )}
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-[#e8f5e9] rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-[#1b5e20]" />
            </div>
            <h2 className="text-xl font-bold text-[#1a2332] mb-2">
              Payment successful
            </h2>
            <p className="text-sm text-gray-500 mb-2">{message}</p>
            <p className="text-xs text-gray-400">
              Redirecting to your courses...
            </p>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-[#1a2332] mb-2">
              Payment not confirmed
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              {message}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/dashboard/student/browse")}
                className="flex-1 border border-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Back to courses
              </button>
              <button
                onClick={() => {
                  setStatus("checking");
                  setMessage("Confirming your payment...");
                  startPolling();
                }}
                className="flex-1 bg-[#1b5e20] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#145218] transition-colors"
              >
                Check again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
