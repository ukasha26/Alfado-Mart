import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  subtotal: number;
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      totalItems: 0,
      subtotal: 0,

      addItem: (product, qty = 1) => {
        const { items } = get();
        const existing = items.find((i) => i.product.id === product.id);
        let newItems: CartItem[];
        if (existing) {
          newItems = items.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + qty }
              : i
          );
        } else {
          newItems = [...items, { product, quantity: qty }];
        }
        set({
          items: newItems,
          totalItems: newItems.reduce((s, i) => s + i.quantity, 0),
          subtotal: newItems.reduce(
            (s, i) => s + i.product.price * i.quantity,
            0
          ),
        });
      },

      removeItem: (productId) => {
        const newItems = get().items.filter((i) => i.product.id !== productId);
        set({
          items: newItems,
          totalItems: newItems.reduce((s, i) => s + i.quantity, 0),
          subtotal: newItems.reduce(
            (s, i) => s + i.product.price * i.quantity,
            0
          ),
        });
      },

      updateQuantity: (productId, quantity) => {
        const newItems =
          quantity <= 0
            ? get().items.filter((i) => i.product.id !== productId)
            : get().items.map((i) =>
                i.product.id === productId ? { ...i, quantity } : i
              );
        set({
          items: newItems,
          totalItems: newItems.reduce((s, i) => s + i.quantity, 0),
          subtotal: newItems.reduce(
            (s, i) => s + i.product.price * i.quantity,
            0
          ),
        });
      },

      clearCart: () => set({ items: [], totalItems: 0, subtotal: 0 }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: "alfado-cart",
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        subtotal: state.subtotal,
      }),
    }
  )
);
