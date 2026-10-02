import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  ShoppingBag, Search, Check, Truck, ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import {
  PRODUCTS, PRODUCT_CATEGORIES, type Product,
} from "@/app/data/products";
import { useCart, type CartItem } from "@/context/CartContext";
import { useLocationPricing } from "@/app/hooks/useLocationPricing";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

export type AddItem = (
  item: Omit<CartItem, "key" | "qty"> & { qty?: number },
) => void;

/* Shop index. Physical goods only - courses and services are bought
   through their own pages but share this cart. */
export default function Shop() {
  /* The nav dropdown deep-links to a category via ?category=Books.
     Seed the filter from it, falling back to All if the value is not
     one we recognise. */
  const [searchParams, setSearchParams] = useSearchParams();
  const paramCategory = searchParams.get("category");
  const initialCategory = PRODUCT_CATEGORIES.includes(
    paramCategory as Product["category"],
  )
    ? (paramCategory as Product["category"])
    : "All";

  const [category, setCategory] = useState<"All" | Product["category"]>(
    initialCategory,
  );
  const [query, setQuery] = useState("");

  /* Keep the URL in step so the filter is shareable and survives a
     back-navigation from a product page. */
  const chooseCategory = (c: "All" | Product["category"]) => {
    setCategory(c);
    if (c === "All") searchParams.delete("category");
    else searchParams.set("category", c);
    setSearchParams(searchParams, { replace: true });
  };

  const products = PRODUCTS.filter((p) => {
    const matchCategory = category === "All" || p.category === category;
    const matchQuery =
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.summary.toLowerCase().includes(query.toLowerCase());
    return matchCategory && matchQuery;
  });

  return (
    <div className="bg-[#f7faf7] font-[Poppins,sans-serif]">
      {/* Hero */}
      <section className="bg-[#1b5e20] text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-green-300 text-xs font-bold uppercase tracking-widest mb-4">
            Shop
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight max-w-3xl">
            Books and materials from the institute
          </h1>
          <p className="text-green-100 mt-4 text-lg max-w-2xl leading-relaxed">
            The reference books we teach from, workbooks to practise with, and
            the templates you will be asked to produce in your first month.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-10">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the shop..."
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 bg-white text-sm outline-none focus:border-green-500"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {(["All", ...PRODUCT_CATEGORIES] as const).map((c) => (
              <button
                key={c}
                onClick={() => chooseCategory(c)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                  category === c
                    ? "bg-green-700 text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-green-400"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-14 sm:py-20 text-gray-400">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No products match your search.</p>
            <p className="text-sm mt-1">Try a different keyword or category.</p>
          </div>
        )}

        {/* Reassurance */}
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { icon: Truck, title: "Delivered to you", body: "Dispatched within 3 working days anywhere we deliver." },
            { icon: ShieldCheck, title: "Secure checkout", body: "Pay by card, USSD or bank transfer through Paystack." },
            { icon: Check, title: "Bulk orders welcome", body: "Buying for a team or an HMO? Talk to us for a discount." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-white border border-gray-100 rounded-2xl p-6">
              <Icon className="w-5 h-5 text-green-600 mb-3" />
              <h3 className="font-bold text-[#1a2332] mb-1.5">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
function ProductCard({ product }: { product: Product }) {
  const { addItem, has } = useCart();
  const { formatAmount } = useLocationPricing();
  const inCart = has("product", product.slug);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col hover:border-green-300 hover:shadow-lg transition-all">
      <Link to={`/shop/${product.slug}`} className="relative block h-52 overflow-hidden">
        <ImageWithFallback
          src={product.img}
          alt={product.title}
          className="w-full h-full object-cover"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-green-700 text-white px-2.5 py-1 rounded-full">
            {product.badge}
          </span>
        )}
      </Link>
      <div className="p-6 flex flex-col flex-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
          {product.category}
        </span>
        <Link
          to={`/shop/${product.slug}`}
          className="font-bold text-[#1a2332] leading-snug mb-2 hover:text-green-700 transition-colors"
        >
          {product.title}
        </Link>
        <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">
          {product.summary}
        </p>
        <div className="flex items-end justify-between gap-3 mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-[#1a2332]">
              {formatAmount(product.priceUsd)}
            </span>
            {product.compareAtUsd && (
              <span className="text-sm text-gray-400 line-through">
                {formatAmount(product.compareAtUsd)}
              </span>
            )}
          </div>
          {product.pages && (
            <span className="text-xs text-gray-400">{product.pages} pages</span>
          )}
        </div>
        <AddToCartButton product={product} inCart={inCart} addItem={addItem} />
      </div>
    </div>
  );
}

/** Shared add-to-cart control for the shop card and product page. */
export function AddToCartButton({
  product,
  inCart,
  addItem,
}: {
  product: Product;
  inCart: boolean;
  addItem: AddItem;
}) {
  const soldOut = product.stock === 0;

  return (
    <button
      disabled={soldOut}
      onClick={() => {
        addItem({
          kind: "product",
          slug: product.slug,
          title: product.title,
          priceUsd: product.priceUsd,
          image: product.img,
          meta: product.format ?? product.category,
        });
        toast.success(`${product.title} added to your bag`);
      }}
      className={`w-full flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        inCart
          ? "border-2 border-green-600 text-green-700 hover:bg-green-50"
          : "bg-[#1b5e20] hover:bg-[#145218] text-white"
      }`}
    >
      {soldOut ? (
        "Out of stock"
      ) : inCart ? (
        <>
          <Check className="w-4 h-4" /> In your bag
        </>
      ) : (
        <>
          <ShoppingBag className="w-4 h-4" /> Add to bag
        </>
      )}
    </button>
  );
}
