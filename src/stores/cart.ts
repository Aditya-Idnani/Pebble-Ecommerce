import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/data/products';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

interface Coupon {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  label: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  appliedCoupon: Coupon | null;
  open: () => void;
  close: () => void;
  toggle: () => void;
  addItem: (product: Product, color?: string, size?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  clearCart: () => void;
  subtotal: () => number;
  discount: () => number;
  shipping: () => number;
  total: () => number;
  itemCount: () => number;
}

const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 5.99;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      appliedCoupon: null,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set(s => ({ isOpen: !s.isOpen })),
      addItem: (product, color, size) => set(state => {
        const existing = state.items.find(i => i.product.id === product.id);
        if (existing) {
          return { items: state.items.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) };
        }
        return { items: [...state.items, { product, quantity: 1, selectedColor: color, selectedSize: size }] };
      }),
      removeItem: (productId) => set(state => ({
        items: state.items.filter(i => i.product.id !== productId),
      })),
      updateQuantity: (productId, quantity) => set(state => ({
        items: quantity <= 0
          ? state.items.filter(i => i.product.id !== productId)
          : state.items.map(i => i.product.id === productId ? { ...i, quantity } : i),
      })),
      applyCoupon: (coupon) => set({ appliedCoupon: coupon }),
      removeCoupon: () => set({ appliedCoupon: null }),
      clearCart: () => set({ items: [], appliedCoupon: null }),
      subtotal: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      discount: () => {
        const coupon = get().appliedCoupon;
        if (!coupon) return 0;
        const sub = get().subtotal();
        return coupon.type === 'percent' ? sub * (coupon.value / 100) : Math.min(coupon.value, sub);
      },
      shipping: () => get().subtotal() >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST,
      total: () => {
        const sub = get().subtotal();
        const disc = get().discount();
        const ship = get().shipping();
        return Math.max(0, sub - disc + ship);
      },
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'pebble-cart',
      partialize: (state) => ({ items: state.items, appliedCoupon: state.appliedCoupon }),
    }
  )
);
