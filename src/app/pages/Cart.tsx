import { Link } from "react-router";
import { useState } from "react";
import {
  ShoppingBag, Trash2, Minus, Plus, CreditCard, Landmark, Loader2,
  ShieldCheck, Copy, Check, ArrowRight, Package, GraduationCap, Clock,
} from "lucide-react";
import { toast } from "sonner";
import { useCart, type CartItem } from "@/context/CartContext";
import { useLocationPricing } from "@/app/hooks/useLocationPricing";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

const BANK = {
  bank: "Access Bank",
  accountName: "Kalaro Institute of HMO Operations",
  accountNumber: "0123456789",
};

type Method = "card" | "transfer";

const KIND_META: Record<
  CartItem["kind"],
  { label: string; icon: typeof Package; note: string }
> = {
  course: { label: "Course", icon: GraduationCap, note: "Lifetime access" },
  service: { label: "Service", icon: Clock, note: "One-time fee" },
  product: { label: "Product", icon: Package, note: "Shipped to you" },
};

/* Cart + checkout.
   One bag holds courses, services and products together. Card payment
   goes through Paystack exactly as the single-item checkouts do. The
   server is the authority on the final total - never the prices shown
   here, which are for display only. */
export default function Cart() {
  const { items, removeItem, setQty, clear, subtotalUsd, count } = useCart();
  const { formatAmount } = useLocationPricing();
  const [method, setMethod] = useState<Method>("card");
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const payByCard = async () => {
    setSubmitting(true);
    try {
      const { apiRequest } = await import("@/lib/api-client");
      const data = await apiRequest<{ authorization_url: string }>(
        "/payments/paystack/initialize",
        {
          method: "POST",
          body: {
            items: items.map((i) => ({
              kind: i.kind,
              slug: i.slug,
              qty: i.qty,
            })),
          },
        },
      );
      /* Only clear once Paystack has accepted the order and we are
         leaving for their page - clearing earlier would lose the bag
         if initialization failed. */
      clear();
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
      "Transfer noted. We will confirm your order once the payment clears.",
    );
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#f7faf7] min-h-screen font-[Poppins,sans-serif] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <ShoppingBag className="w-14 h-14 text-green-600 mx-auto mb-5" />
          <h1 className="text-2xl font-extrabold text-[#1a2332] mb-2">
            Your bag is empty
          </h1>
          <p className="text-gray-500 text-sm mb-7">
            Add a course, a service or something from the shop and it will
            appear here.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/courses"
              className="bg-green-700 hover:bg-green-800 text-white text-sm font-bold px-6 py-3 rounded-full transition-colors"
            >
              Browse courses
            </Link>
            <Link
              to="/shop"
              className="border-2 border-gray-200 hover:border-green-600 text-gray-700 hover:text-green-700 text-sm font-bold px-6 py-3 rounded-full transition-colors"
            >
              Visit the shop
            </Link>
          </div>
        </div>
      </div>
    );
  }
return (
    <div className="bg-[#f7faf7] min-h-screen font-[Poppins,sans-serif]">
      <section className="bg-[#1b5e20] text-white">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <h1 className="text-3xl md:text-4xl font-extrabold">Your bag</h1>
          <p className="text-green-100 text-sm mt-2">
            {count} item{count !== 1 ? "s" : ""} &middot; courses, services
            and shop items
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
          {/* Lines */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {items.map((item) => {
                const meta = KIND_META[item.kind];
                const Icon = meta.icon;
                return (
                  <div
                    key={item.key}
                    className="flex gap-4 p-5 border-b border-gray-100 last:border-0"
                  >
                    <div className="w-16 h-16 rounded-xl bg-green-50 overflow-hidden shrink-0 flex items-center justify-center">
                      {item.image ? (
                        <ImageWithFallback
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Icon className="w-6 h-6 text-green-600" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-100 px-2 py-0.5 rounded mb-1.5">
                            <Icon className="w-3 h-3" />
                            {meta.label}
                          </span>
                          <p className="font-bold text-[#1a2332] leading-snug">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {item.meta ?? meta.note}
                          </p>
                        </div>
                        <div className="flex items-start gap-3 shrink-0">
                          <span className="font-bold text-[#1a2332]">
                            {formatAmount(item.priceUsd * item.qty)}
                          </span>
                          <button
                            onClick={() => removeItem(item.key)}
                            aria-label={`Remove ${item.title}`}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Products can take a quantity; digital items cannot */}
                      {item.kind === "product" && (
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => setQty(item.key, item.qty - 1)}
                            aria-label="Decrease quantity"
                            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-green-600 hover:text-green-700 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm font-semibold w-6 text-center">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => setQty(item.key, item.qty + 1)}
                            aria-label="Increase quantity"
                            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-green-600 hover:text-green-700 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-sm font-bold text-green-700 hover:gap-3 transition-all mt-5"
            >
              Continue shopping <ArrowRight className="w-4 h-4" />
            </Link>
{/* Payment method */}
            <h2 className="text-lg font-bold text-[#1a2332] mt-10 mb-4">
              Payment method
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {(
                [
                  { id: "card", icon: CreditCard, title: "Card payment", body: "Pay securely by card, USSD or mobile money via Paystack." },
                  { id: "transfer", icon: Landmark, title: "Bank transfer", body: "Transfer directly to our account. We confirm once it clears." },
                ] as const
              ).map(({ id, icon: Icon, title, body }) => (
                <button
                  key={id}
                  onClick={() => setMethod(id)}
                  className={`text-left p-5 rounded-2xl border-2 transition-all ${
                    method === id
                      ? "border-green-600 bg-white shadow-md"
                      : "border-gray-200 bg-white/60 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-11 h-11 bg-green-100 text-green-700 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    {method === id && (
                      <span className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-[#1a2332] text-sm mb-1">
                    {title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {body}
                  </p>
                </button>
              ))}
            </div>

            {method === "card" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-start gap-2.5 text-xs text-gray-500 mb-5">
                  <ShieldCheck className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>
                    You will be redirected to Paystack&apos;s secure page to
                    complete payment. We accept Visa, Mastercard, Verve, USSD
                    and mobile money. Card details never touch this site.
                  </span>
                </div>
                <button
                  onClick={payByCard}
                  disabled={submitting}
                  className="w-full bg-[#1b5e20] hover:bg-[#145218] disabled:opacity-60 text-white text-sm font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Starting
                      payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" /> Pay{" "}
                      {formatAmount(subtotalUsd)}
                    </>
                  )}
                </button>
              </div>
            )}

            {method === "transfer" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                  Send the full amount using the details below, then confirm.
                </p>
                <div className="bg-[#f7faf7] rounded-xl p-5 mb-5 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Bank</span>
                    <span className="font-bold text-[#1a2332]">
                      {BANK.bank}
                    </span>
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
                      {formatAmount(subtotalUsd)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={confirmTransfer}
                  className="w-full bg-[#1b5e20] hover:bg-[#145218] text-white text-sm font-bold py-3.5 rounded-xl transition-colors"
                >
                  I have made the transfer
                </button>
                <p className="text-[11px] text-gray-400 text-center mt-3">
                  Send your receipt to info@kalaroinstitute.com quoting your
                  name and the items ordered.
                </p>
              </div>
            )}
          </div>
{/* Summary */}
          <aside className="lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-[#1a2332] mb-5">Order summary</h3>
              <dl className="space-y-3 text-sm mb-5">
                {(["course", "service", "product"] as const).map((kind) => {
                  const lines = items.filter((i) => i.kind === kind);
                  if (lines.length === 0) return null;
                  const sum = lines.reduce(
                    (n, i) => n + i.priceUsd * i.qty,
                    0,
                  );
                  return (
                    <div key={kind} className="flex justify-between">
                      <dt className="text-gray-500">
                        {KIND_META[kind].label}
                        {lines.length > 1 && (
                          <span className="text-gray-400">
                            {" "}
                            &times;{lines.length}
                          </span>
                        )}
                      </dt>
                      <dd className="font-semibold text-[#1a2332]">
                        {formatAmount(sum)}
                      </dd>
                    </div>
                  );
                })}
                <div className="flex justify-between">
                  <dt className="text-gray-500">Delivery</dt>
                  <dd className="font-semibold text-[#1a2332]">
                    Confirmed at checkout
                  </dd>
                </div>
              </dl>
              <div className="border-t border-gray-100 pt-4 flex justify-between items-baseline">
                <span className="text-sm text-gray-500">Total</span>
                <span className="text-2xl font-extrabold text-[#1a2332]">
                  {formatAmount(subtotalUsd)}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
                The final amount charged is calculated by our payment system,
                not this page.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
