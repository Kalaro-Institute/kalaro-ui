import { Link, useParams } from "react-router";
import {
  ArrowLeft, Check, Truck, ShieldCheck, ShoppingBag, Package,
} from "lucide-react";
import { getProduct, PRODUCTS } from "@/app/data/products";
import { useCart } from "@/context/CartContext";
import { useLocationPricing } from "@/app/hooks/useLocationPricing";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { AddToCartButton } from "./Shop";

/* Single product page. Reuses the shop's AddToCartButton so a product
   behaves identically from the grid and from its own page. */
export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem, has } = useCart();
  const { formatAmount } = useLocationPricing();

  const product = slug ? getProduct(slug) : undefined;

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f7faf7] flex items-center justify-center px-6 font-[Poppins,sans-serif]">
        <div className="text-center">
          <Package className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-extrabold text-[#1a2332] mb-2">
            Product not found
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            This item may have sold out or been moved.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-green-700 hover:bg-green-800 text-white text-sm font-bold px-6 py-3 rounded-full transition-colors"
          >
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  const related = PRODUCTS.filter(
    (p) => p.slug !== product.slug && p.category === product.category,
  ).slice(0, 3);
  const soldOut = product.stock === 0;
  /* stock is omitted when unlimited, so only a real number can be low. */
  const low = product.stock !== undefined && product.stock <= 10;

  return (
    <div className="bg-[#f7faf7] font-[Poppins,sans-serif]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm text-green-700 hover:text-green-800 transition-colors mb-7"
        >
          <ArrowLeft className="w-4 h-4" /> Back to shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-10 items-start mb-16">
          <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-100">
            <ImageWithFallback
              src={product.img}
              alt={product.title}
              className="w-full h-[420px] object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 text-[11px] font-bold uppercase tracking-wider bg-green-700 text-white px-3 py-1.5 rounded-full">
                {product.badge}
              </span>
            )}
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3 block">
              {product.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#1a2332] leading-tight mb-4">
              {product.title}
            </h1>
            <p className="text-gray-600 leading-relaxed mb-6">
              {product.summary}
            </p>

            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl font-extrabold text-[#1a2332]">
                {formatAmount(product.priceUsd)}
              </span>
              {product.compareAtUsd && (
                <span className="text-lg text-gray-400 line-through">
                  {formatAmount(product.compareAtUsd)}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mb-6">
              One-time purchase &middot; Delivered to you
            </p>

            {soldOut ? (
              <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700 mb-4">
                This item is out of stock. Contact us and we will tell you when
                it is available.
              </div>
            ) : low ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-sm text-amber-800 mb-4">
                Only {product.stock} left.
              </div>
            ) : null}

            <div className="mb-4">
              <AddToCartButton
                product={product}
                inCart={has("product", product.slug)}
                addItem={addItem}
              />
            </div>
            <Link
              to="/cart"
              className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-green-600 text-gray-700 hover:text-green-700 font-bold text-sm py-3 rounded-full transition-colors"
            >
              <ShoppingBag className="w-4 h-4" /> View bag
            </Link>

            <dl className="grid grid-cols-2 gap-4 mt-7 pt-6 border-t border-gray-200">
              {product.format && (
                <div>
                  <dt className="text-xs text-gray-400 mb-1">Format</dt>
                  <dd className="text-sm font-semibold text-[#1a2332]">
                    {product.format}
                  </dd>
                </div>
              )}
              {product.pages && (
                <div>
                  <dt className="text-xs text-gray-400 mb-1">Length</dt>
                  <dd className="text-sm font-semibold text-[#1a2332]">
                    {product.pages} pages
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
<div className="grid lg:grid-cols-[1fr_320px] gap-10 mb-16">
          <div>
            <h2 className="text-xl font-extrabold text-[#1a2332] mb-3">
              About this {product.category === "Books" ? "book" : "item"}
            </h2>
            <p className="text-gray-600 leading-[1.8] mb-8">
              {product.description}
            </p>
            <h2 className="text-xl font-extrabold text-[#1a2332] mb-4">
              What&apos;s included
            </h2>
            <ul className="space-y-3">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 bg-white border border-gray-100 rounded-xl px-5 py-4 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
          <aside className="space-y-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <Truck className="w-5 h-5 text-green-600 mb-3" />
              <h3 className="font-bold text-[#1a2332] mb-1.5">Delivery</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Dispatched within 3 working days. Delivery times and costs are confirmed when you place your order.</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <ShieldCheck className="w-5 h-5 text-green-600 mb-3" />
              <h3 className="font-bold text-[#1a2332] mb-1.5">Secure payment</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Card, USSD, mobile money or bank transfer, handled through Paystack. We never see your card details.</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <Package className="w-5 h-5 text-green-600 mb-3" />
              <h3 className="font-bold text-[#1a2332] mb-1.5">Bulk orders</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Buying for a team or an entire HMO? Talk to us about volume pricing.</p>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <>
            <h2 className="text-xl font-extrabold text-[#1a2332] mb-6">
              More in {product.category}
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {related.map((r) => (
                <Link key={r.slug} to={`/shop/${r.slug}`} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-green-300 hover:shadow-lg transition-all">
                  <div className="h-40 overflow-hidden">
                    <ImageWithFallback src={r.img} alt={r.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-[#1a2332] leading-snug mb-1.5 group-hover:text-green-700 transition-colors">{r.title}</h3>
                    <p className="text-sm font-bold text-green-700">{formatAmount(r.priceUsd)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
