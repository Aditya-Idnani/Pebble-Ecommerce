import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlistStore } from '@/stores/wishlist';
import { useCartStore } from '@/stores/cart';
import { ProductImage } from '@/components/ProductImage';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const AccountWishlist = () => {
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();

  const moveToCart = (product: any) => {
    addItem(product);
    removeItem(product.id);
    toast.success('Moved to cart');
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
        <h2 className="font-display text-xl mb-2">Your wishlist is empty</h2>
        <p className="text-sm text-muted-foreground font-body mb-4">Save items you love for later</p>
        <Button asChild><Link to="/shop">Start Browsing</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">{items.length} Saved Items</h1>
        <Button variant="outline" size="sm" className="text-xs" onClick={() => {
          items.forEach(p => addItem(p));
          toast.success('All items moved to cart');
        }}>Move all to cart</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {items.map(product => (
            <motion.div key={product.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="border rounded-xl bg-card overflow-hidden group">
              <Link to={`/product/${product.slug}`} className="block aspect-[4/5] overflow-hidden relative">
                <ProductImage src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                    <span className="bg-foreground text-background text-xs px-3 py-1 rounded font-body">Out of Stock</span>
                  </div>
                )}
              </Link>
              <div className="p-3 space-y-2">
                <p className="font-body text-sm font-medium truncate">{product.title}</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono font-medium">${product.price}</span>
                  {product.comparePrice && <span className="text-xs text-muted-foreground line-through font-mono">${product.comparePrice}</span>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 text-xs" onClick={() => moveToCart(product)}>
                    <ShoppingBag className="w-3.5 h-3.5 mr-1" /> Move to Cart
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => { removeItem(product.id); toast('Removed from wishlist'); }}>
                    Remove
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
