import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Size } from "@/lib/products";

export type CartLine = {
  slug: string;
  size: Size;
  qty: number;
  name: string;
  image: string;
  unitPrice: number;
};

export type Order = {
  id: string;
  createdAt: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postal: string;
  method: "card" | "paypal";
  items: CartLine[];
  subtotal: number;
  shipping: number;
  total: number;
};

type CartState = {
  lines: CartLine[];
  orders: Order[];
  add: (line: Omit<CartLine, "qty">, qty?: number, limit?: number) => void;
  setQty: (slug: string, size: Size, qty: number, limit?: number) => void;
  remove: (slug: string, size: Size) => void;
  clear: () => void;
  placeOrder: (
    order: Omit<Order, "id" | "createdAt" | "items" | "subtotal" | "shipping" | "total"> & {
      shipping: number;
      subtotal: number;
      total: number;
    },
  ) => Order;
};

export function clampCartQty(requested: number, available: number) {
  const maxAvailable = Math.max(0, Math.round(available || 0));
  const safeRequested = Number.isFinite(requested) ? Math.round(requested) : 1;
  if (maxAvailable <= 0) return 0;
  return Math.min(Math.max(1, safeRequested), maxAvailable);
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      orders: [],
      add: (line, qty = 1, limit?: number) => {
        const safeQty = Math.max(1, Math.round(qty));
        const lines = [...get().lines];
        const i = lines.findIndex((l) => l.slug === line.slug && l.size === line.size);
        const currentQty = i >= 0 ? lines[i].qty : 0;
        const nextQty = i >= 0 ? currentQty + safeQty : safeQty;
        const clampedQty = typeof limit === "number" ? clampCartQty(nextQty, limit) : nextQty;
        if (i >= 0) lines[i] = { ...lines[i], qty: clampedQty };
        else lines.push({ ...line, qty: clampedQty });
        set({ lines });
      },
      setQty: (slug, size, qty, limit?: number) => {
        if (qty <= 0) {
          set({ lines: get().lines.filter((l) => !(l.slug === slug && l.size === size)) });
          return;
        }
        const nextQty = typeof limit === "number" ? clampCartQty(qty, limit) : Math.max(1, Math.round(qty));
        set({
          lines: get().lines.map((l) => (l.slug === slug && l.size === size ? { ...l, qty: nextQty } : l)),
        });
      },
      remove: (slug, size) =>
        set({ lines: get().lines.filter((l) => !(l.slug === slug && l.size === size)) }),
      clear: () => set({ lines: [] }),
      placeOrder: (draft) => {
        const order: Order = {
          ...draft,
          id: `AV-${Date.now().toString(36).toUpperCase()}`,
          createdAt: new Date().toISOString(),
          items: get().lines,
        };
        set({ orders: [order, ...get().orders], lines: [] });
        return order;
      },
    }),
    { name: "ashveil-cart" },
  ),
);

export function cartCount(lines: CartLine[]) {
  return lines.reduce((n, l) => n + l.qty, 0);
}

export function cartSubtotal(lines: CartLine[]) {
  return lines.reduce((n, l) => n + l.unitPrice * l.qty, 0);
}
