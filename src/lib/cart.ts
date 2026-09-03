import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProduct, type Product } from "@/data/products";

export type CartItem = {
  productId: string;
  size: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  add: (productId: string, size: string, qty?: number) => void;
  setQty: (productId: string, size: string, qty: number) => void;
  remove: (productId: string, size: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (productId, size, qty = 1) => {
        const items = [...get().items];
        const i = items.findIndex((it) => it.productId === productId && it.size === size);
        if (i >= 0) items[i] = { ...items[i], qty: items[i].qty + qty };
        else items.push({ productId, size, qty });
        set({ items });
      },
      setQty: (productId, size, qty) => {
        if (qty < 1) {
          set({ items: get().items.filter((it) => !(it.productId === productId && it.size === size)) });
          return;
        }
        set({
          items: get().items.map((it) =>
            it.productId === productId && it.size === size ? { ...it, qty } : it,
          ),
        });
      },
      remove: (productId, size) =>
        set({ items: get().items.filter((it) => !(it.productId === productId && it.size === size)) }),
      clear: () => set({ items: [] }),
    }),
    { name: "m22-cart" },
  ),
);

export function cartCount(items: CartItem[]) {
  return items.reduce((n, it) => n + it.qty, 0);
}

export function cartLines(items: CartItem[]) {
  return items
    .map((it) => {
      const product = getProduct(it.productId);
      if (!product) return null;
      return { ...it, product };
    })
    .filter((row): row is CartItem & { product: Product } => row !== null);
}

export function cartTotal(items: CartItem[]) {
  return cartLines(items).reduce((sum, it) => sum + it.product.price * it.qty, 0);
}
