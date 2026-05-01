import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/data/products';

interface WishlistStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  hasItem: (productId: string) => boolean;
  toggleItem: (product: Product) => void;
  clear: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => set(state => {
        if (state.items.find(i => i.id === product.id)) return state;
        return { items: [...state.items, product] };
      }),
      removeItem: (productId) => set(state => ({
        items: state.items.filter(i => i.id !== productId),
      })),
      hasItem: (productId) => get().items.some(i => i.id === productId),
      toggleItem: (product) => {
        if (get().hasItem(product.id)) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },
      clear: () => set({ items: [] }),
    }),
    { name: 'pebble-wishlist' }
  )
);
