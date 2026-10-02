import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/* ── Cart ──────────────────────────────────────────────────────
   One bag for everything the visitor can buy: courses (digital
   programmes), services (fee-based work) and shop products
   (books and materials).

   Items are stored as a discriminated union on `kind` rather than
   loose strings, so the cart page can render each line correctly
   and the checkout can group them for the backend. Prices are
   captured in USD at add-time and re-converted for display; the
   server must always recalculate the real total. */

export type CartKind = "course" | "service" | "product";

export type CartItem = {
  /** Stable identity: "<kind>:<slug>" */
  key: string;
  kind: CartKind;
  slug: string;
  title: string;
  /** Base price in USD, used only for local totals and display. */
  priceUsd: number;
  image?: string;
  /** Quantity. Digital items (courses) are always 1. */
  qty: number;
  /** Human label for what changes on purchase. */
  meta?: string;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "key" | "qty"> & { qty?: number }) => void;
  removeItem: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  /** Sum of priceUsd * qty across every line. */
  count: number;
  subtotalUsd: number;
  has: (kind: CartKind, slug: string) => boolean;
};

const STORAGE_KEY = "kalaro_cart_v1";

const CartContext = createContext<CartContextValue | null>(null);

const makeKey = (kind: CartKind, slug: string) => `${kind}:${slug}`;

function readStored(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    /* Validate shape - a stale or hand-edited entry should never
       crash the header badge. */
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i): i is CartItem =>
        !!i &&
        typeof i.slug === "string" &&
        typeof i.title === "string" &&
        typeof i.priceUsd === "number" &&
        typeof i.qty === "number" &&
        (i.kind === "course" || i.kind === "service" || i.kind === "product"),
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readStored);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* Private mode / quota - the cart still works for this session. */
    }
  }, [items]);

  const addItem = useCallback<CartContextValue["addItem"]>((item) => {
    const key = makeKey(item.kind, item.slug);
    /* Courses and services are one-per-order; products can repeat. */
    const maxQty = item.kind === "product" ? 10 : 1;

    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key
            ? { ...i, qty: Math.min(maxQty, i.qty + (item.qty ?? 1)) }
            : i,
        );
      }
      return [
        ...prev,
        { ...item, key, qty: Math.min(maxQty, item.qty ?? 1) },
      ];
    });
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.key === key
          ? { ...i, qty: Math.max(1, Math.min(10, qty)) }
          : i,
      ),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const has = useCallback(
    (kind: CartKind, slug: string) =>
      items.some((i) => i.key === makeKey(kind, slug)),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem,
      removeItem,
      setQty,
      clear,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotalUsd: items.reduce((n, i) => n + i.priceUsd * i.qty, 0),
      has,
    }),
    [items, addItem, removeItem, setQty, clear, has],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}