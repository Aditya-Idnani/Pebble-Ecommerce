import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Star } from 'lucide-react';
import type { Product } from '@/data/products';
import { useCartStore } from '@/stores/cart';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ProductImage } from '@/components/ProductImage';

interface Props {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal = ({ product, onClose }: Props) => {
  const addItem = useCartStore(s => s.addItem);
  const open = useCartStore(s => s.open);
  const [qty, setQty] = useState(1);

  useEffect(() => { setQty(1); }, [product]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            className="relative bg-card rounded-2xl overflow-hidden max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 max-h-[85vh]"
          >
            <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-card/80 backdrop-blur flex items-center justify-center">
              <X className="w-4 h-4 text-foreground" />
            </button>

            {/* Image */}
            <div className="aspect-square overflow-hidden">
              <ProductImage
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="p-6 md:p-8 flex flex-col overflow-y-auto">
              <p className="text-xs font-body text-muted-foreground uppercase tracking-wider mb-1">{product.seller}</p>
              <h2 className="font-display text-xl text-foreground mb-2">{product.title}</h2>
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-3.5 h-3.5 fill-stone text-stone" />
                <span className="text-xs font-mono text-muted-foreground">{product.rating} ({product.reviewCount})</span>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono text-2xl text-foreground font-medium">${product.price}</span>
                {product.comparePrice && (
                  <span className="font-mono text-lg text-muted-foreground line-through">${product.comparePrice}</span>
                )}
              </div>

              <p className="text-sm text-muted-foreground font-body mb-6 leading-relaxed line-clamp-3">{product.description}</p>

              {/* Quantity */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm font-body text-muted-foreground">Qty</span>
                <div className="flex items-center border border-border rounded-full">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 flex items-center justify-center"><Minus className="w-3.5 h-3.5" /></button>
                  <span className="w-8 text-center font-mono text-sm">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="w-9 h-9 flex items-center justify-center"><Plus className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-3">
                <button
                  onClick={() => { for (let i = 0; i < qty; i++) addItem(product); open(); onClose(); }}
                  className="w-full bg-accent text-accent-foreground py-3 rounded-full font-body font-semibold hover:opacity-90 transition-opacity"
                >
                  Add to Cart — ${product.price * qty}
                </button>
                <Link to={`/product/${product.slug}`} onClick={onClose} className="text-center text-sm font-body text-accent hover:underline">
                  View Full Details
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
