import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2, Tag, Truck, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { products, mockCoupons } from '@/data/products';
import { ProductImage } from '@/components/ProductImage';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';

const FREE_SHIPPING_THRESHOLD = 50;

export const CartDrawer = () => {
  const { items, isOpen, close, removeItem, updateQuantity, subtotal, discount, shipping, total, itemCount, appliedCoupon, applyCoupon, removeCoupon } = useCartStore();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const count = itemCount();
  const sub = subtotal();
  const disc = discount();
  const ship = shipping();
  const tot = total();
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - sub);

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    const coupon = mockCoupons[code];
    if (coupon) {
      applyCoupon({ code, ...coupon });
      setCouponInput('');
      setCouponError('');
      toast.success(`Coupon applied: ${coupon.label}`);
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  // Upsell: products not in cart
  const cartIds = new Set(items.map(i => i.product.id));
  const upsellProducts = products.filter(p => !cartIds.has(p.id)).slice(0, 2);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-foreground" />
                <h2 className="font-display text-xl text-foreground">Your Cart ({count})</h2>
              </div>
              <button onClick={close} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <ShoppingBag className="w-16 h-16 mb-4 text-border" />
                  <p className="font-display text-lg text-foreground">Your cart is empty</p>
                  <p className="text-sm mt-1 mb-6">Discover something beautiful</p>
                  <button
                    onClick={() => { close(); navigate('/shop'); }}
                    className="px-6 py-2.5 rounded-full bg-accent text-accent-foreground font-body font-medium text-sm hover:opacity-90 transition-opacity"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <>
                  {items.map(item => (
                    <motion.div layout key={item.product.id} exit={{ opacity: 0, x: 40 }} className="flex gap-4 p-3 bg-secondary/50 rounded-xl group">
                      <div className="w-[60px] h-[60px] rounded-lg overflow-hidden flex-shrink-0">
                        <ProductImage
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-sm text-foreground truncate">{item.product.title}</h4>
                        {(item.selectedColor || item.selectedSize) && (
                          <p className="text-[10px] text-muted-foreground font-body">
                            {[item.selectedColor, item.selectedSize].filter(Boolean).join(' · ')}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground font-body">{item.product.seller}</p>
                        <p className="font-mono text-sm text-foreground mt-1">${item.product.price}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center hover:bg-border transition-colors">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-sm w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center hover:bg-border transition-colors">
                            <Plus className="w-3 h-3" />
                          </button>
                          <button onClick={() => removeItem(item.product.id)} className="ml-auto p-1 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Upsell */}
                  {upsellProducts.length > 0 && (
                    <div className="pt-4 border-t border-border">
                      <p className="text-xs font-body text-muted-foreground uppercase tracking-wider mb-3">You might also like</p>
                      <div className="flex gap-3">
                        {upsellProducts.map(p => (
                          <div key={p.id} className="flex-1 bg-secondary/30 rounded-xl p-2 flex gap-2">
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                              <ProductImage src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-display text-foreground truncate">{p.title}</p>
                              <p className="text-xs font-mono text-muted-foreground">${p.price}</p>
                              <button
                                onClick={() => { useCartStore.getState().addItem(p); }}
                                className="text-[10px] font-body text-accent hover:underline mt-0.5"
                              >
                                + Add
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Bottom section */}
            {items.length > 0 && (
              <div className="p-6 border-t space-y-4">
                {/* Coupon */}
                <div>
                  {appliedCoupon ? (
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm font-body">
                      <Tag className="w-4 h-4" />
                      <span className="flex-1">{appliedCoupon.code} — {appliedCoupon.label}</span>
                      <button onClick={removeCoupon} className="hover:text-green-900"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text" value={couponInput} onChange={e => { setCouponInput(e.target.value); setCouponError(''); }}
                        placeholder="Coupon code"
                        className="flex-1 bg-secondary border-0 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/30"
                      />
                      <button onClick={handleApplyCoupon} className="px-4 py-2 bg-foreground text-card rounded-lg text-sm font-body font-medium hover:opacity-90 transition-opacity">
                        Apply
                      </button>
                    </div>
                  )}
                  {couponError && <p className="text-xs text-destructive font-body mt-1">{couponError}</p>}
                </div>

                {/* Free shipping bar */}
                <div className="bg-secondary/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm font-body mb-2">
                    <Truck className="w-4 h-4 text-stone" />
                    {freeShippingRemaining > 0 ? (
                      <span className="text-muted-foreground">
                        <span className="text-foreground font-medium">${freeShippingRemaining.toFixed(2)}</span> away from free shipping!
                      </span>
                    ) : (
                      <span className="text-green-700 font-medium">🎉 Free shipping unlocked!</span>
                    )}
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${freeShippingRemaining === 0 ? 'bg-green-500' : 'bg-accent'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (sub / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-2 text-sm font-body">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-mono">${sub.toFixed(2)}</span>
                  </div>
                  {disc > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-mono">-${disc.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="font-mono">{ship === 0 ? 'Free' : `$${ship.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between font-display text-lg text-foreground pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="font-mono">${tot.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => { close(); navigate('/checkout'); }}
                  className="w-full bg-accent text-accent-foreground py-3.5 rounded-xl font-body font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={close} className="w-full text-center text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
